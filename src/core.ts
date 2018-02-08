import { BaseContext } from 'koa';
import { ConsulOptions } from 'consul';

const debug = require('debug')('microtools:core');

const HEARTBEAT_SEC_INTERVAL = 10;

export interface AppConfig {
  name: string;
  host: string;
  port: number;
  tags: string[];
  healthCheck: {
    method: string,
    route: string
  },
  heartbeatInternal: number
}

export function consulRegister(ctx: BaseContext, config: AppConfig, consulConfig?: ConsulOptions) {
  const consul = require('consul')(consulConfig);

  const cfg = config || {};
  const host = cfg.host || process.env.HOST || 'localhost';
  const port = cfg.port || process.env.PORT || 3000;
  const healthCheck = cfg.healthCheck || {};
  const healthRoute = healthCheck.route || process.env.HEALTH_ROUTE || '/health'
  const healthMethod = healthCheck.method || process.env.HEALTH_METHOD || 'GET';

  // Register when it is created
  const CONSUL_ID = require("uuid").v4();
  let details = {
    id: CONSUL_ID,
    name: cfg.name,
    address: cfg.host,
    port: cfg.port,
    tags: cfg.tags,
    checks: [{
      id: "api",
      name: `HTTP API on port ${port}`,
      http: `http://${host}:${port}/${healthRoute}`,
      tls_skip_verify: false,
      method: healthMethod,
      interval: `${cfg.heartbeatInternal || HEARTBEAT_SEC_INTERVAL}s`,
      deregister_critical_service_after: "1m",
      timeout: "2s"
    }]
  };
  consul.agent.service.register(details, (err: any) => {
    if (err) {
      debug("consul register error: %o", err);
      throw err;
    }
  });

  // De-Register when it is (gracefully) destroyed
  process
    .on("exit", code => consulDeregister(CONSUL_ID, ctx, consulConfig)) // Handle normal exits
    .on("SIGINT", () => consulDeregister(CONSUL_ID, ctx, consulConfig)); // Handle CTRL+C
}

export function consulDeregister(consultId: string, ctx: BaseContext, consulConfig?: ConsulOptions) {
  debug('Deregistering from consul...');
  const consul = require('consul')(consulConfig);
  consul.agent.service.deregister({ id: consultId }, (err: any) => {
    if (err) {
      debug("consul deregister error: %o", err);
    }
    process.exit();
  });
}

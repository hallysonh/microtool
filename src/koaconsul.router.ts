import { IRouterContext } from "koa-router";

import { isDev } from "./enviroment";

const os = require("os");
const v8 = require("v8");
const process = require("process");
const pusage = require("pidusage");
const Router = require("koa-router");

export function KoaConsulRouter(options?: {
  baseUrl?: string;
  strategy?: (t: any) => void;
}) {
  options = options || {};

  const url = options.baseUrl || "/health";
  const strategy = options.strategy;

  const health = new Router();
  health.prefix(url);

  health.get("/", async function(ctx: IRouterContext) {
    if (isDev()) {
      const monitorData: Monitor = {
        os: getOsInfo(),
        process: await getProcessInfo(),
        heap: getHeapSpace()
      };
      monitorData.status = checkHealth(monitorData, strategy)
        ? MonitorStatus.OK
        : MonitorStatus.WARN;

      ctx.status = monitorData.status === MonitorStatus.OK ? 200 : 429;
      ctx.body = monitorData;
    } else if (strategy) {
      const monitorData: Monitor = {
        os: getOsInfo(),
        process: await getProcessInfo(),
        heap: getHeapSpace()
      };
      monitorData.status = checkHealth(monitorData, strategy)
        ? MonitorStatus.OK
        : MonitorStatus.WARN;

      ctx.status = monitorData.status === MonitorStatus.OK ? 200 : 429;
      ctx.body = { status: monitorData.status };
    } else {
      ctx.body = { status: MonitorStatus.OK };
    }
  });

  health.get("/detail", async function(ctx: IRouterContext) {
    const monitorData: Monitor = {
      os: getOsInfo(),
      process: await getProcessInfo(),
      heap: getHeapSpace()
    };
    monitorData.status = checkHealth(monitorData, strategy)
      ? MonitorStatus.OK
      : MonitorStatus.WARN;

    ctx.status = monitorData.status === MonitorStatus.OK ? 200 : 429;
    ctx.body = monitorData;
  });

  return health.routes();
}

//#region retrieve data functions

function checkHealth(monitorData: any, strategy: any) {
  if (!strategy) {
    return true;
  }
  return strategy(monitorData);
}

function getOsInfo(): OsInfo {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    uptime: os.uptime(),
    arch: os.arch(),
    cpus: os.cpus(),
    avg: os.loadavg(),
    memory: {
      free: os.freemem(),
      total: os.totalmem()
    }
  };
}

async function getProcessInfo() {
  let state = {};
  try {
    state = await getCpuMemoryPercent();
  } catch (_) {
    state = MonitorStatus.WARN;
  }

  return {
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage(),
    memoryUsage: process.memoryUsage(),
    percent: state
  } as ProcessInfo;
}

function getHeapSpace() {
  return v8.getHeapSpaceStatistics();
}

function getCpuMemoryPercent() {
  return new Promise((resolve, reject) => {
    pusage.stat(process.pid, (err: any, stat: any) => {
      if (err) {
        return reject(err);
      }
      resolve(stat);
    });
  });
}

//#endregion

//#region class definition

export enum MonitorStatus {
  OK = "ok",
  WARN = "warn"
}

export interface Monitor {
  os: OsInfo;
  heap: Space[];
  process: ProcessInfo;
  status?: MonitorStatus;
}

export interface ProcessInfo {
  uptime: number;
  cpuUsage: {
    system: number;
    user: number;
  };
  memoryUsage: {
    external: number;
    heapTotal: number;
    heapUsed: number;
    rss: number;
  };
  percent: {
    cpu: number;
    memory: number;
  };
}

export interface OsInfo {
  hostname: string;
  platform: string;
  uptime: number;
  arch: string;
  cpus: Processor[];
  avg: number;
  memory: {
    free: number;
    total: number;
  };
}

export interface Space {
  physical_space_size: number;
  space_available_size: number;
  space_name: string;
  space_size: number;
  space_used_size: number;
}

export interface Processor {
  model: string;
  speed: number;
  times: {
    idle: number;
    irq: number;
    nice: number;
    sys: number;
    user: number;
  };
}

//#endregion

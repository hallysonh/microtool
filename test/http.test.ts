import * as Router from 'koa-router';
import * as http from '../src/modules/utils/http';

describe('Http functions', () => {
  it('works if checkHttpResult return success (200) when promise resolves', async () => {
    expect.assertions(2);
    const result = 'exemplo';
    const ctx = {} as Router.IRouterContext;
    const loader = (async () => result)();
    await http.checkHttpResult(ctx, loader)
    expect(ctx.status).toBe(200);
    expect(ctx.body).toBe(result);
  })
  it('works if checkHttpResult return success (400) when promise resolves but nothing returned', async () => {
    expect.assertions(2);
    const result = null;
    const ctx = {} as Router.IRouterContext;
    const loader = (async () => result)();
    await http.checkHttpResult(ctx, loader)
    expect(ctx.status).toBe(404);
    expect(ctx.body).toBeFalsy();
  })
  it('works if checkHttpResult throw a error when promise rejected', async () => {
    expect.assertions(2);
    const result = 'Not right';
    const ctx = {} as Router.IRouterContext;

    try {
      await http.checkHttpResult(ctx, Promise.reject(result))
    } catch(err) {
      expect(err).toBe(result);
      expect(ctx.status).toBe(500);
    }
  })
})

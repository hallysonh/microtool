import { IRouterContext } from 'koa-router';

export async function checkHttpResult(ctx: IRouterContext, loader: Promise<any>) {
  try {
    const result = await loader;
    if (result) {
      ctx.status = 200;
      ctx.body = result;
    } else {
      ctx.status = 404;
    }
  } catch (erro) {
    ctx.status = 500;
    throw erro;
  }
}
import * as env from '../src/enviroment';

describe('Enviroment functions', () => {

  it('works if isDev always return a value that matches NODE_ENV', () => {
    expect(env.isDev()).not.toBeNull();

    process.env.NODE_ENV = env.Enviroment.DEV;
    expect(env.isDev()).toBeTruthy();

    process.env.NODE_ENV = env.Enviroment.PROD;
    expect(env.isDev()).toBeFalsy();
  })

  it('works if isProd always return a value that matches NODE_ENV', () => {
    expect(env.isProd()).not.toBeNull();

    process.env.NODE_ENV = env.Enviroment.PROD;
    expect(env.isProd()).toBeTruthy();

    process.env.NODE_ENV = env.Enviroment.DEV;
    expect(env.isProd()).toBeFalsy();
  })

  it('works if currentEnv always return the current Enviroment state', () => {
    expect(env.currentEnv()).not.toBeNull();

    process.env.NODE_ENV = env.Enviroment.DEV;
    expect(env.currentEnv()).toBe(env.Enviroment.DEV);

    process.env.NODE_ENV = env.Enviroment.PROD;
    expect(env.currentEnv()).toBe(env.Enviroment.PROD);
  })
})

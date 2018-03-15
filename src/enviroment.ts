export enum Enviroment {
  DEV = "development",
  PROD = "production"
}

export function isDev() {
  return process.env.NODE_ENV === Enviroment.DEV;
}

export function isProd() {
  return process.env.NODE_ENV === Enviroment.PROD;
}

export function currentEnv() {
  return isDev() ? Enviroment.DEV : Enviroment.PROD;
}

import { isDev } from '../utils';

const config = {
  prod: {
    app: { port: 5000 },
    database: {
      host: 'localhost',
      port: 5432,
      databaseName: 'ether_market',
      id: 'ehtermarket',
      password: 'ether3434',
    },
  },
  dev: {
    app: { port: 5000 },
    database: {
      host: 'localhost',
      port: 5432,
      databaseName: 'ether_market',
      id: 'ehtermarket',
      password: 'ether3434',
    },
  }
}

export function appConfig() {
  return isDev() ? config.dev.app : config.prod.app;
}

export function dbConfig() {
  return isDev() ? config.dev.database : config.prod.database;
}
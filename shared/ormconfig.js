module.exports = {
  type: 'postgres', // modify
  host: 'localhost', // modify
  port: 5432, // modify
  username: 'postgres', // modify
  password: 'postgres', // modify
  database: 'capita_development', // modify
  synchronize: false,
  logging: false,
  migrationsRun: true,
  entities: [
    'db/entity/**/*.ts',
  ],
  migrations: [
    'db/migration/**/*.ts',
  ],
  subscribers: [
    'db/subscriber/**/*.ts',
  ],
  cli: {
    entitiesDir: 'db/entity',
    migrationsDir: 'db/migration',
    subscribersDir: 'db/subscriber',
  },
};

module.exports = {
  type: 'sqlite',
  database: 'db/line.sqlite',
  synchronize: true,
  entities: [
    'dist/**/*.entity.{ts,js}',
  ],
  migrations: [
    'dist/database/migrations/**/*.migration.{ts,js}',
  ],
  seeds: [
    'dist/database/seeds/*.seed.{ts,js}',
  ],
  factories: [
    'dist/database/factories/*.factory.{ts,js}',
  ],
};

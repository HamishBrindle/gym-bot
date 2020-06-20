module.exports = {
  // Type '"mysql"' is not assignable to type '"aurora-data-api" | undefined'.ts(2322)
  // @ts-ignore - Not sure why this is erroring...
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_INT_PORT, 10),
  username: process.env.MYSQL_ROOT_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
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

import { Client } from 'pg';

let pqSQLConnection: Client;
export const Pgsql = async () => {
  if (!pqSQLConnection) {
    pqSQLConnection = new Client({
      user: process.env.PG_SQL_USER,
      password: process.env.PG_SQL_PASSWORD,
      host: process.env.PG_SQL_HOST,
      port: Number(process.env.PG_SQL_PORT),
      database: process.env.PG_SQL_DATABASE,
      connectionTimeoutMillis: 1000 * 30,
    });
    await pqSQLConnection.connect();
  }
  return pqSQLConnection;
};

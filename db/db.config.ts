// Database connections
import { Pool } from "pg";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
  database: DB_DATABASE,
  //connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

pool
  .connect()
  .then(() => {
    console.log("Database connection established.");
  })
  .catch(console.error);

export default pool;

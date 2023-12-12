// Database connections
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

pool
  .connect()
  .then(() => {
    console.log("Database connection established.");
  })
  .catch(console.error);

export default pool;

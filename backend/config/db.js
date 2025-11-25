import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "amisha@01",
  database: process.env.DB_NAME || "blood_donation",
  connectionLimit: 10,
});
const db = pool.promise();
export default db;

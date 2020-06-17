require("dotenv").config();
const sql = require("mysql2/promise");

const pool = sql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

(async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("Connection Created", conn);
    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

(async function createUserTable() {
  try {
    const conn = await pool.getConnection();

    conn.query("CREATE DATABASE IF NOT EXISTS foodblog");
    conn.query("USE foodblog");

    const userDb = await conn.query(
      "CREATE TABLE IF NOT EXISTS user (username VARCHAR(300) UNIQUE NOT NULL, profilepic VARCHAR(255), bio VARCHAR (4000), PRIMARY KEY(username) )"
    );
    console.log(userDb);

    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

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

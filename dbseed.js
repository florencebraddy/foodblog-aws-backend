require("dotenv").config();
const sql = require("mysql2/promise");

const pool = sql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

//this is a async function to test connection to db
// (async function testConnection() {
//   try {
//     const conn = await pool.getConnection();
//     console.log("Connection Created");
//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

(async function createUserTable() {
  try {
    const conn = await pool.getConnection();

    conn.query("CREATE DATABASE IF NOT EXISTS foodblog");
    conn.query("USE foodblog");

    const userDb = await conn.query(
      "CREATE TABLE IF NOT EXISTS user (username VARCHAR(255) UNIQUE NOT NULL, profilepic VARCHAR(255), bio VARCHAR(3000), PRIMARY KEY(username))"
    );
    console.log(userDb);

    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

(async function createBlogPostTable() {
  try {
    const conn = await pool.getConnection();
    conn.query("USE foodblog");
    const foodblogpostDb = await conn.query(
      "CREATE TABLE IF NOT EXISTS foodblogpost (id INT UNIQUE NOT NULL AUTO_INCREMENT, title VARCHAR(255), description VARCHAR(4095), username VARCHAR(255) NOT NULL, date DATETIME NOT NULL, PRIMARY KEY(id), FOREIGN KEY(username) REFERENCES user(username))"
    );
    console.log(foodblogpostDb);
    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

require("dotenv").config();
const sql = require("mysql2/promise");

const pool = sql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

//this is a async function to test connection to db
(async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("Connection Created");
    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

(async function() {
  try {
    const conn = await pool.getConnection();

    conn.query("CREATE DATABASE IF NOT EXISTS foodblog");
    conn.query("USE foodblog");

    const userDb = await conn.query(
      "CREATE TABLE IF NOT EXISTS users_to_groups (user VARCHAR(255) NOT NULL, group_name VARCHAR(255) NOT NULL, PRIMARY KEY(user,group_name), FOREIGN KEY (user) REFERENCES user(username), FOREIGN KEY (group_name) REFERENCES user_groups(groupname) )"
    );
    console.log(userDb);

    conn.release();
  } catch (error) {
    console.log(error);
  }
})();

// (async function() {
//   try {
//     const conn = await pool.getConnection();

//     conn.query("CREATE DATABASE IF NOT EXISTS foodblog");
//     conn.query("USE foodblog");

//     const userDb = await conn.query(
//       "CREATE TABLE IF NOT EXISTS user_groups (groupname VARCHAR(255) PRIMARY KEY, description VARCHAR(255))"
//     );
//     console.log(userDb);

//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

// (async function createBlogPostTable() {
//   try {
//     const conn = await pool.getConnection();
//     conn.query("USE foodblog");
//     const foodblogpostDb = await conn.query(
//       "CREATE TABLE IF NOT EXISTS foodblogpost (id INT UNIQUE NOT NULL AUTO_INCREMENT, title VARCHAR(255), description VARCHAR(4095), username VARCHAR(255) NOT NULL, date DATETIME NOT NULL, PRIMARY KEY(id), FOREIGN KEY(username) REFERENCES user(username))"
//     );
//     console.log(foodblogpostDb);
//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

// (async function createBlogPostPicTable() {
//   try {
//     const conn = await pool.getConnection();
//     conn.query("USE foodblog");
//     const foodblogpicDb = await conn.query(
//       "CREATE TABLE IF NOT EXISTS foodblogpic (s3uuid VARCHAR(255) UNIQUE NOT NULL, description VARCHAR(4095), foodblogpost INT NOT NULL, PRIMARY KEY(s3uuid), FOREIGN KEY(foodblogpost) REFERENCES foodblogpost(id))"
//     );
//     console.log(foodblogpicDb);
//     // console.log("connection created", conn);
//     conn.release();
//   } catch (error) {
//     console.log(error);
//   }
// })();

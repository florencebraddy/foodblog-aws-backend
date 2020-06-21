require("dotenv").config();
const express = require("express");
const sql = require("mysql2/promise");
const cors = require("cors");

const PORT = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pool = sql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.post("/user", async (request, response) => {
  try {
    console.log("POST USER");
    if (!request.body.username) {
      response.status(400).send({ message: "No Username Entered" });
    }

    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `INSERT INTO foodblog.user (username, profilepic, bio) VALUES (?, ?, ?)`,
      [
        request.body.username,
        request.body.profilepic ? request.body.profilepic : null,
        request.body.bio ? request.body.bio : null
      ]
    );

    //don't do this the above way, unless you want a sql injection attack
    // const conn = await pool.getConnection();
    // const queryResponse = await conn.query(
    //   `INSERT INTO foodblog.user (username, profilepic, bio) VALUES (${request.body.username}, ${request.body.profilepic}, ${request.body.bio})`
    // );

    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

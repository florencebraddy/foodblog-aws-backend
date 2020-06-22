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

app.post("/user", authorizeUser, async (request, response) => {
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

app.get("/user", authorizeUser, async (request, response) => {
  try {
    console.log("GET ONE USER");

    const conn = await pool.getConnection();
    const recordSet = await conn.execute(
      `SELECT * FROM foodblog.user WHERE username = ?`,
      [request.query.username]
    );
    conn.release();
    console.log(recordSet);
    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/users", authorizeUser, async (request, response) => {
  try {
    console.log("GET ALL USERS");

    const conn = await pool.getConnection();
    const recordSet = await conn.execute(`SELECT * FROM foodblog.user`);
    conn.release();
    console.log(recordSet);

    //adding [0] to recordSet response enables us to hide binary representation of info. We don't need this, we only need to first array (the string representation).
    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.put("/user", authorizeUser, async (request, response) => {
  try {
    console.log("PUT USER");
    if (!request.body.username) {
      response.status(400).send({ message: "No Username Entered" });
    }
    const selectQuery = await pool.execute(
      `SELECT * FROM foodblog.user WHERE username = ?`,
      [request.body.username]
    );

    console.log(selectQuery[0][0]);

    const selectedUser = selectQuery[0][0];

    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `UPDATE foodblog.user SET username = ?, profilepic = ?, bio = ? WHERE username = ?`,
      [
        request.body.username,
        request.body.profilepic
          ? request.body.profilepic
          : selectedUser.profilepic,
        request.body.bio ? request.body.bio : selectedUser.bio,
        request.body.username
      ]
    );

    //request.body.profilepic ? request.body.profilepic: selectedUser.profilepic allows user to perform a put request without a user entering profile pic, and won't show null for any profile pic entered by user prior

    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.delete("/user", authorizeUser, async (request, response) => {
  try {
    console.log("DELETE USER");

    const conn = await pool.getConnection();
    const recordSet = await conn.execute(
      `DELETE FROM foodblog.user WHERE username = ?`,
      [request.body.username]
    );
    conn.release();
    console.log(recordSet);

    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.post("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("POST food blog post");
    if (!request.body.username) {
      response.status(400).send({ message: "This blog post has no user" });
    }
    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `INSERT INTO foodblogpost.foodblogpost (username,title,description,date) VALUES (?, ?, ?, ?)`,
      [
        request.body.username,
        request.body.title ? request.body.title : null,
        request.body.description ? request.body.description : null,
        new Date()
      ]
    );
    conn.release();
    console.log(queryResponse);
    response.status(200).send({ message: queryResponse });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/foodblogposts", authorizeUser, async (request, response) => {
  try {
    console.log("GET ALL food blog posts");
    const conn = await pool.getConnection();
    const recordSet = await conn.query(
      `SELECT * FROM foodblog.foodblogpost`

      // this is an example of how you can filter out/in certain items from table
      // `SELECT date, bio, users.username FROM foodblog.user users JOIN foodblog.foodblogpost foodposts ON users.username = foodposts.username`
    );
    conn.release();
    console.log(recordSet[0]);
    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.get("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("GET one blog post");
    const conn = await pool.getConnection();
    const recordSet = await conn.execute(
      `SELECT * FROM foodblog.foodblogpost WHERE id = ?`,
      [request.query.blogPostId]
    );
    conn.release();
    console.log(recordSet[0]);
    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.delete("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("DELETE BLOG POST");

    const conn = await pool.getConnection();
    const recordSet = await conn.execute(
      `DELETE FROM foodblog.foodblogpost WHERE id = ?`,
      [request.body.blogPostId]
    );
    conn.release();
    console.log(recordSet);

    response.status(200).send({ message: recordSet[0] });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.put("/foodblogpost", authorizeUser, async (request, response) => {
  try {
    console.log("PUT BLOG POST");
    if (!request.body.blogPostId) {
      response.status(400).send({ message: "No Valid Blog Id Entered" });
    }
    const selectQuery = await pool.execute(
      `SELECT * FROM foodblog.foodblogpost WHERE id = ?`,
      [request.body.blogPostId]
    );

    console.log(selectQuery[0][0]);

    const selectedBlogPost = selectQuery[0][0];

    const conn = await pool.getConnection();
    const queryResponse = await conn.execute(
      `UPDATE foodblog.foodblogpost SET title = ?, description = ?, date = ? WHERE id = ?`,
      [
        request.body.title ? request.body.title : selectedBlogPost.title,
        request.body.description
          ? request.body.description
          : selectedBlogPost.description,
        new Date(),
        request.body.blogPostId
      ]
    );
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

//this is where you would check for authorization of user
function authorizeUser(request, response, next) {
  next();
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

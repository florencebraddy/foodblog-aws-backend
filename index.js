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
    if (!request.body.username) {
      response.status(400).send({ message: "No Username Entered" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

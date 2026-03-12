require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");
const redis = require("redis");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("src/main/public"));


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .query(
    `
    CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`,
  )
  .catch((err) => console.error("DB Init Error:", err.message));

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.connect().catch(console.error);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", environment: process.env.APP_ENV });
});

app.get("/api/history", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT username, searched_at FROM search_history ORDER BY searched_at DESC LIMIT 5",
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});


app.get("/api/github/:username", async (req, res) => {
  const { username } = req.params;

  try {
   
    await pool.query("INSERT INTO search_history (username) VALUES ($1)", [
      username,
    ]);

    
    const cachedData = await redisClient.get(`github:${username}`);
    if (cachedData) {
      console.log("Serving from Cache!");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Fetching from GitHub API...");
    const userResponse = await axios.get(
      `https://api.github.com/users/${username}`,
    );
    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`,
    );

    const responseData = {
      profile: userResponse.data,
      recentActivity: repoResponse.data,
    };

    await redisClient.setEx(
      `github:${username}`,
      3600,
      JSON.stringify(responseData),
    );

    res.json(responseData);
  } catch (error) {
    res
      .status(404)
      .json({ error: "GitHub user not found or rate limit exceeded." });
  }
});

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(` Enterprise Server running on port ${PORT}`),
  );
}
module.exports = app;

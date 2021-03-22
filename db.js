require('dotenv').config();

const { Client } = require("pg");

let db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

db.connect();

module.exports = db;
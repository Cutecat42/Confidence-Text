require('dotenv').config();

const { Client } = require("pg");

let db = new Client({
  connectionString: process.env.DATABASE_URL
});

db.connect();

module.exports = db;
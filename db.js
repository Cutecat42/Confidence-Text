const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///text_test";
} else {
  DB_URI = "postgres://tvccnhwylotwje:28b489e732f91d27307b6052454ba9732d75de573108bb8b9ab11a2b22e9dfae@ec2-34-235-108-68.compute-1.amazonaws.com:5432/dbrqsrpqrb8d14";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;
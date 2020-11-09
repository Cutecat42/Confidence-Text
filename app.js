require('dotenv').config();

const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const express = require('express');

const db = require("./db");
const ExpressError = require('./expressError');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', async function (req, res, next) {
  let body = await db.query(
    `SELECT * FROM texts OFFSET random() * (SELECT COUNT(*) FROM texts) limit 1;`);

  let send = await client.messages.create({
      to: process.env.myPhone, 
      from: process.env.twilioPhone, 
      body: body.rows[0]['full_text']
    }, function( err, data ) {
      if(err){
        const newError = new ExpressError(err, 404);
        return next(newError)
      }
      console.log("Success!")
      res.render('text');
  });
  res.render('text');
});


async function sendText() {
    let body = await db.query(
      `SELECT * FROM texts OFFSET random() * (SELECT COUNT(*) FROM texts) limit 1;`);

    let send = await client.messages.create({
        to: process.env.myPhone, 
        from: process.env.twilioPhone, 
        body: body.rows[0]['full_text']
      }, function( err, data ) {
        if(err){
          console.log(err)
        }
        console.log("Success!")
    });
  };

sendText()

app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});


app.use(function(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;
  
    return res.status(status).json({
      error: {message, status}
    });
  });


module.exports = app;

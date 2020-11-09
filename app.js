require('dotenv').config();

const express = require('express');

const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const cronJob = require('cron').CronJob;

const db = require("./db");
const ExpressError = require('./expressError');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', async function (req, res, next) {
  let body = await db.query(
    `SELECT * FROM texts OFFSET random() * (SELECT COUNT(*) FROM texts) limit 1;`);

  let send = await client.messages.create({
      to: process.env.myPhone, 
      from: process.env.twilioPhone, 
      body: body.rows[0]['full_text']
    }, function( err, data ) {
      if(err){
          console.log(err,"err")
      }
      console.log("Success!")
  });
});


let textJob = new cronJob('00 18 * * *', async function(){
    let body = await db.query(
      `SELECT * FROM texts OFFSET random() * (SELECT COUNT(*) FROM texts) limit 1;`);

    let send = await client.messages.create({
        to: process.env.myPhone, 
        from: process.env.twilioPhone, 
        body: body.rows[0]['full_text']
      }, function( err, data ) {
        if(err){
            console.log(body)
        }
        console.log("Success!")
    });
  },  null, true);


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

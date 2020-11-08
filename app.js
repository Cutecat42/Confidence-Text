const express = require('express');
const twilio = require('twilio');

const {ACCOUNTSID} = require('./credentials');
const {AUTHTOKEN} = require('./credentials');
const {myPhone} = require('./credentials');
const {twilioPhone} = require('./credentials');
const client = require('twilio')(ACCOUNTSID, AUTHTOKEN);
const cronJob = require('cron').CronJob;

const db = require("./db");
const ExpressError = require('./expressError');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let textJob = new cronJob('00 15 * * *', async function(){
    let body = await db.query(
      `SELECT * FROM texts OFFSET random() * (SELECT COUNT(*) FROM texts) limit 1;`);
      console.log(body.rows, "HI");

    let send = await client.messages.create({
        to: myPhone, 
        from: twilioPhone, 
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

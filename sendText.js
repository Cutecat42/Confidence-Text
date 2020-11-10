const axios = require('axios');

async function sendText() {
    try {
        let res = await axios.get('https://confidence-text.herokuapp.com/')
        return res
    }
    catch(err) {
        console.log("Error with database or Twilio api")
    }
}

sendText()
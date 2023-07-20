const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/signup.html'));

app.post('/', (req, res) => {
    const { firstName, lastName, email } = req.body;
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = 'https://us21.api.mailchimp.com/3.0/lists/21be87b232';
    const options = {
        method: 'POST',
        auth: 'bittu:d03f794341f3220f5a20ec645034c6fd-us21'
    }

    const request = https.request(url, options, (response) => {
        response.on('data', (data) => {
            response.statusCode === 200 ? res.sendFile(__dirname + '/success.html') : res.sendFile(__dirname + '/failure.html');
        })
    })

    request.write(jsonData);
    request.end();   

})

app.post('/failure', (req, res) => res.redirect('/'));

app.listen(process.env.PORT  || 3000, () => console.log(`Listening on port ${port}`));


// API KEY
// d03f794341f3220f5a20ec645034c6fd-us21

// 21be87b232
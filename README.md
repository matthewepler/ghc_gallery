# TO DO 
* on close (x) of modal, clear errors
* modal should pop up at wherever they are in the scroll.
* fade-in new pics
* Twilio - turn off responses
* delete git branches

created using the template by Alan B. Smith, see link to repo in 1st step below

# STEPS
* Clone [this repo](https://github.com/alanbsmith/react-node-example), `cd` into the repo
* `npm install`
* `heroku create`
* create Procfile, `web: node server.js`
* add node version to package.json: 
```json
"engines" : {
    "node": "4.5.0"
  },

  ```
* add .env file
* test locally with `heroku local web`
* test on heroku 
```bash
git add .
git commit -m 'test deploy'
git push heroku master
heroku open
```
## Production Steps
set env vars on heroku: `heroku config:set TIMES=2`

# DEV NOTES
When sending email, if using Gmail the first message will prompt a warning email 
to be sent to the inbox about a Less Secure app trying to authorize. You will
need to follow the instructions in the email that will ALLOW use of Less Secure
Apps to send email from your account.
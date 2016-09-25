# TO DO 
* on 5555555555 'ajax success false', no error appears in modal.
* Twilio - turn off responses

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
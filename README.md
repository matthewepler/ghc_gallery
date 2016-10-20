# TO DO 
* add route to sign-in with write permissions. 
* paginate for faster load time
* post install: remove admin code (see server.js and App.js for sign-in)
* post install: remove text/email?


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
* add any elements from your webpack file that you'll be needing to the new webpack file
included in the Express app. If you want to keep things clean, add them only as you need them
or as errors arise that can only be fixed by adding loaders, etc. 

* add .env file
* test locally with `heroku local web`
* test on heroku 
```bash
git add .
git commit -m 'test deploy'
git push heroku master
heroku open
```
* `npm install` any modules you will be needing in your app. 

* take a look at "index.js." This is the launching spot of your app and will resemble your
base js file in your React app. Go ahead and copy yours in there and take note of the following:
- Change the class of the object you're targeting in the index.html to match your new index.html file.
- speaking of the index.html file, it's in the "dist" folder. Add any headers or script tags you 
need now. 

From here, everything gets a little tricky because everyone's app is different. But basically you
want to try to do the following:
1.) copy your component files into the new "components" directory and get them working
2.) take a look at "server.js" in root folder and add functionality, routes, and other libraries
as needed. I hope to put up a tutorial soon on how to add Twilio and Firebase and Google Cloud. 
3.) Deploy to heroku 




## Production Steps
set env vars on heroku: `heroku config:set TIMES=2`

# DEV NOTES
When sending email, if using Gmail the first message will prompt a warning email 
to be sent to the inbox about a Less Secure app trying to authorize. You will
need to follow the instructions in the email that will ALLOW use of Less Secure
Apps to send email from your account.
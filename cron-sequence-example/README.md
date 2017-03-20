# Make An Event-Driven Bot with OpenWhisk, Cron-Trigger Version

This bot will take the `pigify` example found in the `pigify-twitterbot` folder and create an alarm-based trigger and a wrapper function to call it, instead of using the Zapier trigger.


## General Setup

1. Follow the general setup instructions in the `README` at the top level of this repo. You do not have to set up the Zapier trigger or create a function API URL.

2. If you haven't already, follow the instructions above to create a new Twitter account for your bot and a new app. Then put your key, secret, token, and access token secret in the `temp-config.js` file, and rename it to `config.js`. Then delete `temp-config.js`.

## Create your OpenWhisk Action

Because we want to include `moment.js` and our config file, we're going to create our OpenWhisk action by uploading a zip file.

 1. Make sure you're in the cron-sequence-example directory.
 2. Make sure your config file is created and includes your keys.
 3. Run `npm install`
 4. Zip the files in this directory: `zip -r -X "tweetGet.zip" *` 
 5. Create your OpenWhisk action: `wsk action create YOURACTIONNAME --kind nodejs:6 tweetGet.zip`
 6. Check to see if your action has been created: `wsk action list`.
 
 
## Create your OpenWhisk Trigger
 
 We want our bot to tweet once an hour (don't have your bot tweet more than once an hour; that's kind of rude), so we're going to create an OpenWhisk trigger that runs our function. 
 
You can set an alarm trigger with `cron` (let's call it `sendTweet`) to make this happen, like so: 

`wsk trigger create sendTweet --feed /whisk.system/alarms/alarm --param cron "5 * * * 0-6"`

Cron syntax is tricky! If you don't want to remember it, you can use this handy [crontab generator](http://crontab-generator.org/).
 
 
## Create your OpenWhisk Rule

Once you have an action and a trigger, you can put them together with a rule, like so: 

`wsk rule create tweetRule sendTweet myTwitterBot`

The format here is 
`wsk rule create NameOfRule NameOfTrigger NameOfAction`



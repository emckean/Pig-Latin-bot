# Make An Event-Driven OpenWhisk Twitterbot

TODO:
* redo directory structure
* change code to make sure botname is a variable

What does this example do? This example: 

* creates a OpenWhisk action (`pigify`) that receives text, turns it into Pig Latin, and tweets it;
* creates an OpenWhisk action (`findTweets`) that polls the Twitter API looking for mentions of your bot's name, and then calling the `pigify` action;
* creates a trigger that fires once an hour, five minutes after the hour; 
* creates a rule that connects the 'once-an-hour' trigger with the `findTweets` action.


## General Setup

### 1. Clone this repo

Prerequisites: I assume you have node and npm installed. Need help installing either? [Here's a link for you.](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

1. Clone this repo
2. Run `npm install`
3. Open in your favorite editor.

### 2. Get Credentials and Add Configuration

##### Twitter
* It's best to create a new Twitter account for your bot, instead of tweeting Pig Latin from your personal Twitter account. You can sign up for a Twitter account [here](https://twitter.com).
* a Twitter application (not the same as a Twitter account; apply for one at [apps.twitter.com](apps.twitter.com))
* a Consumer Key, a Consumer Secret, an Access Token, and your Access Token Secret

_NOTE_: when you sign up for a Twitter app, it will ask for a website and a callback URL. You can enter your bot's Twitter URL for the website (e.g., https://www.twitter.com/YOURBOTNAME) and you can leave the callback URL blank.

Also _NOTE_: You may be asked to connect a phone number to your Twitter app account. If you have your phone connected to a different Twitter account, just disconnect it from that account and connect it to the bot account to create your keys. Once your keys are set, you can delete and reattach the number to your primary account.

Put your botname, key, secret, token, and access token secret in the `temp-config.js` file, and rename it to `config.js`. Then delete `temp-config.js`.

##### Register for Bluemix

* a Bluemix account. Sign up for one at [https://console.ng.bluemix.net/registration](https://console.ng.bluemix.net/registration). *No credit card required! You'll get 2GB of runtime and container memory free for 30 days, plus access to provision up to 10 services (including databases, devops pipelines, and more).*


##### Install and configure Openwhisk

If you already have the OpenWhisk CLI installed, check whether you have the latest version: 

`wsk property get --apibuild` will show you the latest version

`wsk property get --cliversion` will show you your installed version
 
* Visit the [OpenWhisk CLI setup page](https://console.ng.bluemix.net/openwhisk/cli) and log in to Bluemix.
* Note your `Namespace` and `Authorization Key`. You will need them!
* Install the OpenWhisk CLI (instructions [here](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_cli.html#openwhisk-cli)).
* Once you have the OW CLI installed, set your `Namespace` and `Authorization Key`:

`wsk property set --apihost YOURNAMESPACE --auth YOURAUTHORIZATIONKEY`

(If you have a default NAMESPACE there won't be a NAMESPACE value in your Bluemix auth. Just copy-paste what you get after logging in and use that.)

You can also run your own OpenWhisk server! This is beyond the scope of this lab, but you can find more info [here](https://github.com/openwhisk/openwhisk).

## Using OpenWhisk

### 3. Create your `pigify` OpenWhisk Action

Because we want to include the npm module `pig-latin` and our config file, we're going to create our OpenWhisk action by uploading a zip file.

 1. Make sure you're in the `pigify-action` directory.
 2. Make sure your `config.js` file is created and includes your keys.
 3. Run `npm install`
 4. Run the tests: `npm test`
 5. Zip the files in this directory: `zip -r -X "pigify.zip" *` 
 6. Create your OpenWhisk action: `wsk action create pigify --kind nodejs:6 pigify.zip`
 7. Check to see if your action has been created: `wsk action list`.
 
### 4. Create your `findTweets` OpenWhisk Action

Because we want to include the `moment` library and our config file, we're going to create our OpenWhisk action by uploading a zip file.

 1. Make sure you're in the `findTweets-action` directory.
 2. Make sure your `config.js` file is created and includes your keys.
 3. Run `npm install`
 4. Run the tests: `npm test`
 5. Zip the files in this directory: `zip -r -X "findTweets.zip" *` 
 6. Create your OpenWhisk action: `wsk action create pigify --kind nodejs:6 findTweets.zip`
 7. Check to see if your action has been created: `wsk action list`.
 
### 5. Create your OpenWhisk Trigger
 
We want our bot to tweet once an hour (don't have your bot tweet more than once an hour; that's kind of rude), so we're going to create an OpenWhisk trigger that runs our function. 
 
You can set an alarm trigger with `cron` (let's call it `sendTweet`) to make this happen, like so: 

`wsk trigger create onceAnHour --feed /whisk.system/alarms/alarm --param cron "5 * * * 0-6"`

Cron syntax is tricky! If you don't want to remember it, you can use this handy [crontab generator](http://crontab-generator.org/).
 
 
### 6. Create your OpenWhisk Rule

Once you have an action and a trigger, you can put them together with a rule, like so: 

`wsk rule create tweetRule onceAnHour findTweets`

The format here is 
`wsk rule create NameOfRule NameOfTrigger NameOfAction`

## Test it out!

With OpenWhisk, you can see your action logs directly in the terminal! Open a new terminal tab, and use the command: 

`wsk activation poll`

This will show you any `stdout` messages as your action runs.

You don't have to wait for your alarm to go off—you can fire your trigger like so: 

`wsk trigger fire onceAnHour`

Remember: if nobody has mentioned your new bot on Twitter your bot will not tweet. :)



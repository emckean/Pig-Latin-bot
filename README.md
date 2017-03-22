# Make An Event-Driven OpenWhisk Twitterbot

Haven't you always wanted at Twitterbot that will respond to @-messages by translating them into Pig Latin and retweeting them? Now you can fulfill that lifelong dream and bucket-list item with this example!

What will you do in this example? In this example, you will: 

* create a OpenWhisk action (`pigify`) that receives text, turns it into Pig Latin, and tweets it;
* create an OpenWhisk action (`findTweets`) that polls the Twitter API looking for mentions of your bot's name, and then calls the `pigify` action;
* create a trigger that fires once an hour, five minutes after the hour; 
* create a rule that connects the 'once-an-hour' trigger with the `findTweets` action.


## General Setup

### 1. Clone this repo

Prerequisites: I assume you have node and npm installed. Need help installing either? [Here's a link for you.](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

1. Clone this repo
2. Run `npm install`
3. Open in your favorite editor.

### 2. Get Credentials and Add Configuration

##### Twitter
* It's best to create a new Twitter account for your bot, instead of tweeting Pig Latin from your personal Twitter account. You can sign up for a Twitter account [here](https://twitter.com).
* a Twitter application (not the same as a Twitter account; apply for one at [apps.twitter.com](https://apps.twitter.com))
* a Consumer Key, a Consumer Secret, an Access Token, and an Access Token Secret.

_NOTE_: when you sign up for a Twitter app, it will ask for a website and a callback URL. You can enter your bot's Twitter URL for the website (e.g., https://www.twitter.com/YOURBOTNAME) and you can leave the callback URL blank.

Also _NOTE_: You may be asked to connect a phone number to your Twitter app account. If you have your phone connected to a different Twitter account, just disconnect it from that account and connect it to the bot account to create your keys. Once your keys are set, you can delete and reattach the number to your primary account.

Put your bot's name, consumer key, consumer secret, access token, and access token secret in the `temp-config.js` file, and rename it to `config.js`. Then delete `temp-config.js`.

##### Register for Bluemix

* a Bluemix account. Sign up for one at [https://console.ng.bluemix.net/registration](https://console.ng.bluemix.net/registration). *No credit card required! You'll get 2GB of runtime and container memory free for 30 days, plus access to provision up to 10 services (including databases, devops pipelines, and more).*


##### Install and configure Openwhisk

If you already have the OpenWhisk CLI installed, check whether you have the latest version: 

`wsk property get --apibuild` will show you the latest version

`wsk property get --cliversion` will show you your installed version
 
* Visit the [OpenWhisk CLI setup page](https://console.ng.bluemix.net/openwhisk/cli) and log in to Bluemix.
* Log in to Bluemix, if you haven't already.
* Follow these instructions (step 2 of the CLI setup) to authorize your OpenWhisk CLI: 
![instructions](https://github.com/emckean/blank-openwhisk-bot/blob/master/bluemix-auth.png?raw=true)

You can also run your own OpenWhisk server! This is beyond the scope of this workshop, but you can find more info [here](https://github.com/openwhisk/openwhisk).

## Using OpenWhisk

### 3. Create your `pigify` OpenWhisk Action

Because we want to include the npm module `pig-latin` and our config file, we're going to create our OpenWhisk action by uploading a zip file.

 1. Make sure you're in the `pigify` directory.
 2. Make sure your `config.js` file is created and includes your Twitter keys and bot name.
 3. Run `npm install`
 4. Run the tests: `npm test`
 5. Zip the files in this directory: `zip -r -X "pigify.zip" *`  (If you update your bot, remember to remove your zip file so that it doesn't get re-zipped into your updated file! Try 
`rm pigify.zip && zip -r -X "pigify.zip" *`)
 6. Create your OpenWhisk action: `wsk action create pigify --kind nodejs:6 pigify.zip`
 7. Check to see if your action has been created: `wsk action list`.
 
### 4. Create your `findTweets` OpenWhisk Action

Because we want to include the `moment` library and our config file, we're going to create our OpenWhisk action by uploading a zip file.

 1. Make sure you're in the `twitterbot-example` directory.
 2. Make sure your `config.js` file is created and includes your keys.
 3. Run `npm install`
 4. Run the tests: `npm test`
 5. Zip the files in this directory: `zip -r -X "findTweets.zip" *` 
 6. Create your OpenWhisk action: `wsk action create pigify --kind nodejs:6 findTweets.zip`
 7. Check to see if your action has been created: `wsk action list`.
 8. You can invoke this action (which will send a tweet!) with the `testparams.json` file (don't forget change the name of the bot in the `text` field to be your bot name) and this command: `wsk action invoke YOURACTIONNAME --blocking -r --param-file testparams.json`

_NOTE_: Twitter doesn't want accounts to tweet the same thing over and over, so change up the 'text' parameter in testparams.json if you are going to be testing several times.
 
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

### 7. Test it out!

With OpenWhisk, you can see your action logs directly in the terminal! Open a new terminal tab, and use the command: 

`wsk activation poll`

This will show you any `stdout` messages as your action runs.

You don't have to wait for your alarm to go off—you can fire your trigger like so: 

`wsk trigger fire onceAnHour`

Remember: if nobody has mentioned your new bot on Twitter your bot will not tweet. :)

### 8. Want to Turn Off Your Bot?

Double-check the name of your rule by entering 
`wsk rule list` at the command line. Then delete your rule (most likely `tweetRule`) with the line 
`wsk delete rule tweetRule`. 

### 9. Cleanup

If you are creating this example on a lab computer, make sure you:

* log out of your Bluemix account
* delete your bot code on this machine: `rm -rf openwhisk-twitterbot-template`
* de-authorize your OpenWhisk account on this machine, by removing `$HOME/.wskprops` (on the Interconect DevZone lab machines this will be in `/usr/local/bin`).
* delete sensitive commands (e.g., your OpenWhisk auth command) from your bash/zsh history. You can do this by editing the `~/.bash_history` or `~/.zsh_history` files. (The zsh shell may also  be called `.zhistory`. Not sure where yours is? Try `echo $HISTFILE`.)




# Make An Event-Driven OpenWhisk Twitterbot

Haven't you always wanted a Twitterbot that will respond to @-messages by translating them into Pig Latin and retweeting them? Now you can fulfill that lifelong dream and bucket-list item with this example!

What will you do in this example? In this example, you will: 

* create a OpenWhisk action (`pigify`) that receives text, turns it into Pig Latin, and tweets it;
* create an OpenWhisk action (`findTweets`) that polls the Twitter API looking for mentions of your bot's name, and then calls the `pigify` action;
* create a trigger that fires once an hour, five minutes after the hour; 
* create a rule that connects the 'once-an-hour' trigger with the `findTweets` action.


## General Setup

### 1. Clone this repo & open in an editor

Prerequisites: node and npm installed. Need help installing either? [Here's a link for you.](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

1. Clone this repo.
3. Open in your favorite editor.

### 2. Get Twitter and Bluemix credentials 

##### Twitter
* It's best to create a new Twitter account for your bot (rather than tweeting Pig Latin from your personal Twitter account). You can sign up for a Twitter account [here](https://twitter.com).
* a Twitter application (not the same as a Twitter account; apply for one at [apps.twitter.com](https://apps.twitter.com))
* a Consumer Key, a Consumer Secret, an Access Token, and an Access Token Secret.

_NOTE_: when you sign up for a Twitter app, it will ask for a website and a callback URL. You can enter your bot's Twitter URL for the website (e.g., https://www.twitter.com/YOURBOTNAME) and you can leave the callback URL blank.

Also _NOTE_: You may be asked to connect a phone number to your Twitter bot account. If you have your phone connected to a different Twitter account, just disconnect it from that account and connect it to the bot account to create your keys. Once your keys are set, you can delete and reattach the number to your primary account.


##### Register for Bluemix

* a Bluemix account. Sign up for one at [https://console.ng.bluemix.net/registration](https://console.ng.bluemix.net/registration). *No credit card required! You'll get 2GB of runtime and container memory free for 30 days, plus access to provision up to 10 services (including databases, devops pipelines, and more).*


### 3. Install and configure Openwhisk

If you already have the OpenWhisk CLI installed, check whether you have the latest version: 

`wsk property get --apibuild` will show you the latest version

`wsk property get --cliversion` will show you your installed version
 
* Visit the [OpenWhisk CLI setup page](https://console.ng.bluemix.net/openwhisk/cli) and log in to Bluemix.
* Log in to Bluemix, if you haven't already.
* Follow these instructions (step 2 of the CLI setup) to authorize your OpenWhisk CLI: 
![instructions](https://github.com/emckean/blank-openwhisk-bot/blob/master/bluemix-auth.png?raw=true)

You can also run your own OpenWhisk server! This is beyond the scope of this workshop, but you can find more info [here](https://github.com/openwhisk/openwhisk).

## Using OpenWhisk

### 4. Create your `pigify` OpenWhisk Action

Because we want to include the npm module `pig-latin` and our config file, we're going to create our OpenWhisk action by uploading a zip file.

 1. Make sure you're in the `pigify` directory.

 
 2. Open the `temp-config.js` file and replace the values with your own Twitter credentials and bot name. Then rename this file to `config.js` and delete `temp-config.js`.
 3. Run `npm install`.
 4. Run the tests: `npm test`
 5. Zip the files in this directory: `zip -r -X "pigify.zip" *`   6. Create your OpenWhisk action: `wsk action create pigify --kind nodejs:6 pigify.zip`
 7. Check to see if your action has been created: `wsk action list`.
 8. You can invoke this action (which will send a tweet!) with the `testparams.json` file (don't forget change the name of the bot in the `text` field to be your bot name) and this command: `wsk action invoke YOURACTIONNAME --blocking -r --param-file testparams.json`  
_NOTE_: Twitter doesn't want accounts to tweet the same thing over and over, so change up the 'text' parameter in testparams.json if you are going to be invoking several times.
 9. Every time you change the code in `index.js`, you will need to re-zip  it and update your OpenWhisk action: `wsk action update pigify --kind nodejs:6 pigify.zip` (Remember to remove your zip file so that it doesn't get re-zipped into your updated file! Try 
`rm pigify.zip && zip -r -X "pigify.zip" *`)


 
### 5. Create your `findTweets` OpenWhisk Action

Because we want to include the `moment` library and our config file, we're going to create our OpenWhisk action by uploading a zip file.

 1. Make sure you're in the `findTweets` directory.

 
 2. Open the `temp-config.js` file and replace the values with your own Twitter credentials and bot name, and the name of the action you created in step 3 above  (e.g. `pigify`). Then rename this file to `config.js` and delete `temp-config.js`. 
_NOTE_ You will need the full path of your action name, so check `wsk action list` to see what that is -- it might look something like `/$myBluemixSpace/pigify`. 
 3. Run `npm install`
 4. Run the tests: `npm test`
 5. Zip the files in this directory: `zip -r -X "findTweets.zip" *` 
 6. Create your OpenWhisk action: `wsk action create findTweets --kind nodejs:6 findTweets.zip`
 7. Check to see if your action has been created: `wsk action list`.
 8. You can invoke this action with the `testparams.json` file (don't forget to change the name of the bot in the `text` field to be your bot name) and this command: `wsk action invoke YOURACTIONNAME --blocking -r`


 
### 6. Create your OpenWhisk Trigger
 
We want our bot to check for new tweets every five minutes, so we're going to create an OpenWhisk trigger that runs our function every five minutes. 
 
You can set an alarm trigger with `cron` (let's call it `sendTweet`) to make this happen, like so: 

`wsk trigger create everyFiveMinutes --feed /whisk.system/alarms/alarm --param cron "*/5 * * * *"`

Cron syntax is tricky! If you don't want to remember it, you can use this handy [crontab generator](http://crontab-generator.org/).
 
 
### 7. Create your OpenWhisk Rule

Once you have an action and a trigger, you can put them together with a rule, like so: 

`wsk rule create tweetRule everyFiveMinutes findTweets`

The format here is 
`wsk rule create NameOfRule NameOfTrigger NameOfAction`

You can check your rule with this command: `wsk rule get NameOfRule`

### 8. Test it out!

With OpenWhisk, you can see your action logs directly in the terminal! Open a new terminal tab, and use the command: 

`wsk activation poll`

This will show you any `stdout` messages as your action runs.

You don't have to wait for your alarm to go off—you can fire your trigger like so: 

`wsk trigger fire everyFiveMinutes`

_NOTE_ if nobody has mentioned your new bot on Twitter your bot will not tweet. :)

### 9. Want to Turn Off Your Bot?

Double-check the name of your rule by entering 
`wsk rule list` at the command line. Then delete your rule (most likely `tweetRule`) with the line 
`wsk delete rule tweetRule`. 

### 10. Cleanup

If you are creating this example on a lab computer (or any computer that isn't yours), make sure you:

* log out of your Bluemix account in the browser
* delete your bot code on this machine: `rm -rf Pig-Latin-bot`
* de-authorize your OpenWhisk account on this machine, by removing `$HOME/.wskprops` (on the Interconect DevZone lab machines this will be in `/usr/local/bin`)
* delete sensitive commands (e.g., your OpenWhisk auth command) from your bash/zsh history. You can do this by editing the `~/.bash_history` or `~/.zsh_history` files. (The zsh shell may also  be called `.zhistory`. Not sure where yours is? Try `echo $HISTFILE`.)


### Thanks!

Thanks to [Darius Kazemi](https://github.com/dariusk) for the wordfilter module and [Isaac Hess](https://github.com/isaachess) for the pig-latin module.

Thanks also to all those who attended the OpenWhisk bot workshops at the 2017 InterConnect!

All errors, bugs, and omissions are, as always, the sole responsibility of the author.



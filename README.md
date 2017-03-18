# Make An Event-Driven Bot with OpenWhisk

### 1. Clone this repo

Prerequisites: I assume you have node and npm installed. Need help installing either? [Here's a link for you.](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

1. Clone this repo
2. Run `npm install`
3. Open in your favorite editor.

### 2. Get Credentials and Add Configuration

##### Twitter
* If you don't have a Twitter account, you will need one for your bot and Zapier. You can sign up for a Twitter account [here](https://twitter.com).
* a Twitter application (not the same as a Twitter account; apply for one at [apps.twitter.com](apps.twitter.com))
* a Consumer Key, a Consumer Secret, an Access Token, and your Access Token Secret

_NOTE_: when you sign up for a Twitter app, it will ask for a website and a callback URL. You can enter your bot's Twitter URL for the website (e.g., https://www.twitter.com/YOURBOTNAME) and you can leave the callback URL blank.

Also _NOTE_: You may be asked to connect a phone number to your Twitter app account. If you have your phone connected to a different Twitter account, just disconnect it from that account and connect it to the bot account to create your keys. Once your keys are set, you can delete and reattach the number to your primary account.

Put your key, secret, token, and access token secret in the `temp-config.js` file, and rename it to `config.js`. Then delete `temp-config.js`.

##### Zapier
Register for a (free) Zapier account [here](https://zapier.com).

##### Register for Bluemix

* a Bluemix account. Sign up for one at [https://console.ng.bluemix.net/registration](https://console.ng.bluemix.net/registration). *No credit card required! You'll get 2GB of runtime and container memory free for 30 days, plus access to provision up to 10 services (including databases, devops pipelines, and more).*


##### Install and configure Openwhisk
* Visit the [OpenWhisk CLI setup page](https://console.ng.bluemix.net/openwhisk/cli) and log in to Bluemix.
* Note your `Namespace` and `Authorization Key`. You will need them!
* Install the OpenWhisk CLI (instructions [here](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_cli.html#openwhisk-cli)).
* Once you have the OW CLI installed, set your `Namespace` and `Authorization Key`:

`wsk property set --apihost YOURNAMESPACE --auth YOURAUTHORIZATIONKEY`

(If you have a default NAMESPACE there won't be a NAMESPACE value in your Bluemix auth. Just copy-paste what you get after logging in and use that.)

You can also run your own OpenWhisk server! This is beyond the scope of this lab, but you can find more info [here](https://github.com/openwhisk/openwhisk).

##### Create your Zapier trigger
We'll be creating a 'Mention' trigger with Zapier. Zapier accounts can make two-step Zaps (like this one) [free](https://zapier.com/pricing/)! 

This trigger will run every five minutes, and will send a *separate* call to your OpenWhisk action for every @-mention your bot gets. So if five people @-mention your bot, your function will run five separate times.

1. From the Zapier Dashboard, choose "Make a Zap!"
2. From the "Choose a Trigger App" screen, select the "Twitter" trigger. At this stage, you will have to authorize with your Twitter account. (Don't worry, Zapier won't tweet as you!)
2. Choose "Search Mention" as your Twitter trigger.
2. Choose your authorized Twitter account.
3. Enter your search term -- it should be your Twitterbot name, including the '@' sign.
4. Choose the "Fetch and Continue" option. (If there are no mentions, none will be found ... you can skip Zapier's test at this point if you like.) Choose "Continue".
5. Choose an "Action App" -- it should be Webhooks (at the bottom of the list).
6. Choose the "GET" action.
7. In the URL field, enter the GET URL from your OpenWhisk action. If you have forgotten the URL, you can use the `wsk api-experimental list` command from the terminal to see all of the action URLs you have created.
8. Under "Send As JSON" choose YES. Leave the "JSON key" setting as "json". All of the other fields can be left as the default.
9. Go ahead and test your Zap! If there are errors, check the URL field and that you set "Send as JSON" correctly.
10. Click "Finish", and in the next screen name your Zap (giving it your bot's name is a good idea).
11. Set your Zap to ON. It will now run every five minutes.

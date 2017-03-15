#Make An Event-Driven Bot with OpenWhisk

###1. Clone this repo

Prerequisites: I assume you have node and npm installed. Need help installing either? [Here's a link for you.](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

1. Clone this repo
2. Run `npm install`
3. Open in your favorite editor.

###2. Get Credentials and Add Configuration

##### Twitter
If you don't have a Twitter account, you will need one for Zapier. You can sign up for a Twitter account [here](https://twitter.com).

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

##### Cloudant

Follow the instructions [here](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_cloudant.html#openwhisk_catalog_cloudant) to add a free Cloudant NoSQL database to your 
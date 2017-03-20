# Make An Event-Driven Bot with OpenWhisk, Cron-Trigger Version

This bot will take the `pigify` example found in the `pigify-twitterbot` folder and create an alarm-based trigger and a wrapper function to call it, instead of using the Zapier trigger.


## General Setup

1. Follow the general setup instructions under the `pigify-twitterbot` folder. You do not have to set up the Zapier trigger or create a function API URL.

2. If you haven't already, follow the instructions above to create a new Twitter account for your bot and a new app. Then put your key, secret, token, and access token secret in the `temp-config.js` file, and rename it to `config.js`. Then delete `temp-config.js`.



## To Do
* add testing info
* add cronset info
* slackbot?
* fix moment.js warning

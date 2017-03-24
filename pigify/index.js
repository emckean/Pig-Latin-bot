var piglatin = require('pig-latin');
var Twit = require('twit');
var wordfilter = require('wordfilter');
var config = require('./config.js')
var T = new Twit(config);
var botName = config.bot_name;


function tweetOK(phrase) {
      if (!wordfilter.blacklisted(phrase) && phrase !== undefined && phrase !== "" && phrase !== " " && tweetLengthOK(phrase)){
        return true;
      } else {
        return false;
      }
  }

function tweetLengthOK(phrase) {
      if (phrase.length <= 130){
        return true;
      } else {
        return false;
      }
  }

function cleanTweet(phrase, botName){
    var nameRegex = new RegExp(' *@'+botName+' *', 'gi');
    var unmentioned = phrase.replace(nameRegex, '');
    return(unmentioned.trim());
}  

function main(params){
    var JSONparams;
    try {
        JSONparams = JSON.parse(params.json);
    } catch (e) {
        JSONparams = JSON.parse(JSON.stringify(params.json));
    }
    var cleanText = cleanTweet(JSONparams.text, botName);
    var pigged = piglatin(cleanText);
    var text = '@'+JSONparams.user.name + " " + pigged;
    var errorText = '@'+JSONparams.user.name + " " + "Orrysay, Iway ouldn'tcay igifypay atthay."

    if (tweetOK(text)) {
        return new Promise((resolve, reject) => {    
        T.post('statuses/update', { status: text }, function(err, reply) {
            if (err) {
                reject({payload: err});
            }
            else {
                resolve({payload: 'yep, tweeted: '+ text});
            }
      });
    })
    } else {
        return new Promise((resolve, reject) => {    
        T.post('statuses/update', { status: errorText }, function(err, reply) {
            if (err) {
                reject({payload: err})
            }
            else {
                resolve({payload: 'yep, tweeted: '+ errorText});
            }
      });
    })
    }
};

exports.main = main;
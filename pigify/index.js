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

//ellipses really seem to make the pig-latin module unhappy so lets remove them temporarily
function removeEllipses(phrase){
    var ellipRegex = new RegExp(/[.]{3,4}/, 'gi');
    return(phrase.replace(ellipRegex, 'GGGGG'));
}  

// and put them back! 
function replaceEllipses(phrase){
    var reEllipRegex = new RegExp(/GgGGGay/, 'gi');
    return (phrase.replace(reEllipRegex, '...'));
} 

//remove botname and extra spaces
function cleanTweet(phrase, botName){
    var nameRegex = new RegExp('@'+botName, 'gi');
    //remove the bot name
    var unmentioned = phrase.replace(nameRegex, ' ');
    //clean up extra spaces
    var spaceRegex = new RegExp(/\s\s+/, 'gi');
    var EOLcheck = (unmentioned.replace(spaceRegex, ' ')).trim()
    //clean up extra spaces before ending punctuation
    var EOLSpaceRegex = new RegExp(/\s(.)$/, 'gi');
    return EOLcheck.replace(EOLSpaceRegex, '$1')

}  





function main(params){
    var JSONparams;
    try {
        JSONparams = JSON.parse(params.json);
    } catch (e) {
        JSONparams = JSON.parse(JSON.stringify(params.json));
    }
    var cleanText = cleanTweet(removeEllipses(JSONparams.text), botName);
    var errorText = '@'+JSONparams.user.name + " " + "Orrysay, Iway ouldn'tcay igifypay atthay."
    //if the pigLatin module balks at our text, let's catch that error
    try {
        var pigged = piglatin(cleanText);
        console.log(pigged)
        var text = '@'+JSONparams.user.name + " " + replaceEllipses(pigged);
    }
    catch (e){
        console.log('this text did not pigify nicely: ' + cleanText)
    }
    

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
var config = require('./config.js');
var Twit = require('twit');
var T = new Twit(config);
var moment = require('moment');
var openwhisk = require('openwhisk');
var pigifyAction = config.action_name;

function checkDate(date){
    var now = moment(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS');
    var lastTime = moment(now, 'YYYY-MM-DDTHH:mm:ss.SSS').subtract(5, 'minutes');
    if (moment(date, 'ddd MMM DD HH:mm:ss +0000 YYYY').isSameOrBefore(lastTime)){
        return false;
    } else {
        return true;
    }
}

function main(params){ 
  var wsk = openwhisk();  
  var user = config.bot_name;
  return new Promise((resolve, reject) => {    
    T.get('search/tweets', { q: user+' since:2017-01-01', count: 100 }, function(err, data, response) {
            if (err) {
                reject({payload: err})
            }
            else {
                data.statuses.map(function(status){
                    if (checkDate(status.created_at) === true) {
                        console.log('found tweets');
                        resolve(wsk.actions.invoke({
                            actionName: pigifyAction,
                            params: {json:"{\"text\": \""+ status.text + "\",\"user\": {\"name\": \""+status.user.screen_name+"\"}}"}
                        }))
                    }; 
                })
                resolve({payload: 'all tweets too old'});
            }    
        })
});
}
exports.main = main;
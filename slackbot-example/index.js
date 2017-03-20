var config = require('./config.js');
var openwhisk = require('openwhisk');
var pigifyAction = config.action_name;


function checkDate(date){
    var now = moment(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS');
    var lastTime = moment(now).subtract(5, 'minutes');
    if (moment(date).isSameOrBefore(lastTime)){
        return false;
    } else {
        return true;
    }
}

function main(params){ 
  console.log('these are the params: ' + JSON.stringify(params));
  var wsk = openwhisk();  
  var user = params.name || '@pigify';
  return new Promise((resolve, reject) => {
    resolve({ statusCode: 200,
        headers: { 'Content-type': 'application/json' },
        body: 'got here'
    })
  });
//   return new Promise((resolve, reject) => {    
//     T.get('search/tweets', { q: user+' since:2017-01-01', count: 100 }, function(err, data, response) {
//             if (err) {
//                 reject({payload: err})
//             }
//             else {
//                 data.statuses.map(function(status){
//                     if (checkDate(status.created_at) === true) {
//                         resolve(wsk.actions.invoke({
//                             actionName: pigifyAction,
//                             params: {json:"{\"text\": \""+ status.text + "\",\"user\": {\"name\": \""+status.user.name+"\"}}"}
//                         }))
//                     }; 
//                 })
//                 resolve({payload: 'all tweets too old'});
//             }    
//         })
// });
}
exports.main = main;
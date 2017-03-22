var expect = require('chai').expect;
var rewire = require("rewire");
var bot = rewire('../index.js');
var moment = require('moment');

//rewiring
checkDate = bot.__get__('checkDate');  


describe('canary test', function() {
	it ('should pass this canary test', function(){
		expect(true).to.eql(true);
	});
});


describe('check date tests', function() {
	it ('it should return true if date is within five minutes of now',function(){
		var now = moment(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS')
        var testDate = moment(now).subtract(4, 'minutes');
		var dateBool = checkDate(testDate);
		expect(dateBool).to.eql(true);
	});

    it ('it should return false if date is within five minutes of now',function(){
		var now = moment(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS')
        var testDate = moment(now).subtract(6, 'minutes');
		var dateBool = checkDate(testDate);
		expect(dateBool).to.eql(false);
	});

    it ('should return true if date is exactly five minutes from now', function (){
	    var now = moment(new Date(), 'YYYY-MM-DDTHH:mm:ss.SSS')
        var testDate = moment(now).subtract(5, 'minutes');
		var dateBool = checkDate(testDate);
		expect(dateBool).to.eql(false);
	});	

	// it ('it should return false if phrase is >= 130 char', function(){
	// 	var testPhrase = 'This text is far, far, far too long to tweet, if you want to stay well under the Twitter 140-character limit, which you do, I believe, yes?';
	// 	var phrase = tweetLengthOK(testPhrase);
	// 	expect(phrase).to.eql(false);
	// });
});

// describe('word filter test', function() {
// 	it ('it should return an error if the phrase contains a bad word', function(){
// 		var phrase = "using the word 'lame' is lame";
// 		var phraseCheck = tweetOK(phrase);
// 		expect(phraseCheck).to.eql(false);
// 	});

// 	it ('it should return an error if the phrase is undefined', function(){
// 		var phrase;
// 		var phraseCheck = tweetOK(phrase);
// 		expect(phraseCheck).to.eql(false);
// 	});

// 	it ('it should return an error if the phrase is empty', function(){
// 		var phrase = "";
// 		var phraseCheck = tweetOK(phrase);
// 		expect(phraseCheck).to.eql(false);
// 	});

// 	it ('it should return true if the phrase is OK', function(){
// 		var phrase = "Hi! I am a short phrase that is perfectly fine.";
// 		var phraseCheck = tweetOK(phrase);
// 		expect(phraseCheck).to.eql(true);
// 	});

// });
var expect = require('chai').expect;
var rewire = require("rewire");
var bot = rewire('../index.js');
var piglatin = require('pig-latin');


//rewiring
tweetOK = bot.__get__('tweetOK'); 
tweetLengthOK = bot.__get__('tweetLengthOK'); 
cleanTweet = bot.__get__('cleanTweet'); 
removeEllipses = bot.__get__('removeEllipses'); 



describe('canary test', function() {
	it ('should pass this canary test', function(){
		expect(true).to.eql(true);
	});
});


describe('phrase length tests', function() {
	it ('it should return true if phrase is = 130 char', function(){
		var testPhrase = 'This test text has been hand-crafted with love to equal exactly one hundred & thirty of the finest Tweetable characters available!';
		var phrase = tweetLengthOK(testPhrase);
		expect(phrase).to.eql(true);
	});

	it ('it should return true if phrase is <= 130 char', function(){
		var phrase = tweetLengthOK('Hi! I am a short phrase!');
		expect(phrase).to.eql(true);
	});	

	it ('it should return false if phrase is >= 130 char', function(){
		var testPhrase = 'This text is far, far, far too long to tweet, if you want to stay well under the Twitter 140-character limit, which you do, I believe, yes?';
		var phrase = tweetLengthOK(testPhrase);
		expect(phrase).to.eql(false);
	});
});

describe('word filter test', function() {
	it ('it should return an error if the phrase contains a bad word', function(){
		var phrase = "using the word 'lame' is lame";
		var phraseCheck = tweetOK(phrase);
		expect(phraseCheck).to.eql(false);
	});

	it ('it should return an error if the phrase is undefined', function(){
		var phrase;
		var phraseCheck = tweetOK(phrase);
		expect(phraseCheck).to.eql(false);
	});

	it ('it should return an error if the phrase is empty', function(){
		var phrase = "";
		var phraseCheck = tweetOK(phrase);
		expect(phraseCheck).to.eql(false);
	});

	it ('it should return an error if the phrase is just spaces', function(){
		var phrase = " ";
		var phraseCheck = tweetOK(phrase);
		expect(phraseCheck).to.eql(false);
	});

	it ('it should return true if the phrase is OK', function(){
		var phrase = "Hi! I am a short phrase that is perfectly fine.";
		var phraseCheck = tweetOK(phrase);
		expect(phraseCheck).to.eql(true);
	});

});

describe('cleanTweet tests', function() {
	it ('it should return phrase with bot name stripped out', function(){
		var testPhrase = 'testing a bot eh @pigify';
		var botName = 'pigify';
		var phrase = cleanTweet(testPhrase, botName);
		expect(phrase).to.eql('testing a bot eh');
	});

	it ('it should delete extra spaces before punctuation', function(){
		var testPhrase = 'testing a bot eh @pigify?';
		var botName = 'pigify';
		var phrase = cleanTweet(testPhrase, botName);
		expect(phrase).to.eql('testing a bot eh?');
	});

	it ('it should not delete extra spaces before opening quotes', function(){
		var testPhrase = 'hey @pigify testing a "bot" eh @pigify?';
		var botName = 'pigify';
		var phrase = cleanTweet(testPhrase, botName);
		expect(phrase).to.eql('hey testing a "bot" eh?');
	});

	it ('it should pigLatin "GGGGG"', function(){
		var testPhrase = 'GGGGG';
		var phrase = piglatin(testPhrase);
		expect(phrase).to.eql('GgGGGay');
	});

	it ('it should deal nicely with ellipses', function(){
		var testPhrase = 'hey @pigify this is another ... test';
		var botName = 'pigify';
		var phrase = removeEllipses(cleanTweet(testPhrase, botName));
		expect(phrase).to.eql('hey this is another GGGGG test');
	});




});
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

});


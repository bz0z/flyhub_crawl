var casper = require('casper').create();
var to_ = casper.cli.args[0], price = casper.cli.args[1];
var cities = ['Toronto', 'Montreal', 'Calgary', 'Vancouver'];
var urls = [], info = []
var counter = 0;

for(var g = 0; g < 4; g++){
	var date = new Date(), 
		year = date.getFullYear(),
		month = date.getMonth()+1,
		dayDate = date.getDate(),
		day = date.getDay(),
		days = new Date(year,month,0).getDate(),
		fridays = [], sundays1 = [], sundays2 = []

	for(var k = -1; k < 2; k++){
		for(var i = 1; i < days; i++){
			var thisDay = new Date(year,month+k,i)
			if(thisDay.getDay() == 5 && thisDay >= date){
				thisDay.setDate(thisDay.getDate() + 9)
				var date_to = year+'-'+(month+k+1)+'-'+i;
				var date_from = year+'-'+(thisDay.getMonth()+1)+'-'+thisDay.getDate()
				info.push(cities[g] + ' - ' + to_ + ' for '+date_to+ ' - ' + date_from)
				urls.push('http://www.flighthub.com/fares/airport-suggestion?new_search=1&seg0_from='+ cities[g] +'&seg0_date='+ date_to +'&seg0_to=' + to_ +'&seg1_date='+ date_from +'&num_adults=1&num_children=0&num_infants=0&num_infants_lap=0&seat_class=Economy&seg1_from='+ to_ +'&seg1_to=' + cities[g])
				thisDay.setDate(thisDay.getDate() + 7)
				date_from = year+'-'+(thisDay.getMonth()+1)+'-'+thisDay.getDate()
				info.push(cities[g] + ' - ' + to_ + ' for '+date_to+ ' - ' + date_from)
				urls.push('http://www.flighthub.com/fares/airport-suggestion?new_search=1&seg0_from='+ cities[g] +'&seg0_date='+ date_to +'&seg0_to=' + to_ +'&seg1_date='+ date_from +'&num_adults=1&num_children=0&num_infants=0&num_infants_lap=0&seat_class=Economy&seg1_from='+ to_ +'&seg1_to=' + cities[g]+"\n")
			}
		}
	}
}
console.log(info)
var execution = new Date(); 
var num = info.length;
casper.start();
casper.repeat(num, function(){
	this.thenOpen(urls[counter], function(){
		casper.capture('screenshots/data'+counter+'.png')	
		casper.click('.orange-big-btn.pointer')
		casper.waitFor(function check() {
		    return this.evaluate(function() {
		        return $('#fares-search-progress-bar').css('display') == 'none';
		    });
		}, function then() {
			casper.capture('screenshots/pricedata'+counter+'.png')
			var array = this.evaluate(function(price) {
				var arr = [], count = 11
				for(var i = 1; i < count; i++){
					var value = $('#fares-search-results ul.exp-container-flight-package li:nth-of-type('+i+') div.blue-fhub.result-price').text();
					if(value != ''){
						if(typeof price != 'undefined'){
							if(parseInt(value.substring(1)) < price){
								arr.push(value)
							}
						} else arr.push(value)
					}
				}
				return arr
			}, price)
			if(array.lenght == 0){
				console.log(info[counter])
				console.log('There isn\'t any proposal for less then '+ price +'$')
				counter++
			}
			else {
				console.log(info[counter] +'\n' +array)
				counter++
			}
		}, function timeout(){
			console.log('Timeout!')
		}, 70000).then(function(){
			console.log('=======================           '+(new Date() - execution)/ 1000 +'            ============================')
		})
	})
})
casper.run();































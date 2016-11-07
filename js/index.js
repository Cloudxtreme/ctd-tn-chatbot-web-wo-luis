var app = angular.module('submitExample',['ngMaterial']);
var messages = j('.messages-content'), d, i = 0, msg = "", botmsg = "";

function setDate() {
	d = new Date();
	j('<div class="timestamp">' + formatAMPM(d) + '</div>').appendTo(j('.message:last'));
}

function insertMessage(msg) {
	if (j.trim(msg) == '') {
		return false;
	}
	j('<div class="message message-personal new">' + msg + '</div>').appendTo(j('#mCSB_1_container'));
	setDate();
	j('.message-input').val(null);
	updateScrollbar();
}

function insertBotMessage(msg) {
	console.log("insertBotMessage "+msg);
	if (j.trim(msg) == '') {
		return false;
	}
	j('<div class="message new">' + msg + '</div>').appendTo(j('#mCSB_1_container'));
	setDate();
	j('.message-input').val(null);
	j('.message.loading').remove();
	j('.message.timestamp').remove();			
	updateScrollbar();
}

function updateScrollbar() {
	messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
		scrollInertia: 10,
		timeout: 0
	});
}

function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
  		hours = hours ? hours : 12; // the hour '0' should be '12'
  		minutes = minutes < 10 ? '0'+minutes : minutes;
  		var strTime = hours + ':' + minutes + ' ' + ampm;
  		return strTime;
 }

function setTyping() {
	j('<div class="message loading new"><span></span></div>').appendTo(j('#mCSB_1_container'));
	j('<div class="timestamp">Typing...</div>').appendTo(j('.message:last'));
	j('.message-input').prop('disabled',true);
}

j(window).load(function () {
	messages.mCustomScrollbar();
	insertBotMessage("Welcome to TNVAT. I am your tax advisor. I'm in training mode. So please bear with me.");
});

app.controller('autoCompleteController', autoCompleteController);
function autoCompleteController ($rootScope, $scope,$timeout, $q, $log) {
	var self = this;
	self.car = loadCar();
	self.querySearch   = querySearch;
	self.selectedItemChange = selectedItemChange;
	self.searchTextChange   = searchTextChange;
	var qa_present;
	$scope.submit1 = function() {
		var user_input = angular.lowercase(j('#input-0').val());
		self.car.map(function (car) { 
			if (car.value.indexOf(user_input) === 0) {
			insertMessage(user_input);
			j('#input-0').val('');
			qa_present = true;
			setTyping();
			setTimeout(function(){ 
  				insertBotMessage(car.answer);
  			}, 2000);		
			}
		});
		if (!qa_present)
		{
			insertMessage(user_input);
			j('#input-0').val('');
			setTyping();
			setTimeout(function(){ 
  				insertBotMessage("I am not getting you. Please provide appropriate question or feel free to call our <i>Helpdesk Toll Free Number (18001036751)</i>");
  			}, 2000);		
		}
		}
	function querySearch (query) {
		var start = Math.floor(Math.random() * (self.car.length - 100));
		var end = 10 + start;
		var results = query ? self.car.filter(createFilterFor(query)) : self.car.slice(1, 10), deferred;

		if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function () { 
				deferred.resolve(results); 
			}, 
			Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}
	function searchTextChange(text) {
	}
	function selectedItemChange(item) {
	}

	function selectedItemChange(item) {
 		 
	}
	//build list of states as map of key-value pairs
	function loadCar() {
		var arrCarList = new Array(
			"What is the difference between Informational and Transactional Portal?, [In Informational Portal, you can view and download all the Commercial Taxes Department related information, Notifications, Acts, Rules, Forms and Tax application Process documents. In Transactional Portal, you can do all your taxation related activities like e-Registration, e-Payment, e-Returns, e-CST Forms Issuance etc]",
			"What is the Registration Fees for VAT?, The registration fees is Rs. 1000/- for principal place of business and Rs. 1000/- for each additional place of business (Branches and Godowns). No Security Deposit is necessary for Registration for dealers.There is no renewal of registration under VAT and it is permanent till it is cancelled by the Department or on stoppage of business when reported by the dealer.",
			"What is the date of service of documents?, Wherever any document like notice or order is sent to dealer to his registered e-mail Id or is available in download documents option in portal login, date of service will be considered as date on which documents has been generated from the system.",
			"What is the login ID for the dealer?, Email ID shall be the login ID till the time dealer gets registered and once dealer gets registered - TIN shall be the login ID.",
			"What is the method to obtain commodity details?, Both on the Informational Portal and Transactional Portal has the link for Commodity Search & Tax Rates. User can search either by commodity name or by commodity code and click on search. All the details of the commodity will be displayed on the screen. A downloadable PDF file is also available containing the entire list and details of commodities.",
			"What is the RC effective date for TNGST dealers?, The RC effective date to be entered for the signup process will be VAT RC effective date i.e. 01/01/2007 instead of GST RC effective date.",
			"What is Voluntary Registration under VAT?, Voluntary Registration means those dealer who are not compulsorily registered under the TNVAT Act 2006. The following dealer (or) person intending to commence business may get himself registered under the Act. A dealer who purchases goods within the State and effects sale of those foods within the state and whose total turnover in any year is less than Ten Lakhs of Rupees. Every other dealer whose total Turnover in a year is less than Five Lakhs of Rupees.",
			"What is Master TIN?, Dealer with same PAN will be issued the same TIN for registration in different tax types; this TIN is called Master TIN.",
			"What is the mode of payment for Registration?, No Cheque /Demand Draft/ cash will be accepted.The payment can be done only through net banking or through e-challan.For further details go through payment guide",
			"What is duplicate Registering certificate?, The concept of duplicate Registering certificate is not available since the original certificate is available through digital mode.",
			"What is registration under CST and other Acts?, Only online mode of application is accepted as in VAT registration. For further details go through User Manual provided on TNCTD homepage under Help top menu.",
			"What is the procedure to obtain registration certificate by digital signature?, After login, there is a link available by the name Map Digital Certificate by which dealer can map his digital certificate in the system. While registering, select yes option in Is application digitally signed? The system will display all the mapped certificate to choose from. Then upload the signed xml which will be validated against selected mapped digital certificate and submit.",
			"What are the conditions to be fulfilled to generate F Forms?, 	Condition for generation of F Forms: Forms are generated monthly. Confirmed CST return (with annexure 10) for at least one month of the quarter should be filed. Payment for this period should be realized. Commodities entered in return forms (CST i.e. Annexure 8 and annexure 10 of VAT Form I) should match with the registered CST commodities. Forms for the quarter will be generated after 1 month and 20 days of quarter end. Dealer can check reason for not generation forms in portal under e-Services menu ? e-CST Forms ?e-CST Forms Status with Non Generated Forms as Status."
		);
	return arrCarList.map( function (car) {
	return {
		value: car.split(',')[0].toLowerCase(),
		answer: car.split(',')[1],
		display: car.split(',')[0]
	};
});
}
	//filter function for search query
	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(car) {
			return (car.value.indexOf(lowercaseQuery) >= 0);
		};
	}
} 

app.controller('ChatTitleCtrl', ['$scope', function ($scope) {
	$scope.maximChatbox = function () {
		j("#minim-chat").css("display","block");
		j("#maxi-chat").css("display","none");
		j("#chatbox").css("margin","0");
		j("#animHelpText").css("display","none");
	};
	$scope.minimChatbox = function () {
		j("#minim-chat").css("display","none");
		j("#maxi-chat").css("display","block");
		j("#chatbox").css("margin","0 0 -53vh 0");
		j("#animHelpText").css("display","block");
	};
}]);
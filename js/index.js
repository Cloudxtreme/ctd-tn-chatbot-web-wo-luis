var app = angular.module('submitExample', ['ngMaterial']);
var messages = j('.messages-content'),
	d, i = 0,
	msg = "",
	botmsg = "";

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
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}
var toggle = true;
j(window).bind('keypress', function (e) {
	if (e.keyCode == 13) {
		if (toggle) {
			j("#input-0").focus();
		} else {
			j("#input-0").blur();
		}
		toggle = !toggle;
	}
});

function setTyping() {
	j('<div class="message loading new"><span></span></div>').appendTo(j('#mCSB_1_container'));
	j('<div class="timestamp">Typing...</div>').appendTo(j('.message:last'));
	j('.message-input').prop('disabled', true);
}

j(window).load(function () {
	messages.mCustomScrollbar();
	j('.md-virtual-repeat-scroller').mCustomScrollbar();
	insertBotMessage("Hello, I am Nithya Robo");
	setTyping();
	setTimeout(function () {
		insertBotMessage("I am here to help you.");
	}, 1000);
	setTimeout(function () {
		insertBotMessage("As I'm new and in my learning period, I may not have answers to all your questions. However will try my best to provide the right information");
	}, 2000);
});


function email_template() {
	j('<form id="send_email" action="contact.html"><div class="message new"><table><tr><td>Name:</td><td><input id="email" type="text" name="name" /></td></tr><tr><td>Email:</td><td><input id="email" type="email" name="email" /></td></tr><tr><td> Query: </td><td><textarea name="comment"></textarea></td></tr><tr><td><input id="send_email" type="submit" value="Send Email" /></td></tr></table></form>').appendTo(j('#mCSB_1_container'));
	j('#send_email').submit(function (e) {
		e.preventDefault();
		j("input#email").attr('disabled', 'disabled');
		j("input#send_email").attr('disabled', 'disabled');
		j("textarea").attr('readonly', 'readonly');
		insertBotMessage("Your email is sent successfully. We will get back to you shortly...");
	});
}

app.controller('autoCompleteController', autoCompleteController);

function autoCompleteController($rootScope, $scope, $timeout, $q, $log) {
	var self = this;
	self.car = loadCar();
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;
	self.searchTextChange = searchTextChange;
	var qa_present;
	var attempt = 0;
	$scope.submit1 = function () {
		$scope.noCacheResults = false;
		// j('.md-autocomplete-suggestions').hide();
		var user_input = angular.lowercase(j('#input-0').val());
		j("#input-0").blur();
		if (j.trim(user_input) == '') {
			console.log("fasle");
			return false;
		}


		if (/hi|hello|hay/i.test(user_input) == true) {
			insertMessage(user_input);
			setTyping();
			setTimeout(function () {
				insertBotMessage("May I know what you are looking for");
			}, 1000);
		} else {
			var answer_count = 0;
			var correct_answer, correct_question;

			self.car.map(function (car) {
				if (car.value.indexOf(user_input) === 0) {
					answer_count = answer_count + 1;
					correct_answer = car.answer;
					correct_question = car.value;
				}
			});

			if (answer_count == 1) {
				qa_present = true;
				insertMessage(correct_question);
				setTyping();
				setTimeout(function () {
					insertBotMessage(correct_answer);
				}, 1000);
			}
			if (!qa_present) {
				if (attempt < 1) {
					insertMessage(user_input);
					setTyping();
					setTimeout(function () {
						insertBotMessage("Oops! Sorry I didn't understand your question. Can you please type your question in the format Ex : How can / What is");
					}, 1000);
					attempt = attempt + 1;
				} else {
					insertMessage(user_input);
					setTyping();
					setTimeout(function () {
						insertBotMessage("Sorry I still didn't get your question. While I try to learn the answer to your question, could you please contact 1800-xxx-xxx for the right answer");
						email_template();
					}, 1000);
					attempt = 0;
				}
			} else {
				qa_present = false;
				attempt = 0;
			}
		}
		j('#input-0').val('');
	}

	function querySearch(query) {
		var start = Math.floor(Math.random() * (self.car.length - 100));
		var end = 10 + start;
		var results = query ? self.car.filter(createFilterFor(query)) : self.car.slice(1, 10),
			deferred;

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

	function searchTextChange(text) {}

	function selectedItemChange(item) {}

	//build list of states as map of key-value pairs
	function loadCar() {
		var arrCarList = new Array(
			"What is the difference between Informational and Transactional Portal?<answer> In Informational Portal, you can view and download all the Commercial Taxes Department related information, Notifications, Acts, Rules, Forms and Tax application Process documents. In Transactional Portal, you can do all your taxation related activities like e-Registration, e-Payment, e-Returns, e-CST Forms Issuance etc.",
			"What is the Registration Fees for VAT?<answer> \n The registration fees is \n Rs. 1000/- for principal place of business and Rs. 1000/- for each additional place of business (Branches and Godowns). No Security Deposit is necessary for Registration for dealers.There is no renewal of registration under VAT and it is permanent till it is cancelled by the Department or on stoppage of business when reported by the dealer.",
			"What is the date of service of documents?<answer> Wherever any document like notice or order is sent to dealer to his registered e-mail Id or is available in download documents option in portal login, date of service will be considered as date on which documents has been generated from the system.",
			"What is the login ID for the dealer?<answer> Email ID shall be the login ID till the time dealer gets registered and once dealer gets registered - TIN shall be the login ID.",
			"What is the method to obtain commodity details?<answer> Both on the Informational Portal and Transactional Portal has the link for Commodity Search & Tax Rates. User can search either by commodity name or by commodity code and click on search. All the details of the commodity will be displayed on the screen. A downloadable PDF file is also available containing the entire list and details of commodities.",
			"What is the RC effective date for TNGST dealers?<answer> The RC effective date to be entered for the signup process will be VAT RC effective date i.e. 01/01/2007 instead of GST RC effective date.",
			"What is Voluntary Registration under VAT?<answer> Voluntary Registration means those dealer who are not compulsorily registered under the TNVAT Act 2006. The following dealer (or) person intending to commence business may get himself registered under the Act. A dealer who purchases goods within the State and effects sale of those foods within the state and whose total turnover in any year is less than Ten Lakhs of Rupees. Every other dealer whose total Turnover in a year is less than Five Lakhs of Rupees.",
			"What is Master TIN?<answer> Dealer with same PAN will be issued the same TIN for registration in different tax types; this TIN is called Master TIN.",
			"What is the mode of payment for Registration?<answer> No Cheque /Demand Draft/ cash will be accepted.The payment can be done only through net banking or through e-challan.For further details go through payment guide",
			"What is duplicate Registering certificate?<answer> The concept of duplicate Registering certificate is not available since the original certificate is available through digital mode.",
			"What is registration under CST and other Acts?<answer> Only online mode of application is accepted as in VAT registration. For further details go through User Manual provided on TNCTD homepage under Help top menu.",
			"What is the procedure to obtain registration certificate by digital signature?<answer> After login - there is a link available by the name Map Digital Certificate by which dealer can map his digital certificate in the system. While registering, select yes option in Is application digitally signed? The system will display all the mapped certificate to choose from. Then upload the signed xml which will be validated against selected mapped digital certificate and submit.",
			"What are the conditions to be fulfilled to generate F Forms?<answer> 	Condition for generation of F Forms: Forms are generated monthly. Confirmed CST return (with annexure 10) for at least one month of the quarter should be filed. Payment for this period should be realized. Commodities entered in return forms (CST i.e. Annexure 8 and annexure 10 of VAT Form I) should match with the registered CST commodities. Forms for the quarter will be generated after 1 month and 20 days of quarter end. Dealer can check reason for not generation forms in portal under e-Services menu ? e-CST Forms ?e-CST Forms Status with Non Generated Forms as Status.",
			//Newly added questions
			"How can/will a works Contractee obtain TDS certificate?<answer>On the informational Portal (without logging in), click on the link of TDS Certificate (Form T) and click on search. The required details will be displayed.",
			"How can/will I receive my TIN and Registration Certificate?<answer>TIN: Once your application is approved by the Registration Authority, TIN will be generated and emailed to you on the email id provided in your application. This TIN issuance is purely on provisional basis.<br>Registration Certificate: Once your documents are submitted to CTD Office and the site visit is conducted and Registration Authority approves, the certificate will be generated and can be collected from the CTD Office. The Registration Certificate will be issued only through digital mode. The certificate affixed with digital certificate will be send through e-mail and also available in the dealer profile permanently.",
			"How can/will I register in TNVAT Portal if I already have a TIN?<answer>If dealer already has an Online Account on the existing Tamil Nadu CTD Portal, he can log in the new TNCTD Portal by clicking on New User Signup on the E-Registration link and then select Yes option button in Do you have a TIN? Then user needs to enter his TIN which will be his login ID, his e-mail ID, first name, last name, mobile number, tax type and RC effective date and click on submit.",
			"How can/will I contact TNCTD Helpdesk?<answer>On the TNCTD Portal homepage, Helpdesk Toll Free Number (18001036751) is displayed on top right corner.<br>1.If the user has any doubt then he can post his query by clicking on the Request Logger link available on homepage.<br>2.If the user wants to register any grievance then he can post his grievance by clicking on the Grievance Redressal link available on homepage.<br>3.If the user has any suggestion then he can post his suggestion by clicking on the Suggestions link available on homepage.<br>4.If the user wants to report any tax evasion incident then he can report such incident by clicking on the Report Tax Evasion link available on homepage.",
			"How can/will I search for a dealer on the portal?,Both on the Informational Portal and Transactional portal has the link for Dealer Search. A dealer can be searched either by his TIN, PAN or Firm name. ",
			"How can/will I check the status of my posted query?<answer>On the TNCTD Portal homepage, click Request Logger link on top right corner. Select the option of Check query status and enter your request number and click on search.",
			"How can/will I get a new TNCDT Portal password, if I had forgotten my password?<answer>Click on the Forgot Password link on the transactional portal. If you are a registered dealer, then you can select any of the available two options :<br>1. Answer Security Question<br>2. Answer other details (only for registered dealers)<br>and get your new password by entering required details. In case of users other than registered dealers, then select Answer Security Question and enter required details to get the new password.",
			"How can/will I apply for Registration under various Acts?<answer>Online registration is compulsory.The template for registration is available in the website. For further details, dealer can go through How to E-Register user manual provided under Help top menu.",
			"How can/will a/the dealer track the current status of e-Forms?<answer>Dealer can track the status of successfully filed e-Forms from Web Portal via browse through the link<br><i style=”color:red;”>/ e-Services / e-Forms /View e-Forms (JJ/KK/LL/MM)</i><br>Here dealer filter the search based upon mentioning parameters like Form No, Current Status From/To Date etc.",
			"How can/will a/the dealer search the payments he has made till date to the department?<answer>The dealers can click on Payment History link under e-payments and view the payment on the basis of transaction ID.",
			"Where can/will I download the Form - A?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+A/81a25477-31c7-43d8-85ad-5260410fb4ea?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-A</button></a>",
			"Where can/will I download the Form - A1?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+A1/284782b8-e949-4d97-9dc9-c9c49ff26cc2?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-A1</button></a>",
			"Where can/will I download the Form - AA?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+AA/321da82b-09c3-4d08-a4f6-38223d5fc87c?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-AA</button></a>",
			"Where can/will I download the Form - B?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+B/96ad2090-6fc2-4a90-9a08-7322db57e2a7?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-B</button></a>",
			"Where can/will I download the Form - BB?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+BB/1c85f484-e5e1-4f21-bd3a-fbbe3a1e40cd?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-BB</button></a>",
			"Where can/will I download the Form - CC?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+CC/164e7f71-1221-42cc-a26e-a306085155b5?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-CC</button></a>",
			"Where can/will I download the Form - D?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+D/449d854b-ff0c-4c65-99db-1efe06ec396c?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-D</button></a>",
			"Where can/will I download the Form - DD?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+DD/4b6a95bf-50d8-48d9-b967-63a765024644?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-DD</button></a>",
			"Where can/will I download the Form - E?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+E/38234c54-85a3-4eb7-b16d-a27ae7a0dfd0?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-E</button></a>",
			"Where can/will I download the Form - F?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+F/d2c68ffa-db04-409e-873c-5da8ded35eb0?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-F</button></a>",
			"Where can/will I download the Form - FF?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+FF/337f4f23-2dc8-4dac-83d7-787f2cf3a472?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-FF</button></a>",
			"Where can/will I download the Form - G?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+G/436c38ae-12f9-4967-b93b-64c04a4cae00?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-G</button></a>",
			"Where can/will I download the Form - G-1?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+G-1/37af17c9-2508-4c9c-bc19-39bd13dbd5dd?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-G1</button></a>",
			"Where can/will I download the Form - GG?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+GG/8a8718a5-17e9-43c3-9c1c-4d2e57a62739?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-GG</button></a>",
			"Where can/will I download the Form - H?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+H/81d56588-7b61-4bdc-94aa-a642ff75e435?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-H</button></a>",
			"Where can/will I download the Form - HH?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+HH/ff9cc0aa-69f0-4fb3-8901-fd96b0550586?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-HH</button></a>",
			"Where can/will I download the Form - II?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-II/7c7aa14b-4055-479c-9f2f-3053082ac325?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-II</button></a>",
			"Where can/will I download the Form - K1?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+K-1/1f591e2f-c136-4723-93de-44463f78268d?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-K1</button></a>",
			"Where can/will I download the Form - M?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+M/a19e7b86-5295-42f3-8e8e-bf820475855b?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-M</button></a>",
			"Where can/will I download the Form - MM?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/FORM+MM/d05d41cd-cc44-4798-bdff-23d1441c7bab?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-MM</button></a>",
			"Where can/will I download the Form - N?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+N/8c8c69c7-3a94-48d8-a5ab-b90be897e7f2?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-N</button></a>",
			"Where can/will I download the Form - O?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+O/42f615ea-6bda-428f-84b7-e8dc60515a73?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-O</button></a>",
			"Where can/will I download the Form - P?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+P/8dc4d641-da9a-4218-99a3-8a44c59d1d32?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-P</button></a>",
			"Where can/will I download the Form - P1?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+P1/a8539b18-cddc-412c-ae71-412cce2bbbb0?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-P1</button></a>",
			"Where can/will I download the Form - PP?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+PP/08af6478-f34e-419b-bab3-b09682ac7827?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-PP</button></a>",
			"Where can/will I download the Form - QQ?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+QQ/f03fdadc-600e-4dec-a845-93b9b30cc5d1?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-QQ</button></a>",
			"Where can/will I download the Form - R?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+R/90d76a81-2a65-49dc-a750-1722e7ba5acf?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-R</button></a>",
			"Where can/will I download the Form - RR?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+RR/ba0b4b54-5d41-4530-a705-f26a95af0719?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-RR</button></a>",
			"Where can/will I download the Form - S?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+S/2c412655-f43b-48ea-8b32-928dc07745ad?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-S</button></a>",
			"Where can/will I download the Form - SS?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-+SS/d6b90efd-5754-4745-9124-cdca84085b98?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-SS</button></a>",
			"Where can/will I download the Form - T?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form-T/ff31af99-66ba-45eb-ad7b-b222397ddb4d?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-T</button></a>",
			"Where can/will I download the Form - TT?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-TT/4aa66a61-f925-4cf2-9447-5fe450064e52?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-TT</button></a>",
			"Where can/will I download the From - U?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/From+-+U/75d4ad99-26ea-4c14-8c5b-237adf5893be?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-U</button></a>",
			"Where can/will I download the Form - V?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-V/d7d7e4fe-871d-478a-9b58-fb6a7f68c0ef?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-V</button></a>",
			"Where can/will I download the Form - VV?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-VV/25d9a766-7960-413e-97b4-c6ad05fcdeee?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-VV</button></a>",
			"Where can/will I download the Form - W?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+W/09539206-bd20-4b7d-a673-8104575e2257?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-W</button></a>",
			"Where can/will I download the Form - X?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+X/afae33c6-3eb8-436e-a33f-c0ba36661bf4?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-X</button></a>",
			"Where can/will I download the Form - XX?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+-XX/4ed3bc12-75e6-4446-91ba-39f0ec697a75?version=1.0\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-XX</button></a>",
			"Where can/will I download the Form - Y?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+Y/45fac066-43d4-4c90-8e31-ff19a580eaa6?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-Y</button></a>",
			"Where can/will I download the Form - Z?<answer>You can download the requested FORM from the below link<a href=\"https://ctd.tn.gov.in/documents/10184/188461/Form+Z/d3a0da55-f696-45b1-a25d-d9a2d76675ad?version=1.1\" download><button class=\"bot-download-btn\" ><i class=\"fa fa-download\" aria-hidden=\"true\"></i> FORM-Z</button></a>"
		);
		return arrCarList.map(function (car) {
			return {
				value: car.split('<answer>')[0].toLowerCase(),
				answer: car.split('<answer>')[1],
				display: car.split('<answer>')[0]
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
		j("#minim-chat").css("display", "block");
		j("#maxi-chat").css("display", "none");
		j("#chatbox").css("margin", "0");
		j("#animHelpText").css("display", "none");
	};
	$scope.minimChatbox = function () {
		j("#minim-chat").css("display", "none");
		j("#maxi-chat").css("display", "block");
		j("#chatbox").css("margin", "0 0 -53vh 0");
		j("#animHelpText").css("display", "block");
	};
}]);


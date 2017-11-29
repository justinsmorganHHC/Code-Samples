'use strict';

app.controller('ProrepEnrollMember', ['$rootScope', '$scope', '$http', '$filter', '$state', function ($rootScope, $scope, $http, $filter, $state) {
	//console.log( "ProReps Enroll Member Controller");
	var token = $rootScope.member.token;

	if (!$rootScope.enrollProduct) $state.go($state.includes('app.enrollprorep') ? 'app.enrollprorep.product' : 'app.enrollmember.product');
	
	$scope.globals = {
		PageName: $state.includes('app.proreps.enrollprorep') ? 'Enroll a Pro Rep' : 'Enroll a Member',
		type: $state.includes('app.proreps.enrollprorep') ? 'P' : 'T',
		prorep: true,
		update: true,
		message: {},
		responce: false,
		hideform: false
	};
	
	$scope.forms = {
		member: {}
	};
	
	$scope.lists = {
		Country: {}
	};

    $scope.clearmainmessage = function () {
		$scope.globals.message = {};
	};
	
	$scope.panels = {
		main: {
			data: {},
			order: [
				{name: 'FirstName', capt: 'First Name', edit: true, validation: {required:true,max:32}},
				{name: 'LastName', capt: 'Last Name', edit: true, validation: {required:true,max:32}},
				{name: 'Company', capt: 'Company', edit: true, validation: {max:64}},
				{name: 'Street', capt: 'Street', edit: true, validation: {required:true,max:64}},
				{name: 'Street2', capt: 'Street2', edit: true, validation: {max:64}},
				{name: 'City', capt: 'City', edit: true, validation: {required:true,max:32}},
				{name: 'State', capt: 'State', edit: true, validation: {required:true,max:32}},
				{name: 'PostalCode', capt: 'Postal Code', edit: true, digit: true, validation: {max:10}},
				{name: 'Country', capt: 'Country', list: true, edit: true, validation: {max:32}},
				{name: 'Email', capt: 'Email', edit: true, type: 'email', validation: {max:32}},
				{name: 'Telephone', capt: 'Telephone', edit: true, digit: true, validation: {max:10}},
				{name: 'CreditCardNumber', capt: 'Card Number', edit: true, validation: {max:20}},
				{name: 'CreditCardExpirationDate', capt: 'Expiration Date', edit: true, digit: true, validation: {max:4}},
				{name: 'CreditCardNameOnCard', capt: 'Name On Card', edit: true, validation: {max:64}},
				{name: 'TaxId', capt: 'SSN/Tax Id', edit: true, hide: !$scope.globals.prorep, validation: {max:64}}
			]
		}
	};
	
	$scope.savememberenroll = function() {
		if ($scope.globals.update || !$scope.forms.member.$valid) return;
		var obj = {
			token: token,
			saving: true,
			user: $scope.panels.main.data,
			products: $rootScope.enrollProduct,
			type: $scope.globals.type
		};
		$scope.globals.update = true;
		$scope.clearmainmessage();
		$http.post('/api/prorep/enroll', obj)
		.then(function (response) {
			if (response.data.response.error) {
				if (response.data.response.error) angular.forEach(response.data.response.error, function(value){
					$rootScope.toaster = {type: 'error', title: 'Saving error',text: value};
					$rootScope.pop();
				});
			} else if (response.data.response.enroll) {
				$scope.globals.hideform = true;
			}
			$scope.globals.update = false;
		},
		function (x) {
			//console.log(x);
			$scope.globals.update = false;
		});
	};
	
	$http.post('/api/prorep/lists', {token:token, list: 'Country'})
	.then(function (response) {
		//console.log(response);
		if (response.data.status) {
			$scope.lists.Country = response.data.response.list;
		}
		$scope.globals.update = false;
	});

}]);
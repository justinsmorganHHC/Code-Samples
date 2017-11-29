'use strict';

app.controller('ProrepProfile', ['$rootScope', '$scope', '$http', '$state', function ($rootScope, $scope, $http, $state) {
	//console.log( "ProReps Controller");
	var token = $rootScope.member.token;
	//$scope.accountsummary = {};
	$scope.forms = {},
	$scope.lists = {
		Country: {}
	};
	$scope.globals = {
		addr: null,
		Pagename: '',
		messages: [],
		showform: 'profile',
		update: true
	};	
	$scope.profile = {
		data: {},
		copy: {},
		id: 0,
		update: true,
		order: [
			{name: 'SubType', capt: 'Membership Type', edit: false},
			{name: 'FirstName', capt: 'First Name', edit: false},
			{name: 'LastName', capt: 'Last Name', edit: false},
			{name: 'Company', capt: 'Company', edit: false},
			{name: 'LoginId', capt: 'Member Id', edit: false},
			{name: 'CreateDateTime', capt: 'Join Date', edit: false},
			{name: 'Email', capt: 'E-mail', edit: true, type: 'email',validation:{required:true}},
			{name: 'Telephone', capt: 'Telephone', edit: true, digit:true, validation:{required:true,min:10}},
			{name: 'Password', capt: 'Password', edit: true, hidden: true, type: 'password',validation:{min:6,max:32}}
		],
		setProfileCopy: function() {
			$scope.profile.copy = {};
			for (var i in $scope.profile.order) {
				if (!$scope.profile.order[i].hidden) $scope.profile.copy[$scope.profile.order[i].name] = $scope.profile.data[$scope.profile.order[i].name];
			}
		}
	};
	
	$scope.data = {
		Shipping: {
			data: {},
			copy: {}
		},
		Billing: {
			data: {},
			copy: {}
		},
		Payment: {
			data: {},
			copy: {},
			types: function(){
				if (!this.data || !this.data.hasOwnProperty('CreditCardNumber')) return '';
				var t = '';
				switch (this.data.CreditCardNumber.slice(0,1)){
					case '3': t = 'AMEX'; break;
					case '4': t = 'Visa'; break;
					case '5': t = 'MasterCard'; break;
					case '6': t = 'Discover'; break;
				}
				return t;
			},
			number: function(){
				if (!this.data || !this.data.hasOwnProperty('CreditCardNumber')) return '';
				return '************' + this.data.CreditCardNumber.slice(-4);
			},
			valid: function(){
				if (!this.data || !this.data.hasOwnProperty('CreditCardExpirationDate')) return '';
				return this.data.CreditCardExpirationDate.slice(0,2) + '/20' + this.data.CreditCardExpirationDate.slice(-2);
			},
			update: function(val) {
				return (val.indexOf('*') === -1) ? val : this.data.CreditCardNumber;
			}
		}
	};
	
	$scope.panels = [
		{
			name: 'Shipping',
			capt: 'Shipping Address',
			save: false,
			show: true,
			update: false,
			order: [
				{name: 'FirstName', capt: 'First Name', edit: true, validation: {max:32}},
				{name: 'LastName', capt: 'Last Name', edit: true, validation: {max:32}},
				{name: 'Organization', capt: 'Organization', edit: true, validation: {max:64}},
				{name: 'Street', capt: 'Street', edit: true, validation: {required:true,max:64}},
				{name: 'Street2', capt: 'Street2', edit: true, validation: {max:64}},
				{name: 'Country', capt: 'Country', list:true, edit: true, validation: {required:true,max:32}},
				{name: 'City', capt: 'City', edit: true, validation: {required:true,max:32}},
				{name: 'State', capt: 'State', edit: true, validation: {required:true,max:32}},
				{name: 'PostalCode', capt: 'Postal Code', edit: true, digit: true, validation: {required:true,max:10}},
				{name: 'Email', capt: 'Email', edit: true, type: 'email', validation: {required:true,max:32}},
				{name: 'Telephone', capt: 'Telephone', edit: true, digit: true, validation: {max:10}}
			],
			messages: []
		},
		{
			name: 'Billing',
			capt: 'Billing Address',
			save: false,
			show: true,
			update: false,
			order: [
				{name: 'FirstName', capt: 'First Name', edit: true, validation: {max:32}},
				{name: 'LastName', capt: 'Last Name', edit: true, validation: {max:32}},
				{name: 'Organization', capt: 'Organization', edit: true, validation: {max:64}},
				{name: 'Street', capt: 'Street', edit: true, validation: {required:true,max:64}},
				{name: 'Street2', capt: 'Street2', edit: true, validation: {max:64}},
				{name: 'Country', capt: 'Country', list:true, edit: true, validation: {required:true,max:32}},
				{name: 'City', capt: 'City', edit: true, validation: {required:true,max:32}},
				{name: 'State', capt: 'State', edit: true, validation: {required:true,max:32}},
				{name: 'PostalCode', capt: 'Postal Code', edit: true, digit: true, validation: {required:true,max:10}},
				{name: 'Email', capt: 'Email', edit: true, type: 'email', validation: {required:true,max:32}},
				{name: 'Telephone', capt: 'Telephone', edit: true, digit: true, validation: {max:10}}
			],
			messages: []
		},
		{
			name: 'Payment',
			capt: 'Payment Address',
			save: false,
			show: true,
			update: false,
			order: [
				{name: 'CreditCardNumber', capt: 'Card Number', edit: true, validation: {required:true,max:20}, __get: function(){return $scope.data.Payment.number();}, __set: function(val){return $scope.data.Payment.update(val);}},
				{name: 'CreditCardExpirationDate', capt: 'Expiration Date', edit: true, digit: true, validation: {required:true,max:4}},
				{name: 'CreditCardNameOnCard', capt: 'Name On Card', edit: true, validation: {required:true,max:64}}
			],
			messages: []
		}
	];
	
	/* functions */
	$scope.errorMessage = function(err, obj) {
		if (typeof err !== 'object') return;
		this.MSG = function(type, obj) {
			switch (type) {
			case 'required':
				return obj.capt + ' is required.';
				break;
			case 'minlength':
				return obj.capt + ' must contain at least ' + obj.validation.min + ' ' + (obj.digit ? 'digits' :'characters') + '.';
				break;
			case 'email':
				return obj.capt + ' is not a valid e-mail address.';
				break;
			case 'maxlength':
				return obj.capt + ' is too long.  Maximum length is ' + obj.validation.max + ' ' + (obj.digit ? 'digits' :'characters') + '.';
				break;
			default:
				break;
			}
		};
		return this.MSG(Object.keys(err)[0], obj);
	};
	$scope.addMessage = function(type, msg) {
		$scope.globals.messages.push({type: type, msg: msg});
	};
	$scope.closeMessage = function(index) {
		$scope.globals.messages.splice(index, 1);
   };
	$scope.addpanelmessage = function(type, msg, panel){
		//$scope.globals.messages.push({type: type, msg: msg, panel: panel});
		$rootScope.toaster = {type: type, title: panel,text: msg};
		$rootScope.pop();
	};
	$scope.updateuser = function() {
		if ($scope.profile.update || !$scope.forms.profileform.$valid) return;
		var obj = {
            id: $rootScope.targetMemberId ?
                $rootScope.targetMemberId : $rootScope.member.MemberId,
			token: token,
			saving: 'profile',
			Email: $scope.profile.copy.Email,
			Telephone: $scope.profile.copy.Telephone,
			Password: $scope.profile.copy.Password || ''
		};
		$scope.profile.update = true;
		$scope.globals.update = true;
		$scope.globals.messages = [];
		$http.post('/api/prorep/profilesave', obj)
		.then(function (response) {
			if (response.data.response.error) {
				angular.forEach(response.data.response.error, function(value,key){
					$scope.addMessage('danger',value);
				});
			} else if (response.data.response.update) {
				$scope.profile.data.Email = obj.Email;
				$scope.profile.data.Telephone = obj.Telephone;
				//$scope.profile.data.Password = obj.Password;
				$scope.addMessage('success', 'User data was updated.');
			}
			$scope.profile.update = false;
			$scope.globals.update = false;
		},
		function (x) {
			 //console.log(x);
		});
	};
	
	$scope.sidepanel = function(panelid) {
		$scope.globals.messages = [];
		if ($scope.panels[panelid].save) {
			//console.log('save ' + $scope.panels[panelid].name);
			if (!$scope.forms.panel.$valid) return;
			$scope.panels[panelid].update = true;
			var obj = {};
			angular.copy($scope.data[$scope.panels[panelid].name].copy, obj);
            obj.id = $rootScope.targetMemberId ?
                $rootScope.targetMemberId : $rootScope.member.MemberId;
			obj.token = token;
			obj.saving = $scope.panels[panelid].name;
			$http.post('/api/prorep/profilechildsave', obj)
			.then(function (response) {
				$scope.panels[panelid].update = false;
				if (response.data.response.error) {
					angular.forEach(response.data.response.error, function(value,key){
						$scope.addpanelmessage('error',value, $scope.panels[panelid].name);
					});
					$scope.globals.update = false;
				} else if (response.data.response.update) {
					angular.forEach($scope.panels[panelid].order, function(value,key){
						$scope.data[$scope.panels[panelid].name].data[value.name] = value.__set ? value.__set($scope.data[$scope.panels[panelid].name].copy[value.name]) : $scope.data[$scope.panels[panelid].name].copy[value.name];
					});
					$scope.addpanelmessage('success', 'User ' + $scope.panels[panelid].capt + ' was updated.', $scope.panels[panelid].name);
					$scope.panels[panelid].save = false;
					angular.forEach($scope.panels, function(value, key){
						value.show = true;
					});
				}
			},
			function (x) {
				 //console.log(x);
			});
		} else {
			//console.log('open ' + $scope.panels[panelid].name);
			angular.forEach($scope.panels[panelid].order, function(value,key){
				$scope.data[$scope.panels[panelid].name].copy[value.name] = value.__get ? value.__get() : $scope.data[$scope.panels[panelid].name].data[value.name];
			});
			$scope.panels[panelid].save = true;
			angular.forEach($scope.panels, function(value, key){
				if (key != panelid) value.show = false;
			});
		}
	};
	
	$scope.closepanel = function(panelid) {
		if ($scope.panels[panelid].save) {
			$scope.globals.messages = [];
			//console.log('close ' + $scope.panels[panelid].name);
			$scope.panels[panelid].save = false;
			angular.forEach($scope.panels, function(value, key){
				value.show = true;
			});
		}
	};
	
	$scope.resetedits = function() {
		$scope.profile.setProfileCopy();
		$scope.globals.Pagename = 'Profile';
		$scope.globals.showform = 'profile';
		$scope.globals.update = false;
		$scope.globals.messages = [];
		$state.go('app.proreps.prorepprofile');
	};
	
	/* Data init*/
    $http.post('/api/prorep/profile', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
		.then(function (response) {
			//console.log(response);
			if (response.status) {
				$scope.lists.Country = response.data.response.list;
				//$scope.lists.Country.push({ListId:10,List:"Country",Name:"CA",Value:"CA"});
				$scope.profile.data = response.data.response.member;
				$scope.profile.setProfileCopy();
				$scope.profile.id = $scope.profile.data.MemberId;
				$scope.data.Shipping.data = response.data.response.addresses.shipping;
				$scope.data.Billing.data = response.data.response.addresses.billing;
				$scope.data.Payment.data = response.data.response.payment;
				$scope.profile.update = false;
				$scope.globals.update = false;
			}
		});
	if (!$state.is('app.proreps.enrollees')) {
		$scope.resetedits();
	}


 }]);
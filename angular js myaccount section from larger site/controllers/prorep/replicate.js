'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepReplicate', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//console.log( "ProReps Replicated Website Controller");
	var token = $rootScope.member.token;
	
	$scope.globals = {
		update: true,
		message: {}
	};
	
	$scope.forms = {
		main: {}
	};

	$scope.item = {
		data: {},
		copy: {}
	};

	$scope.panels = {
		order: [
			{name: 'ReplicatedName', capt: 'Name', validation: {max:64}},
			{name: 'ReplicatedCompany', capt: 'Company', validation: {max:64}},
			{name: 'ReplicatedEmail', type: 'email', capt: 'E-mail', validation: {max:128}},
			{name: 'ReplicatedTelephone', capt: 'Telephone', digit: true, validation: {min:10,max:16}},
			{
                name: 'URL',
                valIfNull: 'LoginId',
                capt: 'Replicated URL',
                group: function () {return $scope.item.data.Country == 'CA' ? 'www.healthyhomecompany.ca/' : 'www.healthyhomecompany.com/'},
                disabled : true
            }
		],
		messages: []
	};
	
	$scope.errorMessage = function(err, obj) {
		if (typeof err !== 'object') return;
		var t = Object.keys(err)[0];
		//console.log(t);
		switch (t) {
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
	
	$scope.clearmainmessage = function(){
		$scope.globals.message = {};
	};
	
	$scope.updatereplicated = function()
	{
		if ($scope.globals.update) return;
		$scope.globals.update = true;
		$scope.clearmainmessage();
		
		var obj = {};
		angular.copy($scope.item.copy, obj);
        obj.id = $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId;
		obj.token = token;
		obj.saving = true;
		
		$http.post('/api/prorep/replicated', obj)
		.then(function (response) {
			console.log(response);
			if (response.data.status) {
				angular.copy($scope.item.copy, $scope.item.data);
				$scope.globals.message = {type: 'success', msg: 'Your replicated website settings have been updated.'};
			} else {
				$scope.globals.message = {type: 'danger', msg: response.data.error[0]};
			}
			$scope.globals.update = false;
		});
	};

    $http.post('/api/prorep/replicated', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
	.then(function (response) {
		console.log(response);
		if (response.data.status) {
			$scope.item.data = response.data.response.item;
			angular.copy($scope.item.data, $scope.item.copy);
			$scope.globals.update = false;
		}
	});

 }]);
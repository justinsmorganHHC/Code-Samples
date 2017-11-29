'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepCertificate', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//console.log( "ProReps Certificated Controller");
	var token = $rootScope.member.token;
	
	$scope.globals = {
		update: true,
		message: {},
		responce: false
	};
	
	$scope.clearmainmessage = function(){
		$scope.globals.message = {};
	};
	
	$scope.products = [
		[
			{name: 'Individual (Single user)', id: 2773, member: 39.99, retail: 49.99},
			{name: 'Couple (2 users)', id: 2779, member: 49.99, retail: 49.99}
		]
	];
	
	$scope.senditem = function(id) {
		//console.log('send item ' + id);
        $http.post('/api/prorep/certificate', {
            id: $rootScope.targetMemberId ?
                $rootScope.targetMemberId : $rootScope.member.MemberId, token: token, productid: id
        })
		.then(function (response) {
			//console.log(response);
			if (!response.data.status) {
				$scope.globals.message = {type: 'danger', msg: response.data.error};
			}
			if (response.data.redirect) {
				window.location.href = response.data.redirect;
			}
			$scope.globals.update = false;
			
		});
	};

    $http.post('/api/prorep/certificate', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
	.then(function (response) {
		//console.log(response);
		if (response.data.status) {
			$scope.globals.responce = response.data.result;
		} else {
			$scope.globals.message = {type: 'danger', msg: response.data.error};
		}
		$scope.globals.update = false;
	});

 }]);
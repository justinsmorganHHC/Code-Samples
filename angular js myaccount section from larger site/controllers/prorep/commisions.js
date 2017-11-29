'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepCommisions', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	console.log( "ProReps Commisions Controller");
	var token = $rootScope.member.token;


    $scope.globals = {
		update: true,
		message: {}
	};
	
	$scope.commissions = {
		
	};
	
	$http.post('/api/prorep/commissions', {id:$rootScope.targetMemberId ?
        $rootScope.targetMemberId : $rootScope.member.MemberId, token:token})
	.then(function (response) {
		//console.log(response);
		if (response.data.status) {
			$scope.commissions = response.data.result;

        }
		$scope.globals.update = false;
	});

 }]);
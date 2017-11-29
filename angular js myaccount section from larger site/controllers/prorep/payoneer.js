'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepPayoneer', ['$rootScope', '$scope', '$http', '$state', function ($rootScope, $scope, $http, $state) {
	//console.log( "ProReps Payoneer Controller");
	var token = $rootScope.member.token;
	
	$scope.globals = {
		payoneer: {
			id:1
		}
	};

    /* this code add +1 request to payoneer on state change */
	/*
	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		$scope.globals.payoneer = {id:1};
		if (toState.name === 'app.payoneer.complete') {
			$scope.globals.payoneer = {id:10, name: ''};
		} else {
			$http.post('/api/prorep/payoneer', {id: $rootScope.targetMemberId ?
                $rootScope.targetMemberId : $rootScope.member.MemberId, token:token})
				.then(function (response) {
					//console.log(response.data.status);
					if (response.data.status) {
						$scope.globals.payoneer = response.data.response;
					}
				});
		}
	});
	*/

	if ($state.is('app.proreps.payoneer.complete')) {
		$scope.globals.payoneer = {id:10, name: ''};
	} else {
        $http.post('/api/prorep/payoneer', {
            id: $rootScope.targetMemberId ?
                $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
        })
			.then(function (response) {
				//console.log(response.data.status);
				if (response.data.status) {
					$scope.globals.payoneer = response.data.response;
				} else {
					$scope.globals.payoneer = {id: 90, msg: response.data.error}
				}
			});
	}

 }]);

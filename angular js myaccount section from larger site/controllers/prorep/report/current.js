'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepReportCurrent', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//console.log( "ProReps Report Current Controller");
	var token = $rootScope.member.token;

	$scope.globals = {
		update: true,
		message: {},
		time: new Date()
	};
	
	$scope.items = {
		data: []
	};

    $http.post('/api/prorep/reports', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token, report: 'current'
    })
		.then(function (response) {
			//console.log(response);
			if (response.data.status) {
				$scope.items.data = response.data.response.item;
				$scope.globals.update = false;
			}
		});

 }]);
'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepAutoTrinary', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//console.log( "ProReps AutoTrinary Controller");
	var token = $rootScope.member.token;
	//$scope.accountsummary = {};
		 
	$scope.list = {
		UplinePlacement: {}
	};

	$scope.current = {
		UplinePlacement: ""
	};
	
	$scope.globals = {
		update: true,
		message: {}
	};

	$scope.printtype = function() {
		return typeof $scope.current.UplinePlacement;
	};
	
	$scope.clearmessage = function() {
		$scope.globals.message = {};
	};
	
	$scope.updatetrinary = function() {
		$scope.globals.update = true;
		$scope.clearmessage();
        $http.post('/api/prorep/autotrinary', {
            id: $rootScope.targetMemberId ?
                $rootScope.targetMemberId : $rootScope.member.MemberId,
            token: token,
            saving: true,
            upline: $scope.current.UplinePlacement.Value
        })
		.then(function (response) {
			//console.log(response);
			if (response.data.status) {
				if (response.data.response.success) {
					$scope.globals.message.type = 'success';
					$scope.globals.message.msg = 'Your automatic trinary tree placement settings have been updated.';
				} else {
					$scope.globals.message.type = 'danger';
					$scope.globals.message.msg = 'Your automatic trinary tree placement settings haven\'t been updated.';
				}
				$scope.globals.update = false;
			}
		});
	};

    $http.post('/api/prorep/autotrinary', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
		.then(function (response) {
			if (response.data.status) {
                $scope.list.UplinePlacement = response.data.response.list;
                $scope.current.UplinePlacement = $scope.list.UplinePlacement[0];
                angular.forEach($scope.list.UplinePlacement, function (val, ind) {
                    if (val.Value == response.data.response.data) {
                        $scope.current.UplinePlacement = $scope.list.UplinePlacement[ind];
                    }
                });
				$scope.globals.update = false;
			}
		});

 }]);
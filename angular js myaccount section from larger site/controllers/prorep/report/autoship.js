'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepReportAutoship', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//console.log( "ProReps Report Autoship Controller");
	var token = $rootScope.member.token;

	$scope.globals = {
		update: true,
		message: {},
		time: new Date()
	};
	
	$scope.items = {
		data: []
	};
	
		$scope.getTotal = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.items.data.length; i++){
	        var product = $scope.items.data[i];
	        total += product.Dollars * 10 / 10  ;
	    }
	    return total;
	}

	$scope.getTotalCV = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.items.data.length; i++){
	        var product = $scope.items.data[i];
	        total += product.CV * 10 / 10;
	    }
	    return total;
	}

    $http.post('/api/prorep/reports', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token, report: 'autoship'
    })
		.then(function (response) {
			//console.log(response);
			if (response.data.status) {
				$scope.items.data = response.data.response.item;
				$scope.globals.update = false;
			}
		});
		

 }]);

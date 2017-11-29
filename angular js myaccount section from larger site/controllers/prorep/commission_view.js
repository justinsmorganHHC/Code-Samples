'use strict';
console.log('asdf');
/* Controllers */
// prorep dashboard main page controller
app.controller('ProRepCommissionView', ['$rootScope', '$scope', '$http', '$state', '$filter', 'pageData', function ($rootScope, $scope, $http, $state, $filter, pageData) {
	//console.log( "ProReps Commisions Controller");
	var token = $rootScope.member.token;
	
	$scope.globals = {
		update: true,
		message: {},
		month: 'MM',
        year: 'XXXX',
		total: 0
	};

    /** this was taken from ugly hardcoded php files */
    $scope.commissions = {
        2014:{
            5:{noPV:true},
            6:{noPV:true},
            7:{noPV:true},
            8:{noPV:true},
            9:{noPV:true}
        }
    };

    $scope.totalCompanyTrinaryPool = {
        2014 : {
            5:'4,730.07',
            6:'4,619.33',
            7:'$4,346.34',
            8:'$3,564.24',
            9:''
        }
    };

	$scope.data = {
		commissions: {},
		url: false,
		member: {},
		ranks: {}
	};
	console.log(pageData);
    var response = pageData;
		if (response.data.status) {
			$scope.data.commissions = response.data.result.data;
			$scope.data.url = response.data.result.url;
			$scope.data.member = response.data.member;
			$scope.data.ranks = response.data.ranks;
            $scope.commission = response.data.commission;
            $scope.PV = response.data.PV;
            console.log($scope.data.commissions);
        }
            $scope.globals.update = false;


    $scope.back = function () {
        $state.go('app.proreps.commisions');
    }

 }]);
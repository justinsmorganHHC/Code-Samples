'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepReportVolume', ['$rootScope', '$scope', '$http', 'scrollService', '$filter', function ($rootScope, $scope, $http, scrollService, $filter) {
	//console.log( "ProReps Report Volume Controller");
	var token = $rootScope.member.token;
	var itemsLimit = 100;
	$scope.totalDisplayed = itemsLimit;
	$scope.reverse = true;

	scrollService.setToBottom(200);
	scrollService.onScroll(function () {
		$scope.$apply(function () {
			$scope.totalDisplayed += itemsLimit;
		});
	});

	$scope.sort = function (name, reverse) {
		$scope.items.data = $filter('orderBy')($scope.items.data, name, reverse);
		$scope.totalDisplayed = itemsLimit;
	};

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
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token, report: 'volume'
    })
		.then(function (response) {
			//console.log(response);
			if (response.data.status) {
				angular.forEach(response.data.response.item, function (item, key) {
					//console.log(item);
					item.PVLast = parseFloat(item.PVLast);
					item.PVThis = parseFloat(item.PVThis);
				});
				$scope.items.data = response.data.response.item;
				$scope.globals.update = false;
			}
		});
		

 }]);
'use strict';

/* Controllers */
app.controller('ProrepOrderHistory', ['$rootScope', '$scope', '$http', 'scrollService', function ($rootScope, $scope, $http, scrollService) {
	//console.log( "ProReps Order History Controller");
	var token = $rootScope.member.token;
	//$scope.accountsummary = {};
	
	$scope.globals = {
		update: true,
		message: {}
	};
	
	$scope.list = {
		type: {
			E: 'Entered',
			P: 'Processed',
			S: 'Shipped',
			C: 'Cancelled',
			H: 'Holding'
		}
	};

    $scope.setSort = function (sortName) {
    	debugger;
        if ($scope.orderBy == sortName) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.reverse = false;
            $scope.orderBy = sortName;
        }
    };
	
	$scope.items = {
		data: {}
	};

	$scope.toprint = function(id){
		//console.log('View order detail ' + id);
	};

    $http.post('/api/prorep/orderhistory', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
		.then(function (response) {
			console.log( 'check if working' );
			console.log(response);
			if (response.data.status) {
				angular.forEach(response.data.response.list, function (item) {
					item.Total = parseFloat(item.Total);
					item.TotalCV = parseFloat(item.TotalCV);
				});
				$scope.items.data = response.data.response.list;
				$scope.globals.update = false;
				$scope.orderBy = 'Date';
				$scope.reverse = true;
			}
		});

	var itemsLimit = 10;
	$scope.totalDisplayed = itemsLimit;
	scrollService.setToBottom(100);
	scrollService.onScroll(function () {
		$scope.$apply(function () {
			$scope.totalDisplayed += itemsLimit;
		});
	});

 }]);
'use strict';

app.controller('ProrepReferral', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//console.log( "ProReps Refferals Controller");
	var token = $rootScope.member.token;
	
	$scope.globals = {
		update: true,
		message: {}
	};

	$scope.item = {
		data: []
	};

	$scope.clearmainmessage = function(){
		$scope.globals.message = {};
	};
	
	$scope.totalPV = function(){
		var ttl = 0;
		angular.forEach($scope.item.data, function(value){
			ttl += value.PV || 0;
		});
		return ttl;
	};
	
	$scope.dodate = function(data){
		return new Date(data);
	};
	
	$http.post('/api/prorep/referrals', {id:2121/*$rootScope.member.MemberId*/, token:token})
	.then(function (response) {
		//console.log(response);
		if (response.data.status) {
			$scope.item.data = response.data.response.data;	
		}
		$scope.globals.update = false;
	});

 }]);
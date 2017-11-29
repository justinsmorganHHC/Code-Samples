'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepReportSelect', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
	//console.log( "ProReps Report Select Controller");
	var token = $rootScope.member.token;

	$scope.globals = {
		report: $state.current.name,
		message: {}
	};

	$scope.list = {
		report: [
			{name: '---------- Select Report ----------', val: 'app.proreps.prorepreports'},
			{name: 'Current Rank', val: 'app.proreps.prorepreports.currentrank'},
			{name: 'New Members/Pro Reps Per Week (Previous 8 Weeks)', val: 'app.proreps.prorepreports.members'},
			{name: 'Personal Volume (PEL)', val: 'app.proreps.prorepreports.volume'},
			{name: 'Smart-Ship Remaining (PEL)', val: 'app.proreps.prorepreports.autoship'}
		]
	};

	$scope.selectreport = function(){
		$state.go($scope.globals.report);
	};

}]);
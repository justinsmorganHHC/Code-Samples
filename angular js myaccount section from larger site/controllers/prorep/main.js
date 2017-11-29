(function() {
	'use strict';

	angular.module('app')

		.controller('ProrepMain', ['MemberHandler', '$rootScope', '$scope', '$http', 'resolvedData', function (MemberHandler, $rootScope, $scope, $http, resolvedData) {
			$scope.accountsummary = {};
			$scope.accountsummary.dailyCVchart = {};
			$scope.accountsummary.data = {};
			$scope.accountsummary.loaded = false;

			$scope.tooltipFormatter = function (sparkline, options, fields) {
				return $scope.accountsummary.dailyCVchartMonth[fields.offset] + '<br />' + fields.y + ' PV';
			};
			//debugger;
			$scope.accountsummary = resolvedData.data.response;

			var sum = 0;
			angular.forEach($scope.accountsummary.dailyCVchart, function (val, key) {
				sum += parseInt(val);
			});
			$scope.accountsummary.dailyCVchart.avr = parseInt(sum / $scope.accountsummary.dailyCVchart.length);
			$scope.accountsummary.dailyCVchart.min = Math.min.apply(Math, $scope.accountsummary.dailyCVchart);
			$scope.accountsummary.dailyCVchart.max = Math.max.apply(Math, $scope.accountsummary.dailyCVchart);

			$scope.accountsummary.loaded = true;

			/*
			$http.post('/api/prorep/accountsummary',
				{
					id: $rootScope.targetMemberId ? $rootScope.targetMemberId : $rootScope.member.MemberId,
					token: token
				}
			).then(function (response) {

				if (response.data.status) {
					$scope.accountsummary = response.data.response;


					var sum = 0;
					angular.forEach($scope.accountsummary.dailyCVchart, function(val, key) {
						sum += parseInt(val);
					});

					$scope.accountsummary.dailyCVchart.avr = parseInt(sum / $scope.accountsummary.dailyCVchart.length);
					$scope.accountsummary.dailyCVchart.min = Math.min.apply(Math, $scope.accountsummary.dailyCVchart);
					$scope.accountsummary.dailyCVchart.max = Math.max.apply(Math, $scope.accountsummary.dailyCVchart);

					$scope.accountsummary.loaded = true;

					//console.log('member: ');
					console.log($scope.accountsummary.PEL.percentage);

				}
			 });*/
		}])
	;

})();
'use strict';

app.controller('MemberMain', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
	//console.log( "Members Controller");
	var token = $rootScope.member.token;
	$scope.accountsummary = {};

    $http.post('/api/prorep/accountsummary', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
		.then(function (response) {
			//console.log(response);
			if (response.data.status) {
				$scope.accountsummary = response.data.response;
			}
		});

	$scope.memberId = function(data){
		return 500000 + parseInt(data);
	};

 }]);
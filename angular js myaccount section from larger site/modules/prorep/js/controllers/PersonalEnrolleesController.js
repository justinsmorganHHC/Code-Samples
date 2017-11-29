(function () {
    'use strict';

    angular.module('app.prorep.controllers')

        .controller('PersonalEnrolleesController', ['$rootScope', '$scope', '$state', '$http', function ($rootScope, $scope, $state, $http) {

            var token = $rootScope.member.token;
            $scope.domain = window.location.host;
            $scope.Members = {};
            $scope.Members.BackOfficeId = null;
            $scope.type = $state.is('app.proreps.enrollees') ? 'P' : 'T';

            $http.post('/api/prorep/accountsummary', {
                id: $rootScope.targetMemberId ? $rootScope.targetMemberId : $rootScope.member.MemberId,
                token: token
            }).then(function (response) {
                if (response.data.status) {
                    $scope.Members.BackOfficeId = response.data.response.member.BackOfficeId;
                    console.log($scope.Members.BackOfficeId);
                }
            });
        }])
    ;

})();
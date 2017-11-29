'use strict';

/* Controllers */
// accountsummary controller
app.controller('AccountsummaryController', [ 'MemberHandler','$rootScope', '$scope', '$http', '$state', function (MemberHandler, $rootScope, $scope, $http, $state) {
    //console.log( "Accountsummary Controller");
    $scope.accountsummary = ($scope.user,function () {
        /** Attempt to get Accountsummary report  the user. */
        MemberHandler.accountsummary();
    });

 }]);
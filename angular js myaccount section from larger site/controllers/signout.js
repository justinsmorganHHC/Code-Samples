'use strict';

/* Controllers */
app.controller('SignoutController', ['UserHandler', '$rootScope', '$scope', '$http', '$state', function (UserHandler, $rootScope, $scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.logout = function () {
        $scope.authError = null;
        /** Attempt to unauthenticate the user. */
        UserHandler.signout(function (resp) {
            //console.log(resp);
        });
    };
}])
;
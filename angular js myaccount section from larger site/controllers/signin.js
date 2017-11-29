'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['UserHandler', '$rootScope', '$scope', '$http', '$state', function (UserHandler, $rootScope, $scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function () {
        $scope.authError = null;
        UserHandler.signin($scope.user, function (resp) {
            if (resp.hasOwnProperty('authError')) {
                $scope.authError = resp.authError;
            }
        });
    };
}])
;
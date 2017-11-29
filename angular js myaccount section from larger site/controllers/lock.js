'use strict';

/* Controllers */
// lock controller
app.controller('LockController', ['UserHandler', '$rootScope', '$scope', '$http', '$state', function (UserHandler, $rootScope, $scope, $http, $state) {
    //console.log('lock controller initiated');
    $scope.lock = function () {
        UserHandler.lock(function (resp) {
            //console.log(resp);
        });
    };
}]);
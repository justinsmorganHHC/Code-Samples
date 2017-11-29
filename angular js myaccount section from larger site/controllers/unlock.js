'use strict';

/* Controllers */
// unlock controller
app.controller('UnlockController', ['UserHandler', '$rootScope', '$scope', 'unlockAttempts', '$state', function (UserHandler, $rootScope, $scope, unlockAttempts, $state) {
    //console.log('Unlock controller initaiated');

    /** watch attempts */
    $scope.$watch('attempts', function (newVal, oldVal, $scope) {
        if(newVal > 3) {
            UserHandler.signout(function (result) {
                //console.log(result);
            });
        }
    });

    $scope.attempts = unlockAttempts;

    $scope.unlock = function () {
        event.preventDefault();
        UserHandler.unlock($scope.password, function (result, x) {
            $scope.attempts= x.data.response.unlockAttempts;
        });
    };
}]);
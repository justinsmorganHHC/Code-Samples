'use strict';

// signup controller
app.controller('SignupFormController', ['UserHandler', '$scope', function (UserHandler, $scope) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
        UserHandler.signup($scope.user, function (resp) {
            if (resp.hasOwnProperty('authError')) {
                $scope.authError = resp.authError;
            }
      });
    };
  }])
 ;
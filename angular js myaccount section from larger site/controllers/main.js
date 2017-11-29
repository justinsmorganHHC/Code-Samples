angular.module('app').controller(
    'MainController', ['UserHandler', 'Helpers', '$scope', '$rootScope', '$http', '$state', function(UserHandler, Helpers, $scope, $rootScope, $http, $state) {
        //console.log('MainCtrl', $rootScope.member.Role);
        $scope.templateName = 'main';
        switch ($rootScope.member.Role) {

            //Admin Dashboard is disabled
            case 'Administrators':
                //console.log('redirecting to admin... or not');
                if ($rootScope.member.isProRep) {
                    $rootScope.member.showMenu = 'ProReps';
                    $state.go('app.proreps.main');
                }
                if ($rootScope.member.isMember) {
                    $rootScope.member.showMenu = 'Members';
                    $state.go('app.members.main');
                }
                UserHandler.saveToLocalStorage();
                // $state.go('app.admin.main');
                break;

            case "Members" :
                //console.log('redirecting to members');
                $state.go('app.members.main');
                break;
            case "ProReps" :
                //console.log('redirecting to proreps');
                $state.go('app.proreps.main');
                break;
            default :
                $state.go('access.403');
                break;

        }

    }]
);
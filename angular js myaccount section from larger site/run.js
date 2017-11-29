angular.module('app')
    .run(['Permission', 'UserHandler', '$idle', '$rootScope', '$state', '$stateParams', '$http', 'Helpers',
    function (Permission, UserHandler, $idle, $rootScope, $state, $stateParams, $http, Helpers) {
        //console.log('run section');
        // $rootScope.$state = $state;
        // $rootScope.$stateParams = $stateParams;

        /** Get Member from localStorage */
        var memberInformation = localStorage.getItem('memberInformation') != 'undefined' ? angular.fromJson(localStorage.getItem('memberInformation')) : false;
        if (memberInformation) {
            $rootScope.memberInformation = memberInformation;
            $rootScope.member = memberInformation.member;
            if (memberInformation.isLocked !== true) {
                //console.log('enabling idle watch');
                $idle.watch();
            }
            if ($rootScope.member.Role == undefined)
            {
                /** determinate user role **/
                /** means it came from auto login **/
                $rootScope.member.Role = Helpers.getMemberRole($rootScope.member);
                $rootScope.member.isMember = Helpers.isMember($rootScope.member);
                $rootScope.member.isProRep = Helpers.isProRep($rootScope.member);
                $rootScope.memberInformation.member = $rootScope.member;

                localStorage.setItem('memberInformation', angular.toJson($rootScope.memberInformation));
            }           
        }

        /** Setting up permissions */
        Permission.defineRole('anonymous', function (stateParams) {
            //console.log('Checking permission for anonymous');
            // If the returned value is *truthy* then the user has the role, otherwise they don't
            return !$rootScope.memberInformation
        });
        Permission.defineRole('Administrators', function (stateParams) {
            //console.log('Checking permission for Admin');
            return $rootScope.member.Role === 'Administrators';
        });
        Permission.defineRole('Prospects', function (stateParams) {
            //console.log('Checking permission for Prospect');
            return $rootScope.member.Role === 'Prospects';
        });
        Permission.defineRole('Members', function (stateParams) {
            //console.log('Checking permission for Member');
            return $rootScope.member.Role === 'Members';
        });
        Permission.defineRole('ProReps', function (stateParams) {
            //console.log('Checking permission for ProRep');
            return $rootScope.member.Role === 'ProReps';
        });
        Permission.defineRole('Distributors', function (stateParams) {
            //console.log('Checking permission for ProRep');
            return $rootScope.member.Role === 'Distributors';
        });
        Permission.defineRole('Individuals', function (stateParams) {
            //console.log('Checking permission for Individuals');
            return $rootScope.member.Role === 'Individuals';
        });

        /** ng-idle events handler */
        $rootScope.$on('$idleStart', function () {
            //console.log('idle start');
        });

        $rootScope.$on('$idleEnd', function () {
            //console.log('idle end');
        });
/*        
        $rootScope.$on('$idleTimeout', function () {
            //console.log('idle timeout');
            UserHandler.lock(function (err) {
                //console.log(err);
            });
        });
*/

        /** state change event handler */
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //console.log('state change started from ' + (fromState.name ? fromState.name : 'nowhere') + ' to ' + toState.name);
            /** try to find member info in php session */
            if (!(toState.name == 'access.signup' || toState.name == 'access.signin')) {
                UserHandler.validate();
            } else {
                //console.log("Member Information: ", $rootScope.memberInformation);
                /** Check is user is locked */
                if ($rootScope.hasOwnProperty('memberInformation') && $rootScope.memberInformation.hasOwnProperty('isLocked') && $rootScope.memberInformation.isLocked === true && toState.name !== 'lockme') {
                    //console.log('redirect');
                    //event.preventDefault();
                    $state.go('lockme');
                }
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //console.log('state changed from ' + (fromState.name ? fromState.name : 'nowhere') + ' to ' + toState.name);
        });

    }]
);

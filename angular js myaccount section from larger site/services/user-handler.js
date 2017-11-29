angular.module('app')
    .service('UserHandler', ['Helpers', '$q', '$idle', '$state', '$http', '$rootScope', 'ApiCall',
        function(Helpers, $q, $idle, $state, $http, $rootScope, ApiCall) {
            var UserHandler = this;
            var token = $rootScope.hasOwnProperty('member') ? $rootScope.member.token : false;
            this.lock = function (callback) {
                //console.log('lock method triggered');
                if ($rootScope.hasOwnProperty('memberInformation')) {
                    $rootScope.memberInformation.isLocked = true;
                    localStorage.setItem('memberInformation', angular.toJson($rootScope.memberInformation));
                }
                $http.post('/api/authenticate/lock', {token:token}).
                    then(
                    function (response) {
                        //console.log(response);
                        if (response.data.status) {
                            $state.go('lockme');
                        }
                    },
                    function (x) {
                        callback(false, x);
                    }
                );
            };
            this.unlock = function (password, callback) {
                //console.log('unlock method triggered');
                $http.post('/api/authenticate/unlock', {password: password, token:token}).then(
                    function (response) {
                        //console.log(response);
                        $rootScope.memberInformation.isLocked = false;
                        localStorage.setItem('memberInformation', angular.toJson($rootScope.memberInformation));
                        $idle.watch();
                        $state.go('app.main');
                    },
                    function (x) {
                        //console.log('failed', x);
                        callback(false, x);
                    }
                )
            };
            this.getUnlockAttempts = function () {
                return ApiCall.call({url:'/api/authenticate/getUnlockAttempts', params:{}})
                    .then(
                    function (resp) {
                        return resp.data.unlockAttempts;
                    },
                    function (x) {
                        return [false, x];
                    }
                )
            };
            /**
             * Attempt to authenticate the user.
             * redirects to dashboard if success
             * triggers the callback if error occurs
             */
            this.signin = function (user, callback) {
                /* Attempt to authenticate the user. */
                var resp = {};
                $http.post('/api/authenticate/member', {id: user.email, password: user.password})
                    .then(function (response) {
                        if (response.data.response.member.MemberId) {
                            $rootScope.memberInformation = response.data.response;
                            $rootScope.member = response.data.response.member;

                            /** determinate user role */

                            $rootScope.member.Role = Helpers.getMemberRole($rootScope.member);
                            $rootScope.member.isMember = Helpers.isMember($rootScope.member);
                            $rootScope.member.isProRep = Helpers.isProRep($rootScope.member);
                            $rootScope.memberInformation.member = $rootScope.member;

                            localStorage.setItem('memberInformation', angular.toJson($rootScope.memberInformation));

                            $idle.watch();
                            $state.go('app.main');
                        } else {
                            resp.authError = 'An unknown issue occured. Please try again.';
                            callback(resp);
                        }
                    }, function (x) {

                        if (x.status == '401') {
                            resp.authError = x.data.response.message;
                        } else {
                            resp.authError = 'An unknown issue occured. Please try again.';
                        }
                        callback(resp);
                    });
            };
            this.saveToLocalStorage = function () {
                $rootScope.memberInformation.member = $rootScope.member;
                localStorage.setItem('memberInformation', angular.toJson($rootScope.memberInformation));
            };
            this.signup = function (user, callback) {
                /** Try to create */
                var resp = {};
                $http.post('api/signup', {name: user.name, email: user.email, password: user.password})
                    .then(function (response) {
                        if (!response.data.user) {
                            resp.authError = response;
                            callback(resp);
                        } else {
                            $state.go('app.main');
                        }
                    }, function (x) {
                        resp.authError = 'Server Error';
                        callback(false, x);
                    });
            };
            this.signout = function (callback) {
                // this is when the signout process is being called
                // debugger;
                $http.post('/api/authenticate/signout', {token : token})
                    .then(function (response) {
                        //console.log('logout');
                        localStorage.setItem('memberInformation', false);
                        $rootScope.memberInformation = false;
                        $rootScope.member = false;
                        $idle.interrupt();
                        $idle.unwatch();
                        $state.go('access.signin');
                    }, function (x) {
                        callback ? callback(false, x) : 0;
                        //$state.go('access.signin');
                    });
            };
            this.validate = function () {
                /** Attempt to authenticate the user. */

                $http.post('/api/authenticate/validate', {token:token})
                    .then(function (response) {

                        if (response.data.response.sso) {
                            console.log('SSO Attempt');

                            $rootScope.memberInformation = response.data.response;
                            $rootScope.member = response.data.response.member;

                            /** determinate user role */

                            $rootScope.member.Role = Helpers.getMemberRole($rootScope.member);
                            $rootScope.member.isMember = Helpers.isMember($rootScope.member);
                            $rootScope.member.isProRep = Helpers.isProRep($rootScope.member);
                            $rootScope.memberInformation.member = $rootScope.member;

                            localStorage.setItem('memberInformation', angular.toJson($rootScope.memberInformation));
			                location.reload(true);
                            $idle.watch();
                            $state.go('app.main');

                        } else if (response.data.response.isAuthenticated) {
                            // debugger;
                            if ($rootScope.member.MemberId != response.data.response.member.MemberId) {
                                UserHandler.signout();
                                // debugger
                            }
                            if (response.data.response.isLocked == true) {
                                $state.go('lockme');
                            }
                        } else {
                            //console.log("User could not be authenticated.");
                            UserHandler.signout();
                            //$state.go('access.signin');
                        }
                    },
                    function (x) {
                        console.log(x);
                        /** No response. Push to sign in page. */
                        UserHandler.signout();
                        //$state.go('access.signin');
                    });
            }
        }]);

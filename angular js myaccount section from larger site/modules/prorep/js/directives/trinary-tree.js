(function() {
    'use strict';

    angular.module('app.prorep.directives', ['BasicPrimitives'])

        .directive('trinaryTree', ['$http', '$modal', '$log', '$state', '$rootScope', function ($http, $modal, $log, $state, $rootScope) {
            return {
                restrict: 'AEC',
                replace: false,
                template: '',
                link: function($scope, $elem, $attr) {

                    /** modal */
                    $scope.open = function (size, model, block, template) {
                        var modalInstance = $modal.open({
                            templateUrl: template ? template : 'tpl/administrators/modal_form.html',
                            controller: function ($scope) {
                                $scope.model = model;
                                $scope.title = '';
                                $scope.fields = {};
                                $scope.actions = {};
                            },
                            size: size
                        });
                        modalInstance.result.then(function(selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $scope.modalInstance = modalInstance;
                    };

                    $elem
                        .on('click', 'span[class~="tree-label"]', function(e) {
                            $scope.deferredBranch.getPromise().then(function(branch) {

                                $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                                    $rootScope.previousState = from.name;
                                    $rootScope.currentState = to.name;
                                    console.log('Previous state:' + $rootScope.previousState);
                                    console.log('Current state:' + $rootScope.currentState)
                                });
                                //$rootScope.statePrev = $state.current();
                                $state.go('app.proreps.view', {id: branch.data.MemberId});

                            });
                        })
                    ;
                }
            };
        }])

        .directive('trinaryTreeList', ['$http', '$modal', function ($http, $modal) {
            return {
                restrict: 'AEC',
                replace: false,
                template: '',
                link: function($scope, $elem, $attr) {

                    $scope.paginator = {
                        offset: 0,
                        length: 40,
                        filters: {
                            type: 'list',
                            date: $scope.data.list.enroll.value,
                            level: 0,
                            Rank: 0
                        }
                    };
                    var requestLock = false;
                    var prevScrollTop = undefined;
                    $scope.getData = function () {
                        $http.post('/api/prorep/personalenrollees', {
                            id: $scope.searchmember,
                            token: $scope.token,
                            type: $scope.cnf.type,
                            paginator: $scope.paginator
                        }).then(function (response) {
                            if (response.data.status) {
                                console.log(response);
                                $scope.fullRank = response.data.response.fullRanks;
                                $scope.data.list.data = response.data.response.data;
                                if (!$scope.data.list.typeRank)
                                    $scope.data.list.typeRank = $scope.fullRank[0];

                            }
                            $scope.member_load = false;
                        });
                    };
                    $scope.getData();

                    $scope.$watch(
                        function () {
                            return angular.toJson(
                                [$scope.data.list.enroll, $scope.data.list.level, $scope.data.list.typeRank]
                            )
                        },
                        function (newVal, oldVal) {
                            if (newVal == oldVal) {
                                return;
                            }
                            $scope.paginator.filters.date = $scope.data.list.enroll.value;
                            $scope.paginator.filters.level = $scope.data.list.level;
                            $scope.paginator.filters.Rank = $scope.data.list.typeRank.RankId ? $scope.data.list.typeRank.RankId : 0;
                            $scope.paginator.offset = 0;
                            $scope.paginator.length = 40;
                            $scope.data.list.data = [];
                            $scope.getData();
                        }
                    );

                    $(window).on('scroll', function(e) {
                        if ( ! $('[data-trinary-tree-list]').hasClass('active')) {
                            return;
                        }
                        if (prevScrollTop == undefined) {
                            prevScrollTop = $(this).scrollTop();
                        }
                        if (($(this).scrollTop() + $(this).height() + 800) > $('div[class~="app-content"]').height() &&
                            $(this).scrollTop() > prevScrollTop) {

                            if (requestLock) { return; }
                            requestLock = true;
                            $scope.paginator.offset = $scope.data.list.data.length;

                            $http.post('/api/prorep/personalenrollees', {
                                id: $scope.searchmember,
                                token: $scope.token,
                                type: $scope.cnf.type,
                                paginator: $scope.paginator
                            }).then(function(response) {
                                if (response.data.status) {
                                    angular.forEach(response.data.response.data, function(item) {
                                        $scope.data.list.data.push(item);
                                    });
                                }
                                $scope.member_load = false;
                                requestLock = false;
                            });
                        }
                        prevScrollTop = $(this).scrollTop();
                    });
                }
            };
        }])
    ;

})();
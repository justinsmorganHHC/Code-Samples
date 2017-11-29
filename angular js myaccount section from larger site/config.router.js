'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .config(
    ['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
                .otherwise('/main')
                .when('/app/admin/members', '/app/admin/members/index');
            $stateProvider

            /** APP STATE */
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: 'tpl/app.html',
                    controller: ['$rootScope', 'toaster', function($rootScope, toaster) {

                        $rootScope.toaster = {
                            type: 'success',
                            title: 'Title',
                            text: 'Message'
                        };

                        $rootScope.pop = function () {
                            toaster.pop($rootScope.toaster.type, $rootScope.toaster.title, $rootScope.toaster.text);
                        };

                    }],
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                // Required for base authentication functionality.
                                return $ocLazyLoad.load([
                                    'js/services/handlers.js',
                                    'js/controllers/signout.js',
                                    'js/controllers/lock.js',
                                    'js/controllers/unlock.js',
                                    'js/controllers/menu.js',
                                    'js/controllers/systemnote.js',
                                    'toaster'
                                ])
                            }]
                    }
                })
                .state('app.main', {
                    url: '^/main',
                    data: {
                        permissions: {
                            except: ['anonymous'],
                            redirectTo: 'access.signin'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                /** Required for base authentication functionality. */
                                return $ocLazyLoad.load([
                                    'js/controllers/main.js',
                                    'js/controllers/admin/main.js',
                                    'js/controllers/prorep/main.js',
                                    'js/controllers/members/main.js',
                                    'js/directives/contact_form.js'
                                ]);
                            }]
                    },
                    controller: 'MainController'
                })


            /** ADMIN STATES */
/*
                .state('app.admin', {
                    url: '^/admin',
                    template: '<div class="fade-in-up" ui-view></div>',
                    data: {
                        permissions: {
                            only: ['Administrators'],
                            redirectTo: 'access.403'
                        }
                    }
                })

                .state('app.admin.main', {
                    url: '^/main',
                    templateUrl: 'tpl/administrators/main.html',
                    controller: 'AdminMain',
                    resolve: {
                        PageData: ['ApiCall', function (ApiCall) {
                            return ApiCall.call({url: '/api/admin/main', params: {}})
                                .then(
                                function (resp) {
                                    return resp
                                },
                                function (x) {
                                    return x
                                }
                            )
                        }],
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                //Required for base authentication functionality.
                                return $ocLazyLoad.load(['js/controllers/admin/main.js']);
                            }]
                    }

                })
                .state('app.admin.alerts', {
                    url: '^/alerts',
                    template: '<div class="fade-in-up" ui-view><h1>Under Development</h1></div>'
                })
                .state('app.admin.members', {
                    //abstract:true,
                    url: '^/members',
                    template: '<div class="fade-in-up" ui-view></div>',
                    controller: ['$state', '$scope', function ($state, $scope) {
                        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                                if (toState.name === 'app.admin.members')
                                    $state.go('app.admin.members.index');
                            }
                        );
                    }],
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                //Required for base authentication functionality.
                                return $ocLazyLoad.load(['js/controllers/admin/members.js']);
                            }]
                    }
                })
                .state('app.admin.members.index', {
                    url: '/index',
                    templateUrl: 'tpl/administrators/members.html'
                })

                .state('app.admin.members.edit', {
                    url: '/edit/{id}',
                    templateUrl: 'tpl/administrators/member_form.html',
                    controller: 'MemberEditController',
                    resolve: {
                        PageData: ['ApiCall', '$stateParams', function (ApiCall, $stateParams) {
                            return ApiCall.call({url: '/api/admin/member_edit', params: {id: $stateParams.id}}).then(
                                function (resp) {
                                    return resp;
                                },
                                function (x) {
                                    return x;
                                }
                            );
                        }],
                        deps: ['$ocLazyLoad', '$scope',
                            function ($ocLazyLoad, $scope) {
                                return $ocLazyLoad.load(['ui.select', 'js/controllers/admin/member_edit.js'])
                            }]
                    }
                })
                .state('app.admin.orders', {
                    url:'^/orders',
                    template: '<div class="fade-in-up" ui-view></div>',
                    controller: function ($state, $scope) {
                        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                                if (toState.name === 'app.admin.orders')
                                    $state.go('app.admin.orders.index');
                            }
                        );
                    }
                })
                .state('app.admin.orders.index', {
                    url: '/index',
                    templateUrl: 'tpl/administrators/orders.html',
                    controller: 'AdminOrderController',
                    resolve: {
                        deps: [
                            '$ocLazyLoad',
                            function ($ocLazyLoad, $scope) {
                                return $ocLazyLoad.load(['js/controllers/admin/orders.js', 'js/directives/fancy-table.js'])
                            }
                        ]
                    }
                })
                .state('app.admin.orders.edit', {
                    url: '/edit/{id}',
                    templateUrl: 'tpl/administrators/order_form.html',
                    controller:'AdminOrderEditController',
                    resolve: {
                        PageData: function (ApiCall, $stateParams) {
                            return ApiCall.call({url: '/api/admin/order_edit', params: {id: $stateParams.id}}).then(
                                function (resp) {
                                    return resp;
                                },
                                function (x) {
                                    return x;
                                }
                            );
                        },
                        deps: [
                            '$ocLazyLoad', function($ocLazyLoad) {
                               return $ocLazyLoad.load(['ui.select', 'js/controllers/admin/order_edit.js', 'js/directives/panel-block.js', 'js/directives/panel-form.js'])
                            }
                        ]
                    }
                })
                .state('app.admin.products',{
                    url : '^/products',
                    template : '<div class="fade-in-up" ui-view=""></div>',
                    controller: function ($state, $scope) {
                        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                                if (toState.name === 'app.admin.products')
                                    $state.go('app.admin.products.index');
                            }
                        );

                    }
                })
                .state('app.admin.products.index', {
                    url : '/index',
                    //template: 'the index page',
                    templateUrl:'tpl/administrators/products.html',
						  controller: 'AdminProducts',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['js/controllers/admin/products.js']);
                            }]
                    }
                })
                .state('app.admin.products.edit', {
                    url : '/edit/{id}',
                    //template: 'this is edit product page',
                    templateUrl:'tpl/administrators/product_form.html',
						  controller: 'AdminProductEdit',
                    resolve: {
                        ProductData: function (ApiCall, $stateParams) {
                            return ApiCall.call({url: '/api/admin/productedit', params: {id: $stateParams.id}}).then(
                                function (resp) {
                                    return resp.data.product;
                                },
                                function (x) {
                                    return x;
                                }
                            );
                        },
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['js/controllers/admin/product_edit.js']);
                            }]
                    }
                })
                .state('app.admin.departments', {
                    url: '^/departments',
                    template: '<div class="fade-in-up" ui-view=""><h1>Under Development</h1></div>'
                })
                .state('app.admin.reports', {
                    url: '^/reports',
                    template: '<div class="fade-in-up" ui-view=""><h1>Under Development</h1></div>'
                })

*/
            /** REP STATES */

                .state('app.proreps', {
                    url: '^/proreps',
                    permissions: {
                        only: ['ProReps', 'Members', 'Administrators'],
                        redirectTo: 'access.403'
                    },
                    template: '<div class="fade-in-up" ui-view></div>'
                })
                .state('app.proreps.main', {
                    url: '^/main',
                    templateUrl: 'tpl/proreps/main.html',
                    controller: 'ProrepMain',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['js/controllers/prorep/main.js']);
                            }
                        ],
                        resolvedData: ['$rootScope', '$http', function ($rootScope, $http) {
                            return $http.post('/api/prorep/accountsummary',
                                {
                                    id: $rootScope.targetMemberId ? $rootScope.targetMemberId : $rootScope.member.MemberId
                                }
                            );
                        }]
                    }
                })
                .state('app.proreps.view', {
                    url: '^/member_view/:id',
                    templateUrl: 'tpl/members/view.html',
                    controller: 'MemberController',
                    resolve: {
                        resolveData: ['$http', '$stateParams', function ($http, $stateParams) {
                            return $http.post('/api/prorep/memberaccountsummary',
                                {
                                    memberId: $stateParams.id
                                }
                            );
                        }]
                    }
                })
                .state('app.proreps.autotrinary', {
                    url: '^/autotrinary',
                    templateUrl: 'tpl/proreps/autotrinary.html',
                    data: {
                        permissions: {
                            only: ['ProReps', 'Administrators'],
                            redirectTo: 'access.403'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/autotrinary.js');
                            }
                        ]
                    },
                    controller: 'ProrepAutoTrinary'
                })
                .state('app.proreps.order', {
                    url: '^/order',
                    templateUrl: 'tpl/proreps/freetemplate.html',

                    controller: ['$state', '$scope', function ($state, $scope) {
                        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                                if (toState.name === 'app.proreps.order')
                                    $state.go('app.proreps.order.history');
                            }
                        );
                    }]
                })
                .state('app.proreps.order.history', {
                    url: '/history',
                    templateUrl: 'tpl/proreps/order/history.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/order.js');
                            }
                        ]
                    },
                    controller: 'ProrepOrderHistory'
                })
                .state('app.proreps.order.view', {
                    url: '/view/{id}',
                    templateUrl: 'tpl/proreps/order/view.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/orderview.js');
                            }
                        ]
                    },
                    controller: 'ProrepOrderView'
                })
                .state('app.proreps.smartship', {
                    url: '^/smartship',
                    templateUrl: 'tpl/proreps/autoship.html',
                    controller: ['$state', '$scope', function ($state, $scope) {
                        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                                if (toState.name === 'app.proreps.smartship')
                                    $state.go('app.proreps.smartship.history');
                            }
                        );
                    }]
                })
                .state('app.proreps.smartship.history', {
                    url: '/history',
                    templateUrl: 'tpl/proreps/autoship/history.html',
                    controller: 'ProrepAutoshipHistory',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/autoshiphistory.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.smartship.new', {
                    url: '/add',
                    templateUrl: 'tpl/proreps/autoship/new.html',
                    controller: 'ProrepAutoshipEdit',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/autoshipedit.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.smartship.edit', {
                    url: '/edit/{id}',
                    templateUrl: 'tpl/proreps/autoship/new.html',
                    controller: 'ProrepAutoshipEdit',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/autoshipedit.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.payoneer', {
                    url: '^/payoneer',
                    templateUrl: 'tpl/proreps/payoneer.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/payoneer.js');
                            }
                        ]
                    },
                    controller: 'ProrepPayoneer'
                })
                .state('app.proreps.payoneer.complete', {
                    url: '/complete'
                })
                .state('app.proreps.reports', {
                    url: '^/prorepreports',
                    templateUrl: 'tpl/proreps/reports.html',
                    data: {
                        permissions: {
                            only: ['ProReps', 'Administrators'],
                            redirectTo: 'access.403'
                        }
                    },
                    controller: 'ProrepReportSelect',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/reports.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.reports.current_rank', {
                    url: '/currentrank',
                    templateUrl: 'tpl/proreps/report/current.html',
                    controller: 'ProrepReportCurrent',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/report/current.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.reports.members', {
                    url: '/members',
                    templateUrl: 'tpl/proreps/report/members.html',
                    controller: 'ProrepReportMembers',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/report/members.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.reports.volume', {
                    url: '/volume',
                    templateUrl: 'tpl/proreps/report/volume.html',
                    controller: 'ProrepReportVolume',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/report/volume.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.reports.autoship', {
                    url: '/autoship',
                    templateUrl: 'tpl/proreps/report/autoship.html',
                    controller: 'ProrepReportAutoship',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/report/autoship.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.commisions', {
                    url: '^/commissions',
                    templateUrl: 'tpl/proreps/commissions.html',
                    controller: 'ProrepCommisions',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/commisions.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.commissionView', {
                    url: '^/commissions/{commissionId}',
                    templateUrl: 'tpl/proreps/commission_view.html',
                    controller: 'ProRepCommissionView',
                    resolve: {
                        pageData : ['$rootScope', '$stateParams', 'ApiCall', function ($rootScope, $stateParams, ApiCall) {
                            return ApiCall.call(
                                {
                                    url:'/api/prorep/commissions',
                                    params : {
                                        id:$rootScope.targetMemberId ? $rootScope.targetMemberId : $rootScope.member.MemberId,
                                        commissionId:$stateParams.commissionId
                                    }
                                }
                            )
                        }],
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/commission_view.js');
                            }
                        ]
                    }
                })
                .state('app.proreps.replicated', {
                    url: '^/replicated',
                    templateUrl: 'tpl/proreps/replicate.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/replicate.js');
                            }
                        ]
                    },
                    controller: 'ProrepReplicate'
                })
                .state('app.proreps.certification', {
                    url: '^/certification',
                    templateUrl: 'tpl/proreps/certificate.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/certificate.js');
                            }
                        ]
                    },
                    controller: 'ProrepCertificate'
                })
                .state('app.proreps.prorepprofile', {
                    url: '^/profilepage',
                    templateUrl: 'tpl/administrators/member_form.html',
                    controller: 'MemberEditProRepController',
                    resolve: {
                        PageData: ['ApiCall', '$stateParams', '$rootScope', function (ApiCall, $stateParams, $rootScope) {
                            console.log('asdf');
                            return ApiCall.call({url: '/api/member/get', params: {MemberId: $stateParams.id ?
                                $stateParams.id : $rootScope.member.MemberId}})
                                .then(
                                function (resp) {
                                    return resp;
                                },
                                function (x) {
                                    return x;
                                });
                        }],
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'js/controllers/prorep/member_edit.js', 'js/directives/input-mask.js'])
                            }
                        ]
                    }
                })

                .state('app.proreps.prorepprofile.address', {
                    url: '/address',
                    data: {
                        permissions: {
                            only: ['ProReps', 'Administrators'],
                            redirectTo: 'access.403'
                        }
                    }
                })
                .state('app.proreps.prorepprofile.payment', {
                    url: '/payment',
                    data: {
                        permissions: {
                            only: ['ProReps', 'Administrators'],
                            redirectTo: 'access.403'
                        }
                    }
                })
                .state('app.proreps.prorepnotes', {
                    url: '^/notesarchive',
                    templateUrl: 'tpl/proreps/note.html',
                    data: {
                        permissions: {
                            only: ['ProReps', 'Members', 'Administrators'],
                            redirectTo: 'access.403'
                        }
                    },
                    controller: 'SystemNotes'
                })
                .state('app.proreps.referral', {
                    url: '^/referrals',
                    templateUrl: 'tpl/proreps/referrals.html',
                    data: {
                        permissions: {
                            only: ['Members', 'Administrators'],
                            redirectTo: 'access.403'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/prorep/referrals.js');
                            }
                        ]
                    },
                    controller: 'ProrepReferral'
                })
                .state('app.proreps.memberview', {
                    url: '^/member_view/{id}',
                    template: '<div class="fade-in-up" ui-view=""><h1>Under Development</h1></div>'
                })


            /** END OF PRO-REPS STATES */
				
				/** MEMBER */
				
                .state('app.members', {
                    url: '^/members',
                    template: '<div class="fade-in-up" ui-view></div>'
                })
                .state('app.members.main', {
                    url: '^/main',
                    templateUrl: 'tpl/members/main.html',
                    controller: 'MemberMain',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                /** Required for base authentication functionality. */
                                return $ocLazyLoad.load(['js/controllers/members/main.js']);
                            }]
                    }
                })
				
				/** END MEMBER */


                .state('app.dashboard', {
                    url: '/dashboard',
                    templateUrl: 'tpl/app_dashboard.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['js/controllers/chart.js']);
                            }]
                    }
                })
                .state('app.dashboard-v2', {
                    url: '/dashboard-v2',
                    templateUrl: 'tpl/app_dashboard_v2.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['js/controllers/chart.js']);
                            }]
                    }
                })
                .state('app.ui', {
                    url: '/ui',
                    template: '<div ui-view class="fade-in-up"></div>'
                })
                .state('app.ui.buttons', {
                    url: '/buttons',
                    templateUrl: 'tpl/ui_buttons.html'
                })
                .state('app.ui.icons', {
                    url: '/icons',
                    templateUrl: 'tpl/ui_icons.html'
                })
                .state('app.ui.grid', {
                    url: '/grid',
                    templateUrl: 'tpl/ui_grid.html'
                })
                .state('app.ui.widgets', {
                    url: '/widgets',
                    templateUrl: 'tpl/ui_widgets.html'
                })
                .state('app.ui.bootstrap', {
                    url: '/bootstrap',
                    templateUrl: 'tpl/ui_bootstrap.html'
                })
                .state('app.ui.sortable', {
                    url: '/sortable',
                    templateUrl: 'tpl/ui_sortable.html'
                })
                .state('app.ui.portlet', {
                    url: '/portlet',
                    templateUrl: 'tpl/ui_portlet.html'
                })
                .state('app.ui.timeline', {
                    url: '/timeline',
                    templateUrl: 'tpl/ui_timeline.html'
                })
                .state('app.ui.tree', {
                    url: '/tree',
                    templateUrl: 'tpl/ui_tree.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/tree.js');
                                    }
                                );
                            }
                        ]
                    }
                })
                .state('app.ui.toaster', {
                    url: '/toaster',
                    templateUrl: 'tpl/ui_toaster.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('toaster').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/toaster.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.ui.jvectormap', {
                    url: '/jvectormap',
                    templateUrl: 'tpl/ui_jvectormap.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('js/controllers/vectormap.js');
                            }]
                    }
                })
                .state('app.ui.googlemap', {
                    url: '/googlemap',
                    templateUrl: 'tpl/ui_googlemap.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load([
                                    'js/app/map/load-google-maps.js',
                                    'js/app/map/ui-map.js',
                                    'js/app/map/map.js']).then(
                                    function () {
                                        return loadGoogleMaps();
                                    }
                                );
                            }]
                    }
                })
                .state('app.chart', {
                    url: '/chart',
                    templateUrl: 'tpl/ui_chart.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load('js/controllers/chart.js');
                            }]
                    }
                })
                // table
                .state('app.table', {
                    url: '/table',
                    template: '<div ui-view></div>'
                })
                .state('app.table.static', {
                    url: '/static',
                    templateUrl: 'tpl/table_static.html'
                })
                .state('app.table.datatable', {
                    url: '/datatable',
                    templateUrl: 'tpl/table_datatable.html'
                })
                .state('app.table.footable', {
                    url: '/footable',
                    templateUrl: 'tpl/table_footable.html'
                })
                .state('app.table.grid', {
                    url: '/grid',
                    templateUrl: 'tpl/table_grid.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/grid.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.table.uigrid', {
                    url: '/uigrid',
                    templateUrl: 'tpl/table_uigrid.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.grid').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/uigrid.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.table.editable', {
                    url: '/editable',
                    templateUrl: 'tpl/table_editable.html',
                    controller: 'XeditableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('xeditable').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/xeditable.js');
                                    }
                                );
                            }]
                    }
                })
                // form
                .state('app.form', {
                    url: '/form',
                    template: '<div ui-view class="fade-in"></div>',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load('js/controllers/form.js');
                            }]
                    }
                })
                .state('app.form.elements', {
                    url: '/elements',
                    templateUrl: 'tpl/form_elements.html'
                })
                .state('app.form.validation', {
                    url: '/validation',
                    templateUrl: 'tpl/form_validation.html'
                })
                .state('app.form.wizard', {
                    url: '/wizard',
                    templateUrl: 'tpl/form_wizard.html'
                })
                .state('app.form.fileupload', {
                    url: '/fileupload',
                    templateUrl: 'tpl/form_fileupload.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('angularFileUpload').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/file-upload.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.form.imagecrop', {
                    url: '/imagecrop',
                    templateUrl: 'tpl/form_imagecrop.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ngImgCrop').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/imgcrop.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.form.select', {
                    url: '/select',
                    templateUrl: 'tpl/form_select.html',
                    controller: 'SelectCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/select.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.form.slider', {
                    url: '/slider',
                    templateUrl: 'tpl/form_slider.html',
                    controller: 'SliderCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('vr.directives.slider').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/slider.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.form.editor', {
                    url: '/editor',
                    templateUrl: 'tpl/form_editor.html',
                    controller: 'EditorCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('textAngular').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/editor.js');
                                    }
                                );
                            }]
                    }
                })
                .state('app.form.xeditable', {
                    url: '/xeditable',
                    templateUrl: 'tpl/form_xeditable.html',
                    controller: 'XeditableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('xeditable').then(
                                    function () {
                                        return $ocLazyLoad.load('js/controllers/xeditable.js');
                                    }
                                );
                            }]
                    }
                })
                // pages
                .state('app.page', {
                    url: '/page',
                    template: '<div ui-view class="fade-in-down"></div>'
                })
                .state('app.page.profile', {
                    url: '/profile',
                    templateUrl: 'tpl/page_profile.html'
                })
                .state('app.page.post', {
                    url: '/post',
                    templateUrl: 'tpl/page_post.html'
                })
                .state('app.page.search', {
                    url: '/search',
                    templateUrl: 'tpl/page_search.html'
                })
                .state('app.page.invoice', {
                    url: '/invoice',
                    templateUrl: 'tpl/page_invoice.html'
                })
                .state('app.page.accountsummary', {
                    url: '/accountsummary',
                    templateUrl: 'tpl/page_accountsummary.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/accountsummary.js']);
                            }]
                    }
                })
                .state('app.page.price', {
                    url: '/price',
                    templateUrl: 'tpl/page_price.html'
                })
                .state('app.docs', {
                    url: '/docs',
                    templateUrl: 'tpl/docs.html'
                })
                // others
                .state('lockme', {
                    url: '/lockme',
                    templateUrl: 'tpl/page_lockme.html',
                    controller:'UnlockController',
                    resolve: {
                        unlockAttempts: ['UserHandler', function (UserHandler) {
                            return UserHandler.getUnlockAttempts();
                        }],
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/unlock.js']);
                            }]
                    }
                })
                .state('access', {
                    url: '/access',
                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                })
                .state('access.signin', {
                    url: '/signin',
                    templateUrl: 'tpl/page_signin.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/signin.js']);
                            }]
                    }
                })
                .state('access.signup', {
                    url: '/signup',
                    templateUrl: 'tpl/page_signup.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/signup.js']);
                            }]
                    }
                })
                .state('access.forgotpwd', {
                    url: '/forgotpwd',
                    templateUrl: 'tpl/page_forgotpwd.html'
                })
                .state('access.403', {
                    url: '/403',
                    templateUrl: 'tpl/page_404.html',
                    controller: ['$scope', function ($scope) {
                        //console.log('403 controller');
                        $scope.errorCode = '403';
                    }]
                })
                .state('access.404', {
                    url: '/404',
                    templateUrl: 'tpl/page_404.html'
                })

                // fullCalendar
                .state('app.calendar', {
                    url: '^/calendar',
                    templateUrl: 'tpl/app_calendar.html',
                    // use resolve to load other dependences
                    resolve: {
                        deps: ['$ocLazyLoad', 'uiLoad',
                            function ($ocLazyLoad, uiLoad) {
                                return uiLoad.load(
                                    ['vendor/jquery/fullcalendar/fullcalendar.css',
                                        'vendor/jquery/fullcalendar/theme.css',
                                        'vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                                        'vendor/libs/moment.min.js',
                                        'vendor/jquery/fullcalendar/fullcalendar.min.js',
                                        'js/app/calendar/calendar.js']
                                ).then(
                                    function () {
                                        return $ocLazyLoad.load('ui.calendar');
                                    }
                                )
                            }]
                    }
                })

                // mail
                .state('app.mail', {
                    abstract: true,
                    url: '/mail',
                    templateUrl: 'tpl/mail.html',
                    // use resolve to load other dependences
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/app/mail/mail.js',
                                    'js/app/mail/mail-service.js',
                                    'vendor/libs/moment.min.js']);
                            }]
                    }
                })
                .state('app.mail.list', {
                    url: '/inbox/{fold}',
                    templateUrl: 'tpl/mail.list.html'
                })
                .state('app.mail.detail', {
                    url: '/{mailId:[0-9]{1,4}}',
                    templateUrl: 'tpl/mail.detail.html'
                })
                .state('app.mail.compose', {
                    url: '/compose',
                    templateUrl: 'tpl/mail.new.html'
                })

                .state('layout', {
                    abstract: true,
                    url: '/layout',
                    templateUrl: 'tpl/layout.html'
                })
                .state('layout.fullwidth', {
                    url: '/fullwidth',
                    views: {
                        '': {
                            templateUrl: 'tpl/layout_fullwidth.html'
                        },
                        'footer': {
                            templateUrl: 'tpl/layout_footer_fullwidth.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/vectormap.js']);
                            }]
                    }
                })
                .state('layout.mobile', {
                    url: '/mobile',
                    views: {
                        '': {
                            templateUrl: 'tpl/layout_mobile.html'
                        },
                        'footer': {
                            templateUrl: 'tpl/layout_footer_mobile.html'
                        }
                    }
                })
                .state('layout.app', {
                    url: '/app',
                    views: {
                        '': {
                            templateUrl: 'tpl/layout_app.html'
                        },
                        'footer': {
                            templateUrl: 'tpl/layout_footer_fullwidth.html'
                        }
                    },
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/controllers/tab.js']);
                            }]
                    }
                })
                .state('apps', {
                    abstract: true,
                    url: '/apps',
                    templateUrl: 'tpl/layout.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                /* Required for base authentication functionality. */
                                return $ocLazyLoad.load([
                                    'js/controllers/signout.js',
                                    'js/controllers/lock.js',
                                    'js/controllers/unlock.js',
                                    'js/controllers/menu.js',
                                    'js/controllers/systemnote.js'
                                ]);
                            }]
                    }
                })
                .state('apps.note', {
                    url: '/note',
                    templateUrl: 'tpl/apps_note.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/app/note/note.js',
                                    'vendor/libs/moment.min.js']);
                            }]
                    }
                })
                .state('apps.contact', {
                    url: '/contact',
                    templateUrl: 'tpl/apps_contact.html',
                    resolve: {
                        deps: ['uiLoad',
                            function (uiLoad) {
                                return uiLoad.load(['js/app/contact/contact.js']);
                            }]
                    }
                })
                .state('app.weather', {
                    url: '/weather',
                    templateUrl: 'tpl/apps_weather.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(
                                    {
                                        name: 'angular-skycons',
                                        files: ['js/app/weather/skycons. js',
                                            'vendor/libs/moment.min.js',
                                            'js/app/weather/angular-skycons.js',
                                            'js/app/weather/ctrl.js']
                                    }
                                );
                            }]
                    }
                })
                .state('music', {
                    url: '/music',
                    templateUrl: 'tpl/music.html',
                    controller: 'MusicCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'com.2fdevs.videogular',
                                    'com.2fdevs.videogular.plugins.controls',
                                    'com.2fdevs.videogular.plugins.overlayplay',
                                    'com.2fdevs.videogular.plugins.poster',
                                    'com.2fdevs.videogular.plugins.buffering',
                                    'js/app/music/ctrl.js',
                                    'js/app/music/theme.css'
                                ]);
                            }]
                    }
                })
                .state('music.home', {
                    url: '/home',
                    templateUrl: 'tpl/music.home.html'
                })
                .state('music.genres', {
                    url: '/genres',
                    templateUrl: 'tpl/music.genres.html'
                })
                .state('music.detail', {
                    url: '/detail',
                    templateUrl: 'tpl/music.detail.html'
                })
                .state('music.mtv', {
                    url: '/mtv',
                    templateUrl: 'tpl/music.mtv.html'
                })
                .state('music.mtvdetail', {
                    url: '/mtvdetail',
                    templateUrl: 'tpl/music.mtv.detail.html'
                })
                .state('music.playlist', {
                    url: '/playlist/{fold}',
                    templateUrl: 'tpl/music.playlist.html'
                })
        }
    ]
);
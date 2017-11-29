angular.module('app').controller(
    'MenuController', ['$scope', '$rootScope', '$injector', function ($scope, $rootScope, $injector) {
        //console.log('menuctrl');
        var $state = $injector.get('$state');

        $scope.menuItemsList = {
            Administrators: [
                {
                    name: 'Home',
                    sref: 'app.admin.main',
                    translate: 'aside.nav.HOME',
                    type: 'simple',
                    iconClass: "fa fa-home text-primary-dker"
                },
                {
                    name: 'Alerts',
                    type: 'simple',
                    sref: 'app.admin.alerts',
                    translate: 'aside.nav.ALERTS',
                    iconClass: "fa fa-exclamation-triangle text-primary-dker"
                },
                {
                    name: 'Members',
                    type: 'simple',
                    sref: 'app.admin.members',
                    active: 'app.admin.members.index',
                    translate: 'aside.nav.MEMBERS',
                    iconClass: "fa fa-users text-primary-dker"
                },
                {
                    name: 'Events',
                    type: 'simple',
                    sref: 'app.calendar',
                    translate: 'aside.nav.EVENTS',
                    iconClass: "fa fa-calendar text-primary-dker"
                },
                {
                    name: 'Orders',
                    type: 'simple',
                    sref: 'app.admin.orders',
                    translate: 'aside.nav.ORDERS',
                    iconClass: "fa fa-shopping-cart text-primary-dker"
                },
                {
                    name: 'Products',
                    type: 'simple',
                    sref: 'app.admin.products',
                    translate: 'aside.nav.PRODUCTS',
                    iconClass: "fa fa-cube text-primary-dker"
                },
                {
                    name: 'Departments',
                    type: 'simple',
                    sref: 'app.admin.departments',
                    translate: 'aside.nav.DEPARTMENTS',
                    iconClass: 'fa fa-cubes text-primary-dker'
                },
                {
                    name: 'Reports',
                    type: 'simple',
                    sref: 'app.admin.reports',
                    translate: 'aside.nav.REPORTS',
                    iconClass: 'fa fa-file-text'
                }
            ],
            ProReps: [
                {
                    name: 'Account Summary',
                    type: 'simple',
                    sref: 'app.proreps.main',
                    translate: 'aside.nav.SUMMARY',
                    iconClass: "fa fa-home text-primary-dker"
                },

                {
                    name: 'Personal_Enrollees',
                    type: 'simple',
                    sref: 'app.proreps.enrollees',
                    translate: 'aside.nav.ENROLLEES',
                    iconClass: "fa fa-group text-color-orange"
                },
                {
                    name: 'Trinary_Tree',
                    type: 'simple',
                    sref: 'app.proreps.trinary',
                    translate: 'aside.nav.TRINARY',
                    iconClass: "fa fa-sitemap text-color-greenyellow"
                },
                {
                    name: 'Auto_Trinary_Placement',
                    type: 'simple',
                    sref: 'app.proreps.autotrinary',
                    translate: 'aside.nav.AUTOTRINARY',
                    iconClass: "fa fa-random text-color-papayawhip"
                },
                {
                    name: 'Enroll_a_Member/REP',
                    type: 'simple',
                    sref: 'app.proreps.enroll',
                    translate: 'aside.nav.ENROLLMENT',
                    iconClass: "fa fa-link text-color-salmon"
                },
                {
                    name: 'Order_History',
                    type: 'simple',
                    sref: 'app.proreps.order.history',
                    translate: 'aside.nav.ORDERHISTORY',
                    iconClass: "fa fa-align-justify"
                },
                {
                    name: 'Smart-Ship',
                    type: 'simple',
                    sref: 'app.proreps.smartship.history',
                    translate: 'aside.nav.SMARTSHIP',
                    iconClass: "fa fa-truck text-danger-dker"
                },
                {
                    name: 'Payoneer',
                    type: 'simple',
                    sref: 'app.proreps.payoneer',
                    translate: 'aside.nav.PAYONEER',
                    iconClass: "fa fa-credit-card text-success-dker"
                },
                {
                    name: 'Reports',
                    type: 'downline',
                    sref: 'app.proreps.reports',
                    translate: 'aside.nav.REPORTS',
                    iconClass: "fa fa-file-text text-primary-dker",

                    child:[
                        {
                            name: 'Current_Rank',
                            type: 'simple',
                            sref: 'app.proreps.reports.current_rank',
                            translate: 'aside.nav.CURRENT_RANK',
                            iconClass: "fa fa-file-text text-primary-dker"
                        },
                        {
                            name: 'New_Members',
                            type: 'simple',
                            sref: 'app.proreps.reports.members',
                            translate: 'aside.nav.NEW_MEMBERS',
                            iconClass: "fa fa-file-text text-primary-dker"
                        },
                        {
                            name: 'Personal_Volume',
                            type: 'simple',
                            sref: 'app.proreps.reports.volume',
                            translate: 'aside.nav.PERSONAL_VOLUME',
                            iconClass: "fa fa-file-text text-primary-dker"
                        },
                        {
                            name: 'Smart-Ship_Remaining',
                            type: 'simple',
                            sref: 'app.proreps.reports.autoship',
                            translate: 'aside.nav.SMARTSHIP_REMAINING',
                            iconClass: "fa fa-file-text text-primary-dker"
                        },
                    ]
                },
                /*
                {
                    name: 'Commissions',
                    type: 'simple',
                    sref: 'app.proreps.commisions',
                    translate: 'aside.nav.COMMISIONS',
                    iconClass: "fa fa-terminal text-info-dker"
                },
                */
                {
                    name: 'Replicated_Website',
                    type: 'simple',
                    sref: 'app.proreps.replicated',
                    translate: 'aside.nav.REPLICATED',
                    iconClass: "fa fa-copy text-warning-dker"
                },
                {
                    name: 'Certification',
                    type: 'simple',
                    sref: 'app.proreps.certification',
                    translate: 'aside.nav.CERTIFICATION',
                    iconClass: "fa fa-certificate text-info-dker"
                },
                {
                    name: 'Profile',
                    type: 'simple',
                    sref: 'app.proreps.prorepprofile',
                    translate: 'aside.nav.PROFILE',
                    iconClass: "fa fa-user text-success-dker"
                },
                {
                    name: 'Notifications',
                    type: 'simple',
                    sref: 'app.proreps.prorepnotes',
                    translate: 'aside.nav.NOTES',
                    iconClass: "fa fa-list-alt"
                }
            ],
            Members: [
                {
                    name: 'Account Summary',
                    type: 'simple',
                    sref: 'app.members.main',
                    translate: 'aside.nav.SUMMARY',
                    iconClass: "fa fa-home text-primary-dker"
                },
                {
                    name: 'Referrals',
                    type: 'simple',
                    sref: 'app.proreps.referral',
                    translate: 'aside.nav.REFERRAL',
                    iconClass: "fa fa-align-justify"
                },
                {
                    name: 'Enroll_a_Member/REP',
                    type: 'simple',
                    sref: 'app.proreps.enroll',
                    translate: 'aside.nav.ENROLLMENT',
                    iconClass: "fa fa-link text-color-salmon"
                },
                {
                    name: 'Order_History',
                    type: 'simple',
                    sref: 'app.proreps.order.history',
                    translate: 'aside.nav.ORDERHISTORY',
                    iconClass: "fa fa-align-justify"
                },
                {
                    name: 'Smart-Ship',
                    type: 'simple',
                    sref: 'app.proreps.smartship.history',
                    translate: 'aside.nav.SMARTSHIP',
                    iconClass: "fa fa-truck text-danger-dker"
                },
                {
                    name: 'Payoneer',
                    type: 'simple',
                    sref: 'app.proreps.payoneer',
                    translate: 'aside.nav.PAYONEER',
                    iconClass: "fa fa-credit-card text-success-dker"
                },
                {
                    name: 'Replicated_Website',
                    type: 'simple',
                    sref: 'app.proreps.replicated',
                    translate: 'aside.nav.REPLICATED',
                    iconClass: "fa fa-copy text-warning-dker"
                },
                {
                    name: 'Certification',
                    type: 'simple',
                    sref: 'app.proreps.certification',
                    translate: 'aside.nav.CERTIFICATION',
                    iconClass: "fa fa-certificate text-info-dker"
                },
                {
                    name: 'Profile',
                    type: 'simple',
                    sref: 'app.proreps.prorepprofile',
                    translate: 'aside.nav.PROFILE',
                    iconClass: "fa fa-user text-success-dker"
                },
                {
                    name: 'Notifications',
                    type: 'simple',
                    sref: 'app.proreps.prorepnotes',
                    translate: 'aside.nav.NOTES',
                    iconClass: "fa fa-list-alt"
                }
            ]
        };

        $scope.getLiClass = function (item) {
            if ($state.is(item.sref)) {
                return 'active';
            }
        };

        $scope.menuItems = $rootScope.member.hasOwnProperty('showMenu') ? $scope.menuItemsList[$rootScope.member.showMenu] :  $scope.menuItemsList[$rootScope.member.Role];
        $rootScope.showMenu = function (role) {
            if ($scope.menuItemsList[role]) {
                $scope.menuItems = $scope.menuItemsList[role];
            } else return false;
        }
    }]
);



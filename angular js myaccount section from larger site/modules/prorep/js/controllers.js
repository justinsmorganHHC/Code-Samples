(function() {
    'use strict';

    angular.module('app.prorep.controllers', [])

        .controller('PersonalController', ['$rootScope', '$scope', '$state',  '$http', '$filter', '$q', '$timeout',
            function($rootScope, $scope, $state, $http, $filter, $q, $timeout) {


            $scope.token = $rootScope.member.token;
            $scope.enrolles = {};
            $scope.output = '';
            $scope.tree_control = {};
            $scope.searchmember = $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId; //3558 - small test, 2568 - big data test
            $scope.member_load = false;
            $scope.cnf = {
                field: 'GV',
                type: $state.is('app.proreps.enrollees') ? 'P' : 'T',
                hold: []
            };

            $scope.datefilter = [
                {name:'All',value:0},
                {name:'Past 24 Hours',value:1*24*60*60*1000},
                {name:'Past Week',value:7*24*60*60*1000},
                {name:'Past 14 Days',value:14*24*60*60*1000},
                {name:'Past 21 Days',value:21*24*60*60*1000},
                {name:'Past 28 Days',value:28*24*60*60*1000},
                {name:'Past 60 Days',value:60*24*60*60*1000},
                {name:'Past 90 Days',value:90*24*60*60*1000}
            ];

            $scope.lists = {
                rank: []
            };

            $scope.data = {
                tree: [],
                list: {
                    data: [],
                    level: 1,
                    enroll: $scope.datefilter[0],
                    total: 0,
                    filters: {},
                },
                chart: {
                    data:'',
                    update:false,
                    member:$scope.searchmember
                },
                count: 0
            };

            $scope.now = new Date().getTime();

            $scope.loadTree = function() {
                //console.log('loadTree');
                $scope.member_load = true;
                $scope.tree = [];
                $scope.output = '';
                $scope.data.list.data = [];

                /** List filters */
                $scope.data.list.enroll = $scope.datefilter[0];
                $scope.data.list.level = 0;
                $scope.data.list.rank = null;


                $scope.data.chart.data = '';
                $scope.cnf.hold = [];

                $http.post('/api/prorep/personalenrollees', {
                    id: $scope.searchmember,
                    token: $scope.token,
                    type: $scope.cnf.type
                }).then(function (response) {
                        //console.log(response);
                        if (response.data.status) {
                            //$scope.tree = response.data.response.data;
                            $scope.count = response.data.response.count;
                            $scope.now = response.data.response.now;
                            $scope.cnf.field = response.data.response.field;
                            $scope.cnf.type = response.data.response.type;
                            $scope.cnf.hold = response.data.response.holding || [];
                            $scope.lists.rank = response.data.response.ranks;
                            //$scope.findmember($scope.searchmember);
                            //$scope.IterateMembers();
                            $scope.chartItems = response.data.response.data;


                            var t  = $scope.parseData(response.data.response.data);
                            $scope.data.tree = t.tree;
                            //$scope.data.list.data = t.list.data;
                            $scope.data.list.data = [];
                            //$scope.data.list.total = t.list.total;
                            $scope.data.chart.data = response.data.response.data;
                            //$scope.findmember($scope.searchmember);
                            $scope.data.count = response.data.response.dataCount;
                        }
                        $scope.member_load = false;
                    });
            };

            $scope.loadTree();

            $scope.rank = function(data){
                data = parseInt(data);
                return data ? data : 10;
            };

            $scope.parseData = function(data) {
                var field = {
                    FirstName: '',
                    LastName: '',
                    LoginId: '',
                    MemberId: parseInt,
                    SubType: '',
                    Email: '',
                    Telephone: '',
                    NextDate: '',
                    Rank: $scope.rank,
                    'Smart-Ship': '',
                    GV: parseFloat,
                    PV: parseFloat,
                    TV: parseFloat
                };
                var that = this;
                var list = [], chart = '', count = 0, total = 0;
                this.child = function(child, level) {
                    level = level || 0;
                    var d = {};
                    angular.forEach(field, function(value, key){
                        d[key] = value ? value(child[key]) : child[key];
                    });
                    count++;
                    total += d.PV;
                    d.level = level;
                    chart += '<li>';
                    chart += '<div class="TreeDiv">' +
                                '<b>'+d.FirstName+' '+d.LastName+'</b>' +
                                '<br />'+(500000+d.MemberId)+
                                '<br />'+$filter('currency')(d.PV)+'/'+$filter('currency')(d[$scope.cnf.field])+
                                '<p><span>'+(d.PV >= 200 ? '<i class="fa fa-money text-success"></i>' : '')+(d['Smart-Ship'] ? '<i class="fa fa-truck text-warning"></i>' : '')+'</span><a class="'+d.MemberId+'">Downline</a></p></div>';

                    var tree = {
                        label: d.FirstName+' '+d.LastName+' '+(d.LoginId ? '('+d.LoginId+') ':'')+(500000+d.MemberId)+' '+$filter('currency')(d.PV)+'/'+$filter('currency')(d[$scope.cnf.field]),data:d,children: []};
                    if (level !== 0) {
                    }
                    list.push(d);
                    if (child.members) {
                        chart += '<ul>';
                        angular.forEach(child.members[++level], function(value){
                            tree.children.push(that.child(value, level));
                        });
                        chart += '</ul>';
                    }
                    chart += '</li>';

                    return tree;
                };
                return {
                    tree: [this.child(data[0][$scope.searchmember])],
                    list: {
                        data: list,
                        total: total
                    },
                    chart: chart,
                    count: count
                };

            };

            $scope.deferredBranch = {
                deferred: $q.defer(),
                getPromise : function() {
                    this.deferred = $q.defer();
                    return this.deferred.promise;
                },
                resolve : function(data) {
                    this.deferred.resolve(data);
                }
            };

            $scope.tree_handler = function(branch) {

                $scope.deferredBranch.resolve(branch);

                if (branch.children.length) {

                    var hasChildren = 0;

                    angular.forEach(branch.children, function(value, key) {

                        if (value.children.length) {
                            hasChildren++;
                        }
                    });

                    if (hasChildren == 0) {
                       // $scope.searchmember = branch.data.MemberId;
                        $http.post('/api/prorep/personalenrollees',
                            {
                                id: branch.data.MemberId,
                                token: $scope.token,
                                type: $scope.cnf.type
                            }
                        ).then(function(response) {
                            var t = $scope.parseData(response.data.response.data);
                            branch.children = t.tree[0].children;

                                //$scope.data.list.data = t.list.data;
                                //$scope.data.list.total = t.list.total;
                                //$scope.data.chart.data = t.chart;
                                //$scope.findmember($scope.searchmember);
                                //$scope.data.count = response.data.response.dataCount;
                                //console.log(t.tree.children);
                        })
                    }


                }

                var _ref;
                $scope.output = "Link for : " + branch.label;
                if ((_ref = branch.data) != null ? _ref.linkid : void 0) {
                    //$state.go('app.memberview',{id: branch.data.linkid});
                    return $scope.output += ' id (' + branch.data.linkid + ')';
                }
            };

            $scope.findmember = function(member){
                //console.log('findmember '+member);

                if ($scope.data.tree.length < 1) return $scope.chart.data = '';

                this.iterate = function(item, member){
                    if (item.length < 1) return;
                    for (var data in item) {
                        if (member && item[data].data.MemberId == member) {
                            $scope.data.chart.member = parseInt(member);
                            var t = $scope.chartbuilder(item[data]);
                            $scope.data.chart.data = t;
                            return t;
                        }
                        this.iterate(item[data].children,member);
                    }
                };

                this.iterate($scope.data.tree,member);
            };

            $scope.chartbuilder = function(member){
                var tmp = '<li>';
                tmp += '<div class="TreeDiv"><b>'+member.data.FirstName+' '+member.data.LastName+'</b><br />'+(500000+member.data.MemberId)+'<br />'+$filter('currency')(member.data.PV)+'/'+$filter('currency')(member.data[$scope.cnf.field])+'<p><span>'+(member.data.PV >= 200 ? '<i class="fa fa-money text-success"></i>' : '')+(member.data['Smart-Ship'] ? '<i class="fa fa-truck text-warning"></i>' : '')+'</span><a class="'+member.data.MemberId+'">Downline</a></p></div>';
                if (member.children.length > 0) {
                    tmp += '<ul>';
                    for (var data in member.children) {
                        tmp += $scope.chartbuilder(member.children[data]);
                    }
                    tmp += '</ul>';
                }
                tmp += '</li>';
                return tmp;
            };

            $scope.isMe = function() {
                if (isNaN($scope.searchmember)) return false;
                if (parseInt($scope.searchmember) == $rootScope.member.MemberId) return false;
                return true;
            };

            $scope.loadmember = function(member) {
                if ($scope.member_load || !$scope.isMe()) return;
                if (!isNaN(member)) {
                    $scope.searchmember = parseInt(member);
                    if (member == $rootScope.member.MemberId) $scope.searchvalue = '';
                } else {
                    $scope.searchmember = $rootScope.member.MemberId;
                }
                $scope.loadTree();
            };

            $scope.loadBranch = function(member) {
                return $http.post('/api/prorep/personalenrollees',
                    {
                        id: member,
                        token: token,
                        type: $scope.cnf.type
                    }
                );
            };

            $scope.downline = function(event) {
                var a = angular.element(event.target);
                if (a[0].nodeName === "A") {
                    $scope.data.chart.update = true;
                    return $timeout(function() {
                        $scope.findmember(a.attr('class'));
                        $scope.data.chart.update = false;
                    }, 700);
                }
            };

            $scope.updatemember = function() {
                //console.log('updatemember');
                if ($scope.data.chart.member != $scope.searchmember && $scope.tree) {
                    $scope.data.chart.update = true;
                    return $timeout(function() {
                        $scope.findmember($scope.searchmember);
                        $scope.data.chart.update = false;
                    }, 200);
                }
            };

        }])

        .controller('MemberController', ['$rootScope', '$scope', '$stateParams', '$http', '$state', 'resolveData',
            function ($rootScope, $scope, $stateParams, $http, $state, resolveData) {
                $scope.model = resolveData.data.response;

            $scope.backBtn = function () {
                $state.go($rootScope.previousState);
            }
        }])
    ;

})();
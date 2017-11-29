app.controller('AdminMembers', ['Helpers', 'MemberHandler', '$rootScope', '$scope', '$log', '$http', '$state',
    function (Helpers, MemberHandler, $rootScope, $scope, $log, $http, $state) {

    $scope.tabs = [
        { title:'List', content:'Dynamic content 1' },
        { title:'Tree', content:'Dynamic content 2', disabled: true }
    ];
    $scope.columns = [
        {name : 'Name',          property : function (member) { return member.FirstName +' '+ member.LastName }},
        {name : 'Id',            property : 'MemberId'},
        {name : 'Type',          property : function (member) { return Helpers.getMemberRole(member)}},
        {name : 'Join Date',     property : 'CreateDateTime'},
        {name : 'Upline Member', property : 'UplineMember'}
    ];
    $scope.types = [
        {id : 0, label : 'All'},
        {id : 1, label : 'Customer'},
        {id : 2, label : 'Distributor'},
        {id : 3, label : 'Prospect'}
    ];
    $scope.membersPerPage = [
        {id : 10,  label : "10"},
        {id : 20,  label : "20"},
        {id : 50,  label : "50"},
        {id : 100, label : "100"}
    ];
    $scope.actions = [
        {
            label : 'Select option', action : function () {}
        },
        {
            label : 'remove',
            action : function (member) {
                MemberHandler.remove(member.MemberId, function (resp) {
                    angular.forEach($scope.members, function (memb, index) {
                       if (memb.MemberId == member.MemberId) {
                           $scope.members.splice(index,1);
                       }

                   });
                });
            }
        },
        {
            label : 'some other action'
        }
    ];
    $scope.page = 1;
    $scope.action = $scope.actions[0];
    $scope.limit = $scope.membersPerPage[0];
    $scope.search = '';
    $scope.formMemberData = function (m,c) {
        switch (typeof c.property) {
            case 'function':
                return c.property(m);
            break;
            case 'string':
                return m[c.property];
                break;
            default:
                return "Column not find"
        }
    };
    $scope.$watch(function () {
        return angular.toJson([$scope.limit,$scope.page,$scope.memberType]);
    }, function (newVal,oldVal, $scope) {
        //console.log('search criteria changed');
        $scope.getMembers();
    });

    $scope.setLimit = function (l) {
        $scope.limit = l;
    };
    $scope.setSearch = function (s) {
        $scope.search = s;
    };
        $scope.keypressCallback = function (e, search) {
        e.preventDefault();
        e.stopPropagation();
        $scope.setSearch(search);
        $scope.getMembers();
    };
    $scope.setMemberType = function (memberType) {
        $scope.memberType = memberType;
    };

    $scope.setPage = function (pageNo) {
        ////console.log($scope.page,pageNo);
        $scope.page = pageNo;
    };
    $scope.checkAll = function (checker) {
        angular.forEach($scope.members, function (member) {
            member.checked = checker;
        });
    };
    $scope.applyAction = function (action) {
        angular.forEach($scope.members, function (member) {
            if (member.checked && typeof(action.action) == 'function') {
                action.action(member);
            }
        })
    };
        $scope.addDistributor = function () {
            MemberHandler.create({}, function (member) {
                //console.log(member);
                $state.go('app.admin.members.edit', {id: member.Field.MemberId});
            });
        };

    /** max shown pages on pagination */
    $scope.maxSize = 5;


    $scope.getMembers = function (o) {
        //console.log('search button pressed',o);
        if (!o) {
           var o = {
               search     : $scope.search,
               memberType : $scope.memberType,
               limit      : $scope.limit.id,
               page       : $scope.page
            }
        }
        $scope.members = [];
        $http.post('/api/admin/members',{token:$rootScope.member.token, search : o})
            .then(
            function (response) {
                //console.log(response);
                $scope.members      = response.data.members;
                $scope.membersCount = response.data.membersCount;
                $scope.totalPages   = Math.ceil($scope.membersCount/$scope.limit.id);
                $scope.ready        = true;
            },
            function (x) {
                //console.log(x);
            }
        )
    };

}]);

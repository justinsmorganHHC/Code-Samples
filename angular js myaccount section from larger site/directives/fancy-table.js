app.directive('fancyTable', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/blocks/fancy_table.html',
        controller: function ($scope) {
            angular.forEach($scope.settings, function (obj, key) {
                $scope[key] = obj;
            });

            $scope.bulkActions = [];
            $scope.bulkActions[$scope.bulkActions.length] = {
                label: 'Select option',
                action: function () {
                }
            };
            $scope.bulkActions[$scope.bulkActions.length] = {
                label: 'remove',
                action: function (item) {
                    $scope.handler.remove(item[$scope.indexField], function (resp) {
                        angular.forEach($scope.items, function (item, index) {
                            if (item[$scope.indexField] == item.MemberId) {
                                $scope.items.splice(index, 1);
                            }
                        });
                    });
                }
            };

            $scope.settings.bulkActions.forEach(function (act) {
                $scope.bulkActions[$scope.bulkActions.length]=act;
            });

            $scope.filters.forEach(function (filter) {
                //console.log(filter);
                filter.val = filter.options[0];
            });

            $scope.page = 1;
            $scope.bulkAction = $scope.bulkActions[0];
            $scope.limit = $scope.itemsPerPage[0];
            $scope.search = '';
            $scope.ready = false;

            /** max shown pages on pagination */
            $scope.maxSize = 5;

            $scope.formItemData = function (m, c) {
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
                return angular.toJson([$scope.limit, $scope.page, $scope.filters]);
            }, function (newVal, oldVal, $scope) {
                //console.log('search criteria changed');
                $scope.getItems();
            });
            $scope.keypressCallback = function (e, search) {
                e.preventDefault();
                e.stopPropagation();
                $scope.setSearch(search);
                $scope.getItems();
            };

            $scope.setLimit = function (l) {
                $scope.limit = l;
            };
            $scope.setSearch = function (s) {
                $scope.search = s;
            };
            $scope.setPage = function (pageNo) {
                $scope.page = pageNo;
            };

            $scope.checkAll = function (checker) {
                angular.forEach($scope.members, function (member) {
                    member.checked = checker;
                });
            };
            $scope.applyAction = function (action) {
                angular.forEach($scope.items, function (item) {
                    if (item.checked && typeof(action.action) == 'function') {
                        action.action(item);
                    }
                })
            };
            $scope.addItem = function () {

            };
            $scope.getItems = function (o) {
                //console.log('search button pressed', o);
                if (!o) {
                    o = {
                        search: $scope.search,
                        searchFields: ['Name', 'Date', 'Status', 'BillingName', 'Total'],
                        filters: $scope.filters,
                        limit: $scope.limit.id,
                        page: $scope.page
                    }
                }
                $scope.items = [];
                $scope.ready = false;
                $scope.handler.get(o, function (response) {
                    //console.log(response);

                    $scope.items = response[$scope.apiModel];
                    $scope.itemsCount = response[$scope.apiModel + 'Count'];
                    $scope.totalPages = Math.ceil($scope.itemsCount / $scope.limit.id);

                });
            };
        },
        scope: {
            settings: '=settings'
        }
    }
});
angular.module('app')
    .directive('reportsPel', [function () {
        return {
            restrict: 'AEC',
            replace: true,
            compile: function (tElem, attrs) {
                return function (scope, elem, attrs) {
                    scope.$watch('items.data', function (newVal, oldVal) {
                        if (newVal == oldVal) {
                            return;
                        }
                        //console.log(scope.items.data);
                        var html = '';
                        angular.forEach(scope.items.data, function (value, key) {
                            html += '<tr>' +
                            '<td>' + value.Name + ' (' + value.LoginId + ')</td>' +
                            '<td>' + value.PVLast + '</td>' +
                            '<td>' + value.PVThis + '</td>' +
                            '</tr>';
                        });
                        elem.append(html);
                    })
                }
            }

        };
    }]);
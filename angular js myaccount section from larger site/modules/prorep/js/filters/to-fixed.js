(function () {
    'use strict';

    angular.module('app.prorep.filters', [])

        .filter('toFixed', function () {
            return function (input, limit) {
                return input == undefined ? '' : parseInt(input).toFixed(limit || 2);
            };
        })
    ;

})();
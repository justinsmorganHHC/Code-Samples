(function() {
    'use strict';

    angular.module('app.prorep.services', [])

        .service('dataService', ['$http', function($http) {
            this.get = function() {
                return $http({
                    method: 'GET'
                });
            }

            this.post = function(url, data) {
                return $http({
                    method: 'POST',
                    url: url,
                    data: data
                });
            }
        }])
    ;

})();
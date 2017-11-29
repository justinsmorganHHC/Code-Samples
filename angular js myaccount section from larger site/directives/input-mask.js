angular.module('app').directive('inputMask', function() {
    return {
        restrict: 'A',
        link: function($scope, el, attrs) {
            el.on('keyup', function(e){
                $scope.model.Field[attrs.col] = el.val();
            });
            el.on('focus', function (e) {
                if(el.val()[0]=='*')
                    el.val('');
            })
        }
    };
});
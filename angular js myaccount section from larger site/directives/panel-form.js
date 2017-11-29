angular.module('app').directive('panelForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/blocks/panel_form.html',
        controller: ['$scope', function ($scope) {

            //field processing
            $scope.settings.fields.forEach(function(row) {
                //console.log(row);
                row.forEach(function (field) {
                    switch (field.el) {
                        case 'select' :
                            $scope.settings.model[field.col]=field.options[0];
                            var value = $scope.settings.model.Field[field.col];
                            if (value) {
                                field.options.forEach(function (opt) {
                                    if (opt.hasOwnProperty('id') && opt.id == value) {
                                        $scope.settings.model[field.col]=opt;
                                    }
                                });
                            }
                            break;
                        case 'ui-select' :
                            //console.log('the ui-sel');
                            field.selected = field.opt;
                            break;
                    }
                });
            });
        }],
        scope: {
            settings: '=settings'
        }
    }
});
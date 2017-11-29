angular.module('app').directive('panelBlock', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/blocks/panel_block.html',
        controller: ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
            $scope.block = $scope.settings;

            // adding actions
            $scope.block.actions.forEach(function (action) {
                //console.log(action);
                action.action = function (model) {
                    //console.log('Performing action with', model);
                    $scope.modalInstance.close();
                }
            });

            /** modal */
            $scope.open = function (size, model, block, template) {
                var modalInstance = $modal.open({
                    templateUrl: template ? template : 'tpl/administrators/modal_form.html',
                    controller: function ($scope) {
                        //console.log('ModalController');
                        $scope.model = model;
                        $scope.title = block.title;
                        $scope.fields = block.edit;
                        $scope.actions = block.actions;
                    },
                    size: size
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
                $scope.modalInstance = modalInstance;
            };
        }],
        scope: {
            settings: '=settings'
        }
    }
});
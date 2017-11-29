angular.module('app').directive(
    'contactForm',
    function () {
        return {
            restrict: 'E',
            templateUrl: 'tpl/blocks/contact_form.html',
            controller: ['$scope', '$modal', 'FeedbackHandler', function ($scope, $modal, FeedbackHandler) {
                console.log('ContactFormCtrl');
                $scope.submit = function () {
                    console.log($scope.message);
                    FeedbackHandler.send(
                        {message:$scope.message},
                        function(r, x) {
                            if (r) {
                                $scope.message = '';
                            }
                           var modalInstance = $modal.open({
                                templateUrl: 'tpl/blocks/contact_modal.html',
                                controller: ['$scope', 'data', function ($scope, data) {
                                    $scope.data = data;
                                    console.log('ModalCtrl')
                                }],
                                size: 'xs',
                                resolve: {
                                    data: function () {
                                        return {
                                            message: r ? r.data.Message : x.data.Message,
                                            type : r ? 'success':'danger',
                                            header : r ? 'Thank you for your feedback' : 'Error'
                                        };
                                    }
                                }
                           });

                        }
                    );
                }

            }],
            scope: {
                settings: '=settings'
            }
        }
    }
);
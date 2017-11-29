angular.module('app').controller('AdminMain', ['$http', '$scope', 'PageData', function ($http, $scope, PageData) {
    //console.log('admin main controller');
    $scope.plotChanged = false;
    var resp = PageData;
            $scope.d0_1        = resp.data.charts.Distributor;
            $scope.d0_2        = resp.data.charts.Prospect;
            $scope.months      = resp.data.charts.months;
            $scope.members     = resp.data.members.members;
            $scope.proReps     = resp.data.members.proReps;
            $scope.sales       = resp.data.sales;
            $scope.ready       = true;
            $scope.plotChanged = true;
}]);

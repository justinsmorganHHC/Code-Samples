'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ModalDeleteAutoship', ['$scope', '$modalInstance', function($scope, $modalInstance) {
	$scope.ok = function () {
		$modalInstance.close('true');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);

app.controller('ProrepAutoshipHistory', ['$rootScope', '$scope', '$http', '$modal', function ($rootScope, $scope, $http, $modal) {
	//console.log( "ProReps Smart-ship History Controller");
	var token = $rootScope.member.token;
	//$scope.accountsummary = {};
	
	$scope.globals = {
		update: true,
		message: {}
	};
	
	$scope.list = {
		type: {
			E: 'Entered',
			P: 'Processed',
			S: 'Shipped',
			C: 'Cancelled',
			H: 'Holding'
		}
	};
	
	$scope.items = {
		data: {}
	};

	$scope.deletepopup = function (id) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/proreps/autoship/modaldelete.html',
			controller: 'ModalDeleteAutoship',
			size: 'sm'
		});

      modalInstance.result.then(function () {
			//console.log('Delete autoship' + id);
          $http.post('/api/autoship/delete', {
              id: $rootScope.targetMemberId ?
                  $rootScope.targetMemberId : $rootScope.member.MemberId, token: token, autoship: id
          })
			.then(function (response) {
				//console.log(response);
				if (response.data.status) {
					var t = -1;
					angular.forEach($scope.items.data, function(value, key){
						//console.log(key,value.AutoshipmentId, id,value.AutoshipmentId == id);
						if (value.AutoshipmentId == id)
							t = key;
					});
					if (t != -1) $scope.items.data.splice(t, 1);
				}
			});
      }, function () {
			//console.log('no');
      });
    };

    $http.post('/api/autoship/history', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
		.then(function (response) {
			//console.log(response);
			if (response.data.status) {
				$scope.items.data = response.data.response.list;
				$scope.globals.update = false;
			}
		});

    $scope.generateSref = function (order) {
        var d = Date.parse(order.NextDate) - (60 * 60 * 24 * 2 * 1000);
        var date = new Date(d);
        //var now = new Date(2015, 0, 2);
        var now = new Date();
        //debugger;
        if (+now > +date) {
            return '<span class="text-muted">' + order.NextDate + '</span>';
        } else {
            return '<a href="#/smartship/edit/' + order.AutoshipmentId + '" class="text-info">' + order.NextDate + '</a>';
        }
    };

 }]);
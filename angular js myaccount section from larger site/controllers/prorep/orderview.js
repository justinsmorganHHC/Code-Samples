'use strict';

app.controller('ProrepOrderView', ['$rootScope', '$scope', '$http', '$state', function ($rootScope, $scope, $http, $state) {
	//console.log( "ProReps Order History Controller");
	var token = $rootScope.member.token;
	//$scope.accountsummary = {};
	
	$scope.globals = {
		update: true,
		message: {},
		orderid: $state.params.id,
		type: 0,
		phone: '',
		email: ''
	};
	
	$scope.list = {
		type: {
			E: 'Entered',
			P: 'Processed',
			S: 'Shipped',
			C: 'Cancelled',
			H: 'Holding'
		},
		title: {
			'0': 'RECEIPT',
			'1': 'INVOICE',
			'2': 'PACKING LIST',
			'4': 'PACKING LIST/INVOICE'
		},
		addresses: {
			'0': [
					{capt: 'Bill To:', use: 'billing'},
					{capt: 'Ship To:', use: 'shipping', info: true}
				]
		}
	};
	
	$scope.item = {
		data: {},
		shipping: {},
		billing: {},
		product: {}
	};

	$scope.toprint = function(id){
		//console.log('View order detail ' + id);
	};

    $scope.back = function() {
        console.log('I am back button');
        $state.go('app.proreps.order');
    };
	

	$http.post('/api/prorep/orderview', {id:$scope.globals.orderid, token:token})
		.then(function (response) {
			//console.log(response);
			if (response.data.status) {
				$scope.item.data = response.data.response.order;
				$scope.item.product = response.data.response.items;
				$scope.item.billing = response.data.response.billing;
				$scope.item.shipping = response.data.response.shipping;
				$scope.globals.phone = response.data.response.globals.phone;
				$scope.globals.email = response.data.response.globals.email;
				$scope.globals.update = false;
			}
		});

	$scope.getTotalCV = function () {
		var total = 0;
		angular.forEach($scope.item.product, function (val) {
			//debugger;
			total += val.Quantity * val.CV;
		});
		return total;
	};

 }]);
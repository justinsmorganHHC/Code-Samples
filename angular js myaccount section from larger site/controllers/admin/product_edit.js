'use strict';

app.controller('AdminProductEdit', ['$rootScope', '$scope', '$log', '$http', '$state', 'ProductData', 'ApiCall', function ($rootScope, $scope, $log, $http, $state, ProductData, ApiCall) {

	$scope.globals = {
		update: true
	};
	$scope.product = ProductData;
	$scope.departments = [];
	$http.post('/api/admin/departments',{token: $rootScope.member.token, action: 'getAll'})
	.then(function (response) {
			//console.log(response);
			$scope.departments = response.data.departments;
			$scope.globals.update = false;
		},
		function (x) {
			//console.log(x);
			$scope.globals.update = false;
		}
	);
	
	$scope.order = [
		{capt: 'Name', type: 'text', name: 'Name'},
		{capt: 'Country', type: 'select', name: 'Country', data: function(){return {CA: 'Canada', US: 'United States'};}},
		{capt: 'SKU', type: 'text', name: 'SKU'},
		{capt: 'SKU (New)', type: 'text', name: 'SKUNew'},
		{capt: '5+ Price', type: 'text', name: 'Price'},
		{capt: 'Member Price', type: 'text', name: 'ListPrice'},
		{capt: 'Ret Price', type: 'text', name: 'RetailPrice'},
		{capt: 'CV', type: 'text', name: 'CV'},
		{capt: 'Weight', type: 'text', name: 'Weight'},
		{capt: 'Inactive', type: 'checkbox', name: 'Inactive'},
		{capt: 'Keywords', type: 'text', name: 'Keywords'},
		{capt: 'Link', type: 'text', name: 'ProductLink'},
		{capt: 'Image', type: 'text', name: 'Image'},
		{capt: 'Autoship', type: 'checkbox', name: 'Autoship'},
		{capt: 'Featured', type: 'checkbox', name: 'Featured'},
		{capt: 'Send Bundle', type: 'checkbox', name: 'SendBundle'},
		{capt: 'Supplier SKU', type: 'text', name: 'SupplierSKU'},
		{capt: 'Media Id', type: 'text', name: 'MediaId'},
		{capt: 'Description', type: 'textarea', name: 'Description'}
	];

	$scope.saveProduct = function() {
		//console.log($scope.product);
		
		if ($scope.globals.update) return;
		$scope.globals.update = true;
		var obj = {};
		angular.copy($scope.product, obj);
		obj.saving = true;
		ApiCall.call({url: '/api/admin/productedit', params: obj})
		.then(function (resp) {
				if (resp.data.result) {
					$rootScope.toaster = {type: 'success', title: 'Save complete', text: 'Product '+$scope.product.Name+' successfully saved.'};
					$rootScope.pop();
					$state.go('app.admin.products.index');
				} else {
					if (resp.data.error) angular.forEach(resp.data.error, function(value){
						$rootScope.toaster = {type: 'error', title: 'Save error',text: value};
						$rootScope.pop();
					});
				};
				$scope.globals.update = false;
			}, function (x) {
				//console.log(x);
				$scope.globals.update = false;
			}
		);
	};
	
	$scope.resetProduct = function(){
		$state.go('app.admin.products.index');
	};
		
	angular.forEach($scope.order, function(value){
		if (value.type == 'checkbox') $scope.product[value.name] = parseInt($scope.product[value.name]);
	});
	

}]);
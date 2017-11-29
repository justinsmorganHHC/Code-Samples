'use strict';

app.controller('AdminProducts', ['$rootScope', '$scope', '$log', '$http', '$state', function ($rootScope, $scope, $log, $http, $state) {

	$scope.products = [];
	$scope.departments = [];
	$http.post('/api/admin/departments',{token: $rootScope.member.token, action: 'getAll'})
	.then(function (response) {
			//console.log(response);
			$scope.departments = response.data.departments;
		},
		function (x) {
			//console.log(x);
		}
	);
	$scope.columns = [
		{type: 1, name : 'Product Name', property : 'Name'},
		{type: 0, name : 'SKU', property : 'SKU'},
		{type: 0, name : '', property : function (product) { return product.Inactive == '1' ? '(Inactive)' : ''; }}
	];
	$scope.PerPage = [
		{id : 10,  label : "10"},
		{id : 20,  label : "20"},
		{id : 50,  label : "50"},
		{id : 100, label : "100"}
	];
	$scope.actions = [
		{label : 'Select option', action : function () {}},
		{label : 'Remove', action : function (product) { $scope.removeProduct(product); }}
	];
	$scope.globals = {
		update: true,
		action: $scope.actions[0],
		total: 0,
		checker: false,
		maxSize: 5,
		totalPages: 0,
		searchtext: ''
	};
	$scope.search = {
		page: 1,
		limit: $scope.PerPage[0].id,
		text: '',
		department: 0
	};

	$scope.formData = function (m,c) {
		switch (typeof c.property) {
			case 'function':
				return c.property(m);
			break;
			case 'string':
				return m[c.property];
				break;
			default:
				return "Column not find";
		}
	};
	$scope.$watchCollection('search', function (newVal,oldVal, $scope) {
		//console.log('search criteria changed');
		$scope.getData();
	});

	$scope.setSearch = function (s) {
		$scope.search.text = s;
	};

	$scope.checkAll = function (checker) {
		angular.forEach($scope.products, function (product) {
			product.checked = checker;
		});
	};
	$scope.applyAction = function (action) {
		angular.forEach($scope.members, function (member) {
			if (member.checked && typeof(action.action) == 'function') {
				action.action(member);
			}
		});
	};
	$scope.getData = function() {
		$scope.globals.update = true;
		$scope.products = [];
		$http.post('/api/admin/products',{token: $rootScope.member.token, search: $scope.search})
		.then(function (response) {
				//console.log(response);
				$scope.products = response.data.products;
				$scope.globals.total = response.data.productsCount;
				$scope.globals.totalPages   = Math.ceil($scope.globals.total/$scope.search.limit);
				$scope.globals.update = false;
			},
			function (x) {
				//console.log(x);
				$scope.globals.update = false;
			}
		);
	};
	$scope.deleteProduct = function(product) {
		//console.log('deleting ',product);
	};
	$scope.addProduct = function() {
		//console.log('creating new products');
		$state.go('app.admin.products.edit');
	};

}]);

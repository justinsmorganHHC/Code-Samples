'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller('ProrepEnroll', ['$rootScope', '$scope', '$http', '$filter', '$state', function ($rootScope, $scope, $http, $filter, $state) {
	//console.log( "ProReps Enroll Controller");
	var token = $rootScope.member.token;
	
	$scope.globals = {
		PageName: $state.includes('app.proreps.enrollprorep') ? 'Enroll a Pro Rep' : 'Enroll a Member',
		type: $state.includes('app.proreps.enrollprorep') ? 'P' : 'T',
		update: true,
		message: {},
		responce: false
	};

	$scope.data = {
		products: [],
		Shipping: {}
	};
	
	$scope.forms = {
		main : {}
	};
	
	$scope.clearmainmessage = function(){
		$scope.globals.message = {};
	};
	
	$scope.Totals = function() {
		var a = {SubTotal: 0, TotalCV: 0, SalesTax: 0, ShippingCharge: 0};
		this.countSalesTax = function() {
			if (['fl', 'fl.', 'florida'].indexOf($filter('lowercase')($scope.data.Shipping.State)) === -1){
				return 0;
			} else {
				return $filter('number')(a.SubTotal * .075, 2);
            }
        };
		this.countShippingCharge = function() {
			if (['ak', 'ak.', 'alaska', 'hi', 'hi.', 'hawaii'].indexOf($filter('lowercase')($scope.data.Shipping.State)) === -1) {
				return (a.SubTotal >= 50 ? 0 : 8);
			} else {
				return 25 + (a.SubTotal >= 50 ? 0 : 8);
			}
		};
		angular.forEach($scope.data.products, function(product){
			a.SubTotal += product.Quantity * product.ListPrice;
			if (product.Quantity) a.TotalCV += product.Quantity * product.CV;
		});
		a.SalesTax = this.countSalesTax();
		a.ShippingCharge = this.countShippingCharge();
		return a;
	};
	
	$scope.saveenroll = function() {
		//console.log('save enroll');
		if ($scope.globals.update || !$scope.forms.main.$valid) return;
		var t = $scope.Totals();
		if ($scope.globals.type == 'P' ? t.TotalCV < 200  : t.SubTotal < 100) {
			$rootScope.toaster = {type: 'error', title: 'Product Totals',text: $scope.globals.type == 'P' ? 'You must specify at least 200 CV of product to enroll a Pro Rep' : 'You must specify at least $100 of product to enroll a Member'};
			$rootScope.pop();
			return;
		}
		var obj = {};
		angular.forEach($scope.data.products, function(value){
			if (value.Quantity > 0)
				obj[value.ProductId] = value.Quantity;
		});
		$rootScope.enrollProduct = obj;
		$state.go($state.includes('app.enrollprorep') ? 'app.proreps.enrollprorep.member' : 'app.proreps.enrollmember.member');
	};

    $http.post('/api/prorep/enroll', {
        id: $rootScope.targetMemberId ?
            $rootScope.targetMemberId : $rootScope.member.MemberId, token: token
    })
	.then(function (response) {
		//console.log(response);
		if (response.data.status) {
			$scope.data.products = response.data.response.products;
			$scope.data.Shipping = response.data.response.shipping;
		}
		$scope.globals.update = false;
	});

}]);
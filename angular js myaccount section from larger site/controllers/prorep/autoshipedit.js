'use strict';

/* Controllers */
// prorep dashboard main page controller
app.controller(
    'ProrepAutoshipEdit',
    [
        '$rootScope',
        '$scope',
        '$http',
        '$filter',
        '$state',
        'OrderTaxation',
        function ($rootScope, $scope, $http, $filter, $state, OrderTaxation) {
            //console.log( "ProReps Smart-ship History Controller");
            var token = $rootScope.member.token;
            //$scope.accountsummary = {};
            var date = new Date();
            var tomorrow = date.setDate(date.getDate() + 1);
            //debugger;
            $scope.globals = {
                update: true,
                message: {},
                summ: {},
                subtotal: 0,
                selectdate: $filter('date')(tomorrow, 'yyyy-MM-dd'),
                autoship: $state.params.id || 0,
                messages: []
            };

            $scope.forms = {
                panel: {},
                main: {}
            };

            $scope.lists = {
                Country: [],
                Dates: []
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'MM/dd/yyyy', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];

            $scope.data = {
                Shipping: {
                    data: {},
                    copy: {}
                },
                Billing: {
                    data: {},
                    copy: {}
                },
                Payment: {
                    data: {},
                    copy: {},
                    types: function () {
                        if (!this.data.CreditCardNumber) return '';
                        var t = '';
                        switch (this.data.CreditCardNumber.slice(0, 1)) {
                            case '3':
                                t = 'AMEX';
                                break;
                            case '4':
                                t = 'Visa';
                                break;
                            case '5':
                                t = 'MasterCard';
                                break;
                            case '6':
                                t = 'Discover';
                                break;
                        }
                        return t;
                    },
                    number: function () {
                        if (!this.data.CreditCardNumber) return '';
                        return '************' + this.data.CreditCardNumber.slice(-4);
                    },
                    valid: function () {
                        if (!this.data.CreditCardExpirationDate) return '';
                        return this.data.CreditCardExpirationDate.slice(0, 2) + '/20' + this.data.CreditCardExpirationDate.slice(-2);
                    },
                    update: function (val) {
                        return (val.indexOf('*') === -1) ? val : this.data.CreditCardNumber;
                    }
                },
                products: {}
            };
            var addressFields = [
                    {name: 'FirstName', capt: 'First Name', edit: true, validation: {max: 32}},
                    {name: 'LastName', capt: 'Last Name', edit: true, validation: {max: 32}},
                    {name: 'Organization', capt: 'Organization', edit: true, validation: {max: 64}},
                    {name: 'Street', capt: 'Street', edit: true, validation: {max: 64}},
                    {name: 'Street2', capt: 'Street2', edit: true, validation: {max: 64}},
                    {name: 'City', capt: 'City', edit : true, validation: {max: 32}},
                    {name: 'Country', capt: 'Country', list: true, edit: true, validation: {max: 32}, options: function (m) {return $scope.lists.Country}},
                    {name: 'State', capt: 'State', list : true, edit: true, validation: {max: 32}, options: function (m) {
                        var cId = false;
                        angular.forEach($scope.lists.Country, function (c) {
                            if (c.country == m.Country) {
                                cId = c.id;
                            }
                        });
                        return $filter('filter')($scope.lists.State, {country_pk:cId});
                    }},
                    {name: 'PostalCode', capt: 'Postal Code', edit: true, digit: true, validation: {max: 10}},
                    {name: 'Email', capt: 'Email', edit: true, type: 'email', validation: {max: 32}},
                    {name: 'Telephone', capt: 'Telephone', edit: true, digit: true, validation: {max: 10}}
                ];

            $scope.panels = [
                {
                    name: 'Shipping',
                    capt: 'Shipping Address',
                    save: false,
                    show: true,
                    update: false,
                    order: addressFields,
                    messages: []
                },
                {
                    name: 'Billing',
                    capt: 'Billing Address',
                    save: false,
                    show: true,
                    update: false,
                    order: addressFields,
                    messages: []
                },
                {
                    name: 'Payment',
                    capt: 'Payment Address',
                    save: false,
                    show: true,
                    update: false,
                    order: [
                        {
                            name: 'CreditCardNumber',
                            capt: 'Card Number',
                            edit: true,
                            validation: {max: 20},
                            __get: function () {
                                return $scope.data.Payment.number();
                            },
                            __set: function (val) {
                                return $scope.data.Payment.update(val);
                            }
                        },
                        {
                            name: 'CreditCardExpirationDate',
                            capt: 'Expiration Date',
                            edit: true,
                            digit: true,
                            validation: {max: 4}
                        },
                        {name: 'CreditCardNameOnCard', capt: 'Name On Card', edit: true, validation: {max: 64}}
                    ],
                    messages: []
                }
            ];

            $scope.addpanelmessage = function (type, msg, panel) {
                $scope.globals.messages.push({type: type, msg: msg, panel: panel});
            };

            $scope.clearpanelmessage = function (index) {
                $scope.globals.messages.splice(index, 1);
            };

            $scope.clearmainmessage = function () {
                $scope.globals.message = {};
            };

            $scope.sidepanel = function (panelid) {
                $scope.globals.messages = [];
                if ($scope.panels[panelid].save) {
                    //console.log('save ' + $scope.panels[panelid].name);
                    if (!$scope.forms.panel.$valid) return;
                    $scope.panels[panelid].update = true;
                    var obj = {};
                    angular.copy($scope.data[$scope.panels[panelid].name].copy, obj);
                    obj.id = $rootScope.member.MemberId;
                    obj.token = token;
                    obj.saving = $scope.panels[panelid].name;
                    $http.post('/api/prorep/profilechildsave', obj)
                        .then(function (response) {
                            $scope.panels[panelid].update = false;
                            if (response.data.response.error) {
                                angular.forEach(response.data.response.error, function (value, key) {
                                    $scope.addpanelmessage('danger', value, $scope.panels[panelid].name);
                                });
                                $scope.globals.update = false;
                            } else if (response.data.response.update) {
                                angular.forEach($scope.panels[panelid].order, function (value, key) {
                                    $scope.data[$scope.panels[panelid].name].data[value.name] = value.__set ? value.__set($scope.data[$scope.panels[panelid].name].copy[value.name]) : $scope.data[$scope.panels[panelid].name].copy[value.name];
                                });
                                //angular.copy($scope.data[$scope.panels[panelid].name].copy, $scope.data[$scope.panels[panelid].name].data);
                                $scope.addpanelmessage('success', 'User ' + $scope.panels[panelid].capt + ' was updated.', $scope.panels[panelid].name);
                                $scope.panels[panelid].save = false;
                                angular.forEach($scope.panels, function (value, key) {
                                    value.show = true;
                                });
                            }
                        },
                        function (x) {
                            //console.log(x);
                        });
                } else {
                    //console.log('open ' + $scope.panels[panelid].name);
                    angular.forEach($scope.panels[panelid].order, function (value, key) {
                        ////console.log(value,$scope.panels[panelid].name,$scope.data[$scope.panels[panelid].name]);
                        $scope.data[$scope.panels[panelid].name].copy[value.name] = value.__get ? value.__get() : $scope.data[$scope.panels[panelid].name].data[value.name];
                    });
                    //angular.copy($scope.data[$scope.panels[panelid].name].data, $scope.data[$scope.panels[panelid].name].copy);
                    $scope.panels[panelid].save = true;
                    angular.forEach($scope.panels, function (value, key) {
                        if (key != panelid) value.show = false;
                    });
                }
            };

            $scope.closepanel = function (panelid) {
                if ($scope.panels[panelid].save) {
                    $scope.globals.messages = [];
                    //console.log('close ' + $scope.panels[panelid].name);
                    $scope.panels[panelid].save = false;
                    angular.forEach($scope.panels, function (value, key) {
                        value.show = true;
                    });
                }
            };

            $scope.countSubtotal = function () {
                var t = 0;
                angular.forEach($scope.globals.summ, function (value, key) {
                    t += value;
                });
                $scope.globals.subtotal = t;
                return t;
            };

            $scope.countSalesTax = function () {
                return $scope.SalesTax;
            };

            $scope.countShippingCharge = function () {
                return $scope.ShippingCharge;
            };

            $scope.calculateTaxes = function (e) {

                OrderTaxation.calculateTaxation(
                    {
                        State:this.data.Shipping.data.State,
                        Country:this.data.Shipping.data.Country,
                        Amount: this.countSubtotal()
                    },
                    function (r) {
                        $scope.ShippingCharge = r.data.ShippingCharge;
                        $scope.SalesTax = r.data.SalesTax;
                    });

            };

            $scope.countTotal = function () {
                return $scope.globals.subtotal + $scope.countSalesTax()*1 + $scope.countShippingCharge()*1;
            };

            $scope.countTotalCV = function () {
                var t = 0;
                angular.forEach($scope.data.products, function (value, key) {
                    t += value.Quantity * value.CV;
                });
                return t;
            };

            $scope.datelist = function () {
                var t = new Date(tomorrow);
                var Y = $filter('date')(t, 'yyyy'), cm = t.getMonth() + 1, d = t.getDate(), y = t.getFullYear();
                var dates = [];
                for (var m = cm; m <= cm + 1; m++) {
                    for (var i = 1; i <= daysInMonth(m,y); i++) {
                        if (i < d && m === cm) continue;
                        dates.push({
                            val: Y + '-' + (m < 10 ? '0' + m : m) + '-' + (i < 10 ? '0' + i : i),
                            capt: (m < 10 ? '0' + m : m) + '/' + (i < 10 ? '0' + i : i) + '/' + Y
                        });
                    }

                }
                console.log(dates);
                $scope.lists.Dates = dates;
            };

            function daysInMonth(month,year) {
                return new Date(year, month, 0).getDate();
            }

            $scope.saveautoship = function () {
                //console.log('main form submit');
                if (!$scope.forms.main.$valid) {
                    $scope.globals.message.type = 'danger';
                    $scope.globals.message.msg = 'Please choose valid number for Quantity';
                    return;
                }
                $scope.globals.update = true;
                var obj = {
                    id: $rootScope.member.MemberId,
                    token: token,
                    saving: true,
                    products: {},
                    NextAutoshipDate: $scope.globals.selectdate,
                    autoship: $scope.globals.autoship
                };
                angular.forEach($scope.data.products, function (value, key) {
                    if (value.Quantity > 0)
                        obj.products[value.ProductId] = value.Quantity;
                });
                $http.post('/api/autoship/edit', obj)
                    .then(function (response) {
                        //console.log(response);
                        if (response.data.status) {
                            $state.go('app.proreps.smartship.history');
                        } else {
                            $scope.globals.message.type = 'danger';
                            $scope.globals.message.msg = response.data.error[0];
                        }
                        $scope.globals.update = false;
                    },
                    function (x) {
                        //console.log(x);
                    });
            };

            $scope.cancelAutoship = function () {
                $state.go('app.proreps.smartship.history');
            };


            $http.post('/api/autoship/edit', {
                id: $rootScope.member.targetMemberId ?
                    $rootScope.targetMemberId : $rootScope.member.MemberId,
                token: token,
                autoship: $scope.globals.autoship
            })
                .then(function (response) {
                    //console.log(response);
                    if (response.data.status) {
                        angular.forEach(response.data.response.products, function (item) {
                            item.CV = parseFloat(item.CV);
                            item.Price = parseFloat(item.Price);
                            item.ListPrice = parseFloat(item.ListPrice);
                        });
                        $scope.data.products = response.data.response.products;
                        $scope.data.Shipping.data = response.data.response.shipping;
                        $scope.data.Billing.data = response.data.response.billing;
                        $scope.data.Payment.data = response.data.response.payment;
                        $scope.lists = response.data.response.list;
                        $scope.globals.selectdate = response.data.response.date;
                        $scope.States = angular.copy($scope.lists.State)
                        $scope.globals.selectdate = response.data.response.date;
                        $scope.datelist();
                        $scope.globals.update = false;
                    }
                });
        }
    ]
);

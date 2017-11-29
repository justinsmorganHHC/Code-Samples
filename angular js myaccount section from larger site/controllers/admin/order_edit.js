

angular.module('app').controller('AdminOrderEditController', [
    '$scope','PageData','AddressHandler', 'OrderPayment', 'MemberHandler', function ($scope, PageData, AddressHandler, OrderPayment, MemberHandler) {
        //console.log('The AdminOrderEditController', PageData);
        $scope.order = PageData.data.order;

        $scope.orderEditFormSettings = {
            title: 'Order Edit',
            model:$scope.order,
            fields: [
                [
                    {label: 'Number', col: 'Number', disabled: true, editable: false},
                    {label: 'Date', col: 'Date', disabled: true, editable: false}
                ],
                [
                    {
                        label: 'Status',
                        col: 'Status',
                        el: 'select',
                        w:5,
                        options: [
                            {id: '',  label: 'All'},
                            {id: 'C', label: 'Cancelled'},
                            {id: 'E', label: 'Entered'},
                            {id: 'F', label: 'Fulfillment Sent'},
                            {id: 'W', label: 'Fulfillment Wait'},
                            {id: 'H', label: 'Holding'},
                            {id: 'P', label: 'Processed'},
                            {id: 'S', label: 'Shipped'},
                        ]
                    },
                    {
                        label: 'Terms',
                        col: 'Terms',
                        el:'select',
                        w:2,
                        options: [
                            {label: "Prepaid"},
                            {label: "30 Days"},
                            {label: "60 Days"},
                            {label: "90 Days"}
                        ]
                    },
                    {
                        label: 'Type',
                        col: 'Type',
                        el:'select',
                        w:2,
                        options: [
                            {label: "Member"},
                            {label: "Retail"},
                        ]
                    },
                ],
                [
                    {
                        label: 'Member',
                        col: 'MemberId',
                        opt: $scope.order.Member,
                        handler:MemberHandler,
                        label: function (member) {
                            return member.Field.FirstName +' '+ member.Field.LastName;
                        },
                        showFields:[
                            {
                                label: 'Email',
                                col:   'Email'
                            },
                            {
                                label:'Full Name',
                                val: function (member) {
                                   return member.Field.FirstName +' '+ member.Field.LastName;
                                }
                            }
                        ],
                        refreshItems : function (searchString) {
                            //console.log(searchString);
                        },
                        options: [
                            {Field: {FirstName:'asdf', LastName:'dfda', Email:'the@email.comn'}},
                            {Field: {FirstName:'sddf', LastName:'fasfgfdgdas', Email:'the@email.comn'}},
                            {Field: {FirstName:'asssfasdfdf', LastName:'dfhgf', Email:'the@email.comn'}},
                            {Field: {FirstName:'asdasdffff', LastName:'fghfgh', Email:'the@email.comn'}},
                        ],
                        disabled: true,
                        editable: true,
                        el: 'ui-select',
                        save: function (item, i) {

                        }
                    },
                    {label: 'Charge Tax', col: 'chargetax', el:'checkbox'},
                ],
                [
                    {
                        label: 'Shipping Information',
                        disabled: true,
                        editable: false,
                        col: 'ShippingMethod',
                        w:5
                    }
                ]
            ]
        };

        $scope.addressBlocks = [
            {
                title: 'Billing Address',
                prop: $scope.order.BillingAddress,
                parent:$scope.order,
                handler: AddressHandler,
                indexField: 'AddressId',
                model: 'address',
                refField: 'BillingAddressId',
                edit: [
                    [{label: 'First Name', col: 'FirstName'}, {label: 'Last Name', col: 'LastName'}],
                    [{label: 'Organization', col: 'Organization'}],
                    [{label: 'Street', col: 'Street'}],
                    [{label: 'Street2', col: 'Street2'}],
                    [{label: 'City', col: 'City'}, {label: 'State', col: 'State'}],
                    [{label: 'PostalCode', col: 'PostalCode'}, {label: 'Country', col: 'Country'}],
                    [{label: 'Email', col: 'Email'}],
                    [{label: 'Telephone', col: 'Telephone'}]
                ],
                actions: [
                    {
                        name: 'Save'
                    }
                ],
                fields: [
                    {
                        name: 'Full Name',
                        val: function () {
                            return $scope.order.ShippingAddress.Field.FirstName+' '+$scope.order.ShippingAddress.Field.LastName
                        }
                    },
                    {name: 'Organization'},
                    {name: 'Street'},
                    {name: 'Street2'},
                    {name: 'Country'}
                ]
            },
            {
                title: 'Shipping Address',
                handler: AddressHandler,
                indexField: 'AddressId',
                refField: 'ShippingAddressId',
                prop: $scope.order.ShippingAddress,
                parent:$scope.order,
                model: 'address',
                edit: [
                    [{label: 'First Name', col: 'FirstName'}, {label: 'Last Name', col: 'LastName'}],
                    [{label: 'Organization', col: 'Organization'}],
                    [{label: 'Street', col: 'Street'}],
                    [{label: 'Street2', col: 'Street2'}],
                    [{label: 'City', col: 'City'}, {label: 'State', col: 'State'}],
                    [{label: 'PostalCode', col: 'PostalCode'}, {label: 'Country', col: 'Country'}],
                    [{label: 'Email', col: 'Email'}],
                    [{label: 'Telephone', col: 'Telephone'}]
                ],
                actions: [
                    {
                        name: 'Save'
                    }
                ],
                fields: [
                    {
                        name: 'Full Name',
                        val: function () {
                            return $scope.order.ShippingAddress.Field.FirstName+' '+$scope.order.ShippingAddress.Field.LastName
                        }
                    },
                    {name: 'Organization'},
                    {name: 'Street'},
                    {name: 'Street2'},
                    {name: 'Country'}
                ]
            }
        ];
        $scope.paymentForm = {
            title : 'Payment Edit',
            model : $scope.order,
            fields : [
                [
                    {
                        label: 'Card Number',
                        col: 'CCNumber',
                        w:5,
                        val: function (item) {
                            return '************' + item.Field.CCNumber.substring(item.Field.CCNumber.length-4);
                        },
                        disabled:true
                    },
                    {label: 'Expiration Date', col: 'CCExpirationDate', disabled:true, w:2},
                    {label: 'Security Code', col: 'CCSecurityCode', disabled:true, w:2},
                ],
                [
                    {
                        label: 'Payment Type',
                        col: 'PaymentType',
                        el:'select',
                        w:2,
                        options:[
                            {id:'A',  label:'Cash/Money Order'},
                            {id:'H', label:'Check'},
                            {id:'C', label:'Credit Card'},
                        ]
                    },
                    {label: 'Date', col: 'PaymentDate', w:2, disabled:true},
                    {label: 'Amount', col: 'PaymentAmount', w:2},
                    {
                        label: '',
                        el:'button',
                        buttonLabel:'Process',
                        w:2,
                        action : function () {
                            //console.log('Start processing',$scope.order);
                            var obj = {
                                CCSecurityCode: $scope.order.Field.CCSecurityCode,
                                Name: "test",
                                Street: 'asdf',
                                PostalCode: 'asdkj',
                                OrderNumber: $scope.order.Field.Number
                            };
                            OrderPayment.process(obj, function (resp) {
                                //console.log('Process Ord', resp);
                            });
                        }
                    },
                ]
            ]
        };
        $scope.paymentList = {

        }
    }
]);
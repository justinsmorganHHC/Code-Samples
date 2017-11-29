angular.module('app').controller(
    'MemberEditProRepController', ['$log', '$scope', '$rootScope', '$http', '$state', '$stateParams', 'Helpers', '$filter',
        'MemberHandler', 'AddressHandler', 'PaymentHandler', 'NoteHandler', '$modal', 'PageData', 'OrderUtilities',
        function ($log, $scope, $rootScope, $http, $state, $stateParams, Helpers, $filter, MemberHandler,
                  AddressHandler, PaymentHandler, NoteHandler, $modal, PageData, OrderUtilities) {
            console.log('preloaded Page data', PageData);

            var date = new Date();

            /** init scope vars */
            $scope.initMember = function () {
                $scope.member = {};
                $scope.member.Type = $scope.MemberTypes[0];
                $scope.member.Field = {};
                $scope.member.Billing = {Field: {}};
                $scope.member.Shipping = {Field: {}};
                $scope.member.Payment = {Field: {}};
            };

            $scope.MemberTypes = [
                {label: 'Select One'},
                {label: 'Member'},
                {label: 'Rep'}
            ];

            $scope.Months = [];
            for (var i = 1; i < 13; i++) {
                if (i < 10) {
                    i = '0' + i;
                }
                $scope.Months.push({label:i});
            }

            $scope.Years = [];
            for (var i = date.getFullYear(); i < date.getFullYear()+30; i++) {
                $scope.Years.push({label:i});
            }

            $scope.lists = {};
            OrderUtilities.getStates({}, function (r) {
                $scope.lists.States = r.data.states;
            });
            OrderUtilities.getCountries({}, function (r) {
                $scope.lists.Countries = r.data.countries;
            });

            $scope.initMember();

            /** watch payment information change */
            $scope.$watch(
                function () {
                    return $scope.member.Payment.creditCardExpiryMonth.label.toString() + $scope.member.Payment.creditCardExpiryYear.label.toString()
                },
                function (newVal, oldVal, $scope) {
                    var month = String(newVal).substr(0, 2);
                    var year = String(newVal).substr(2).substr(2);
                    $scope.member.Payment.Field.CreditCardExpirationDate = month+year;
                }
            );

            $scope.$watch('member.Field.Password', function (newVal, oldVal) {
                if (newVal == oldVal) {
                    $scope.member.Field.Password = '';
                }
            });

            /** view data */
            $scope.memberEditRows = [
                [
                    {label: 'First name', col: 'FirstName', el: 'input', editable: false},
                    {label: 'Last name', col: 'LastName', el: 'input', editable: false}
                ],
                [
                    {
                        label: 'Member Type',
                        prop:'Type',
                        editable: false,
                        disabled: true
                    },
                    {label: 'Id', col: 'LoginId', el: 'input'}
                ],
                [
                    {
                        label: 'Join Date',
                        col: 'CreateDateTime',
                        el: 'input',
                        editable:false,
                        val: function (date) {
                            var dateObj = new Date(date);
                            return $filter('date')(dateObj.getTime(),'MM/dd/yyyy')
                        }
                    },
                    {label: 'Company', col: 'Company', editable:false},
                    //{label: 'Password', col: 'Password', el: 'input'}
                ]
            ];

            $scope.blocks = [
                {
                    title: 'Contact Information',
                    name: 'contactInformationForm',
                    fields: [
                        {label: 'Email', col: 'Email'},
                        {label: 'Telephone', col: 'Telephone'},
                    ]
                }
            ];

            var addressEditBlock = [
                [{label: 'First Name', col: 'FirstName'}, {label: 'Last Name', col: 'LastName'}],
                [{label: 'Organization', col: 'Organization', }],
                [{label: 'Street', col: 'Street'}],
                [{label: 'Street2', col: 'Street2'}],
                [{label: 'City', col: 'City'},
                    {
                        label: 'Country',
                        col: 'Country',
                        el: 'select',
                        optionLabel:'country',
                        optionValue:'country',
                        options: function () {
                            return $scope.lists.Countries
                        }
                    }
                ],
                [
                    {label: 'PostalCode', col: 'PostalCode'},
                    {
                        label: 'State',
                        col: 'State',
                        el: 'select',
                        options: function (m) {
                            console.log(m, $scope.lists.States, $scope.lists.Countries);
                            var c_id = false;
                            angular.forEach($scope.lists.Countries, function (c) {
                                if (c.country == m.Field.Country) {
                                    c_id = c.id;
                                }
                            });
                            return $filter('filter')($scope.lists.States, {country_pk: c_id});
                        },
                        optionLabel:'state',
                        optionValue:'state'
                    }
                ],
                [{label: 'Email', col: 'Email'}],
                [{label: 'Telephone', col: 'Telephone'}]
            ];
            $scope.sideBlocks = [
                {
                    title: 'Billing Address',
                    prop: 'Billing',
                    handler: AddressHandler,
                    indexField: 'AddressId',
                    model: 'address',
                    refField: 'BillingAddressId',
                    edit: addressEditBlock,
                    actions: [
                        {name: 'Save'}
                    ],
                    fields: [
                        {
                            name: 'Full Name',
                            val: function () {
                                return $scope.member.Billing.Field.hasOwnProperty('AddressId') ?
                                $scope.member.Billing.Field.FirstName + ' ' + $scope.member.Billing.Field.LastName : 'None';
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
                    prop: 'Shipping',
                    model: 'address',
                    edit: addressEditBlock,
                    actions: [
                        {name: 'Save'}
                    ],
                    fields: [
                        {
                            name: 'Full Name',
                            val: function () {
                                return $scope.member.Shipping.Field.hasOwnProperty('AddressId') ?
                                $scope.member.Shipping.Field.FirstName + ' ' + $scope.member.Shipping.Field.LastName : 'None';
                            }
                        },
                        {name: 'Organization'},
                        {name: 'Street'},
                        {name: 'Street2'},
                        {name: 'Country'}
                    ]
                },
                {
                    title: 'Payment Information',
                    prop: 'Payment',
                    handler: PaymentHandler,
                    indexField: 'PaymentInformationId',
                    refField: 'PaymentInformationId',
                    model: 'payment',
                    edit: [
                        [
                            {
                                label: 'Card Number',
                                col: 'CreditCardNumber' ,
                                val : function (number) {
                                    return '************' + number.substr(number.length-4)
                                }
                            }
                        ],
                        [
                            {label: 'Expiration Month', col: 'creditCardExpiryMonth', el:'select', options : function () { return $scope.Months }},
                            {label: 'Expiration Year', col: 'creditCardExpiryYear', el:'select', options : function () { return $scope.Years }},
                        ],
                        {el: 'errorBlock', col: 'CreditCardExpirationDate'},
                        //[{label: 'Expiration Date', col: "CreditCardExpirationDate", hidden:true}],
                        [{label: 'Name on card', col: 'CreditCardNameOnCard'}],

                    ],
                    actions: [
                        {
                            name: 'Save'
                        }
                    ],
                    fields: [
                        {
                            name: 'Card',
                            val: function () {
                                if (!$scope.member.Payment.Field.hasOwnProperty('CreditCardNumber')) {
                                    return 'None';
                                }
                                var t = '';
                                switch ($scope.member.Payment.Field.CreditCardNumber.slice(0,1)){
                                    case '3': t = 'AMEX'; break;
                                    case '4': t = 'Visa'; break;
                                    case '5': t = 'MasterCard'; break;
                                    case '6': t = 'Discover'; break;
                                }
                                return t + ' ************' + $scope.member.Payment.Field.CreditCardNumber.substr($scope.member.Payment.Field.CreditCardNumber.length-4);
                            }
                        },
                        {
                            name: 'Date',
                            val: function () {
                                if (!$scope.member.Payment.Field.hasOwnProperty('CreditCardExpirationDate')) {
                                    return '';
                                }
                                var month = $scope.member.Payment.Field.CreditCardExpirationDate.slice(0,2);
                                var year = $scope.member.Payment.Field.CreditCardExpirationDate.slice(2);
                                return month + '/20' + year;
                            }
                        }
                    ]
                }
            ];

            /** adding actions and fields val functions */
            $scope.sideBlocks.forEach(function (block) {

                /** adding val() if needed */
                block.fields.forEach(function (field) {
                    if(!field.hasOwnProperty('val')) {
                        field.val = function () {
                            return $scope.member[block.prop].Field.hasOwnProperty(field.name) ?
                                $scope.member[block.prop].Field[field.name] : ''
                        }
                    }
                });

                /** adding actions */
                block.actions.forEach(function (action) {
                    console.log(action);
                    switch (action.name) {
                        case 'Save':
                            action.action = function (model, form) {
                                console.log('Performing action with', model);
                                if (!$scope.member.Field.hasOwnProperty(block.refField)
                                    || $scope.member.Field[block.refField] == '0'
                                ) {
                                    block.handler.create(model, function (Model, x) {
                                        if (Model) {
                                            $scope.member[block.prop] = Model;
                                            $scope.member.Field[block.refField] = model.Field[block.indexField];
                                            MemberHandler.update($scope.member, function (resp) {
                                                console.log(resp);
                                            });
                                            $scope.member[block.prop].validationErrors=[];
                                            $scope.modalInstance.close();
                                        } else {
                                            $scope.member[block.prop].validationErrors = x.data.validationErrors;
                                        }
                                    });
                                } else {
                                    block.handler.update(model, function (Model, x) {
                                        if (!Model) {
                                            $scope.member[block.prop].validationErrors = x.data.validationErrors;
                                            angular.forEach(x.data.validationErrors, function (errors, field) {
                                                if (form[field])
                                                    form[field].$setValidity('asdf', false);
                                            });
                                            console.log(form);
                                            //console.log(x);
                                        } else {
                                            $scope.member[block.prop].validationErrors=[];
                                            $scope.modalInstance.close();
                                        }
                                    });
                                }
                            };
                            break;
                    }
                });
            });


            $scope.controles = [
                {
                    label: 'Save',
                    action: function (member, infoForm, blocks) {
                        angular.forEach(member.Field, function (val, field) {
                            if (blocks[0].form[field])
                            blocks[0].form[field].$setValidity('', true);
                        });
                        MemberHandler.update(member, function (member, x) {
                            if (!member && x.data.validationErrors) {
                                $scope.member.validationErrors = x.data.validationErrors;
                                angular.forEach(x.data.validationErrors, function (error, field) {
                                    if (blocks[0].form[field])
                                        blocks[0].form[field].$setValidity('asdf', false);
                                })
                            } else {
                                $scope.member.validationErrors = [];
                            }
                        });
                    }
                }
            ];
            /** view data */

            /** modal */
            $scope.open = function (size, model, block, template) {
                var modalInstance = $modal.open({
                    templateUrl: template ? template : 'tpl/blocks/modal_form.html',
                    controller: function ($scope) {
                        console.log('ModalController');
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

            /** Setting Data into Member object */
            ['Field', 'Billing', 'Shipping', 'Payment']
                .forEach(function (field) {
                    if (PageData.data.member.hasOwnProperty(field) && PageData.data.member[field])
                        $scope.member[field] = PageData.data.member[field];
                });

            /** setting Year and Month of Credit Card Expiry */
            var expiryDate = {
                Month : $scope.member.Payment.Field.CreditCardExpirationDate.slice(0,2),
                Year  : '20' + $scope.member.Payment.Field.CreditCardExpirationDate.slice(2)
            };

            $scope.member.Payment.creditCardExpiryMonth = $scope.Months[0];
            $scope.member.Payment.creditCardExpiryYear = $scope.Years[0];

            ['Month', 'Year'].forEach(function (prop) {
                $scope[prop+'s'].forEach(function (val, i) {
                    //debugger;
                    if (val.label == expiryDate[prop]) {
                        $scope.member.Payment['creditCardExpiry'+prop] = $scope[prop+'s'][i];
                    }
                });
            });


            $scope.member.Properties = [];
            /** define member role */
            switch (Helpers.getMemberRole($scope.member.Field)) {
                case 'ProReps':
                    $scope.member.Type = $scope.MemberTypes[2];
                    break;
                case 'Members':
                    $scope.member.Type = $scope.MemberTypes[1];
                    break;
                default :
                    $scope.member.Type = $scope.MemberTypes[0];
            }
        }]
);

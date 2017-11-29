app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }
        return out;
    };
});
angular.module('app').controller(
    'MemberEditController', ['$log', '$scope', '$rootScope', '$http', '$state', '$stateParams', 'Helpers', '$filter',
        'MemberHandler', 'AddressHandler', 'PaymentHandler', 'NoteHandler', '$modal', 'PageData',
        function ($log, $scope, $rootScope, $http, $state, $stateParams, Helpers, $filter, MemberHandler,
                  AddressHandler, PaymentHandler, NoteHandler, $modal, PageData) {

            //console.log('preloaded Page data', PageData);
            $scope.ready = false;
            /** init scope vars */
            $scope.initMember = function () {
                $scope.member.Rank = $scope.MemberRanks[0];
                $scope.member.Type = $scope.MemberTypes[0];
                $scope.member.Field = {};
                $scope.member.Upline = {};
                $scope.member.Sponsor = {};
                $scope.member.Billing = {Field: {}};
                $scope.member.Shipping = {Field: {}};
                $scope.member.Payment = {Field: {}};
                $scope.member.Notes = [];
                $scope.member.Properties = [];
                $scope.member.Upline.selected = undefined;
                $scope.member.Sponsor.selected = undefined;
            };

            $scope.MemberTypes = [
                {label: 'Select One'},
                {label: 'Member'},
                {label: 'Pro Rep'}
            ];

            $scope.MemberRanks = [{label: 'None'}];
            $scope.member = {};
            $scope.initMember();
            $scope.Members = [];

            /** watch Upline and sponsor */
            ['Upline', 'Sponsor'].forEach(function (i) {
                $scope.$watch(function () {
                    return angular.toJson($scope.member[i]);
                }, function (newVal, oldVal, $scope) {
                    //console.log('member' + i + 'changed');
                    var newVal = angular.fromJson(newVal);
                    if (newVal.hasOwnProperty('selected') && newVal.selected.hasOwnProperty('MemberId')
                        && newVal.selected.MemberId != '')
                        $scope.member.Field[i + 'MemberId'] = angular.fromJson(newVal).selected.MemberId;
                });
            });

            /** watch Credits */
            $scope.$watch(function () {
                return $scope.member.Credits
            }, function (newVal, oldVal, $scope) {
                //console.log('Credits scope value changed');
            });

            /** watch Rank */
            $scope.$watch(function () {
                return $scope.member.Rank
            }, function (newVal, oldVal, $scope) {
                //console.log('Rank changed');
                $scope.member.Field.Rank = newVal.rankId;
            });

            /** watch Type */
            $scope.$watch(function () {
                return $scope.member.Type
            }, function (newVal, oldVal, $scope) {
                //console.log(newVal);
                switch (newVal.label) {
                    case 'Member':
                        $scope.member.Field.Type = 'D';
                        $scope.member.Field.SubType = 'M';
                        break;
                    case 'Pro Rep':
                        $scope.member.Field.Type = 'D';
                        $scope.member.Field.SubType = '';
                        break;
                }
            });

            //TODO: this desperately needs to be refactor with foreach
            /** view data */
            $scope.memberEditRows = [
                [
                    {label: 'First name', col: 'FirstName', el: 'input', editable: true},
                    {label: 'Last name', col: 'LastName', el: 'input', editable: true}
                ],
                [
                    {
                        label: 'Member Type',
                        col: 'Type',
                        el: 'select',
                        options: function () {
                            return $scope.MemberTypes
                        },
                        editable: true
                    },
                    {label: 'Id', col: 'MemberId', el: 'input'}
                ],
                [
                    {
                        label: 'Current Rank',
                        col: 'Rank',
                        el: 'select',
                        options: function () {
                            return $scope.MemberRanks
                        },
                        editable: true
                    },
                    {label: 'Tax Id', col: 'TaxId', el: 'input', editable: true}
                ],
                [
                    {label: 'Join Date', col: 'CreateDateTime', el: 'input'},
                    {label: 'Password', col: 'Password', el: 'input'}
                ],
                [
                    {label: 'Backoffice', col: 'BackOfficeAccess', el: 'checkbox'}
                ]
            ];
            $scope.blocks = [
                {
                    title: 'Contact Information',
                    fields: [
                        {label: 'Company', col: 'Company'},
                        {label: 'Email', col: 'Email'},
                        {label: 'Telephone', col: 'Telephone'},
                        {label: 'Replicated Site', col: 'URL'}
                    ]
                },
                {
                    title: 'Placement',
                    fields: [
                        {
                            label: 'Sponsor',
                            col: 'SponsorMemberId',
                            opt: function () {
                                return $scope.member.Sponsor
                            },
                            disabled: true,
                            editable: true, el: 'select',
                            save: function (member, i) {
                                MemberHandler.update(member, function (resp) {
                                    //console.log('Saved');
                                });
                            }
                        },
                        {
                            label: 'Upline',
                            col: 'UplineMemberId',
                            opt: function () {
                                return $scope.member.Upline
                            },
                            disabled: true,
                            editable: true,
                            el: 'select',
                            save: function (member, i) {
                                MemberHandler.update(member, function (resp) {
                                    //console.log('Saved');
                                });
                            }
                        },
                        {
                            label: 'Credits',
                            model: 'Credits',
                            disabled: true,
                            editable: true,
                            edit: function (member) {
                                //console.log('Credit Edit button pressed');
                                $scope.member.Credits_old = $scope.member.Credits;
                            },
                            save: function (member, i) {
                                MemberHandler.update(member, function (resp) {
                                    //console.log('Saved');
                                    $scope.member.Credits = $scope.member.Credits_old * 1 + $scope.member.Credits * 1;
                                });
                            },
                            saveText: 'Update'
                        }
                    ]
                }
            ];
            $scope.Notes = [
                {title: 'Notes'}

            ];
            $scope.sideBlocks = [
                {
                    title: 'Billing Address',
                    prop: 'Billing',
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
                                return $scope.member.hasOwnProperty('Billing') ?
                                $scope.member.Billing.Field.FirstName + ' ' + $scope.member.Billing.Field.LastName : '';
                            }
                        },
                        {
                            name: 'Organization',
                            val: function () {
                                return $scope.member.hasOwnProperty('Billing') ?
                                    $scope.member.Billing.Field.Organization : '';
                            }
                        },
                        {
                            name: 'Street',
                            val: function () {
                                return $scope.member.hasOwnProperty('Billing') ?
                                    $scope.member.Billing.Field.Street : ''
                            }
                        },
                        {
                            name: 'Street2',
                            val: function () {
                                return $scope.member.hasOwnProperty('Billing') ?
                                    $scope.member.Billing.Field.Street2 : ''
                            }
                        },
                        {
                            name: 'Country',
                            val: function () {
                                return $scope.member.hasOwnProperty('Billing') ?
                                    $scope.member.Billing.Field.Country : ''
                            }
                        }
                    ]
                },
                {
                    title: 'Shipping Address',
                    handler: AddressHandler,
                    indexField: 'AddressId',
                    refField: 'ShippingAddressId',
                    prop: 'Shipping',
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
                                return $scope.hasOwnProperty('member') && $scope.member.hasOwnProperty('Shipping') ?
                                $scope.member.Shipping.Field.FirstName + ' ' + $scope.member.Shipping.Field.LastName : '';
                            }
                        },
                        {
                            name: 'Organization',
                            val: function () {
                                return $scope.member.hasOwnProperty('Shipping') ?
                                    $scope.member.Shipping.Field.Organization : '';
                            }
                        },
                        {
                            name: 'Street',
                            val: function () {
                                return $scope.member.hasOwnProperty('Shipping') ?
                                    $scope.member.Shipping.Field.Street : ''
                            }
                        },
                        {
                            name: 'Street2',
                            val: function () {
                                return $scope.member.hasOwnProperty('Shipping') ?
                                    $scope.member.Shipping.Field.Street2 : ''
                            }
                        },
                        {
                            name: 'Country',
                            val: function () {
                                return $scope.member.hasOwnProperty('Shipping') ?
                                    $scope.member.Shipping.Field.Country : ''
                            }
                        }

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
                        [{label: 'Card Number', col: 'CreditCardNumber'}],
                        [{label: 'Expiration Date', col: "CreditCardExpirationDate"}],
                        [{label: 'Name on card', col: 'CreditCardNameOnCard'}]
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
                                return $scope.member.hasOwnProperty('Payment') ?
                                    $scope.member.Payment.Field.CreditCardNumber : ''
                            }
                        },
                        {
                            name: 'Date',
                            val: function () {
                                return $scope.member.hasOwnProperty('Payment') ?
                                    $scope.member.Payment.Field.CreditCardExpirationDate : ''
                            }
                        }
                    ]
                }
            ];

            // adding actions
            $scope.sideBlocks.forEach(function (block) {
                block.actions.forEach(function (action) {
                    //console.log(action);
                    action.action = function (model) {
                        //console.log('Performing action with', model);
                        $scope.modalInstance.close();
                        if (!$scope.member.Field.hasOwnProperty(block.refField)
                            || $scope.member.Field[block.refField] == '0'
                        ) {
                            block.handler.create(model, function (model) {
                                $scope.member[block.prop] = model;
                                $scope.member.Field[block.refField] = model.Field[block.indexField];
                                MemberHandler.update($scope.member, function (resp) {
                                    //console.log(resp);
                                })
                            });
                        } else {
                            block.handler.update(model, function (resp) {
                                //console.log(resp);
                            });
                        }
                    }
                });
            });

            $scope.notesModal = {
                title: 'New note',
                edit: [
                    [{label: 'Visible to Pro Rep', col: 'display', el: 'checkbox'}],
                    [{label: 'Message', col: 'message', el: 'textarea'}]
                ],
                actions: [
                    {
                        name: 'Save',
                        action: function (model) {
                            model.Field.member_id = $scope.member.Field.MemberId;
                            ////console.log(model);
                            NoteHandler.create(model, function (note) {
                                $scope.member.Notes[$scope.member.Notes.length] = note;
                                $scope.modalInstance.close();
                            });
                        }
                    }
                ]
            };
            $scope.PropertiesBlock = {
                title: 'Edit Properties',
                model: 'member.Properties',
                edit: []
            };
            $scope.controles = [
                {
                    label: 'Save',
                    action: function (member) {
                        ////console.log('save triggered', member);
                        MemberHandler.update(member, function (resp) {
                            ////console.log('updated');
                        });
                    }
                },
                {
                    label: 'Cancel',
                    action: function () {
                        $state.go('app.admin.members.index');
                    }

                },
                {
                    label: 'Properties',
                    action: function () {
                        $scope.open('xl', $scope.member, $scope.PropertiesBlock, 'tpl/administrators/properties_form.html');
                    }
                },
                {separator: true},

                {
                    label: 'Backoffice',
                    disabled: function () {
                        return $state.get('app.' + angular.lowercase(Helpers.getMemberRole($scope.member.Field)) + '.main') == null
                    },
                    action: function () {
                        var memberRole = Helpers.getMemberRole($scope.member.Field);
                        var stateName = 'app.' + angular.lowercase(memberRole) + '.main';
                        if ($state.get(stateName)) {
                            $rootScope.showMenu(memberRole);
                            $rootScope.targetMemberId = $scope.member.Field.MemberId;
                            $state.go(stateName);
                        }
                    }
                },
                {
                    label: 'Pioneer',
                    action: function () {
                        $modal.open({
                            template: '<div class="modal-body wrapper-lg ng-scope">{{member.Payoneer.Status}}</div>',
                            controller: ['$scope', function ($modalScope) {
                                //console.log($modalScope);
                                $modalScope.member = $scope.member;

                            }],
                            size: 'xl'
                        })
                    }
                }
            ];
            /** view data */

            /** modal */
            $scope.open = function (size, model, block, template) {
                var modalInstance = $modal.open({
                    templateUrl: template ? template : 'tpl/administrators/modal_form.html',
                    //controller: 'AddressEditController',
                    controller: function ($scope, AddressHandler) {
                        //console.log('ModalController');
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

            $scope.deleteNote = function (note) {
                //  //console.log('Removing Note', note);
                NoteHandler.delete(note.Field.id, function (resp) {
                    //  //console.log(resp);
                    $scope.member.Notes.forEach(function (n, i) {
                        if (n.Field.id == note.Field.id) {
                            $scope.member.Notes.splice(i, 1);
                        }
                    })
                })
            };

            /** Member refresh */
            $scope.refreshMembers = function (search) {
                $scope.Members = [];
                if (search == '') {
                    return 0;
                }
                for (var i = 0; i < 50; i++) {
                    if (
                        (angular.lowercase($scope.Members_[i].FullName).indexOf(angular.lowercase(search)) > -1
                        ||
                        angular.lowercase($scope.Members_[i].MemberId).indexOf(angular.lowercase(search)) > -1)
                    ) {
                        $scope.Members[$scope.Members.length] = $scope.Members_[i];
                    }
                }
            };

            $rootScope.backToAdminArea = function () {
                $rootScope.targetMemberId = false;
                $rootScope.showMenu('Administrators');
                $state.go('app.admin.main');
            };


            var resp = PageData;
                    //console.log(resp);
            ['Field', 'Billing', 'Shipping', 'Payment', 'Sponsor', 'Upline', 'Credits', 'Notes', 'PropertiesGroups', 'Payoneer']
                        .forEach(function (field) {
                            if (resp.data.member.hasOwnProperty(field) && resp.data.member[field])
                                $scope.member[field] = resp.data.member[field];
                        });

                    var propBlock = [];
                    $scope.member.Properties = [];

                    angular.forEach(resp.data.member.PropertiesGroups, function (group) {
                        //  //console.log(group);
                        propBlock[propBlock.length] = [{head: group.Field.Name}];
                        angular.forEach(group.Properties, function (prop) {

                            $scope.member.Properties[$scope.member.Properties.length] = {
                                Field: {
                                    PropertyId: prop.Field.PropertyId,
                                    Value: prop.Val == '1' ? 1 : 0
                                }
                            };
                            propBlock[propBlock.length - 1][propBlock[propBlock.length - 1].length] = {
                                label: prop.Field.Name,
                                el: 'checkbox',
                                col: $scope.member.Properties.length - 1
                            }
                        });
                    });
                    $scope.PropertiesBlock.edit = propBlock;

                    var ranks = [{label: 'None'}];
                    angular.forEach(resp.data.Ranks, function (rank) {
                        var newRank = {label: rank.Name, rankId: rank.RankId};
                        ranks[ranks.length] = newRank;
                        if ($scope.member.Field.Rank === rank.RankId) {
                            $scope.member.Rank = newRank;
                        }
                    });
                    $scope.MemberRanks = ranks;

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
                    if ($scope.member.Field.Rank === '0') {
                        $scope.member.Rank = $scope.MemberRanks[0];
                    }

                    /** find credits */
                    var credits = parseFloat($scope.member.Credits);
                    $scope.member.Credits = (credits > 0 ? credits : 0);
                    $scope.Members_ = resp.data.members;

                    /** find upline and sponsor */
                    for (var i = 0; i < $scope.Members_.length; i++) {
                        ['Upline', 'Sponsor'].forEach(function (id) {
                            if ($scope.Members_[i].MemberId == $scope.member.Field[id + 'MemberId']) {
                                $scope.Members = [];
                                $scope.Members[$scope.Members.length] = $scope.Members_[i];
                                $scope.member[id].selected = $scope.Members_[i];
                            }
                        })
                    }

        }]
);

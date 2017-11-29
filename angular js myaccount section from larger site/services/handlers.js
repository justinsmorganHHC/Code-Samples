angular.module('app').factory('ApiCall', ['$http', '$rootScope', function ($http, $rootScope) {
    return {
        call: function (props) {
            var token = $rootScope.hasOwnProperty('member') ? $rootScope.member.token : false;
            props.params.token = token;
            return $http.post(props.url, props.params);
        }
    }
}]);
 
[
    {
        serviceName:'AddressHandler',
        model:'address',
        indexField:'AddressId',
        methods:[
            {name:'create'},
            {name:'update'}
        ]
    },
    {
        serviceName:'NoteHandler',
        model:'note',
        ajaxUrl:'notes',
        indexField:'id',
        methods:[
            {name:'create'},
            {name:'update'},
            {name:'delete'},
            {name:'get', noToaster: true},
            {name:'usernote', noToaster: true}
        ]

    },
    {
        serviceName:'PaymentHandler',
        model:'payment',
        indexField:'PaymentInformationId',
        methods:[
            {name:'create'},
            {name:'update'}
        ]
    },
    {
        serviceName:'MemberHandler',
        model:'member',
        indexField:'MemberId',
        methods:[
            {name:'create'},
            {name:'update'},
            {name:'remove'}
        ]
    },
    {
        serviceName: 'OrderHandler',
        model: 'order',
        indexField: 'OrderId',
        methods: [
            {name: 'create'},
            {name: 'update'},
            {name: 'remove'},
            {name: 'get', noToaster: true}
        ]
    },
    {
        serviceName:'OrderPayment',
        model:'order_payment',
        ajaxUrl:'api_order_payment',
        indexField: 'PaymentId',
        methods: [
            {name: 'create'},
            {name: 'update'},
            {name: 'remove'},
            {name: 'get', noToaster: true},
            {
                name:'process'
            }
        ]
    },
    {
        serviceName: 'OrderTaxation',
        model: 'order_taxation',
        ajaxUrl: 'api_order_taxation',
     //   indexField: 'PaymentId',
        methods: [
            {name: 'calculateTaxation', noToaster: true},
        ]
    },
    {
        serviceName: 'OrderUtilities',
        model: 'order_utilities',
        ajaxUrl: 'api_order_utilities',
       // indexField: 'PaymentId',
        methods: [
            {name: 'getCountries', noToaster: true},
            {name: 'getStates', noToaster: true},
        ]
    },
    {
        serviceName: 'FeedbackHandler',
        model: 'feedback',
        ajaxUrl: 'api_feedback',
        methods: [
            {name: 'send', noToaster: true},
        ]
    }
]
    .forEach(function (handler) {
    angular.module('app').factory(handler.serviceName, ['$http', '$rootScope', 'ApiCall', function ($http, $rootScope, ApiCall) {
        var obj = {};
        handler.methods.forEach(function (method) {
            if (method.hasOwnProperty('func') ) {
                switch (typeof method.func) {
                    case 'function':
                        obj[method.name] = method.func;
                        break;
                }

            } else {

                obj[method.name] = function (data, callback) {
                    var token = $rootScope.hasOwnProperty('member') ? $rootScope.member.token : false;
                    var params = {token: token};

                    switch (method.name) {
                        case 'update':
                        case 'create':
                            params[handler.model] = data;
                            break;
                        case 'delete':
                        case 'remove':
                            params[handler.indexField] = data;
                            break;
                        case 'get':
                            params.search = data;
                            break;
                        default:
                            params.data = data;
                    }

                    var model = handler.ajaxUrl ? handler.ajaxUrl : handler.model;
                    $http.post('/api/' + model + '/' + method.name, params)
                        .then(
                        function (resp) {

                            if (typeof callback == 'function') {
                                switch (method.name) {
                                    case 'update':
                                    case 'create':
                                        callback(resp.data[handler.model]);
                                        break;
                                    case 'delete':
                                    case 'remove':
                                        break;
                                    case 'get':
                                        callback(resp.data);
                                        break;
                                    default:
                                        callback(resp);
                                }
                            }
                            if (!method.hasOwnProperty('noToaster')) {
                                $rootScope.toaster.text = handler.model + ' ' + method.name + ' was successful';
                                $rootScope.toaster.title = 'System Message';
                                $rootScope.toaster.type = 'success';
                                $rootScope.pop();
                            }

                        },
                        function (x) {
                            //console.log(x);
                            debugger
                            if (x.data.hasOwnProperty('Message')) {
                                $rootScope.toaster.text = x.data.Message;
                            } else {
                                $rootScope.toaster.text = handler.model + ' ' + method.name + 'was unsuccessful';
                            }
                            $rootScope.toaster.title = 'System Message';
                            $rootScope.toaster.type = 'error';
                            $rootScope.pop();

                            if (typeof callback == 'function') {
                                callback(false, x);
                            }

                        }
                    );
                }
            }
        });
        return obj;
    }])
});

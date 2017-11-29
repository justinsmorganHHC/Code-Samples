
app.controller('AdminOrderController',
    ['Helpers', 'MemberHandler', '$rootScope', '$scope', 'OrderHandler', '$state', '$filter', function (Helpers, MemberHandler, $rootScope, $scope, OrderHandler, $state, $filter) {
        var columns = [
            {name: 'Number', property: 'Number'},
            {name: 'Date', property: 'Date'},
            {name: 'Status', property: function (i) {
                return quickFilters.StatusFilter[i.Status];
            }},
            {name: 'Billing Name', property: 'BillingName'},
            {name: 'Total'       , property: function (i) {return $filter('currency')(i.Total);}}
        ];
        var filters = [
            {
                name: 'Types',
                column:'Status',
                options: [
                    {id: '', label: 'All'},
                    {id: 'C', label: 'Cancelled'},
                    {id: 'E', label: 'Entered'},
                    {id: 'F', label: 'Fulfillment Sent'},
                    {id: 'W', label: 'Fulfillment Wait'},
                    {id: 'H', label: 'Holding'},
                    {id: 'P', label: 'Processed'},
                    {id: 'S', label: 'Shipped'},
                ]
            }
        ];

        var quickFilters = [];
        filters.forEach(function (filter) {
            quickFilters[filter.column+'Filter']=[];
            filter.options.forEach(function (opt) {
                quickFilters[filter.column+'Filter'][opt.id]=opt.label;
            })
        });

        var itemsPerPage = [
            {id: 10, label: "10"},
            {id: 20, label: "20"},
            {id: 50, label: "50"},
            {id: 100, label: "100"}
        ];
        var bulkActions = [
            {
                label: 'some other action'
            }
        ];
        var actions = [
            {
                name: 'Add Item'
            },
            {
                name: 'Export'
            }
        ];
        $scope.tableSettings = {
            handler: OrderHandler,
            apiModel: 'order',
            itemStatePath: 'app.admin.orders.edit',
            linkColumn: 'Number',
            indexField: 'OrderId',
            columns: columns,
            filters: filters,
            itemsPerPage: itemsPerPage,
            bulkActions: bulkActions,
            actions: actions
        }
    }]);

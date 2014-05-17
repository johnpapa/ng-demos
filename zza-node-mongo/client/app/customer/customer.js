/*
 * customer viewmodel associated with the customer.html view
 * and its customer.*.html sub-view templates
 */
(function(angular) {
    'use strict';

    // Customer controller state that survives the controller's routine creation and destruction.
    // Saves a network trip when simply toggling among the views.
    // - customerFilterText: the most recent filtering search text
    // - selectedCustomerId: the id of the most recently selected customer
    // - orderHeaders:       a "headers" projection of the orders of the selectedCustomer
    angular.module( "app" ).value( 'customer.state', {});

    // Customer controller
    angular.module( "app" ).controller( 'customer',
        ['customer.state', 'dataservice', controller] );

    function controller(customerState, dataservice) {

        var vm  = this;
        vm.customerFilterText = customerState.customerFilterText || '';
        vm.customers = [];
        vm.filteredCustomers = filteredCustomers;
        vm.isLoadingCustomers = false;
        vm.isLoadingOrders = false;
        vm.isSelected =isSelected;
        vm.orderHeaders = orderHeaders;
        vm.select = select;
        vm.selectedCustomer = null;
        /////////////////////
        dataservice.ready().then(getCustomers);

        // filter for customers with first or last name starting with filter text
        function filteredCustomers(){
            var text = vm.customerFilterText.toLowerCase();
            customerState.customerFilterText = text;
            return text === '' ?
                vm.customers :
                vm.customers.filter(function (c){
                    return c.firstName.toLowerCase().indexOf(text) == 0 ||
                           c.lastName.toLowerCase().indexOf(text) == 0 ;
                })
        }

        function getCustomers() {
            vm.isLoadingCustomers = true;
            dataservice.getCustomers()
                .then(gotCustomers)
                .finally(function(){ vm.isLoadingCustomers = false;});

            function gotCustomers(customers){
                vm.customers = customers;
                var id = customerState.selectedCustomerId;
                if (id){
                    var customer = customers.filter(function(c){ return c.id === id })[0];
                    select(customer);
                }
            }
        }

        function getCustomerOrderHeaders(customer){
            vm.isLoadingOrders = true;
            customerState.orderHeaders = null;
            dataservice.getOrderHeadersForCustomer(customer)
                .then(function(orderHeaders){ customerState.orderHeaders = orderHeaders;})
                .finally(function(){ vm.isLoadingOrders = false;});
        }

        function isSelected(customer){
            return vm.selectedCustomer === customer;
        }

        function orderHeaders(){
            return customerState.orderHeaders || [];
        }

        // Keep 'vm.selectedCustomerId' in a 'customerState' ngValue object
        // where it survives creation and destruction of this controller
        function select(customer){
            if (vm.selectedCustomer === customer ) {return;}  // no change
            vm.selectedCustomer = customer;
            var id = customer && customer.id;
            if (id && id !== customerState.selectedCustomerId){
                // customer changed, get its orderHeaders and update customerState
                customerState.selectedCustomerId = id;
                getCustomerOrderHeaders(customer);
            }
        }
    }

}( this.angular ));
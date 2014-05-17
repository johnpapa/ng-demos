/*
 * Query and save remote data with the Breeze EntityManager
 * Also exposes the 'lookups' service which it initializes
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).factory( 'dataservice',
        ['breeze', 'entityManagerFactory', 'lookups', 'model', 'util', factory]);

    function factory( breeze, entityManagerFactory, lookups, model, util ) {

        var logger   = util.logger,
            isReady  = null,// becomes a promise, not a boolean
            manager  = entityManagerFactory.getManager(),
            $timeout = util.$timeout;

        var service = {
            cartOrder: null,
            draftOrder: null,
            getCustomers: getCustomers,
            getOrderHeadersForCustomer: getOrderHeadersForCustomer,
            lookups: lookups,
            ready: ready,
            saveChanges: saveChanges
        };
        return service;
        /////////////////////
        function ready() {
            return isReady || (isReady = initialize());
        }

        function initialize() {
            return lookups.ready(createDraftAndCartOrders);
        }

        function createDraftAndCartOrders() {
            // Can't call until OrderStatus is available (from lookups)
            var orderInit = { orderStatus: lookups.OrderStatus.Pending};
            service.cartOrder = model.Order.create(manager, orderInit);
            service.draftOrder = model.Order.create(manager, orderInit);
        }

        function getCustomers(){
            var customers =  manager.getEntities('Customer');
            return customers.length ?
                util.$q.when(customers) :

                breeze.EntityQuery.from('Customers')
                    .orderBy('firstName, lastName')
                    .using(manager).execute()
                    .then(function(data){return data.results;})
                    .catch(queryFailed);

        }

        function getOrderHeadersForCustomer(customer){
            var query = breeze.EntityQuery.from('Orders')
                .where('customerId', 'eq', customer.id)
                .orderBy('ordered desc')
                .select('id, statusId, status, ordered, delivered, deliveryCharge, itemsTotal');

            return manager.executeQuery(query)
                .then(function(data){return data.results;})
                .catch(queryFailed);
        }

        function queryFailed(error){
            error = util.filterHttpError(error);
            var resourceName = (error.query && error.query.resourceName) || '';
            logger.error(error.message, resourceName+" query failed");
            throw error; // so downstream fail handlers hear it too
        }

        function saveChanges() {
            return manager.saveChanges()
                         .then(saveSucceeded)
                         .catch(saveFailed);

            function saveSucceeded(saveResult) {
                logger.success("# of entities saved = " + saveResult.entities.length);
                logger.log(saveResult);
            }

            function saveFailed(error) {
                error = util.filterHttpError(error);
                var msg = 'Save failed: ' + util.getSaveErrorMessages(error);
                error.message = msg;

                logger.error(error, msg);
                // DEMO ONLY: discard all pending changes
                // Let them see the error for a second before rejecting changes
                $timeout(function() {
                    manager.rejectChanges();
                }, 1000);
                throw error; // so caller can see it
            }
        }

    }

}( this.angular ));

/*
 * orderItem viewmodel associated with orderItem.html view
 * and its orderItem**.html sub-views.
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).controller( 'orderItem',
        ['$state', '$stateParams', 'dataservice', 'orderItemOptionTypeVm', 'util', controller] );

    function controller($state, $stateParams, dataservice, orderItemOptionTypeVm, util ) {
        var vm = this;
        dataservice.ready().then(onReady);

        function onReady() {
            var cartOrder    = dataservice.cartOrder;
            var draftOrder   = dataservice.draftOrder;
            var lookups      = dataservice.lookups;

            var info         = getOrderItemInfo( );

            if ( info ) {
                var isDraftOrder = info.orderItem.order === dataservice.draftOrder;
                vm.addToCart     = addToCart;
                vm.isDraftOrder  = isDraftOrder;
                vm.orderItem     = info.orderItem;
                vm.product       = info.product;
                vm.sizeVms       = createSizeVms(info);
                vm.typeVms       = orderItemOptionTypeVm.createVms(info.orderItem);

            } else {
                showMenu();
            }
        /////////////////////
            function addToCart() {
                if (vm.isDraftOrder) {
                    draftOrder.removeItem(vm.orderItem);
                    cartOrder.addItem(vm.orderItem);
                    vm.isDraftOrder = isDraftOrder = false;
                    util.logger.info("Added item to cart");

                    showMenu();
                }
            }

            // Get the OrderItem information base on $stateParams
            function getOrderItemInfo( ) {
                var fromOrder   = $stateParams.orderItemId != null;
                return fromOrder ? getInfoFromOrder() : getInfoByProduct();

                // Get the order item info from the order and orderItem id.
                function getInfoFromOrder( ) {
                    var info = null
                      , orderId = $stateParams.orderId
                      , orderItemIid = +$stateParams.orderItemId;

                    // Todo: in future, could be the orderId of any order
                    var orderItem = orderId == 'cart' ?
                        cartOrder.getSelectedItem(orderItemIid) :
                        draftOrder.getSelectedItem(orderItemIid);

                    if (orderItem){
                        info = {
                            orderItem: orderItem,
                            product: orderItem.product,
                            sizes: lookups.productSizes.byProduct(orderItem.product)
                        }
                    }
                    return info;
                }

                // Get the order item info from the productId.
                function getInfoByProduct() {
                    var prodId = +$stateParams.productId;
                    var product = lookups.products.byId(prodId);
                    if (!product){ return null; }

                    var sizes = lookups.productSizes.byProduct(product);

                    // Find an orderItem on the draft order for the given product.
                    var orderItem =  draftOrder.orderItems.filter(function (oi) {
                            return oi.productId == prodId;
                        })[0];

                    if (!orderItem) {
                        // No existing orderItem for this product
                        // Create a new orderItem
                        orderItem = draftOrder.addNewItem(product);
                        orderItem.productSize = sizes[0]; // defaultSize
                    }

                    return {
                        orderItem: orderItem,
                        product: product,
                        sizes: sizes
                    };
                }
            }
        }

        function createSizeVms(info) {
            var isPremium = info.product.isPremium;
            return info.sizes.map(function (size) {
                return {
                    id: size.id,
                    name: size.name,
                    price: isPremium ? (size.premiumPrice ||size.price) : size.price
                };
            });
        }

        function showMenu(){
            $state.go('app.menu', {productType : $stateParams.productType});
    }
   }

}( this.angular ));

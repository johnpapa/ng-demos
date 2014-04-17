/**
 * Order pricing service
 * Calculates how much the ordered pizza, salad, and drinks cost
 *
 * Instead of sending a tentative order to the server for pricing
 * we do it on the client to provide a snappy user experience
 * Of course, for committed saved orders, the pricing SHOULD be performed again
 * on the server as we shouldn't trust a client to handle our money.
 *
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).factory( 'pricing', factory );

    function factory() {
        var pricing = {
            calcOrderItemsTotal: calcOrderItemsTotal,
            calcItemTotalPrice: calcItemTotalPrice,
            calcItemUnitPrice: calcItemUnitPrice,
            calcItemOptionPrice: calcItemOptionPrice,
            calcItemOptionUnitPrice: calcItemOptionUnitPrice,
            orderHasExtraCostOptions: orderHasExtraCostOptions
        };
        return pricing;
        /////////////////////
        /** Both calculates and sets the order.itemsTotal **/
        function calcOrderItemsTotal(order) {
            if (!order) { return 0; }
            try {
                var price = order.orderItems.reduce(function (total, item) {
                    return total + calcItemTotalPrice(item);
                }, 0);
                return order.itemsTotal = roundDollars(price);
            } catch (e) { }
            return order.itemsTotal = 0;
        }

        /** Both calculates and sets the orderItem.totalPrice **/
        function calcItemTotalPrice(item) {
            if (!item) { return 0; }
            try {
                // item unit price + sum of itemOption prices
                var price = calcItemUnitPrice(item);
                price = item.orderItemOptions.reduce(function (total, opt) {
                    return total + calcItemOptionPrice(opt);
                }, price);
                return item.totalPrice = roundDollars(price * item.quantity);
            } catch (e) { }
            return item.totalPrice = 0;
        }

        /** Both calculates and sets the orderItem.unitPrice **/
        function calcItemUnitPrice(item) {
            if (!item) {return 0;}
            try {
                var size = item.productSize;
                var product = item.product;
                if (size && product) {
                    var price = product.isPremium ? (size.premiumPrice || size.price) : size.price;
                    return item.unitPrice = roundDollars(price);
                }
            } catch (e) { }
            return item.unitPrice = 0;
        }

        /** Both calculates and sets the orderItemOption.price **/
        function calcItemOptionPrice(itemOption) {
            if (!itemOption) {return 0;}
            try {
                var price = calcItemOptionUnitPrice(itemOption) * itemOption.quantity || 0;
                return itemOption.price = roundDollars(price);
            } catch (e) { }
            return itemOption.price = 0;
        }

        /** Calculates the orderItemOption.unitPrice (not stored in orderItemOption) **/
        function calcItemOptionUnitPrice(itemOption) {
            try {
                var price = itemOption.orderItem.productSize.toppingPrice *
                    itemOption.productOption.factor;
                return roundDollars(price);
            } catch (e) { }
            return 0;
        }

        /** determine if any option on any order item is an extra cost option **/
        function orderHasExtraCostOptions(order) {
            var maxOptionFactor = 0;
            try {
                order.orderItems.forEach(function(item) {
                    item.orderItemOptions.forEach(function(opt) {
                        maxOptionFactor = Math.max(maxOptionFactor, opt.productOption.factor);
                    });
                });
            } catch(e) { /* let it go */}
            return maxOptionFactor > 1;
        }

        function roundDollars(amt) { return amt ? Math.round(amt * 100) / 100 : 0; }
    }

})(this.angular);

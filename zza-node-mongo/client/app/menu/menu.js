/*
 * menu viewmodel associated with the menu.html view
 * and its menu.*.html sub-view templates
 */
(function(angular) {
    'use strict';

    angular.module( "app" ).controller( 'menu',
        ['$state', '$stateParams', 'dataservice', controller] );

    function controller($state, $stateParams, dataservice ) {
        var vm  = this;
        dataservice.ready().then(onReady);

        function onReady() {
            var type = $stateParams.productType;
            if (type){
                var types = ['drink', 'pizza', 'salad'];
                type = types[types.indexOf(type.toLowerCase())];
            }
            type = type || 'pizza';

            vm.products = dataservice.lookups.products.byTag( type );
            vm.productRef = productRef;
            vm.go = go;
            vm.template = 'app/menu/menu.' + type + '.html';
        }
        /////////////////////
        /*
         * An ng-click callback that uses $state to navigate
         * the link url is not visible in the browser and must
         * style the anchor tag with 'hand' for the cursor to indicate a clickable.
         * See pizza.html for an example of this approach
         */
        function go(product) {
            $state.go('app.order.product', {productType : product.type, productId: product.id});
        }

        // Generates a link that you can see in the browser
        // See drink.html for an example of this approach
        // Link: '#/menu/'+product.type+'/'+product.id;
        function productRef(product) {
            // bind this with href (or data-ng-href to be safe) because it produces a regular href
            return $state.href('app.order.product', {productType : product.type, productId: product.id});

            // bind this version with data-ui-sref because it produces a "state ref"
            // return "app.order.product({productType: '" + product.type + "', productId: '" + product.id +"'})";
        }
    }

}( this.angular ));
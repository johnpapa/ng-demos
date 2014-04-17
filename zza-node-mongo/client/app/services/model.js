/**
 * The application data model describes all of the model classes,
 * the documents (entityTypes) and sub-documents (complexTypes)
 *
 * The metadata (see metadata.js) cover most of the model definition.
 * Here we supplement the model classes with (non-persisted) add/remove methods,
 * property aliases, and sub-document navigation properties that can't be
 * represented (yet) in Breeze metadata.
 *
 * This enrichment takes place once the metadata become available.
 * See `configureMetadataStore()`
 */
(function(angular) {
    'use strict';
    angular.module("app").factory( 'model',
        ['breeze', 'metadata', 'util', factory ]);

    function factory(breeze, metadata, util) {
        var defineProperty = util.defineProperty;
        var model = {
            addToMetadataStore:addToMetadataStore,
            Customer: Customer,
            Order: Order
        };
        return model;
        /////////////////////
        // Model classes
        function Customer() {}
        function Order() {}
            // sub-document of Order
            function OrderItem() { this.quantity = 1; }
                // sub-document of OrderItem
                function OrderItemOption() { this.quantity = 1;}
        function Product() {}
        function ProductOption(){ }

        // Fill metadataStore with metadata, then enrich the types
        // with add/remove methods, property aliases, and sub-document navigation properties
        // that can't be represented (yet) in Breeze metadata.
        // See OrderItem.product for an example of such a "synthetic" navigation property
        function addToMetadataStore(metadataStore) {

            var orderItemType, orderItemOptionType;
            var getEntityById = util.getEntityByIdFromObj;
            var registerType = metadataStore.registerEntityTypeCtor.bind(metadataStore);

            metadata.fillStore(metadataStore);

            registerCustomer();
            registerOrder();
            registerOrderItem();
            registerOrderItemOption();
            registerProduct();
            registerProductOption();

            function registerCustomer() {
                registerType('Customer', Customer);

                defineProperty(Customer, "fullName", function () {
                    return this.firstName + " " + this.lastName;
                });
            }

            function registerOrder() {
                registerType('Order', Order);

                Order.create = create;

                var proto = Order.prototype;
                proto.addNewItem = addNewItem;
                proto.addItem = addItem;
                proto.getSelectedItem = getSelectedItem;
                proto.removeItem = removeItem;

                function create(manager, orderInit) {
                    var init = {
                        id: breeze.DataType.MongoObjectId.getNext(),
                        ordered: new Date(),
                        delivered: new Date()  // projected //todo: add time
                    };
                    breeze.core.extend(init, orderInit);
                    return manager.createEntity('Order', init);
                }

                // create new item and add to existing order
                function addNewItem(product) {
                    var item = orderItemType.createInstance();
                    item.order = this;
                    item.product = product;
                    this.orderItems.push(item);
                    return item;
                }

                // attach existing item to order
                function addItem(item) {
                    item.order = this;
                    var items = this.orderItems;
                    if (items.indexOf(item) == -1) {
                        items.push(item);
                    }
                }

                // the item id is actually an index, expressed in origin 1
                function getSelectedItem(id) { // id == 1 + item's actual index
                    return this.orderItems[id - 1] || null;
                }

                // remove existing item from order
                function removeItem(item) {
                    item.order = null;
                    var ix = this.orderItems.indexOf(item);
                    if (ix > -1) {
                        this.orderItems.splice(ix, 1);
                    }
                }
            }

            function registerOrderItem() {
                registerType('OrderItem', OrderItem);
                orderItemType = metadataStore.getEntityType('OrderItem');

                var proto = OrderItem.prototype;
                proto.addNewOption = addNewOption;
                proto.removeOption = removeOption;
                proto.restoreOption = addOption;

                function addNewOption(productOption) {
                    var option = orderItemOptionType.createInstance();
                    option.orderItem = this;
                    option.productOption = productOption;
                    this.orderItemOptions.push(option);
                    return option;
                }

                function addOption(option) {
                    option.orderItem = this;
                    var options = this.orderItemOptions;
                    if (options.indexOf(option) == -1) {
                        options.push(option);
                    }
                }

                function removeOption(option) {
                    option.orderItem = null;
                    var ix = this.orderItemOptions.indexOf(option);
                    if (ix > -1) {
                        this.orderItemOptions.splice(ix, 1);
                    }
                }

                // OrderItem doesn't have an id; pseudo-id property is position
                defineProperty(OrderItem, "id",function () {
                        var parentOrder = this.complexAspect.parent;
                        // id == 1 + item's index
                        return parentOrder ? 1 + parentOrder.orderItems.indexOf(this) : 0;
                });

                /*** navigation properties ***/
                defineProperty(OrderItem, "product",
                    function () {
                        var id = this.productId;
                        return (id) ? this.product = getEntityById(this, 'Product', id) : null;
                    },
                    function (product) {
                        this.productId = product ? product.id : 0;
                        this.name = product ? product.name : '';
                        this.type = product ? product.type : '';
                    }
                );

                defineProperty(OrderItem, "productSize",
                    function () {
                        var id = this.productSizeId;
                        return (id) ? this.productSize = getEntityById(this, 'ProductSize', id) : null;
                    },
                    function (size) {
                        this.productSizeId = size ? size.id : 0;
                        this.size = size ? size.name : '';
                    }
                );
            }

            function registerOrderItemOption() {
                registerType('OrderItemOption', OrderItemOption);
                orderItemOptionType = metadataStore.getEntityType('OrderItemOption');

                /*** navigation properties ***/
                defineProperty(OrderItemOption, "productOption",
                    function () {
                        var id = this.productOptionId;
                        return (id) ? this.productOption = getEntityById(this, 'ProductOption', id) : null;
                    },
                    function (po) {
                        this.productOptionId = po ? po.id : 0;
                        this.name = po ? po.name : '';
                    });
            }

            function registerProduct() {
                registerType('Product', Product);
                defineProperty(Product, "productSizeIds",
                    function () { // alias
                        return this.sizeIds || [];
                    }
                );
            }

            function registerProductOption() {
                registerType('ProductOption', ProductOption);

                defineProperty(ProductOption,"isPizzaOption",
                    function () {
                        return this.productTypes.indexOf('pizza') > -1;
                    }
                );

                defineProperty(ProductOption,"isSaladOption",
                    function () {
                        return this.productTypes.indexOf('salad') > -1;
                    }
                );
            }
        }
    }

}( this.angular ));

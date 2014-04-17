/************************
 * Test orderItemOptionTypeVm:
 * Creates viewmodels of the orderItemOptionVms for a given OrderItem.
 * See orderItemOptionVm.js
 * There is one OptionType vm for each option type (e.g., 'sauce").
 * Each vm appears as one of the tabs on the orderItem view.
 *******************************/
describe("OrderItemOptionTypeVm: ", function () {

    var lookups, manager, model, optionTypeVm;

    testFns.beforeEachApp('emFactoryMock');

    beforeEach(inject(function(entityManagerFactory, _lookups_, _model_, orderItemOptionTypeVm) {
        lookups = _lookups_;
        lookups.ready();
        manager = entityManagerFactory.getManager();
        model = _model_;
        optionTypeVm = orderItemOptionTypeVm;
    }));

    describe("when create OptionTypeVms for the 'Plain Cheese' pizza", function () {
        var crust, orderItem, product, spice, vms;
        beforeEach(function () {
            var order = createOrder();
            product = lookups.products.byName("Plain Cheese")[0];
            orderItem = order.addNewItem(product);
            vms = optionTypeVm.createVms(orderItem);
            crust = vms[0];
            spice = vms[1];
        });

        it("pizza has two vms", function () {
            expect(vms.length).toEqual(2);
        });
        it("pizza has 'crust' and 'spice' vms in that order", function () {
            expect(crust.type).toEqual('crust');
            expect(spice.type).toEqual('spice');
        });
        it("the 'crust' vm exposes the single choice view", function () {
            expect(crust.choiceTemplate).toMatch(/orderItemOptionOne/i);
        });
        it("the 'spice' vm exposes the multiple choice view", function () {
            expect(spice.choiceTemplate).toMatch(/orderItemOptionMany/i);
        });
        it("the 'spice' vm says all items are free", function () {
            expect(spice.allFree).toBe(true);
            expect(spice.someCostMore).toBe(false);
        });
    });

    describe("when create OptionTypeVms for the 'Chicken Caesar' salad", function () {
        var orderItem, meat, product, saladDressing, vms;
        beforeEach(function () {
            var order = createOrder();
            product = lookups.products.byName("Chicken Caesar Salad")[0];
            orderItem = order.addNewItem(product);
            vms = optionTypeVm.createVms(orderItem);
            meat = vms[2];
            saladDressing = vms[4];
        });

        it("pizza has five vms", function () {
            expect(vms.length).toEqual(5);
        });

        it("the title of the last salad dressing vm is in 'Title' case", function () {
            expect(saladDressing.title).toEqual('Salad Dressing');
        });
        it("salad dressings are not free", function () {
            expect(saladDressing.allFree).toBe(false);
        });
        it("some meat toppings cost more", function () {
            expect(meat.type).toEqual('meat');
            expect(meat.someCostMore).toBe(true);
            expect(meat.allFree).toBe(false);
        });
    });

    /* helpers */
    function createOrder(){
        var pending = lookups.OrderStatus.Pending;
        return model.Order.create(manager, { orderStatus: pending});
    }
});
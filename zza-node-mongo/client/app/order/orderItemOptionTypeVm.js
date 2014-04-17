/************************
 * orderItemOptionTypeVm:
 * Creates viewmodels of the orderItemOptionVms for a given OrderItem.
 * See orderItemOptionVm.
 * There is one such vm for each option type (e.g., 'sauce").
 * Each vm appears as one of the tabs on the orderItem view.
 *******************************/
(function(angular) {
    'use strict';

    angular.module( "app" ).factory( 'orderItemOptionTypeVm',
        ['util', 'orderItemOptionVm', factory] );

    function factory( util, orderItemOptionVm ) {

        var choiceTemplateBase = './app/order/',
            manyChoiceTemplate = choiceTemplateBase+'orderItemOptionMany.html',
            oneChoiceTemplate = choiceTemplateBase+'orderItemOptionOne.html';

        extendOptionTypeVm();

        return {
            createVms: createVms
        };
        /////////////////////
        // Create an orderItemOptionTypeVm for each distinct type of productOption (e.g., spice).
        // Each vm will be displayed in its own tab
        // Each vm contains the orderItemOptionVms for its type of productOption (e.g., all spices).
        function createVms(orderItem) {
            // group the productOptions by type
            var optionVms = orderItemOptionVm.createVms(orderItem);
            var typeGrps = util.groupArray( optionVms,
                function (ovm) { return ovm.productOption.type; }, 'type', 'options');
            var typeVms = typeGrps.map(function (tg) {return new OptionTypeVm(orderItem, tg)});
            return typeVms;
        }


        function extendOptionTypeVm(){
            OptionTypeVm.prototype.selectOneOption  = selectOneOption;
            OptionTypeVm.prototype.selectOption = selectOption;
        }

        // OptionTypeVm is the private ctor name for the orderItemOptionTypeVm viewmodel
        // Each such VM presents all orderItemOptions of a particular option type (e.g., 'sauce")
        // for a given OrderItem. Appears as one of the tabs on the orderItem view.
        // orderItem: the OrderItem associated with this VM
        // typeGroup:
        //    type: the type of productOption (e.g., spice)
        //    options: OptionVms for every productOption of that type
        function OptionTypeVm(orderItem, typeGroup){
            var typeVm = this;
            typeVm.orderItem = orderItem;
            typeVm.type = typeGroup.type;
            typeVm.options = typeGroup.options;
            typeVm.title = util.toTitle(typeVm.type);
            // distribute the options in each tab among 3 columns
            typeVm.columnOptions = util.deal(typeVm.options, 3);
            setOptionTypeVmCostFlags(typeVm);

            // indicates which typeVms allow only one choice
            var oneChoice = typeVm.type == 'crust'; // can only pick one crust
            typeVm.choiceTemplate = oneChoice ? oneChoiceTemplate : manyChoiceTemplate;
            if (oneChoice) {ensureOneOptionSelected(typeVm);}
        }

        function ensureOneOptionSelected(typeVm){
            // Only one choice allowed among options
            // Will display with radio buttons which, unlike checkboxes,
            // must bind to something other than the choices.
            // The `tab.selectedOptionId` is that something.
            // p.s.: can't bind to option itself because of Ng circular-ref failure
            typeVm.selectedOptionId = typeVm.options[0].id; // default selection
            typeVm.options.forEach(function (opt) {
                // override default if any of the options is already selected
                if (opt.selected) typeVm.selectedOptionId = opt.id;});
            typeVm.selectOneOption();
        }

        function setOptionTypeVmCostFlags(typeVm) {
            var maxFactor = 0;
            typeVm.options.forEach(function (o) {
                maxFactor = Math.max(maxFactor, o.productOption.factor);
            });
            typeVm.allFree = maxFactor === 0;
            typeVm.someCostMore = maxFactor > 1;
        }

        function selectOneOption() {
            var optionTypeVm = this;
            var selectedId = parseInt(optionTypeVm.selectedOptionId);
            // reset the selected state for every option in this OptionVm
            optionTypeVm.options.forEach(function (optionVm) {
                optionVm.selected = optionVm.id === selectedId;
                optionTypeVm.selectOption(optionVm);
            });
        }

        function selectOption(optionVm) {
            var orderItem = this.orderItem;
            var itemOption = optionVm.itemOption;

            if (optionVm.selected) {
                if (!itemOption) {// no itemOption; create one
                    optionVm.itemOption = orderItem.addNewOption(optionVm.productOption);
                }
            } else if (itemOption) { // option de-selected; remove it
                orderItem.removeOption(itemOption);
                optionVm.itemOption = null;
            }
        }
    }

}( this.angular ));
(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccWidgetClose', ccWidgetClose);

    /* @ngInject */
    function ccWidgetClose () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(closeEl);

            function closeEl(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    }
})();

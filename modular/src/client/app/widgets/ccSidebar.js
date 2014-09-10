(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccSidebar', ccSidebar);

    /* @ngInject */
    function ccSidebar () {
        // Opens and closes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                whenDoneAnimating: '=?'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);
            var whenDone = (typeof scope.whenDoneAnimating === 'function')? scope.whenDoneAnimating : function(){};

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    $sidebarInner.slideDown(350, whenDone);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350, whenDone);
                }
            }
        }
    }
})();

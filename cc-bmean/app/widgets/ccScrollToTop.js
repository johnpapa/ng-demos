(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccScrollToTop', ['$window', ccScrollToTop]);

    function ccScrollToTop($window) {
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        var directive = {
            link: link,
            template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $win = $($window);
            element.addClass('totop');
            $win.scroll(toggleIcon);

            element.find('a').click(function (e) {
                e.preventDefault();
                // Learning Point: $anchorScroll works, but no animation
                //$anchorScroll();
                $('body').animate({ scrollTop: 0 }, 500);
            });

            function toggleIcon() {
                if ($win.scrollTop() > 300) {
                    element.slideDown();
                } else {
                    element.slideUp();
                }
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccImgPerson', ccImgPerson);

    /* @ngInject */
    function ccImgPerson(config) {
        //Usage:
        //<cc-img-person thumbnail="{{person.imageSource}}"/>
        var basePath = config.imageBasePath;
        var unknownImage = config.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
//                thumbnail: "="
            },
            replace: true,
            template: '<img src="" class="img-thumbnail"/>'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('thumbnail', function(value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }
})();
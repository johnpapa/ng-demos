(function() {
    'use strict';

    angular
        .module('app.bind-to-controller')
        .controller('Music', Music);

    /* @ngInject */
    function Music(logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Music';
        vm.song = 'Counting Stars';
        vm.artist = 'One Republic';

        activate();

        function activate() {
            logger.info('Activated Bind-to-Controller View');
        }
    }
})();
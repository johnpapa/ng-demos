(function () {
    'use strict';

    angular.module('app.widgets', []);

    angular
        .module('app.widgets')
        .factory('testService', function(){
            return {
                ping: function(){ return 'pong'; }
            };
        });

})();
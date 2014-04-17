/*
 * configuration values for the application
 */
(function (){
    'use strict';
    var config = {
        // Ward's Todo Mobile Service
        appUrl: 'https://wardtodomobileservice.azure-mobile.net/',
        appKey: 'psChxvAmcXMcsgEhqqjmfTkoxzwuWG62'  //this is never a secret.
    };

    angular.module('app').value('config', config);
})();


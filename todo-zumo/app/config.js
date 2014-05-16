/*
 * configuration values for the application
 */
(function (){
    'use strict';

    angular.module('app').factory('config',['$q','breeze', configure]);

    function configure($q, breeze){
    	var useZumo = true;
    	return useZumo ? configureForZumo() : configureForWebApi();

    	//////////////////////////////////

	    function configureForZumo(){

		    // Ward's Todo Mobile Service
		    var appUrl = 'https://wardtodomobileservice.azure-mobile.net/',
		        appKey = 'psChxvAmcXMcsgEhqqjmfTkoxzwuWG62';  //this is never a secret.

	        // use Breeze Labs mobile services dataservice adapter to query and save
	        var adapter = breeze.config.initializeAdapterInstance('dataService', 'azure-mobile-services', true);
	        adapter.mobileServicesInfo = {url: appUrl, appKey: appKey};
	        adapter.Q = $q;

		    return {
		    	appTitle: 'Breeze Mobile Services',
		    	hasServerMetadata: false,
		    	serviceType: 'zumo',
		    	serviceName: appUrl + 'tables/',
		    	serverTitle: 'Microsoft Azure'
		    };
	    }

        function configureForWebApi(){
        	breeze.NamingConvention.camelCase.setAsDefault();
		    return {
		    	appTitle: 'Breeze Todos',
		    	hasServerMetadata: true,
		    	serviceType: 'webapi',
		    	serviceName: 'http://localhost:58066/breeze/todos',
		    	serverTitle: 'ASP.NET Web API'
		    };
	    }
    }
})();


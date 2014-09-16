(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {
        /* jshint validthis:true */
        // this.config = {
        //     // These are the properties we need to set
        //     // $stateProvider: undefined
        //     // $urlRouterProvider: undefined
        //     // docTitle: ''
        //     // resolveAlways: {ready: function(){ } }
        // };

        // var $stateProvider;
        // var $urlRouterProvider;
        // var docTitle;
        // var resolveAlways;

        // this.configureRouteHelper = function ($stateProvider, $urlRouterProvider, docTitle, resolveAlways) {
        //     $stateProvider = $stateProvider;
        //     $urlRouterProvider = $urlRouterProvider;
        //     docTitle = docTitle;
        //     resolveAlways = resolveAlways;
        // };

        // this.$get = function() { // $stateProvider, $urlRouterProvider, docTitle, resolveAlways) {
        //     //return new RouteHelper();
        //     return new routehelper($stateProvider, $urlRouterProvider, docTitle, resolveAlways);
        //     // return {
        //     //     $stateProvider: undefined,
        //     //     $urlRouterProvider: undefined,
        //     //     docTitle: undefined,
        //     //     resolveAlways: undefined
        //     // };
        // };

        this.$stateProvider = undefined;
        this.$urlRouterProvider = undefined;
        this.docTitle = undefined;
        this.resolveAlways = undefined;

        this.$get = function () {
            return {
                $stateProvider: this.$stateProvider,
                $urlRouterProvider: this.$urlRouterProvider,
                docTitle: this.docTitle,
                resolveAlways: this.resolveAlways
            };
        };

        // function RouteHelper($stateProvider, $urlRouterProvider, docTitle, resolveAlways) {
        //     this.$stateProvider = $stateProvider;
        //     this.$urlRouterProvider = $urlRouterProvider;
        //     this.docTitle = docTitle;
        //     this.resolveAlways = resolveAlways;
        // }
        // this.$get = function() {
        //     return {
        //         config: this.config
        //     };
        // };
    }

    /* @ngInject */
    function routehelper($location, $rootScope, $state, logger, routehelperConfig) {
        var handlingStateChangeError = false;
        var hasOtherwise = false;
        var stateCounts = {
            errors: 0,
            changes: 0
        };
        var $stateProvider = routehelperConfig.$stateProvider;
        var $urlRouterProvider = routehelperConfig.$urlRouterProvider;

        var service = {
            configureStates: configureStates,
            getStates: getStates,
            stateCounts: stateCounts
        };

        init();

        return service;
        ///////////////

        function configureStates(states, otherwiseState) {
            states.forEach(function(state) {
                state.config.resolve =
                    angular.extend(state.config.resolve || {}, routehelperConfig.resolveAlways);
                $stateProvider.state(state.state, state.config);
            });
            if (otherwiseState && !hasOtherwise) {
                hasOtherwise = true;
                $urlRouterProvider.otherwise(otherwiseState);
            }
        }

    // .state('state1.list', {
    //     url: "/list",
    //     templateUrl: "partials/state1.list.html",
    //     controller: function($scope) {
    //         $scope.items = ["A", "List", "Of", "Items"];
    //     }
    // })

        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$stateChangeError',
                function(event, current, previous, rejection) {
                    if (handlingStateChangeError) {
                        return;
                    }
                    stateCounts.errors++;
                    handlingStateChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current]);
                    $location.path('/');
                }
            );
        }

        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        function getStates() {
            return $state.get();
        }

        function updateDocTitle() {
            $rootScope.$on('$stateChangeSuccess',
                function(event, current, previous) {
                    stateCounts.changes++;
                    handlingStateChangeError = false;
                    var title = routehelperConfig.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
    }
})();

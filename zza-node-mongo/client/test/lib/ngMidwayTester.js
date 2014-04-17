/**
 * FROM:  https://github.com/yearofmoo/ngMidwayTester
 *
 * Creates an instance of the midway tester on the specified module. 
 * 
 * @class ngMidwayTester
 * @constructor
 * @param moduleName the AngularJS module that you wish to test
 * @param {Object} [config]
 * @param {Object} [config.window=window] The window node of the page
 * @param {Object} [config.document=document] The document node of the page
 * @param {Object} [config.templateUrl] The template file for the HTML layout of the tester
 * @param {Object} [config.template] The template string for the HTML layout of the tester
 * @param {Object} [config.mockLocationPaths=true] Whether or not to fake the URL change in the browser address bar
 * @return {Object} An instance of the midway tester
 */
; var ngMidwayTester = function (moduleName, options) {

    options = options || {};
    var doc = options.document || document;
    var wind = options.window || window;
    var noop = angular.noop;

    var mockLocationPaths = options.mockLocationPaths == null ? true : !!options.mockLocationPaths;

    var $rootElement = angular.element(doc.createElement('div')),
        $timers = [],
        $viewContainer,
        $terminalElement,
        $viewCounter = 0;

    var viewSelector = 'ng-view, [ng-view], .ng-view, [x-ng-view], [data-ng-view]';

    var midwayModule = angular.module('ngMidway', []);

    if (mockLocationPaths) {
        midwayModule.config(function ($provide) {
            $provide.decorator('$location', ['$delegate', '$rootScope', function ($delegate, $rootScope) {
                var _path = $delegate.path();
                $delegate.path = function (path) {
                    if (path) {
                        _path = path;
                        $rootScope.$broadcast('$locationChangeSuccess', path);
                        return this;
                    }
                    else {
                        return _path;
                    }
                };
                return $delegate;
            }]);
        });
    }

    if (options.templateUrl) {
        var request = new XMLHttpRequest();
        request.open('GET', options.templateUrl, false);
        request.send(null);

        if (request.status != 200) {
            throw new Error('ngMidwayTester: Unable to download template file');
        }

        options.template = request.responseText;
    }

    if (options.template) {
        $rootElement.html(options.template);
        var view = angular.element($rootElement[0].querySelector(viewSelector));
        $viewContainer = view.parent();
    }
    else {
        $viewContainer = angular.element('<div><div ng-view></div></div>');
        $rootElement.append($viewContainer);
    }

    $terminalElement = angular.element('<div status="{{__view_status}}"></div>');
    $rootElement.append($terminalElement);

    var $injector = angular.bootstrap($rootElement, ['ng', 'ngMidway', moduleName]);
    var $rootModule = angular.module(moduleName);
    angular.element(doc.body).append($rootElement);

    return {
        /**
         * @method module
         * @return {Object} Returns the module container object acquired from angular.module(moduleName)
         */
        module: function () {
            return $rootModule;
        },

        /**
         * Attaches the $rootElement module to the provided body element
         * @param {Element} [body=document.body] The element that will be used as the parent (defaults to document.body)
         * @method attach
         */
        attach: function (body) {
            angular.element(body || doc.body).append($rootElement);
        },

        /**
         * Attaches the $rootElement module to the provided body element
         * @method controller
         * @param {String} name The name of the controller
         * @param {Object} [locals] A key/value map of all the injectable services for when the controller is instantiated
         * @return {Object} The instance of the controller
         */
        controller: function (name, locals) {
            return this.inject('$controller')(name, locals);
        },

        /**
         * @method rootScope
         * @return {Object} The $rootScope object of the module
         */
        rootScope: function () {
            return this.inject('$rootScope');
        },

        /**
         * @method rootElement
         * @return {Object} The $rootElement object of the module
         */
        rootElement: function () {
            return $rootElement;
        },

        /**
         * @method viewElement
         * @return {Element} The current element that has ng-view attached to it
         */
        viewElement: function () {
            return angular.element($viewContainer[0].querySelector(viewSelector));
        },

        /**
         * @method viewElement
         * @return {Object} The scope of the current view element
         */
        viewScope: function () {
            return this.viewElement().scope();
        },

        /**
         * Runs $scope.$evalAsync() on the provided scope
         * @param {function} fn The function to be provided to evalAsync
         * @param {Object} [scope=$rootScope] The scope object which will be used for the eval call
         * @method evalAsync
         */
        evalAsync: function (fn, scope) {
            (scope || this.rootScope()).$evalAsync(fn);
        },

        /**
         * Compiles and links the given HTML
         *
         * @method compile
         * @param {String|Element} html the html or element node which will be compiled
         * @param {Object} [scope=$rootScope] The scope object which will be linked to the compile
         * @return {Element} The element node which which is the result of the compilation
         */
        compile: function (html, scope) {
            return this.inject('$compile')(html)(scope || this.rootScope());
        },

        /**
         * Performs a digest operation on the given scope
         *
         * @method digest
         * @param {Object} [scope=$rootScope] The scope object which will be used for the compilation
         */
        digest: function (scope) {
            (scope || this.rootScope()).$digest();
        },

        /**
         * Performs an apply operation on the given scope
         *
         * @method apply
         * @param {function} fn The callback function which will be used in the apply digest
         * @param {Object} [scope=$rootScope] scope The scope object which the apply process will be run on
         */
        apply: function (fn, scope) {
            scope = scope || this.inject('$rootScope');
            scope.$$phase ? fn() : scope.$apply(fn);
        },

        /*
         * @method inject
         * @param {String} item The name of the service which will be fetched
         * @return {Object} The service fetched from the injection call
         */
        inject: function (item) {
            return $injector.get(item);
        },

        /**
         * @method injector
         * @return {Object} Returns the AngularJS $injector service
         */
        injector: function () {
            return $injector;
        },

        /**
         * @method path
         * @return {String} Returns the path of the current route
         */
        path: function () {
            return this.inject('$location').path();
        },

        /**
         * Changes the current route of the page and then fires the callback when the page has loaded
         *
         * @param {String} path The given path that the current route will be changed to
         * @param {function} [callback] The given callback to fire once the view has been fully loaded
         * @method visit
         */
        visit: function (path, callback) {
            this.rootScope().__view_status = ++$viewCounter;
            this.until(function () {
                return parseInt($terminalElement.attr('status')) >= $viewCounter;
            }, callback || noop);

            var $location = this.inject('$location');
            this.apply(function () {
                $location.path(path);
            });
        },

        /**
         * Keeps checking an expression until it returns a truthy value and then runs the provided callback
         *
         * @param {function} exp The given function to poll
         * @param {function} callback The given callback to fire once the exp function returns a truthy value 
         * @method until
         */
        until: function (exp, callback) {
            var timer, delay = 50;
            timer = setInterval(function () {
                if (exp()) {
                    clearTimeout(timer);
                    callback();
                }
            }, delay);
            $timers.push(timer);
        },

        /**
         * Removes the $rootElement and clears the module from the page
         *
         * @method destroy
         */
        destroy: function () {
            angular.forEach($timers, function (timer) {
                clearTimeout(timer);
            });

            var body = angular.element(document.body);
            body.removeData();
            $rootElement.remove();
            this.rootScope().$destroy();
        }
    };
};
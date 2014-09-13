/* globals inject, sinon, afterEach, $controller, $httpBackend, $location, $q, $rootScope, $route, $routeParams */
var specHelper = specHelper || {};

specHelper.fakeLogger = function($provide) {
    $provide.value('logger', sinon.stub({
        info: function() {},
        error: function() {},
        warning: function() {},
        success: function() {}
    }));
};

specHelper.injectDependencies = function(global) {
    var deps;
    inject(commonDeps);
    if (global) {
        $controller = deps.$controller;
        $httpBackend = deps.$httpBackend;
        $location = deps.$location;
        $q = deps.$q;
        $rootScope = deps.$rootScope;
        $route = deps.$route;
        $routeParams = deps.$routeParams;
    }
    return deps;

    function commonDeps(_$controller_, _$httpBackend_, _$location_, _$q_, _$rootScope_, _$route_, _$routeParams_) {
        deps = {
            $controller: _$controller_,
            $httpBackend: _$httpBackend_,
            $location: _$location_,
            $q: _$q_,
            $rootScope: _$rootScope_,
            $route: _$route_,
            $routeParams: _$routeParams_
        };
    }
};

specHelper.fakeRouteProvider = function($provide) {
    /**
     * Stub out the $routeProvider so we avoid
     * all routing calls, including the default route
     * which runs on every test otherwise.
     * Make sure this goes before the inject in the spec.
     */
    $provide.provider('$route', function() {
        /* jshint validthis:true */
        this.when = sinon.stub();
        this.otherwise = sinon.stub();

        this.$get = function() {
            return {
                // current: {},  // fake before each test as needed
                // routes:  {}  // fake before each test as needed
                // more? You'll know when it fails :-)
            };
        };
    });
};

specHelper.getFnParams = function (fn) {
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var params = [];
    if (fn.length) {
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS);
        angular.forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
                arg.replace(FN_ARG, function(all, underscore, name){
                params.push(name);
            });
        });
    }
    return params;
};

specHelper.getInjectables= function(){
    var annotation,
        body = '',
        cleanupBody = '',
        mustAnnotate = false,
        params;

    if (typeof arguments[0]==='function') {
        params = specHelper.getFnParams(arguments[0]);
    }
    // else from here on assume that arguments are all strings
    else if (angular.isArray(arguments[0])) {
        params = arguments[0];
    }
    else {
        params = Array.prototype.slice.call(arguments);
    }

    annotation = params.join('\',\''); // might need to annotate

    angular.forEach(params, function(name, ix){
        var _name,
            pathName = name.split('.'),
            pathLen = pathName.length;

        if (pathLen > 1){
            // name is a path like 'block.foo'. Can't use as identifier
            // assume last segment should be identifier name, e.g. 'foo'
            name = pathName[pathLen-1];
            mustAnnotate = true;
        }

        _name = '_'+name+'_';
        params[ix] = _name;
        body += name + '=' + _name+';';
        cleanupBody += 'delete window.'+name+';';
    });

    var fn = 'function('+params.join(',')+'){'+body+'}';

    if (mustAnnotate){
        fn = '[\'' + annotation +'\',' + fn + ']';
    }

    var exp = 'inject(' + fn + ');' +
              'afterEach(function(){'+cleanupBody+'});'; // remove from window.

    Function(exp)(); // the assigned vars will be global. `afterEach` will remove them

    // Alternative that would not touch window but would require eval()!!
    // Don't do `Function(exp)()` and don't do afterEach cleanup
    // Instead do ..
    //     return exp;
    //
    // Then caller must say something like:
    //     eval(specHelper.getInjectables('$log', 'foo'));
};


specHelper.getMockAvengers = function() {
    return [
        {
            'id': 1017109,
            'name': 'Black Widow/Natasha Romanoff (MAA)',
            'description': 'Natasha Romanoff, also known as Black Widow, is a world-renowned super spy and one of S.H.I.E.L.D.\'s top agents. Her hand-to-hand combat skills, intelligence, and unpredictability make her a deadly secret weapon. True to her mysterious nature, Black Widow comes and goes as she pleases, but always appears exactly when her particular skills are needed.',
            'thumbnail': {
                'path': 'http://i.annihil.us/u/prod/marvel/i/mg/a/03/523219743a99b',
                'extension': 'jpg'
            }
        },
        {
            'id': 1017105,
            'name': 'Captain America/Steve Rogers (MAA)',
            'description': 'During World War II, Steve Rogers enlisted in the military and was injected with a super-serum that turned him into super-soldier Captain America! He\'s a skilled strategist and even more skilled with his shield, but it\'s his courage and good heart that makes Captain America both a leader and a true hero. ',
            'thumbnail': {
                'path': 'http://i.annihil.us/u/prod/marvel/i/mg/3/10/52321928eaa72',
                'extension': 'jpg'
            }
        },
        {
            'id': 1017108,
            'name': 'Hawkeye/Clint Barton (MAA)',
            'description': 'Hawkeye is an expert archer with an attitude just as on-target as his aim. His stealth combat experience and his ability to hit any target with any projectile make him a valuable member of the Avengers. However, he refuses to let things get too serious, as he has as many jokes as he does arrows!',
            'thumbnail': {
                'path': 'http://i.annihil.us/u/prod/marvel/i/mg/4/03/5232198a81c17',
                'extension': 'jpg'
            }
        },
        {
            'id': 1017104,
            'name': 'Iron Man/Tony Stark (MAA)',
            'description': 'Tony Stark is the genius inventor/billionaire/philanthropist owner of Stark Industries. With his super high-tech Iron Man suit, he is practically indestructible, able to fly, and has a large selection of weapons to choose from - but it\'s Tony\'s quick thinking and ability to adapt and improvise that make him an effective leader of the Avengers.',
            'thumbnail': {
                'path': 'http://i.annihil.us/u/prod/marvel/i/mg/2/d0/5232190d42df2',
                'extension': 'jpg'
            }
        },
        {
            'id': 1017106,
            'name': 'Thor (MAA)',
            'description': 'Thor is the Asgardian Prince of Thunder, the son of Odin, and the realm\'s mightiest warrior. He loves the thrill of battle and is always eager to show off his power to the other Avengers, especially the Hulk. Thor\'s legendary Uru hammer, Mjolnir, gives him the power to control thunder and the ability to fly. He\'s found a new home on Earth and will defend it as his own... even if he doesn\'t understand its sayings and customs.',
            'thumbnail': {
                'path': 'http://i.annihil.us/u/prod/marvel/i/mg/2/03/52321948a51f2',
                'extension': 'jpg'
            }
        }
    ];
};

specHelper.verifyNoOutstandingHttpRequests = function(){
    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));
};
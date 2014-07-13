(function(){
    angular
        .module('app.sample', [])
        .factory('teamservice', teamservice)
        .controller('Team', Team);

    function teamservice () {
        return {
            getData: function () {
                return {title: 'yankees'};
            }
        };
    }

    function Team(teamservice) {
        var vm = this;
        vm.title = 'temp value';
        activate();

        function activate(){
            // Try using this here. We fail the tests
            // because "this" changes its context.
            vm.title = teamservice.getData().title;
        }
    }

})();

describe('Team', function () {

    var scope, scope2,
        controller;

    beforeEach(function () {
        module('app.sample');
    });

    beforeEach(module(function ($provide) {
        $provide.value('teamservice', {
            getData: function() { return {title: 'yankees'}; }
        });
    }));

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('Team as team', {
            '$scope': scope
        });
    }));

    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        scope2 = $rootScope.$new();

        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('Team as team', {
                '$scope': scope2
            });
        };

    }));


    it('should have title of yankees', function () {
        $rootScope.$apply(); // Only needed if we go async and need digest cycle
        expect(scope.team.title).toEqual('yankees');
        expect(controller.title).toEqual('yankees');
    });

    it('should have title of yankees', function() {
        var controller2 = createController();

        $rootScope.$apply();

        expect(scope2.team.title).toEqual('yankees');
        expect(controller2.title).toEqual('yankees');
    });

});
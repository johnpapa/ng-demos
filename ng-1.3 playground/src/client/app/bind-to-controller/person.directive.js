(function() {
    'use strict';

    angular
        .module('app.bind-to-controller')
        .directive('demoPersonProfile', demoPersonProfile);

    /* @ngInject */
    function demoPersonProfile () {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E',
            template: '<div ng-click="vm.toggle()"> \
                        <cc-img-person thumbnail="{{vm.thumbnail}}" class="side-by-side"></cc-img-person> \
                        <div class="side-by-side"> \
                        <h4>{{vm.firstName}} {{vm.lastName}}</h4> \
                        <p ng-show="vm.showDetails">{{vm.city}}, {{vm.state}} {{vm.postalCode}}</p> \
                        <span class="label label-info">{{vm.pets}} pets</span> \
                        </div></div>',
            controller: PersonProfile,
            controllerAs: 'vm',
			scope: {
				firstName: '@',
				lastName: '@',
				city: '@',
				state: '@',
				postalCode: '@zip',
                thumbnail: '@thumbnail'
			},
			bindToController: true
		};

        function link(scope, element, attrs, controller) { 
        	// scope is mp, don't need link for that, can use controller
        	// element is the element
        	// attrs are the attrs
        	// controller is the controller :)
			// Point is that we only seem to need link if we need element or attribute access
			// If I realy want attrs access I should list in isolateScope above in the DDO
        	var x = scope;
        }

        /* @ngInject */
        function PersonProfile() {
        	var vm = this;
        	vm.foo = 'test';
            vm.showDetails = false;
        	vm.fullName = vm.firstName + ' ' + vm.lastName;
        	vm.address = vm.city + ', ' + vm.state + ' ' + vm.postalCode;
        }

		PersonProfile.prototype.toggle = function() {
            this.showDetails = !this.showDetails
			console.log('Selected "' + this.fullName + ' of ' + this.address);
		}

        return directive;    
    }
})();
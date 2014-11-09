(function() {
    'use strict';

    angular
        .module('app.widgets')
        .directive('ccNote', ccNote);

    /* @ngInject */
    function ccNote () {
        // Usage:
        // 
        // Creates:
        //
        var directive = {
            restrict: 'EA',
            controller: Note,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
            	message: '=',
            	dismissible: '='
            },
            template: '<div ng-show="vm.show" class="padded"><div class="alert alert-info alert-dismissible" role="alert"> \
                            <button type="button" class="close" data-dismiss="alert" ng-if="vm.dismissible"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> \
                            <strong>Note:</strong> {{::vm.message}} \
                        </div></div>'

        };

        /* @ngInject */
        function Note() {
        	var vm = this;
        	vm.show = !!vm.message;
        }

        return directive;
    }
})();
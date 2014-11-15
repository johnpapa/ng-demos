(function() {
    'use strict';

    angular
        .module('app.bind-to-controller')
        .directive('funMusicPlayer', funMusicPlayer);

    /* @ngInject */
    function funMusicPlayer() {
        // Usage:
        // <fun-music-player track="vm.song" artist="{{::vm.artist}}"></fun-music-player>
        // Creates:
        //
        var directive = {
            controller: MusicPlayer,
            controllerAs: 'mp',
            link: link,
            restrict: 'E',
			scope: {
				artist: '@',
				song: '=track'
			},
			bindToController: true,
			template:
				'<button class="btn btn-xlarge btn-primary" ng-click="mp.playTrack()"> ' +
				'<i class="fa fa-music black"></i> {{mp.song}}&nbsp; ' +
				'<i class="fa fa-play black"></i> {{mp.artist}} ' +
				'<i class="fa fa-group black"></i> {{mp.foo}}</button>'
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
        function MusicPlayer() {
            var vm = this;
            vm.foo = 'test';
       //  	vm.playTrack = playTrack;

       //  	function playTrack() {
       //  		// this no work
			    // console.log('Now playing "' + vm.song + ' by ' + vm.artist + '"...');
       //  	}
        }

        MusicPlayer.prototype.playTrack = function() {
            console.log('Now playing "' + this.song + ' by ' + this.artist + '"...');
            // console.log('ward = ' + this.ward);
            // console.log('john = ' + this.john);
        };

        return directive;
    }
})();
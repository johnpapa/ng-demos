(function () {
    'use strict';

    var controllerId = 'login';

    angular.module('app')
        .controller(controllerId, ['$http', '$window', login]);

    function login($http, $window) {
        var vm = this;

        vm.activate = activate;
        vm.isAuthenticated = false;
        vm.callRestricted = callRestricted;
        vm.logout = logout;
        vm.message = '';
        vm.submit = submit;
        vm.user = {username: 'john.papa', password: 'secret'};
        vm.welcome = '';

        activate();

        function activate() {
        }

        function submit() {
            $http
                .post('/authenticate', vm.user)
                .success(function (data, status, headers, config) {
                    $window.sessionStorage.token = data.token;
                    vm.isAuthenticated = true;
                    var encodedProfile = data.token.split('.')[1];
                    var profile = JSON.parse(url_base64_decode(encodedProfile));
                    vm.welcome = 'Welcome ' + profile.firstName + ' ' + profile.lastName;
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;
                    vm.isAuthenticated = false;

                    // Handle login errors here
                    vm.error = 'Error: Invalid user or password';
                    vm.welcome = '';
                });
        }

        function logout() {
            vm.welcome = '';
            vm.message = '';
            vm.isAuthenticated = false;
            delete $window.sessionStorage.token;
        };

        function callRestricted () {
            $http({url: '/api/restricted', method: 'GET'})
                .success(function (data, status, headers, config) {
                    vm.message = vm.message + ' ' + data.name; // Should log 'foo'
                })
                .error(function (data, status, headers, config) {
                    alert(data);
                });
        }

        //this is used to parse the profile
        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
        }
    }
})();
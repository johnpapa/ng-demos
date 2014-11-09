(function () {
    'use strict';

    angular
        .module('app.bind-once')
        .controller('Q', Q);

    /* @ngInject */
    function Q($q, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.customers = [];
        vm.find = find;
        vm.msg = '$q constructor with ES6-style promises';
        vm.response = '';
        vm.title = 'Q';

        activate();

        function activate() {
            return getCustomers().then(function() {
                logger.info('Activated Q View');
            });
        }

        function find(name) {
            asyncFindName(name)
                .then(resolved, rejected);

            function resolved(response) {
                vm.response = 'Success: ' + response;
            }

            function rejected(response) {
                vm.response = 'Failed: ' + response;
            }
        }

        function getCustomers() {
            return dataservice.getCustomers().then(function (data) {
                vm.customers = data;
                vm.customers.push({firstName: 'Aint', lastName: 'Toobeefound'});
                return vm.customers;
            });
        }

        function asyncFindName(name) {
            // perform some asynchronous operation, resolve or reject the promise when appropriate.
            return $q(function(resolve, reject) {
                dataservice.getCustomers().then(function (data) {
                    var match = data.filter(function(item) {
                        return item.firstName === name;
                    });
                    if (match.length) {
                        resolve('Found ' + name + '!');
                    } else {
                        reject(name + ' not found.');
                    }
                });
            });
        }
    }
})();
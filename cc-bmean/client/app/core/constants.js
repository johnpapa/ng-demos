/* global toastr:false, moment:false */
(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('moment', moment)
        .constant('toastr', toastr);
})();

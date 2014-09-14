/*
 *  Phantom.js does not support Function.prototype.bind (at least not before v.2.0
 *  That's just crazy. Everybody supports bind.
 *  Read about it here: https://groups.google.com/forum/#!msg/phantomjs/r0hPOmnCUpc/uxusqsl2LNoJ
 *  This polyfill is copied directly from MDN
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 */
if (!Function.prototype.bind) {
    /*jshint freeze: false */
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            FuncNoOp = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof FuncNoOp && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        FuncNoOp.prototype = this.prototype;
        fBound.prototype = new FuncNoOp();

        return fBound;
    };
}

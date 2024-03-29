(function() {
    // Object.create polyfill
    if (typeof Object.create != 'function') {
        Object.create = (function() {
            // To save on memory, use a shared constructor
            function Temp() {
            }

            return function(O) {
                if (typeof O != 'object') {
                    throw TypeError('Object prototype may only be an Object or null');
                }

                Temp.prototype = O;
                var obj = new Temp();
                Temp.prototype = null;

                return obj;
            };
        })();
    }

    //
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {
                },
                fBound = function() {
                    return fToBind.apply(this instanceof fNOP
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
    'use strict';

// Add ECMA262-5 string trim if not supported natively
//
    if (!('trim' in String.prototype)) {
        String.prototype.trim = function() {
            return this.replace(/^\s+/, '').replace(/\s+$/, '');
        };
    }

// Add ECMA262-5 Array methods if not supported natively
//
    if (!('indexOf' in Array.prototype)) {
        Array.prototype.indexOf = function(find, i /*opt*/) {
            if (i === undefined) i = 0;
            if (i < 0) i += this.length;
            if (i < 0) i = 0;
            for (var n = this.length; i < n; i++)
                if (i in this && this[i] === find)
                    return i;
            return -1;
        };
    }

    if (!('forEach' in Array.prototype)) {
        Array.prototype.forEach = function(action, that /*opt*/) {
            for (var i = 0, n = this.length; i < n; i++)
                if (i in this)
                    action.call(that, this[i], i, this);
        };
    }
    if (!('map' in Array.prototype)) {
        Array.prototype.map = function(mapper, that /*opt*/) {
            var other = new Array(this.length);
            for (var i = 0, n = this.length; i < n; i++)
                if (i in this)
                    other[i] = mapper.call(that, this[i], i, this);
            return other;
        };
    }

// addEventListener polyfill
    !window.addEventListener && (function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
        WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
            var target = this;

            registry.unshift([target, type, listener, function(event) {
                event.currentTarget = target;
                event.preventDefault = function() {
                    event.returnValue = false
                };
                event.stopPropagation = function() {
                    event.cancelBubble = true
                };
                event.target = event.srcElement || target;

                listener.call(target, event);
            }]);

            this.attachEvent("on" + type, registry[0][3]);
        };

        WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
            for (var index = 0, register; register = registry[index]; ++index) {
                if (register[0] == this && register[1] == type && register[2] == listener) {
                    return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
                }
            }
        };

        WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
            return this.fireEvent("on" + eventObject.type, eventObject);
        };
    })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);


// getComputedStyle polyfyll
    if (!window.getComputedStyle) {
        window.getComputedStyle = function(e) {
            return e.currentStyle
        };
    }

// helper method for checking RGBA support
    function supportsRgba() {
        if (!('result' in supportsRgba)) {
            var scriptElement = document.getElementsByTagName('script')[0];
            var prevColor = scriptElement.style.color;
            var testColor = 'rgba(0, 0, 0, 0.5)';
            if (prevColor == testColor) {
                supportsRgba.result = true;
            }
            else {
                try {
                    scriptElement.style.color = testColor;
                } catch (e) {
                }
                supportsRgba.result = scriptElement.style.color != prevColor;
                scriptElement.style.color = prevColor;
            }
        }
        return supportsRgba.result;
    }
    window.supportsRGBA = supportsRgba;
})();


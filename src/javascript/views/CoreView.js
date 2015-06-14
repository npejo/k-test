(function(app) {
    'use strict';

    /**
     * Parent view which is extended by the other views
     * It implements the methods which enable easier management of event handlers in the views that extend it
     * The default characteristics of each view are following:
     *  - it is bind to an existing dom element.
     *  - knows how to render its template
     *  - can add listeners for events to elements within the view
     *
     *  This functionality can be extended by overriding the appropriate methods
     *  or implementing another private methods
     *
     * @param options
     * @constructor
     */
    var CoreView = function(options) {
        this.element = options.element || null;
        this.appEvents = options.appEvents || null;
    };

    /**
     * Return the html markup dom elements
     *
     * @returns {HTMLElement|string}
     */
    CoreView.prototype.getTemplate = function() {
        return '';
    };

    /**
     * Add event listeners to elements within the template
     * or using the dependency to appModel listen to app level events
     */
    CoreView.prototype.addEventListeners = function() {
    };

    /**
     * Select the element by id or class and add bind event listener for the specified `eventName`
     * with the specified `callback`
     *
     * @param selector
     * @param eventName
     * @param callback
     */
    CoreView.prototype.addListener = function(selector, eventName, callback) {
        var cleanSelector = selector.substring(1);
        switch (selector.charAt(0)) {
            case '#':
                this.addListenerById(cleanSelector, eventName, callback);
                break;
            case '.':
                this.addListenerByClass(cleanSelector, eventName, callback);
                break;
        }
    };

    /**
     * Select element by id and adds event listener using the specified event name and callback
     *
     * @private
     * @param elementId
     * @param eventName
     * @param callback
     */
    CoreView.prototype.addListenerById = function(elementId, eventName, callback) {
        var element = document.getElementById(elementId);
        if (!element) {
            return;
        }

        element.addEventListener(eventName, function() {
            callback();
        }, false);
    };

    /**
     * Select element by class name and adds event listener using the specified event name and callback
     *
     * @private
     * @param className
     * @param eventName
     * @param callback
     */
    CoreView.prototype.addListenerByClass = function(className, eventName, callback) {
        var elements = this.element.querySelectorAll('.' + className);
        if (!elements.length) {
            return;
        }
        var nbrElements = elements.length;
        for (var i = 0; i < nbrElements; i++) {
            elements[i].addEventListener(eventName, function() {
                callback();
            }, false);
        }
    };
    app.Views.CoreView = CoreView;
})(FluidL);

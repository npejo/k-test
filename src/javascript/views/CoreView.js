(function(app) {
    'use strict';

    /**
     * Parent view which is extended by the other views
     * It implements the method which define the structure of the `view` concept
     * The default characteristics of each view are following:
     *  - it is bind to an existing element by `id`. The root element `id` is passed in the constructor
     *  - has object of subviews that should be rendered within its root element
     *  - knows how to render its template
     *  - can add listeners for events to elements within the view
     *
     *  This functionality can be extended by overriding the appropriate methods
     *
     * @param options
     * @constructor
     */
    var CoreView = function(options) {
        this.element = options.element || null;
        this.appEvents = options.appEvents || null;
    };

    /**
     * Return the html markup template as string
     *
     * @returns {string}
     */
    CoreView.prototype.getTemplate = function() {
        return '';
    };

    /**
     * Add event listeners to elements within the template
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
        var elements = this.element.getElementsByClassName(className);
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

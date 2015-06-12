(function(app) {
    'use strict';

    /**
     * Handles the rendering and actions of the main container for the layout
     *
     * @extends CoreView
     * @param options
     * @constructor
     */
    var MainContainerView = function(options) {
        // invoke the constructor of the parent object
        app.Views.CoreView.call(this, options);
    };

    // chain the prototype of the parent object
    MainContainerView.prototype = Object.create(app.Views.CoreView.prototype);

    /**
     * Bind event actions on elements within the view
     */
    MainContainerView.prototype.addEventListeners = function() {
        // subscribe to application level event
        this.appEvents.subscribe('box-over', this.handleBoxOver.bind(this));
        this.appEvents.subscribe('box-out', this.handleBoxOut.bind(this));
    };

    MainContainerView.prototype.handleBoxOver = function() {
        console.log('main says: box is hovered!');
        this.element.style.border = '10px solid black';
        this.element.style.padding = '40px';
    };

    MainContainerView.prototype.handleBoxOut = function() {
        console.log('main says: box is hovered!');
        this.element.style.border = '1px solid black';
        this.element.style.padding = '50px';
    };

    app.Views.MainContainerView = MainContainerView;
})(FluidL);
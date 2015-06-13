(function(app) {
    'use strict';

    /**
     * Handles the rendering of info messages that inform the user about the application state
     *
     * @extends CoreView
     * @param options
     * @constructor
     */
    var AppInfoView = function(options) {
        // invoke the constructor of the parent object
        app.Views.CoreView.call(this, options);

        this.appState = options.appState;
        this.msgTimeout = null;
    };

    // chain the prototype of the parent object
    AppInfoView.prototype = Object.create(app.Views.CoreView.prototype);

    /**
     * Bind event actions on elements within the view
     */
    AppInfoView.prototype.addEventListeners = function() {
        // subscribe to application level event
        this.appEvents.subscribe('box-added', this.handleBoxAdded.bind(this));
        this.appEvents.subscribe('box-removed', this.handleBoxRemoved.bind(this));

        // subscribe to events on elements within this view
        this.addListener('.js-reset', 'click', this.handleResetContent.bind(this));
    };

    AppInfoView.prototype.initialize = function() {
        this.showCurrentStats();
        this.addEventListeners();
    };

    AppInfoView.prototype.handleBoxAdded = function(boxIndex) {
        this.showCurrentStats();

        // show info message about the added box
        var currentBoxes = this.appState.getCurrentBoxes();
        var boxId = currentBoxes[boxIndex].id;
        this.showMessage('Box [' + boxId + '] added on position ' + (boxIndex + 1));
    };

    AppInfoView.prototype.handleBoxRemoved = function(data) {
        this.showCurrentStats();

        // show info message about the removed box
        this.showMessage('Box [' + data.boxId + '] removed from position ' + (data.boxIndex + 1));
    };

    AppInfoView.prototype.handleResetContent = function() {
        this.appState.reset();
        this.appEvents.publish('reset-content');

        this.showCurrentStats();
        this.showMessage('Boxes re-initialized');
    };

    AppInfoView.prototype.showCurrentStats = function() {
        var stats = this.appState.getStats();

        var nbrBoxesInfo = document.getElementById('nbr-boxes-info');
        var nbrRemovedInfo = document.getElementById('nbr-removed-boxes-info');

        nbrBoxesInfo.innerHTML = stats.nbrBoxes;
        nbrRemovedInfo.innerHTML = stats.nbrRemoved;
        nbrRemovedInfo.title = stats.removedBoxesIds.join(', ');
    };

    AppInfoView.prototype.showMessage = function(msg) {
        var msgInfo = document.getElementById('actions-info-msg');
        msgInfo.innerHTML = msg;

        clearTimeout(this.msgTimeout);
        this.msgTimeout = setTimeout(function() {
            msgInfo.innerHTML = '';
        }, 3000);
    };

    app.Views.AppInfoView = AppInfoView;
})(FluidL);
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

        // private helper variable that tracks if there is already displayed message
        // that should be hidden after the timeout
        this.msgTimeout = null;

        // injected dependencies
        this.appState = options.appState;
    };

    // chain the prototype of the parent object
    AppInfoView.prototype = Object.create(app.Views.CoreView.prototype);

    /**
     * Bind event listeners
     */
    AppInfoView.prototype.addEventListeners = function() {
        // subscribe to application level event
        this.appEvents.subscribe('box-added', this.handleBoxAdded.bind(this));
        this.appEvents.subscribe('box-removed', this.handleBoxRemoved.bind(this));

        // subscribe to events on elements within this view
        this.addListener('.js-reset', 'click', this.handleResetContent.bind(this));
    };

    /**
     * Trigger displaying of current state and setting up of event listeners
     */
    AppInfoView.prototype.initialize = function() {
        this.showCurrentStats();
        this.addEventListeners();
    };

    /**
     * Show the updated stats
     * Display descriptive message about the position and the id of the added box
     *
     * @param boxIndex
     */
    AppInfoView.prototype.handleBoxAdded = function(boxIndex) {
        this.showCurrentStats();

        // show info message about the added box
        var currentBoxes = this.appState.getCurrentBoxes();
        var boxId = currentBoxes[boxIndex].id;
        this.showMessage('Box [' + boxId + '] added on position ' + (boxIndex + 1));
    };

    /**
     * Show the updated stats
     * Display descriptive message about the position and the id of the removed box
     *
     * @param data
     */
    AppInfoView.prototype.handleBoxRemoved = function(data) {
        this.showCurrentStats();

        // show info message about the removed box
        this.showMessage('Box [' + data.boxId + '] removed from position ' + (data.boxIndex + 1));
    };

    /**
     * Trigger state reset and publish app event to inform other sections to reset its self
     * Display descriptive message that the reset action is performed
     */
    AppInfoView.prototype.handleResetContent = function() {
        this.appState.reset();
        this.appEvents.publish('reset-content');

        this.showCurrentStats();
        this.showMessage('Boxes re-initialized');
    };

    /**
     * Display the current stats information
     */
    AppInfoView.prototype.showCurrentStats = function() {
        // fetch current stats
        var stats = this.appState.getStats();

        // select the elements where the stats should be displayed
        var nbrBoxesInfo = document.getElementById('nbr-boxes-info');
        var nbrRemovedInfo = document.getElementById('nbr-removed-boxes-info');

        nbrBoxesInfo.innerHTML = stats.nbrBoxes;
        nbrRemovedInfo.innerHTML = stats.nbrRemoved;
        nbrRemovedInfo.title = stats.removedBoxesIds.join(', ');
    };

    /**
     * Display the message recieved as input in the appropriate element
     * Set timeout to hide the message after certain period
     *
     * @param msg
     */
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

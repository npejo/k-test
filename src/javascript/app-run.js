(function(app) {
    'use strict';

    // create instance off application level objects
    var appEvents = new app.Models.EventsModel();
    var appState = new app.Models.StateModel();

    // create and initialize mainContainerView instance
    //var mainContainerView = new app.Views.MainContainerView({
    //    element: document.getElementsByClassName('main-container')[0],
    //    appEvents: appEvents
    //});
    //mainContainerView.addEventListeners();

    // create and initialize contentView instance
    var contentView = new app.Views.ContentView({
        element: document.getElementsByClassName('content')[0],
        appEvents: appEvents,
        appState: appState
    });
    contentView.initialize();

    // create and initialize appInfoView instance
    var appInfoView = new app.Views.AppInfoView({
        element: document.getElementsByClassName('app-info-box')[0],
        appEvents: appEvents,
        appState: appState
    });
    appInfoView.initialize();

})(FluidL);

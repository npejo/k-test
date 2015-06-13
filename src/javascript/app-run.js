(function(app) {
    var appEvents = new app.Models.EventsModel();
    var appState = new app.Models.StateModel();

    var mainContainerView = new app.Views.MainContainerView({
        element: document.getElementsByClassName('main-container')[0],
        appEvents: appEvents
    });
    mainContainerView.addEventListeners();

    var contentView = new app.Views.ContentView({
        element: document.getElementsByClassName('content')[0],
        appEvents: appEvents,
        appState: appState
    });
    contentView.initialize();

    var appInfoView = new app.Views.AppInfoView({
        element: document.getElementsByClassName('app-info-box')[0],
        appEvents: appEvents,
        appState: appState
    });
    appInfoView.initialize();

})(FluidL);
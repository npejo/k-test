(function(app) {
    var appEvents = new app.Models.Events();
    var mainContainer = new app.Views.MainContainerView({
        element: document.getElementsByClassName('main-container')[0],
        appEvents: appEvents
    });
    mainContainer.addEventListeners();
    var contentView = new app.Views.ContentView({
        element: document.getElementsByClassName('content')[0],
        appEvents: appEvents
    });
    contentView.initialize();
})(FluidL);
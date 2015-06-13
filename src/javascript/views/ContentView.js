(function(app) {
    'use strict';

    /**
     * Handles the rendering and actions of the inner container for the layout
     *
     * @extends CoreView
     * @param options
     * @constructor
     */
    var ContentView = function(options) {
        // invoke the constructor of the parent object
        app.Views.CoreView.call(this, options);

        this.appState = options.appState;

        // array of box view objects that are currently displayed
        this.boxes = [];
    };

    // chain the prototype of the parent object
    ContentView.prototype = Object.create(app.Views.CoreView.prototype);

    ContentView.prototype.initialize = function() {

        if (this.appState.hasSavedState()) {
            var currentBoxes = this.appState.getCurrentBoxes();
            for(var i = 0; i < currentBoxes.length; i++) {
                this.addBoxView(currentBoxes[i]);
            }
        } else {
            this.initContent();
        }

        this.setBgColor(-5 * this.boxes.length);

        // load the previously saved state from localStorage
        // if nothing, draw one box
        //var self = this;
        //setTimeout(function() {
        //    self.addBoxViewOnIndex(6);
        //}, 2000);
        //setTimeout(function() {
        //    self.addBoxViewOnIndex(2);
        //}, 4000);
        //setTimeout(function() {
        //    self.addBoxViewOnIndex(1);
        //}, 6000);
        //setTimeout(function() {
        //    self.addBoxViewOnIndex(10);
        //}, 8000);
        //setTimeout(function() {
        //    self.addBoxViewOnIndex(6);
        //}, 10000);

        this.addEventListeners();
    };

    /**
     * Bind event actions on elements within the view
     */
    ContentView.prototype.addEventListeners = function() {
        // subscribe to application level event
        this.appEvents.subscribe('box-over', this.handleBoxOver.bind(this));
        this.appEvents.subscribe('box-out', this.handleBoxOut.bind(this));
        this.appEvents.subscribe('box-removed', this.handleRemoveBoxView.bind(this));
        this.appEvents.subscribe('box-added', this.handleAddingBoxView.bind(this));
        this.appEvents.subscribe('reset-content', this.handleResetContent.bind(this));
    };

    ContentView.prototype.handleBoxOver = function() {
        this.element.style.border = '15px solid black';
        this.element.style.padding = '35px 35px 25px 35px';
    };

    ContentView.prototype.handleBoxOut = function() {
        this.element.style.padding = '50px 50px 40px 50px';
        this.element.style.border = '1px solid black';
    };

    ContentView.prototype.handleRemoveBoxView = function(data) {
        this.boxes.splice(data.boxIndex, 1);
        this.updateBoxesFromIndex(data.boxIndex - 1);
        this.setBgColor(5);

        this.appState.boxRemoved(data.boxId);
    };

    ContentView.prototype.handleAddingBoxView = function(boxIndex) {
        this.addBoxViewOnIndex(boxIndex);
        this.setBgColor(-5);
    };

    ContentView.prototype.handleResetContent = function() {
        this.initContent();
    };

    ContentView.prototype.initContent = function() {
        if (this.boxes.length) {
            for (var i = 0; i < this.boxes.length; i++) {
                this.boxes[i].element.remove();
            }
            this.boxes = [];
        }

        this.addBoxViewOnIndex(0);
        this.appState.setCurrentBoxes([this.boxes[0].getData()]);
    };

    ContentView.prototype.addBoxView = function(boxData) {
        var boxIndex = this.validateBoxIndex(boxData.index);

        boxData.appEvents = this.appEvents;
        var boxView = new app.Views.BoxView(boxData);
        this.boxes.splice(boxIndex, 0, boxView);

        this.drawBoxView(boxView, true);
    };

    ContentView.prototype.addBoxViewOnIndex = function(index) {
        var boxIndex = this.validateBoxIndex(index);

        var boxView = new app.Views.BoxView({
            id: this.appState.getTotalBoxes() + 1,
            appEvents: this.appEvents
        });
        this.boxes.splice(boxIndex, 0, boxView);

        var isLast = (this.boxes.length - 1) === boxIndex;
        this.initBoxView(boxView, boxIndex, isLast);

        this.drawBoxView(boxView);
        this.updateBoxesFromIndex(boxIndex - 1);
    };

    ContentView.prototype.drawBoxView = function(boxView, append) {
        var newBoxTemplate = boxView.getTemplate();
        if (boxView.isLast || append) {
            this.element.appendChild(newBoxTemplate);
        } else {
            this.element.insertBefore(newBoxTemplate, this.boxes[boxView.index + 1].element);
        }

        boxView.addEventListeners();
    };

    ContentView.prototype.initBoxView = function(boxView, boxIndex, isLast) {
        var gridRow = this.calculateGridRow(boxIndex);

        boxView.init({
            index: boxIndex,
            gridRow: gridRow,
            prevBox: this.getPrevBoxId(boxIndex, gridRow),
            nextBox: this.getNextBoxId(boxIndex, gridRow),
            isLast: isLast || false
        });
    };

    ContentView.prototype.calculateGridRow = function(boxIndex) {
        var gridRowNumber = 1;
        var gridSegment = (boxIndex + 1) % 6;

        switch (gridSegment) {
            case 0:
                gridRowNumber = 3;
                break;
            case 4:
            case 5:
                gridRowNumber = 2;
                break;
        }

        return gridRowNumber;
    };

    ContentView.prototype.getPrevBoxId = function(boxIndex, gridRow) {
        var prevBoxId = null;
        var prevIndex = boxIndex - 1;

        if (prevIndex >= 0) {
            var prevBoxRow = this.calculateGridRow(prevIndex);
            if (prevBoxRow === gridRow) {
                prevBoxId = this.boxes[prevIndex].getId();
            }
        }

        return prevBoxId;
    };

    ContentView.prototype.getNextBoxId = function(boxIndex, gridRow) {
        var nextBoxId = null;
        var nextIndex = boxIndex + 1;

        if (nextIndex < this.boxes.length) {
            var nextBoxRow = this.calculateGridRow(nextIndex);
            if (nextBoxRow === gridRow) {
                nextBoxId = this.boxes[nextIndex].getId();
            }
        }

        return nextBoxId;
    };

    ContentView.prototype.validateBoxIndex = function(index) {
        var boxIndex = this.boxes.length;

        if (typeof index !== 'undefined') {
            boxIndex = index > boxIndex ? boxIndex : parseInt(index, 10);
        }

        return boxIndex;
    };

    ContentView.prototype.updateBoxesFromIndex = function(index) {
        var nbrBoxes = this.boxes.length;

        index = index < 0 ? 0 : index;

        var boxesData = [];

        for (var i = index; i < nbrBoxes; i++) {
            var curBox = this.boxes[i];
            var isLast = i === (nbrBoxes - 1);
            this.initBoxView(curBox, i, isLast);
            curBox.updateTemplate();
            boxesData.push(curBox.getData());
        }

        this.appState.setCurrentBoxes(boxesData, index);
    };

    ContentView.prototype.setBgColor = function(shadeAdjustment) {
        var defaultShade = 220;

        var bgColor = window.getComputedStyle(this.element).backgroundColor;
        var shade = parseInt(bgColor.split(',')[1]) || defaultShade;

        var newShade = shade + shadeAdjustment;
        this.element.style.backgroundColor = 'rgba(' + newShade + ',' + newShade + ',' + newShade + ', 0.8)';
    };

    app.Views.ContentView = ContentView;
})(FluidL);
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
        this.totalBoxes = 0;
    };

    // chain the prototype of the parent object
    ContentView.prototype = Object.create(app.Views.CoreView.prototype);

    ContentView.prototype.initialize = function() {
        var currentBoxes = this.appState.getCurrentBoxes();

        if (currentBoxes.length > 0) {
            for(var i = 0; i < currentBoxes.length; i++) {
                this.addBoxView(currentBoxes[i]);
            }
        } else {
            this.addBoxViewOnIndex(0);
        }
        // load the previously saved state from localStorage
        // if nothing, draw one box
        //this.addBoxView();
        //this.addBoxView();
        //this.addBoxView();
        //this.addBoxView();
        //this.addBoxView();
        //this.addBoxView();
        //this.addBoxView();
        //this.addBoxViewOnIndex(3);
        var self = this;
        setTimeout(function() {
            self.addBoxViewOnIndex(6);
        }, 2000);
        setTimeout(function() {
            self.addBoxViewOnIndex(2);
        }, 4000);
        setTimeout(function() {
            self.addBoxViewOnIndex(1);
        }, 6000);
        setTimeout(function() {
            self.addBoxViewOnIndex(10);
        }, 8000);
        setTimeout(function() {
            self.addBoxViewOnIndex(6);
        }, 10000);

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
    };

    ContentView.prototype.handleBoxOver = function() {
        this.element.style.border = '15px solid black';
        this.element.style.padding = '35px 35px 25px 35px';
    };

    ContentView.prototype.handleBoxOut = function() {
        this.element.style.padding = '50px 50px 40px 50px';
        this.element.style.border = '1px solid black';
    };

    ContentView.prototype.addBoxView = function(boxData) {
        var boxIndex = this.validateBoxIndex(boxData.index);

        boxData.appEvents = this.appEvents;
        var boxView = new app.Views.BoxView(boxData);
        this.boxes.splice(boxIndex, 0, boxView);

        this.drawBoxView(boxView);
    };

    ContentView.prototype.addBoxViewOnIndex = function(index) {
        // update the counter for total number of added and removed boxes
        this.totalBoxes++;

        var boxIndex = this.validateBoxIndex(index);

        var boxView = new app.Views.BoxView({
            id: this.totalBoxes,
            appEvents: this.appEvents
        });
        this.boxes.splice(boxIndex, 0, boxView);

        var isLast = (this.boxes.length - 1) === boxIndex;
        this.initBoxView(boxView, boxIndex, isLast);

        this.drawBoxView(boxView);
    };

    ContentView.prototype.drawBoxView = function(boxView) {
        var newBoxTemplate = boxView.getTemplate();
        if (boxView.isLast) {
            this.element.appendChild(newBoxTemplate);
        } else {
            this.element.insertBefore(newBoxTemplate, this.boxes[boxView.index + 1].element);
        }

        boxView.addEventListeners();

        this.updateBoxesFromIndex(boxView.index - 1);
    };

    ContentView.prototype.handleRemoveBoxView = function(boxIndex) {
        this.boxes.splice(boxIndex, 1);
        this.updateBoxesFromIndex(boxIndex - 1);
        this.setBgColor('lighter');
    };

    ContentView.prototype.handleAddingBoxView = function(boxIndex) {
        this.addBoxViewOnIndex(boxIndex);
        this.setBgColor('darker');
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
        if (index < 0) {
            return;
        }

        var nbrBoxes = this.boxes.length;
        var boxesData = [];

        for (var i = index; i < nbrBoxes; i++) {
            var curBox = this.boxes[i];
            var isLast = i === (nbrBoxes - 1);
            this.initBoxView(curBox, i, isLast);
            curBox.updateTemplate();
            boxesData.push(curBox.getData());
        }

        console.log(boxesData);
        //this.appState.updateStateFromIndex(index, boxesData);
    };

    ContentView.prototype.setBgColor = function(direction) {
        var addition = direction === 'darker' ? '030303' : '-030303';
        //console.log(this.element.style);
        //console.log(parseInt(addition));
    };

    app.Views.ContentView = ContentView;
})(FluidL);
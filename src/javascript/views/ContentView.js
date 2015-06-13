(function(app) {
    'use strict';

    /**
     * Handles the rendering and actions of the box content container
     *
     * @extends CoreView
     * @param options
     * @constructor
     */
    var ContentView = function(options) {
        // invoke the constructor of the parent object
        app.Views.CoreView.call(this, options);

        // injected dependency
        this.appState = options.appState;

        // array of box view objects that are currently displayed
        this.boxes = [];
    };

    // chain the prototype of the parent object
    ContentView.prototype = Object.create(app.Views.CoreView.prototype);

    /**
     * If there is saved app state, draw the saved boxes otherwise initialize the content with one displayed box
     *
     * Set the shade of the background color for content container
     * depending on the number of boxes that are initially displayed
     *
     * Add event listeners
     */
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
        this.addEventListeners();
    };

    /**
     * Bind event listeners
     */
    ContentView.prototype.addEventListeners = function() {
        // subscribe to application level event
        this.appEvents.subscribe('box-over', this.handleBoxOver.bind(this));
        this.appEvents.subscribe('box-out', this.handleBoxOut.bind(this));
        this.appEvents.subscribe('box-removed', this.handleRemoveBoxView.bind(this));
        this.appEvents.subscribe('box-added', this.handleAddingBoxView.bind(this));
        this.appEvents.subscribe('reset-content', this.initContent.bind(this));
    };

    /**
     * Handler box over event
     */
    ContentView.prototype.handleBoxOver = function() {
        this.element.style.border = '15px solid black';
        this.element.style.padding = '35px 35px 25px 35px';
    };

    /**
     * Handle box out event
     */
    ContentView.prototype.handleBoxOut = function() {
        this.element.style.padding = '50px 50px 40px 50px';
        this.element.style.border = '1px solid black';
    };

    /**
     * On box remove
     * - delete the reference to the box view in local boxes array
     * - update the state (style and data) of existing boxes
     * - update the background color of the content container
     * - inform the appState model that specific box was removed
     *
     * @param data
     */
    ContentView.prototype.handleRemoveBoxView = function(data) {
        this.boxes.splice(data.boxIndex, 1);
        this.updateBoxesFromIndex(data.boxIndex - 1);
        this.setBgColor(5);

        this.appState.boxRemoved(data.boxId);
    };

    /**
     * Trigger adding new box on specific index and update the color of the content container
     *
     * @param boxIndex
     */
    ContentView.prototype.handleAddingBoxView = function(boxIndex) {
        this.addBoxViewOnIndex(boxIndex);
        this.setBgColor(-5);
    };

    /**
     * Trigger remove for each of the existing boxes, empty the boxes array
     * Create on box on the first position and update the app state
     */
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

    /**
     * Create new boxView instance using input boxData object
     * store it in boxes views array and render it
     *
     * @param boxData
     */
    ContentView.prototype.addBoxView = function(boxData) {
        // check if the input `index` in boxData is accepted value in current boxes state
        var boxIndex = this.validateBoxIndex(boxData.index);

        // inject the appEvents model as part of the boxData
        boxData.appEvents = this.appEvents;

        // create boxView instance
        var boxView = new app.Views.BoxView(boxData);

        // add the boxView in boxes array on specific index
        this.boxes.splice(boxIndex, 0, boxView);

        // render the template for the new box
        this.drawBoxView(boxView, true);
    };

    /**
     * Create new boxView instance using only the index on which the box should be displayed
     * store it in boxes views array and render it
     * @param index
     */
    ContentView.prototype.addBoxViewOnIndex = function(index) {
        // check if the input `index` in boxData is accepted value in current boxes state
        var boxIndex = this.validateBoxIndex(index);

        // create boxView instance
        var boxView = new app.Views.BoxView({
            id: this.appState.getTotalBoxes() + 1,
            appEvents: this.appEvents
        });
        this.boxes.splice(boxIndex, 0, boxView);

        // check if the new box will be last in current box grid
        var isLast = (this.boxes.length - 1) === boxIndex;
        this.initBoxView(boxView, boxIndex, isLast);

        this.drawBoxView(boxView);
        this.updateBoxesFromIndex(boxIndex - 1);
    };

    /**
     * Insert the boxView template in the content container element
     * depending on the boxView properties display it on the appropriate position
     * Add event listeners the the newly create box element
     *
     * @param boxView
     * @param append
     */
    ContentView.prototype.drawBoxView = function(boxView, append) {
        var newBoxTemplate = boxView.getTemplate();
        if (boxView.isLast || append) {
            this.element.appendChild(newBoxTemplate);
        } else {
            this.element.insertBefore(newBoxTemplate, this.boxes[boxView.index + 1].element);
        }

        boxView.addEventListeners();
    };

    /**
     * Initialize boxView properties, so they describe the state of the box within current box grid
     *
     * @param boxView
     * @param boxIndex
     * @param isLast
     */
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

    /**
     * Depending on the box index in the grid, calculate on which row type it should be
     *
     * @param boxIndex
     * @returns {number}
     */
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

    /**
     * In the boxView object that is on index `boxIndex`,
     * set the `id` of the box that is predecessor in the same row of the grid
     * if there is no predecessor box in the same row, set null
     *
     * @param boxIndex
     * @param gridRow
     * @returns {number}
     */
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

    /**
     * In the boxView object that is on index `boxIndex`,
     * set the `id` of the box that is successor in the same row of the grid
     * if there is no successor box in the same row, set null
     *
     * @param boxIndex
     * @param gridRow
     * @returns {number}
     */
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

    /**
     * Check if the input index value is lower or equal to the current total elements of boxes
     *
     * @param index
     * @returns {Number}
     */
    ContentView.prototype.validateBoxIndex = function(index) {
        var boxIndex = this.boxes.length;

        if (typeof index !== 'undefined') {
            boxIndex = index > boxIndex ? boxIndex : parseInt(index, 10);
        }

        return boxIndex;
    };

    /**
     * Loop through each boxView after specified index, update its data and template
     * and inform the appState model that boxes have been updated
     *
     * @param index
     */
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

    /**
     * Depending on the number of currently displayed boxes, set different shade of gray as background color
     * of the content container
     *
     * @param shadeAdjustment
     */
    ContentView.prototype.setBgColor = function(shadeAdjustment) {
        var defaultShade = 220;

        var bgColor = window.getComputedStyle(this.element).backgroundColor;
        var shade = parseInt(bgColor.split(',')[1]) || defaultShade;

        var newShade = shade + shadeAdjustment;

        // check with polyfill method if the browser supports rgba. IE8 doesn't supports it
        if (window.supportsRGBA(this.element)) {
            this.element.style.backgroundColor = 'rgba(' + newShade + ',' + newShade + ',' + newShade + ', 0.8)';
        } else {
            this.element.style.backgroundColor = 'rgb(' + newShade + ',' + newShade + ',' + newShade + ')';
        }
    };

    app.Views.ContentView = ContentView;
})(FluidL);

(function(app) {
    'use strict';

    /**
     * Handles the rendering and actions of a single box
     *
     * @extends CoreView
     * @param options
     * @constructor
     */
    var BoxView = function(options) {
        // invoke the constructor of the parent object
        app.Views.CoreView.call(this, options);

        // the id of the box is required for the constructor
        this.id = options.id;

        // set the default values of box properties
        this.index = 0;
        this.gridRow = null;
        this.prevBox = null;
        this.nextBox = null;
        this.isLast = false;

        // override the box properties if there are values passed as options
        this.init(options);
    };

    // chain the prototype of the parent object
    BoxView.prototype = Object.create(app.Views.CoreView.prototype);

    /**
     * Bind event actions on elements within the view
     */
    BoxView.prototype.addEventListeners = function() {
        // subscribe to events on elements within this view
        this.addListener('.box', 'mouseenter', this.handleBoxOver.bind(this));
        this.addListener('.box', 'mouseleave', this.handleBoxOut.bind(this));
        this.addListener('.box', 'click', this.addNewBox.bind(this));
        this.addListener('.js-box-remove', 'click', this.removeSelf.bind(this));
    };

    /**
     *  Set the box properties to values passed as options,
     *  otherwise keep the default values
     *
     * @param options
     */
    BoxView.prototype.init = function(options) {
        this.index = options.index || 0;
        this.gridRow = options.gridRow || null;
        this.prevBox = options.prevBox || null;
        this.nextBox = options.nextBox || null;
        this.isLast = options.isLast || false;
    };

    /**
     * Handler for the box mouseenter event
     */
    BoxView.prototype.handleBoxOver = function() {
        this.appEvents.publish('box-over');
    };

    /**
     * Handler for the box mouseleave event
     */
    BoxView.prototype.handleBoxOut = function() {
        this.appEvents.publish('box-out');
    };

    /**
     * Return the value of the box `id` property
     *
     * @returns {number|BoxView.id}
     */
    BoxView.prototype.getId = function() {
        return this.id;
    };

    /**
     * Create the html elements for all sections of single box wrapper, box, header and content
     * and initialize the values
     *
     * @returns {HTMLElement}
     */
    BoxView.prototype.getTemplate = function() {
        // create boxWrapper element
        var boxWrapper = document.createElement('div');
        this.setupBoxWrapperTpl(boxWrapper);

        // create box element
        var box = document.createElement('div');
        this.setupBoxTpl(box);

        // create boxHeader element
        var boxHeader = document.createElement('div');
        this.setupBoxHeaderTpl(boxHeader);

        // create boxContent element
        var boxContent = document.createElement('div');
        this.setupBoxContentTpl(boxContent);

        // append box sections into the box element
        box.appendChild(boxHeader);
        box.appendChild(boxContent);

        // append the box into the boxWrapper
        boxWrapper.appendChild(box);

        // set reference to the boxWrapper element
        this.element = boxWrapper;

        return boxWrapper;
    };

    /**
     * Update the values of box template sections with current box properties
     */
    BoxView.prototype.updateTemplate = function() {
        this.setupBoxWrapperTpl(this.element);

        // update box color
        var box = this.element.querySelectorAll('.box')[0];
        this.setupBoxTpl(box);

        // update boxContent
        var boxContent = box.querySelectorAll('.box-content')[0];
        this.setupBoxContentTpl(boxContent);
    };

    /**
     * Remove specific box element from the dom
     * Trigger app event that the box with specific `id` on `index` was removed
     * Trigger box-out event
     */
    BoxView.prototype.removeSelf = function() {
        this.appEvents.publish('box-removed', {boxIndex: this.index, boxId: this.id});
        this.appEvents.publish('box-out');
    };

    /**
     * Handle click on a box, inform the app that new box should be added on specific index
     * by triggering appropriate app event
     */
    BoxView.prototype.addNewBox = function() {
        this.appEvents.publish('box-added', this.index + 1);
    };

    /**
     * Get the appropriate css class that should be set to the box
     * depending on the row on which is the box in the grid layout
     *
     * @returns {string}
     */
    BoxView.prototype.getGridRowClass = function() {
        var giClass = 'col-2-6';

        switch (this.gridRow) {
            case 2:
                giClass = 'col-3-6';
                break;
            case 3:
                giClass = 'col-6-6';
                break;
        }

        return giClass;
    };

    /**
     * Get the appropriate background color that should be set to the box
     * depending on the index on which it is in the grid of boxes
     *
     * @returns {string}
     */
    BoxView.prototype.getBoxIndexBgColor = function() {
        var bgColor = '';

        switch ((this.index + 1) % 4) {
            case 2:
                bgColor = '#cc3300';
                break;
            case 3:
                bgColor = '#2F9039';
                break;
            case 0:
                bgColor = '#5189AD';
                break;
        }

        return bgColor;
    };

    /**
     * Return object with box properties that define the state of the box
     *
     * @returns {{id: *, index: *, gridRow: *, prevBox: *, nextBox: *, isLast: *}}
     */
    BoxView.prototype.getData = function() {
        return {
            id: this.id,
            index: this.index,
            gridRow: this.gridRow,
            prevBox: this.prevBox,
            nextBox: this.nextBox,
            isLast: this.isLast
        }
    };

    /**
     * Setup the style of the bow wrapper element
     *
     * @param boxWrapper
     */
    BoxView.prototype.setupBoxWrapperTpl = function(boxWrapper) {
        var gridRowClass = this.getGridRowClass();
        boxWrapper.className = 'box-wrapper ' + gridRowClass;
    };

    /**
     * Setup the style of the bow element
     *
     * @param box
     */
    BoxView.prototype.setupBoxTpl = function(box) {
        var lastBoxClass = this.isLast ? ' last' : '';
        box.className = 'box' + lastBoxClass;

        var bgColor = this.getBoxIndexBgColor();
        box.style.backgroundColor = bgColor;
    };

    /**
     * Setup the style and markup of the box header section
     *
     * @param boxHeader
     */
    BoxView.prototype.setupBoxHeaderTpl = function(boxHeader) {
        boxHeader.className = 'box-header';
        boxHeader.innerHTML = '<div class="box-section f-left box-header-info">[' + this.id + ']</div>' +
            '<div class="box-section f-right box-header-actions">' +
                '<button class="js-box-remove" onclick="javascript:event.stopPropagation();">X</button>' +
            '</div>';
    };

    /**
     * Setup the style and markup of the box content section
     *
     * @param boxContent
     */
    BoxView.prototype.setupBoxContentTpl = function(boxContent) {
        var prevBox = this.prevBox === null ? '' : this.prevBox;
        var nextBox = this.nextBox === null ? '' : this.nextBox;
        boxContent.className = 'box-content';
        boxContent.innerHTML = '<div class="box-section f-left">' + prevBox + '</div>' +
            '<div class="box-section f-right">' + nextBox + '</div>';
    };

    app.Views.BoxView = BoxView;
})(FluidL);

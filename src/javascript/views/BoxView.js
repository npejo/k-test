(function(app) {
    'use strict';

    /**
     * Handles the rendering and actions of the inner container for the layout
     *
     * @extends CoreView
     * @param options
     * @constructor
     */
    var BoxView = function(options) {
        // invoke the constructor of the parent object
        app.Views.CoreView.call(this, options);

        this.id = options.id;

        this.index = 0;
        this.gridRow = null;
        this.prevBox = null;
        this.nextBox = null;
        this.isLast = false;

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

    BoxView.prototype.init = function(options) {
        this.index = options.index || 0;
        this.gridRow = options.gridRow || null;
        this.prevBox = options.prevBox || null;
        this.nextBox = options.nextBox || null;
        this.isLast = options.isLast || false;
    };

    BoxView.prototype.handleBoxOver = function() {
        this.appEvents.publish('box-over');
    };

    BoxView.prototype.handleBoxOut = function() {
        this.appEvents.publish('box-out');
    };

    BoxView.prototype.getId = function() {
        return this.id;
    };

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

    BoxView.prototype.updateTemplate = function() {
        this.setupBoxWrapperTpl(this.element);

        // update box color
        var box = this.element.getElementsByClassName('box')[0];
        this.setupBoxTpl(box);

        // update boxContent
        var boxContent = box.getElementsByClassName('box-content')[0];
        this.setupBoxContentTpl(boxContent);
        this.setupBoxContentTpl(boxContent);
    };

    BoxView.prototype.removeSelf = function() {
        event.preventDefault();
        event.stopPropagation();

        this.appEvents.publish('box-removed', this.index);
        this.element.remove();
    };

    BoxView.prototype.addNewBox = function() {
        this.appEvents.publish('box-added', this.index + 1);
    };

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

    //BoxView.prototype.createBoxElement = function() {
    //
    //
    //
    //    return box;
    //};

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

    BoxView.prototype.setupBoxWrapperTpl = function(boxWrapper) {
        var gridRowClass = this.getGridRowClass();
        boxWrapper.className = 'box-wrapper ' + gridRowClass;
    };


    BoxView.prototype.setupBoxTpl = function(box) {
        var lastBoxClass = this.isLast ? ' last' : '';
        box.className = 'box' + lastBoxClass;

        var bgColor = this.getBoxIndexBgColor();
        box.style.backgroundColor = bgColor;
    };

    BoxView.prototype.setupBoxHeaderTpl = function(boxHeader) {
        boxHeader.className = 'box-header';
        boxHeader.innerHTML = '<div class="box-section f-left box-header-info">[' + this.id + ']</div>' +
            '<div class="box-section f-right box-header-actions">' +
                '<button class="js-box-remove">X</button>' +
            '</div>';
    };

    BoxView.prototype.setupBoxContentTpl = function(boxContent) {
        var prevBox = this.prevBox === null ? '' : this.prevBox;
        var nextBox = this.nextBox === null ? '' : this.nextBox;
        boxContent.className = 'box-content';
        boxContent.innerHTML = '<div class="box-section f-left">' + prevBox + '</div>' +
            '<div class="box-section f-right">' + nextBox + '</div>';
    };

    app.Views.BoxView = BoxView;
})(FluidL);

(function(app) {
    'use strict';
    
    var StateModel = function() {
        this.options = {
            statsItemName: 'FluidL-stats',
            currentBoxesItemName: 'FluidL-currentBoxes'
        };

        this.stats = {
            nbrRemoved: 0,
            removedBoxesIds: []
        };
        var savedStats = localStorage.getItem(this.options.statsItemName);
        if (savedStats) {
            this.stats = JSON.parse(localStorage.getItem(this.options.statsItemName));
        }
        this.currentBoxes = JSON.parse(localStorage.getItem(this.options.currentBoxesItemName)) || [];
    };

    StateModel.prototype = {
        hasSavedState: function() {
            return localStorage.getItem(this.options.currentBoxesItemName) !== null;
        },

        getCurrentBoxes: function() {
            return this.currentBoxes;
        },

        getStats: function() {
            this.stats.nbrBoxes = this.currentBoxes.length;
            return this.stats;
        },

        getTotalBoxes: function() {
            return this.currentBoxes.length + this.stats.nbrRemoved;
        },

        setCurrentBoxes: function(boxesData, toIndex) {
            if (toIndex) {
                var boxesBeforeIndex = this.currentBoxes.slice(0, toIndex);
                this.currentBoxes = boxesBeforeIndex.concat(boxesData);
            } else {
                this.currentBoxes = boxesData;
            }

            this.saveBoxes();
        },

        boxRemoved: function(boxId) {
            this.stats.nbrRemoved++;
            this.stats.removedBoxesIds.push(boxId);
            this.saveStats();
        },

        reset: function() {
            this.currentBoxes = [];
            this.stats = {
                nbrRemoved: 0,
                removedBoxesIds: []
            };

            this.saveBoxes();
            this.saveStats();
        },

        saveBoxes: function() {
            localStorage.setItem(this.options.currentBoxesItemName, JSON.stringify(this.currentBoxes));
        },

        saveStats: function() {
            localStorage.setItem(this.options.statsItemName, JSON.stringify(this.stats));
        }
    };

    app.Models.StateModel = StateModel;
})(FluidL);

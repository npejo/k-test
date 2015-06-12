(function(app) {
    'use strict';
    
    var StateModel = function() {
        this.options = {
            statsItemName: 'FluidL-stats',
            currentBoxesItemName: 'FluidL-currentBoxes'
        };

        this.defaultStats = {
            nbrBoxes: 0,
            nbrRemoved: 0,
            removedBoxesIds: [],
            currentBoxesIds: []
        };
        this.stats = JSON.parse(localStorage.getItem(this.options.statsItemName)) || this.defaultStats;
        this.currentBoxes = JSON.parse(localStorage.getItem(this.options.currentBoxesItemName)) || [];
    };


    StateModel.prototype = {
        getCurrentBoxes: function() {
            return this.currentBoxes;
        },

        getStats: function() {
            return this.stats;
        },

        updateState: function(currentBoxes, addedBox, removedBox) {
            this.setCurrentBoxes(currentBoxes);

            //if (addedBox) {
            //
            //}
        },
        reset: function(currentBoxes) {
            this.setCurrentBoxes(currentBoxes);
        },

        setCurrentBoxes: function(currentBoxes) {
            this.currentBoxes = currentBoxes;
            localStorage.setItem(this.options.currentBoxesItemName, JSON.stringify(currentBoxes));
        },

        setStats: function(statsObj) {
            this.stats = statsObj;
            localStorage.setItem(this.options.statsItemName, JSON.stringify(statsObj));
        }
    };

    app.Models.StateModel = StateModel;
})(FluidL);

(function(app) {
    'use strict';

    /**
     * Keep information about the current state of the application
     * Box actions performed within current session, resetting session and info messages
     * The information is saved in localStorage
     *
     * @constructor
     */
    var StateModel = function() {
        this.options = {
            statsItemName: 'FluidL-stats',
            currentBoxesItemName: 'FluidL-currentBoxes'
        };

        // initial stats values
        this.stats = {
            nbrRemoved: 0,
            removedBoxesIds: []
        };

        // load saved stats if they exist and override the default stat values set above
        var savedStats = localStorage.getItem(this.options.statsItemName);
        if (savedStats) {
            this.stats = JSON.parse(localStorage.getItem(this.options.statsItemName));
        }
        // load the saved box gird if it doesn't exits init the variable to empty array
        this.currentBoxes = JSON.parse(localStorage.getItem(this.options.currentBoxesItemName)) || [];
    };

    StateModel.prototype = {
        /**
         * Check if there is saved state
         *
         * @returns {boolean}
         */
        hasSavedState: function() {
            return localStorage.getItem(this.options.currentBoxesItemName) !== null;
        },

        /**
         * Return the array of current boxes
         *
         * @returns {Array|StateModel.currentBoxes}
         */
        getCurrentBoxes: function() {
            return this.currentBoxes;
        },

        getStats: function() {
            this.stats.nbrBoxes = this.currentBoxes.length;
            return this.stats;
        },

        /**
         * Calculate the number of boxes that are part of current session
         * currentBoxes + (already deleted boxes)
         *
         * @returns {number}
         */
        getTotalBoxes: function() {
            return this.currentBoxes.length + this.stats.nbrRemoved;
        },

        /**
         * Set the input boxesData into currentBoxes property
         * If toIndex parameter is specified, keep the array elements to that index and
         * override only the elements in the array that have indexes bigger than toIndex
         * Save the updated array of boxes data
         *
         * @param boxesData
         * @param toIndex
         */
        setCurrentBoxes: function(boxesData, toIndex) {
            if (toIndex) {
                var boxesBeforeIndex = this.currentBoxes.slice(0, toIndex);
                this.currentBoxes = boxesBeforeIndex.concat(boxesData);
            } else {
                this.currentBoxes = boxesData;
            }

            this.saveBoxes();
        },

        /**
         * Increase the number of removed boxes and set the box id into the list of removed boxes
         * Save the updated state
         *
         * @param boxId
         */
        boxRemoved: function(boxId) {
            this.stats.nbrRemoved++;
            this.stats.removedBoxesIds.push(boxId);
            this.saveStats();
        },

        /**
         * Re-initialize the state values and save the clean state
         */
        reset: function() {
            this.currentBoxes = [];
            this.stats = {
                nbrRemoved: 0,
                removedBoxesIds: []
            };

            this.saveBoxes();
            this.saveStats();
        },

        /**
         * Store the value of current boxes array in localStorage
         */
        saveBoxes: function() {
            localStorage.setItem(this.options.currentBoxesItemName, JSON.stringify(this.currentBoxes));
        },

        /**
         * Store the value of current session stats information in localStorage
         */
        saveStats: function() {
            localStorage.setItem(this.options.statsItemName, JSON.stringify(this.stats));
        }
    };

    app.Models.StateModel = StateModel;
})(FluidL);

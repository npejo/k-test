(function(app) {
    'use strict';

    /**
     * Object that handles event subscriptions on application level
     * Its purpose is to enable interaction between separate components/views in the application
     *
     * @constructor
     */
    var EventsModel = function() {
        // object that keeps all event subscriptions
        // eventName: [callback1, callback2...]
        this.subscriptions = {};
    };

    EventsModel.prototype = {
        /**
         * Add subscription that will invoke the callback method when specific event occurs
         *
         * @param eventName
         * @param callback
         */
        subscribe: function(eventName, callback) {
            if (!this.subscriptions[eventName]) {
                this.subscriptions[eventName] = [];
            }
            this.subscriptions[eventName].push(callback);
        },

        /**
         * Trigger specific event, invoke all subscription callback methods
         * @param eventName
         * @param data
         */
        publish: function(eventName, data) {
            if (!this.subscriptions[eventName]) {
                return;
            }
            this.subscriptions[eventName].forEach(function(callback) {
                callback(data);
            });
        }
    };

    app.Models.EventsModel = EventsModel;
})(FluidL);

/**
 * Initialize namespace for the application,
 * this is the only variable added to the global object
 */
var FluidL = {
    Views: {},
    Models: {},
    Utils: {
        // add utility method to the application namespace for browser compatible stopPropagation
        stopPropagation: function(e) {
            if(e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.returnValue = false;
            }
        }
    }
};

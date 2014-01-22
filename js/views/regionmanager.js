// Used with require.js setup

// Common/misc views to be used throughout the app

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var RegionManager = Backbone.View.extend({

        initialize: function() {
            this.elId = this.options.elId;
        },

        showView: function(view) {
            if (this.currentView){
                console.log('Manager for: '+this.elId+' oldView is: '+this.currentView.name);
                this.currentView.close();
            }

            this.currentView = view;
            console.log('Manager for: '+this.elId+' currentView is: '+this.currentView.name);

            $('#'+this.elId).html(this.currentView.el);
        }
    });

    return RegionManager;
});

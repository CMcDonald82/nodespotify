// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/AboutView.html'
], function($, _, Backbone, aboutTemplate) {

    var AboutView = Backbone.View.extend({

        initialize: function() {
            this.render();
        },

        render: function() {
            var compiled_template = _.template(aboutTemplate);
            $(this.el).html(compiled_template());
            return this;
        }

    });

    return AboutView;
});

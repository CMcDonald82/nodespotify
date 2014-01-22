// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/BlankView.html'
], function($, _, Backbone, blankTemplate) {

    var BlankView = Backbone.View.extend({

        initialize: function() {
            this.render();
        },

        render: function() {
            var compiled_template = _.template(blankTemplate);
            $(this.el).html(compiled_template());
            return this;
        }


    });


    return BlankView

});

// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/RegisterDoneView.html'
], function($, _, Backbone, registerDoneTemplate) {

    var RegisterDoneView = Backbone.View.extend({

        initialize: function() {
            this.render();
        },

        render: function() {
            var compiled_template = _.template(registerDoneTemplate);
            $(this.el).html(compiled_template());
            return this;
        }

    });

    return RegisterDoneView;
});

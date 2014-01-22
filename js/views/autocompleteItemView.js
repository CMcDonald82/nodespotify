// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/AutocompleteItemView.html'
], function($, _, Backbone, AutocompleteItemTemplate) {

    var AutocompleteItemView = Backbone.View.extend({

        tagName: 'li',

        className: 'autocomplete',

        initialize: function() {
            this.txt = this.options.txt;
            //this.render();
        },

        render: function() {
            var compiled_template = _.template(AutocompleteItemTemplate);
            $(this.el).html(compiled_template({txt: this.options.txt, name: this.options.name}));
            return this;
        }

    });

    return AutocompleteItemView;
});

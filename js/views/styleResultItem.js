// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/StyleResultItemView.html'
], function($, _, Backbone, StyleItemTemplate) {

    var StyleResultItem = Backbone.View.extend({

        tagName: "li",

        className: "topTenItem styleItemContainer",

        initialize: function() {
            //this.model.bind("change", this.render, this);
            //this.model.bind("destroy", this.close, this);
            this.userModel = this.options.userModel;
            //this.userModel.bind("change", this.createButtons, this);
            //this.type = this.options.type;
            this.childViews = [];
            this.name = this.options.name;
        },

        render: function() {
            // Render template for the search result item (either song or artist)
            console.log("Rendering Artist Items");
            var compiled_template = _.template(StyleItemTemplate);
            $(this.el).html(compiled_template({name: this.model.get('name').toUpperCase()}));
            return this;
        }

    });

    return StyleResultItem;
});

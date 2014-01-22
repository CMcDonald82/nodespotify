// Used with require.js setup
// Experimental view for backbone.paginator.js. If that library doesn't work, go back to regular paginator. See also collections/paginator.js
define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/paginatorBreadcrumb.html'
], function($, _, Backbone, paginatorTpl) {

    var Paginator = Backbone.View.extend({

        events: {
            'click a.first': 'gotoFirst',
            'click a.prev': 'gotoPrev',
            'click a.next': 'gotoNext',
            'click a.last': 'gotoLast',
            'click a.page': 'gotoPage'
        },

        initialize: function() {
            this.collection.on('reset', this.render, this);
            this.collection.on('change', this.render, this);
            this.options.vent.on("app:removePaginator", this.close, this);
            this.name = this.options.name;
            //this.$el.appendTo('#pagination');
        },

        pagingTemplate: _.template(paginatorTpl),

        render: function() {
            console.log('this.collection.info(): '+JSON.stringify(this.collection));
            var html = this.pagingTemplate(this.collection.info());
            this.$el.html(html);
            //return this;
        },

        gotoFirst: function (e) {
            e.preventDefault();
            this.collection.goTo(1);
        },

        gotoPrev: function (e) {
            e.preventDefault();
            this.collection.previousPage();
        },

        gotoNext: function (e) {
            e.preventDefault();
            this.collection.nextPage();
        },

        gotoLast: function (e) {
            e.preventDefault();
            this.collection.goTo(this.collection.information.lastPage);
        },

        gotoPage: function (e) {
            e.preventDefault();
            var page = $(e.target).text();
            this.collection.goTo(page);
        }

        /*
        onClose: function() {
            _.each(this.childViews, function(childView) {
                childView.close();
                console.log('closed view from childViews');
            });
        }
        */

    });

    return Paginator;
});

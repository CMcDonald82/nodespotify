// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'models/playlist',
    'views/playlistSelectorOption'
], function($, _, Backbone, Playlist, selectorOption) {

    var PlaylistSelector = Backbone.View.extend({

        // Bind to collection reset, which will in turn be triggered when a user is logged in and when they create a new playlist

        tagName: "select",

        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll');
            this.blankPlaylist = new Playlist({'playlist_id': 0, 'title': 'No Playlist Selected'});
            this.collection.bind('reset', this.addAll);
            this.childViews = [];
            console.log('playlistselector');
            console.log('Collection is: '+this.collection);
            //this.name = this.options.name;
            //this.addAll();
        },

        render: function() {
            //$(this.el).html(this);
        },


        addOne: function(playlist) {

            var childView = new selectorOption({model: playlist});

            $(this.el).append(childView.render().el);

            this.childViews.push(childView);
        },

        addAll: function() {
            //var that = this;
            console.log("el: "+$(this.el));
            this.addOne(this.blankPlaylist);
            this.collection.each(this.addOne);
        }


    });

    return PlaylistSelector;
});

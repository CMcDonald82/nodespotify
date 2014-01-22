// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'models/playlist'
], function($, _, Backbone, Playlist) {

    var PlaylistSelectorOption = Backbone.View.extend({


        tagName: "option",

        initialize: function() {
            //_.bindAll(this, 'render');
        },

        render: function() {
            console.log('Playlistoption');
            console.log('model: '+JSON.stringify(this.model));
            $(this.el).attr('value', this.model.get('playlist_id')).html(this.model.get('title'));
            return this;
        }
    });

    return PlaylistSelectorOption;
});

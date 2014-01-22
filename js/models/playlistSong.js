// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var PlaylistSong = Backbone.Model.extend({

        url: "playlist_track"

    });

    return PlaylistSong;
});


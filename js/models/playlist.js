// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'collections/playlistsongs'
], function($, _, Backbone, PlaylistSongs) {

    var Playlist = Backbone.Model.extend({

        url: "save_playlist",

        tracks: new PlaylistSongs()

    });

    return Playlist;
});

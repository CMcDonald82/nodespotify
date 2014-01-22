// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'models/playlistSong'
], function($, _, Backbone, playlistSong) {

    // This is the collection that holds the tracks for a playlist
    
    var PlaylistSongs = Backbone.Collection.extend({

        model: playlistSong,

        url: "get_playlist",

        parse: function(data) {
            //console.log('Response from server: '+data);
            if (data === "err") {
                console.log('NO PLAYLIST SELECTED');
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    var track = data[i];
                    console.log("Found track: "+track['track_id']+" apiId: "+track['api_id']);
                }
            }
            return data;
        }
    });

    return PlaylistSongs;
});











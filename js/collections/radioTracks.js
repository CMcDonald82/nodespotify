// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'api_key', 
    'models/song'
], function($, _, Backbone, api, song) {

    var RadioTracks = Backbone.Collection.extend({

        model: song,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var playlistUrlExt = 'playlist/static?api_key='+api.api_key; //ZKIBJJ0Q8BLHRKH1P';
            var url = urlBase + playlistUrlExt;
            return url;
        },

        parse: function(data) {
            console.log("PARSE ARTIST PLAYLIST RESPONSE: "+JSON.stringify(data));

            for (var i = 0; i < data.response.songs.length; i++) {
                var song = data.response.songs[i];
                //console.log("Found song: "+song['title']);
            }

            return data.response.songs;
        }

    });

    return RadioTracks;
});

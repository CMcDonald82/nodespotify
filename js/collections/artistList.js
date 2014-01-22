// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'api_key',
    'models/artist'
], function($, _, Backbone, api, artist) {

    var ArtistList = Backbone.Collection.extend({

        model: artist,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var playlistUrlExt = 'artist/search?api_key='+api.api_key; //ZKIBJJ0Q8BLHRKH1P';
            var url = urlBase + playlistUrlExt;
            return url;
        },


        parse: function(data) {
            console.log("PARSE ARTIST LIST RESPONSE: "+data.response.artists);

            for (var i = 0; i < data.response.artists.length; i++) {
                var artist = data.response.artists[i];
                console.log("Found ARTIST: "+artist['name']);
            }

            return data.response.artists;
        }

    });

    return ArtistList;
});

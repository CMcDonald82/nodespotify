// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'models/playlist'
], function($, _, Backbone, playlist) {

    var Playlists = Backbone.Collection.extend({

        model: playlist,

        url: "playlists",


        parse: function(data) {
            for (var i = 0; i < data.length; i++) {
                var pl = data[i];
                console.log("Found playlist: "+pl['title']);
            }
            //this.data = data;
            console.log("PLAYLIST DATA - Copy to fixtures: "+JSON.stringify(data));
            return data;
        }

    });

    return Playlists;
});

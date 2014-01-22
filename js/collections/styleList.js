// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'api_key',
    'models/style'
], function($, _, Backbone, api, style) {

    var StyleList = Backbone.Collection.extend({

        model: style,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var playlistUrlExt = 'artist/top_terms?api_key='+api.api_key; //ZKIBJJ0Q8BLHRKH1P';
            var url = urlBase + playlistUrlExt;
            return url;
        },

        parse: function(data) {
            console.log("PARSE STYLE LIST RESPONSE: "+JSON.stringify(data));

            for (var i = 0; i < data.response.terms.length; i++) {
                var song = data.response.terms[i];
                //console.log("Found song: "+song['title']);
            }
            return data.response.terms;
        }

    });

    return StyleList;
});

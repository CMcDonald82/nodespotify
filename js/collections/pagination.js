// Used with require.js setup
// Experimental view for backbone.paginator.js. If that library doesn't work, go back to regular paginator. See also views/paginationView

define([
    'jquery',
    'underscore',
    'backbone',
    'api_key',
    'models/song',
    'paginator'
], function($, _, Backbone, api, song) {

    //var Songs = Backbone.Collection.extend({
    var Paginator = Backbone.Paginator.clientPager.extend({

        model: song,

        // Not needed since bootstrapping with client data


        paginator_core: {
            // the type of the request (GET by default)
            type: 'GET',

            // the type of reply (jsonp by default)
            dataType: 'jsonp',

            // the URL (or base URL) for the service
            url: function() {
                var urlBase = 'http://developer.echonest.com/api/v4/';
                var songUrlExt = 'song/search?api_key='+api.api_key; //ZKIBJJ0Q8BLHRKH1P';
                var url = urlBase + songUrlExt;
                console.log('Request URL: '+url);
                return url;
            }
        },



        paginator_ui: {
            // the lowest page index your API allows to be accessed
            firstPage: 1,

            // which page should the paginator start from
            // (also, the actual page the paginator is on)
            currentPage: 1,

            // how many items per page should be shown
            perPage: 10,

            // a default number of total pages to query in case the API or
            // service you are using does not support providing the total
            // number of pages for us.
            // 10 as a default in case your service doesn't return the total
            totalPages: 10,

            // The total number of pages to be shown as a pagination
            // list is calculated by (pagesInRange * 2) + 1.
            pagesInRange: 4
        },


        parse: function(data) {
            return data.response.songs;
        }

    });

    return Paginator;
});

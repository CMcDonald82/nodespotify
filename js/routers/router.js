// Used with require.js setup

define([
    'jquery',
    'backbone'
], function($, Backbone) {

    var Workspace = Backbone.Router.extend({
        routes: {
            "search/:term/:page": "search",
            "search/:term": "search",
            "searchartist/:term/:page": "searchartist",
            "searchartist/:term": "searchartist",
            "displayregister": "register",
            "displayabout": "about"

        }
    });

    return Workspace;
});

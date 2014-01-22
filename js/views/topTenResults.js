// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'views/searchResultItem',
    'views/artistResultItem',
    'views/styleResultItem',
    'text!tpl/TopTenContainer.html'
], function($, _, Backbone, SearchResultItemView, ArtistResultItemView, StyleResultItemView, TopTenTemplate) {

    var TopTenResultsView = Backbone.View.extend({

        //tagName: "ul",

        className: "topTenContainer five columns omega",


        initialize: function() {
            this.userModel = this.options.userModel;
            //this.userModel.on('change', this.render, this);
            this.options.vent.on("app:getTopTen", this.getResults, this);
            this.collection.on('reset', this.render, this);
            this.childViews = [];
            this.name = this.options.name;
            this.type = this.options.type;
            this.elId = this.options.elId;
            this.topTenTitle = this.options.topTenTitle;
        },

        

        // Might want to instead try making separate 'getResults' functions here and call them from appinit. See if this improves readability & modularization.
        // fetch the collection and make TopTenResultsView bound to collection reset (calling render())
        getResults: function() {
            console.log("SELECTED GENRE: "+$('#topTenGenres').val());
            var genre = $('#topTenGenres').val();
            var that = this;
            var request = {};
            if (this.type === "songs") {
                if (genre !== "all") {
                    // Because when searching by song, for some reason EchoNest uses the 'style' param for genres, rather than the 'genre' param, as used when searching artists
                    request['style'] = genre;
                }
                request['song_min_hotttnesss'] = 0.2;
                request['artist_min_familiarity'] = 0.5;
                request['sort'] = 'song_hotttnesss-desc';
                request['bucket'] = ['id:spotify-WW', 'tracks']; //'id:7digital-US', 'tracks'];
                request['limit'] = true;
            } else if (this.type === "artists") {
                if (genre !== "all") {
                    request['genre'] = genre;
                }
                request['min_hotttnesss'] = 0.2;
                request['max_familiarity'] = 0.4;
                request['sort'] = 'hotttnesss-desc';
                request['bucket'] = ['id:spotify-WW']; //'id:7digital-US', 'tracks'];
                request['limit'] = true;
            }
            request['format'] = 'json';
            request['results'] = 10;

            this.collection.fetch({
                data: $.param(request, true),
                success: function(resp) {
                    console.log('Got Top 10 RESULTS. length: '+resp.length);
                    //that.render();
                },
                error: function() {
                    console.log('error occurred. No Results');
                }
            });
        },

        render: function() {
            var compiled_template = _.template(TopTenTemplate);
            $(this.el).html(compiled_template({elId: this.elId, topTenTitle: this.topTenTitle}));
            //$(this.el).html('');
            var results = this.collection.models;
            var len = results.length;
            var childView;

            for (var i = 0; i < len; i++) {
                //console.log('Passing loggedIn status: '+this.userModel.get('loggedIn'));
                if (this.type === "songs") {
                    childView = new SearchResultItemView({model: results[i], userModel: this.userModel, type: "song"}); //loggedIn: this.userModel.get('loggedIn')});
                } else if (this.type === "artists") {
                    childView = new ArtistResultItemView({model: results[i], userModel: this.userModel, type: this.options.type}); //loggedIn: this.userModel.get('loggedIn')});
                } else {
                    childView = new StyleResultItemView({model: results[i], userModel: this.userModel, type: this.options.type}); //loggedIn: this.userModel.get('loggedIn')});
                }
                this.childViews.push(childView);
                $('#'+this.elId).append(childView.render().el);
            }
            return this;
        },

        onClose: function() {
            //this.userModel.unbind('change', this.render, this);
            this.collection.off('reset', this.render, this);
            _.each(this.childViews, function(childView) {
                childView.close();
                console.log('closed view from childViews');
            });
        }


    });


    return TopTenResultsView

});

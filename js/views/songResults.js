// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'views/searchResultItem',
    'views/paginationView',
    'collections/pagination'
], function($, _, Backbone, SearchResultItems, paginatorView, Paginator) {

    var SongResults = Backbone.View.extend({

        initialize: function() {
            this.userModel = this.options.userModel;
            this.paginatorCollection = this.options.paginatorCollection;
            console.log('paginatorCollection: '+this.paginatorCollection);
            /*
                Could also bind to 'loggedin'/'loggedout' events, that should do the same thing as the line below
                (since authUser model is updated when either of those events is fired)
                Might be better to use that technique instead since this will cause a re-render whenever any attribute
                on the authUser model is changed (not just the loggedIn attr)
                We only want a re-render to occur if user logs in/out. Anything else will cause a different view to take over in the mainPanel
            */
            this.userModel.on('change', this.render, this); // need this
            this.childViews = [];
            this.name = this.options.name;
            //this.paginatorCollection.on('reset', this.addAll, this);
            //this.render();


            this.artist = this.options.artist;
            var tags = this.paginatorCollection;

            tags.on('add', this.addOne, this);
            tags.on('reset', this.addAll, this);
            tags.on('all', this.render, this);

            tags.fetch({
                data: $.param(this.options.requestParams, true),
                success: function(){
                    tags.pager();
                },
                silent:true
            });

        },

        render: function() {

            /*
            var results = this.collection.models;
            var len = results.length;
            var type;

            if (!this.options.artist) {
                type = "song"
            } else {
                type = "artist"
            }

            console.log('Page: '+this.options.page);
            var startPos = (this.options.page - 1) * 4;
            var endPos = Math.min(startPos + 4, len);

            $(this.el).html('<ul class="thumbnails">kjdsnvkjcdns</ul>');

            for (var i = startPos; i < endPos; i++) {
                //console.log('Passing loggedIn status: '+this.userModel.get('loggedIn'))
                var childView = new SearchResultItems({model: results[i], loggedIn: this.userModel.get('loggedIn'), userModel: this.userModel, type: type});
                this.childViews.push(childView);
                $('.thumbnails', this.el).append(childView.render().el);
            }
            */
            //$('.thumbnails', this.el).append('<div id="pagination">Paginator Here:</div>');
            //this.paginatorCollection(this.collection);

            //var thePaginator = this.paginatorCollection(this.collection.toJSON());
            //var thePaginator = new Paginator(this.collection.toJSON());
            //thePaginator.bootstrap();
            //this.paginatorCollection.bootstrap();
            //var paginator = new paginatorView({collection: this.paginatorCollection}); //thePaginator});
            //thePaginator.pager();
            //paginator.render();

            //this.paginator.collection.reset();



            //alert("TEST");
            this.resetMoreResultsButton();
            //this.options.parent(showMoreResults);

            // fix paginator and import - old (non-backbone.paginator stuff)
            //$(this.el).append(new Paginator({model: this.model, page: this.options.page, term: this.options.term, artistSongs: this.options.artist}).render().el);

            return this;
        },

        
        resetMoreResultsButton: function() {
            //if ($('#moreResults').hasClass('expanded')) {
            $('#moreResultsLabel').text('More');
            //} else {
            //    $('#moreResultsLabel').text('Previous');
            //}
            $('#moreResults').removeClass('expanded');
            //$('.searchResultsLeft').removeClass('expanded');
            $('.searchResultsRight').removeClass('expanded');
        },
        

        // The below two methods (addAll, addOne) are just for testing until determined if they work with backbone.paginator or not

        addAll: function () {
            this.$el.empty();
            var that = this;

            var rightEl = $("<div class='searchResultsRight'></div>");
            var leftEl = $("<div class='searchResultsLeft'></div>");
            $(this.el).append(leftEl);
            $(this.el).append(rightEl);

            this.paginatorCollection.each(function(model, index) {
                console.log("INDEX: "+index)
                that.addOne(model, index);
            });
            //var pagination = new paginatorView({collection: this.paginatorCollection});
            //$(this.el).append('<div id="pagination"></div>');
        },

        addOne: function (item, index) {
            

            if (!this.artist) {
                type = "song"
            } else {
                type = "artist"
            }
            console.log('this.options.artist: '+this.artist);
            console.log('this.userModel: '+JSON.stringify(this.userModel));
            console.log('item: '+JSON.stringify(item));
            var childView = new SearchResultItems({model: item, loggedIn: this.userModel.get('loggedIn'), userModel: this.userModel, type: type });
            this.childViews.push(childView);
            //if (index === 5) {
                
            //}
            if (index >= 5) {
                $('.searchResultsRight').append(childView.render().el);
            } else {
                $('.searchResultsLeft').append(childView.render().el);
            }
            //$(this.el).append(childView.render().el);
        },


        // Pulled into appinit.js so it is in proper scope to be called
        /*
        makeRadioPlaylist: function(ev) {
            var request = {};
            var that = this;
            console.log('$(ev.currentTarget): '+ $(ev.currentTarget).data("attachedData").artistId);

            if ($(ev.currentTarget).data("attachedData").artistId) {
                request['artist_id'] = $(ev.currentTarget).data("attachedData").artistId;
            }
            else if ($(ev.currentTarget).data("attachedData").songId) {
                request['song_id'] = $(ev.currentTarget).data("attachedData").songId;
            }

            request['format'] = 'json';
            request['results'] = 20;
            request['bucket'] = ['id:spotify-WW', 'tracks'];
            request['limit'] = true;
            request['type'] = $(ev.currentTarget).data("attachedData").playlistType; //'artist-radio'
            request['variety'] = 0.2;
            request['distribution'] = 'focused'; //wandering ? 'wandering' : 'focused';

            console.log('Making Playlist of type: '+request['type']+' from Artist ID: '+request['artist_id']);

            this.collection.fetch({
                data: $.param(request, true),
                success: function() {
                    console.log("ARTIST PLAYLIST SUCCESS");
                    // Try refactoring the displayPlaylist code to accept PREFERREDTITLE and TRACKS params. Pass in the request['type'] and
                    // the ArtistPlaylist collection itself, respectively. Allows the displayPlaylist code to be reused for custom playlist loading
                    //that.loadPlaylistToSpotifyPlayer(request['type'], that.radioTracks);
                }
            });
        },
        */

        onClose: function() {
            this.userModel.unbind('change', this.render, this);
            _.each(this.childViews, function(childView) {
                childView.close();
                console.log('closed view from childViews');
            });
        }

    });

    return SongResults;
});

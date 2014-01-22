// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'views/customPlaylistItem', 
    'jqueryui'
], function($, _, Backbone, CustomPlaylistItem) {

    var CustomPlaylistDisplay = Backbone.View.extend({

        tagName: "ul",

        id: "sortablePlaylistList",

        events: {
            //'click #loadPlaylist': 'loadPlaylist'
        },

        initialize: function() {
            //_.bindAll(this, 'addOne', 'addAll');
            this.options.vent.on("app:selectedCustomPlaylist", this.getPlaylist, this);
            
            this.childViews = [];
            this.name = this.options.name;
            //_.bindAll(this, "getPlaylist");
            
            // May need this _.bindAll but not sure. Seems to work without it
            //_.bindAll(this, "loadPlaylist");

            this.setup();
            
        },

        setup: function() {
            var that = this;
            $(this.el).sortable({
                update: function() { 
                    that.updateSort(); 
                }
            });
            $(this.el).disableSelection();
        },

        updateSort: function() {
            var that = this;
            var sortedIDs = $(this.el).sortable('toArray');
            //alert("UPDATED! "+sortedIDs);

            // Code to save the rearranged order of tracks in playlist to DB
            var plId = $('#playlistSelector option:selected').val();
            $.post('/rearrange_playlist', { tracklist: sortedIDs, plId: plId, _csrf: this.model.get('token') }, function(data) {
                //console.log('Saved Track '+JSON.stringify(data));
                //console.log('Type Of Saved Track '+typeof(data));
                if (!data) {
                    alert('This track already exists in the playlist '+$('#playlistSelector option:selected').text());
                }
                else {
                    if (data === 'noplaylist') {
                        alert('No playlist is selected!');
                        $(that.el).sortable('cancel');
                    } else if (data === 'invalidPlaylist') {
                        alert('There is no such playlist!');
                        $(that.el).sortable('cancel');
                    } else if (data === 'invalidTracks') {
                        alert('One or more tracks submitted is invalid');
                        $(that.el).sortable('cancel');
                    } else {
                        alert('Successfully updated playlist! '+$('#playlistSelector option:selected').text());
                    }
                }
            });
            

        },


        getPlaylist: function() {
            //alert('gettin playlist');
            $(this.el).html('');
            var that = this;
            var request = {};
            request['plId'] = this.options.plId;
            console.log('GETTING PLAYLIST FROM SERVER: '+this.options.plId);
            this.collection.fetch({
                data: $.param(request, true),
                success: function(resp) {
                    console.log('Got the playlist: '+resp+' length: '+resp.length);
                    that.addAll();
                },
                error: function() {
                    // Pretty sure this is triggered (and the collection's 'parse' function is not) when string value is sent back from server.
                    // Normally would recognize a string value, but since 'fetch' is a method on a collection object, it always expects some type of JSON
                    // being returned from server. It can't parse strings or ints and will go to error callback here if one is encountered
                    console.log('An error occurred. No Playlist');
                    //alert("Please select a playlist");
                    //var plView = new CustomPlaylistPlaceholderView({collection: that.collection, model: authUser, name: 'CustomPlaylistPlaceholderView', plId: that.options.plId, vent: that.options.vent });
                    //playlistEditorManager.showView(plView);
                    //vent.trigger("app:blankCustomPlaylist");
                }
            });
        },

        /*
         blankPlaylist: function() {
         //var plView = new CustomPlaylistPlaceholderView({collection: this.collection, model: authUser, name: 'CustomPlaylistPlaceholderView', plId: this.options.plId, vent: this.options.vent });
         //playlistEditorManager.showView(plView);
         $('#playlistEditor').html('Please select a playlist');
         },
         */


        addAll: function() {
            console.log('Playlist Length: '+this.collection.length);
            console.log('Playlist: '+this.collection.toJSON());
            // Alternative approach here might be to use this.collection.each(this.addOne); but defer it until collection has refreshed. Doesn't seem to be necessary here - the this.collection.models approach seems to work fine and allows slicing for pagination
            //this.collection.each(this.addOne);
            var pl = $('#playlistSelector option:selected').text();
            $("#sortableCustomPlaylistTitle").html("<h5>"+pl+"</h5>");

            var results = this.collection.models;
            console.log('customPlaylistDisplay RESULTS: '+JSON.stringify(results));
            // Try doing a pagination thing here (i.e. display the first 10 results, if the playlist is longer than 10, display a "next" button that will get the next 10 results and append them - just trigger this function again and set the variables such as page, start, end, numResults accordingly)
            for (var i=0; i < results.length; i++) {
                this.addOne(results[i]);
            }
            if (this.options.plId !== 0 && this.collection.length > 0) {
                $(this.el).parent().append('<div id="loadPlaylist">Load Playlist</div>');
            }
            
        },

        addOne: function(track) {
            console.log('Model: '+JSON.stringify(track));
            var childView = new CustomPlaylistItem({model: track, vent: this.options.vent, authUser: this.model});
            $(this.el).append(childView.render().el);
            this.childViews.push(childView);
            //console.log('pushed view to childViews');
        },


        // Need an 'onClose' method to take care of removing nested (child) views and unbinding events from them
        onClose: function() {
            //this.collection.unbind('reset', this.addAll);
            this.options.vent.off("app:selectedCustomPlaylist", this.getPlaylist, this);
            //this.options.vent.off(); // unbinds ALL events from the view. DO NOT USE, for some reason, using this will prevent getPlaylist() from being called whenever user selects a different playlist from dropdown
            _.each(this.childViews, function(childView) {
                childView.close();
                console.log('closed view from childViews');
            });
        },

        // Had to pull this out into appinit.js because with the jQueryUI sortable implemented, the #loadPlaylist button needs to be placed outside of $(this.el). Then, this function is no longer triggered when the button is clicked  
        /*
        loadPlaylist: function(ev) {
            // Code to loop through playlist and create the Spotify playlist from it
            //console.log("CALLED loadPlaylist");
            //console.log("PL: "+this.options.pl);
            alert("LOADING...");
            
            
            var plTitle = this.options.pl;
            var spotifyIds = [];
            this.collection.each(function(obj) {
                console.log('PUSHING SPOTIFY ID: '+obj.get('spotify_id'));
                spotifyIds.push(obj.get('spotify_id'));
            });
            console.log('LOADED COLLECTION: '+JSON.stringify(spotifyIds));
            this.options.parent.loadPlaylistToSpotifyPlayer(plTitle, spotifyIds);
            
        }
        */
    });

    return CustomPlaylistDisplay;
});

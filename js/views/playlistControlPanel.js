// Used with require.js setup
// If this file is being used, it looks like playlistSelector.js can be safely deleted. Try it and see if everything still works
define([
    'jquery',
    'underscore',
    'backbone',
    'views/playlistSelectorOption',
    'text!tpl/PlaylistControlPanelView.html',
    'models/playlist'
], function($, _, Backbone, playlistSelector, playlistControlPanelTemplate, Playlist) {

    var PlaylistControlPanel = Backbone.View.extend({

        events: {
            'click #newPlaylistAdd': 'playlistControlToggle',
            //'click #createCustomPlaylist': 'newCustomPlaylist'  //Moved to displayNewPlaylistOptionsView.js

        },

        initialize: function() {
            this.name = this.options.name;
            this.childViews = [];
            // child view will be the select element used for selecting a playlist (playlistSelector)
            this.collection.on('reset', this.addAll, this);
            this.blankPlaylist = new Playlist({'playlist_id': 0, 'title': 'No Playlist Selected'});
            //this.newPlaylist = new Playlist({userid: this.model.get('uid')});
            this.options.vent.on("app:getCustomPlaylists", this.getPlaylists, this);
            this.options.vent.on("app:closeChildViews", this.onClose, this);
            this.render();


        },

        render: function() {
            var compiled_template = _.template(playlistControlPanelTemplate);
            $(this.el).html(compiled_template());
            //this.getPlaylists();
            this.options.vent.trigger("app:getCustomPlaylists");
            return this;
        },

        getPlaylists: function() {
            var that = this;
            var request = {};
            request['userid'] = this.model.get('uid');
            this.collection.fetch({
                data: $.param(request, true),
                success: function() {
                    console.log('Fetched user\'s playlists successfully');
                    //console.log("the collection: "+that.playlists.toJSON());
                    //that.playlistControlPanelSwap();
                },
                error: function() {
                    console.log('Could not fetch user\'s playlists');
                }
            });

        },

        addOne: function(pl) {
            console.log("pl: "+JSON.stringify(pl));
            var childView = new playlistSelector({model: pl});

            $('#playlistSelector').append(childView.render().el);
            this.childViews.push(childView);
        },

        addAll: function() {
            //$('#playlistSelector').html('');
            console.log('What is THIS?? '+this.childViews);
            //console.log("el: "+$(this.el));
            this.addOne(this.blankPlaylist);
            var results = this.collection.models;
            console.log('playlistControlPanel RESULTS: '+JSON.stringify(results));
            for (var i=0; i < results.length; i++) {
                this.addOne(results[i]);
            }
            //this.collection.each(this.addOne);


        },




        /* Moved to displayNewPlaylistOptionsView.js 
        newCustomPlaylist: function() {
            alert("CLICK");
            /*
            if ($('#newPlaylistTitle').val() === '') {
                alert("Aint no title");
            } else {
                var that = this;
                var playlist = new Playlist({userid: this.model.get('uid')});
                console.log('Userid for custom playlist: '+this.model.get('uid'));
                playlist.save({'title': $('#newPlaylistTitle').val(), _csrf: this.model.get('token')}, {
                    success: function(model, resp) {
                        alert('New Playlist Saved');
                        console.log('RESPONSE: '+JSON.stringify(model));
                        that.onClose();
                        that.getPlaylists();
                    },
                    error: function(model, resp) {
                        console.log('Error saving new playlist');
                    }

                });
            }
            
        },
        */


        playlistControlToggle: function(ev) {
           //$('#createPlaylistContainer').toggle();
           $('.newPlaylistAddDropdown').toggleClass('expanded');
           $('#createPlaylistContainer').toggleClass('expanded');
        },


        onClose: function() {
           _.each(this.childViews, function(childView) {
               childView.close();
               console.log('closed view from playlistControlPanel childViews');
           });
        }

    });

    return PlaylistControlPanel;
});

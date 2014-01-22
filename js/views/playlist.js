window.CustomPlaylistPlaceholderView = Backbone.View.extend({

    //el: '#playlistEditor',

    initialize: function() {
        console.log('CustomPlaylistPlaceholderView model is: '+this.model.get('loggedIn') );
        this.model.on('all', this.render, this);  // Need to pass the third "this" param here for object context (otherwise the model wont be recognized)
        this.name = this.options.name;
        this.options.vent.on("app:selectedCustomPlaylist", this.render, this);
    },


    render: function() {
        var status = '';

        if (this.model.get('loggedIn')) {
            //alert($('#userPlaylists option:selected').text());
            //status = "Edit playlist here";
            status = 'Select A Playlist';

            if ($('#userPlaylists option:selected').val() > -1) {
                //alert('val0');
                //status = 'Select A Custom Playlist';
                status = $('#userPlaylists option:selected').text();
            }
        }
        else if (!this.model.get('loggedIn')) {
            status = "Need to login to edit playlist";
        }
        else {
            status = "An error occurred. Please refresh browser.";
        }

        $(this.el).html(this.template({status: status}));
        return this;
    },

    onClose: function() {
        this.model.off('all', this.render, this);
        this.options.vent.off("app:selectedCustomPlaylist", this.render, this);
    }


});


window.NewPlaylistTypeView = Backbone.View.extend({

    //el: '#playlistEditor',

    initialize: function() {
        this.name = this.options.name;
        this.render();
    },

    events: {
        'click #createCustomPlaylist': 'createCustomPlaylist'
    },

    render: function() {
        $(this.el).html(this.template());
        return this;
    },

    createCustomPlaylist: function() {
        if ($('#newPlaylistTitle').val() === '') {
            alert("Aint no title");
        }
        else {
            //alert($('#newPlaylistTitle').val());
        }
    }
});


window.DisplayENOptionsView = Backbone.View.extend({

    //el: '#playlistEditor',

    initialize: function() {
        this.name = this.options.name;
        this.render();
        //$('#slider').slider();
    },

    render: function() {
        $(this.el).html(this.template());
        return this;
    }
});


// Appends option values to the userPlaylists select box. Values are retruned from server/db
window.UserPlaylistsOptionView = Backbone.View.extend({

    tagName: "option",

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        //console.log('model: '+this.model);
        $(this.el).attr('value', this.model.get('playlist_id')).html(this.model.get('title'));
        return this;
    }

    //onClose: function() {

    //}

});


// Gets all playlists associated with user on collection reset. Then uses UserPlaylistsOptionView to append each one to the select box
window.UserPlaylistsView = Backbone.View.extend({

    tagName: "select",

    initialize: function() {
        _.bindAll(this, 'addOne', 'addAll');
        this.blankPlaylist = new Playlist({'playlist_id': 0, 'title': 'No Playlist Selected'});

        this.collection.bind('reset', this.addAll);
        this.childViews = [];
        this.name = this.options.name;
        this.model.on('change', this.routing, this);
        this.routing();
        // Event binding for event where newly created playlist model is saved (the save will emit the event app:newPlaylistCreated)
        this.options.vent.on("app:newPlaylistCreated", this.getPlaylists, this);
    },

    routing: function() {
        if (this.model.get('loggedIn')) {
            console.log('size of collection: '+this.collection.length);
            this.getPlaylists();
            $(this.el).show();
        }
        else {
            $(this.el).hide();
        }
    },

    getPlaylists: function() {
        $(this.el).html('');
        var request = {};
        request['userid'] = this.model.get('uid');
        this.collection.fetch({
            data: $.param(request, true),
            success: function() {
                console.log('fetched collection successfully');
                vent.trigger("app:selectedCustomPlaylist");
            },
            error: function() {
                console.log('error occurred');
            }

        });
    },

    addOne: function(playlist) {
        //for (var i = 0; i < this.collection.length; i++) {
            var childView = new UserPlaylistsOptionView({model: playlist});
            //console.log('this.el: '+$(this.el));
            $(this.el).append(childView.render().el);

            this.childViews.push(childView);
            //console.log('pushed view to childViews');
        //}
        //$(this.el).append(new UserPlaylistsOptionView({model: playlist}).render().el);

    },

    addAll: function() {
        this.addOne(this.blankPlaylist);
        this.collection.each(this.addOne);
    },

    onClose: function() {
        this.collection.unbind('reset', this.addAll);
        this.model.off('change', this.routing, this);
        _.each(this.childViews, function(childView) {
            childView.close();
            console.log('closed view from childViews');
            //if (childView.onClose) {
            //    childView.onClose();
            //}
        });
    }
});


window.PlaylistControlPanelView = Backbone.View.extend({

    initialize: function() {
        this.name = this.options.name;
        this.model.on('change', this.routing, this);
        this.render();
    },

    routing: function() {
        if (this.model.get('loggedIn')) {
            console.log('SHOWING MODEL');
            $(this.el).show();
        }
        else {
            $(this.el).hide();
        }
    },

    render: function() {
        //if (this.model.get('loggedIn')) {
            console.log('RENDERING MODEL');
            $(this.el).html(this.template());
            return this;
        //}
    }
});


window.CustomPlaylistDisplayView = Backbone.View.extend({

    tagName: "ul",

    events: {
        'click #loadPlaylist': 'loadPlaylist'
    },

    initialize: function() {
        _.bindAll(this, 'addOne', 'addAll');
        this.options.vent.on("app:selectedCustomPlaylist", this.getPlaylist, this);
        //this.options.vent.on("app:blankCustomPlaylist", this.blankPlaylist, this);
        //this.collection.bind('all', this.addAll);
        this.childViews = [];
        this.name = this.options.name;
    },


    getPlaylist: function() {
        $(this.el).html('');
        var that = this;
        var request = {};
        request['plId'] = this.options.plId;
        console.log('GETTING PLAYLIST FROM SERVER: '+this.options.plId);
        this.collection.fetch({
            data: $.param(request, true),
            success: function(resp) {
                //console.log('Got the playlist: '+resp+' length: '+resp.length);
                console.log('Got the playlist: '+resp+' length: '+that.collection.length);
                //that.addAll();
            },
            error: function() {
                // Pretty sure this is triggered (and the collection's 'parse' function is not) when string value is sent back from server.
                // Normally would recognize a string value, but since 'fetch' is a method on a collection object, it always expects some type of JSON
                // being returned from server. It can't parse strings or ints and will go to error callback here if one is encountered
                console.log('error occurred. No Playlist');
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
        this.collection.each(this.addOne);
        if (this.options.plId > 0) {
            $(this.el).append('<div id="loadPlaylist" class="button">Load Playlist</div>');
        }
    },

    addOne: function(track) {
        var childView = new CustomPlaylistItemView({model: track});
        $(this.el).append(childView.render().el);
        this.childViews.push(childView);
        //console.log('pushed view to childViews');
    },

    // Need an 'onClose' method to take care of removing nested (child) views and unbinding events from them
    onClose: function() {
        this.collection.unbind('reset', this.addAll);
        this.options.vent.off("app:selectedCustomPlaylist", this.getPlaylist, this);
        //this.model.off('change', this.routing, this);
        _.each(this.childViews, function(childView) {
            childView.close();
            console.log('closed view from childViews');
        });
    },

    loadPlaylist: function(ev) {
        // Code to loop through playlist and create the Spotify playlist from it
        var plTitle = this.options.pl;
        var spotifyIds = [];
        this.collection.each(function(obj) {
            spotifyIds.push(obj.get('spotify_id'));
        });
        console.log('LOADED COLLECTION: '+JSON.stringify(spotifyIds));
        app.appView.loadSpotifyPlaylist(plTitle, spotifyIds);
    }



});


// Appends individual track item to the #playlistEditor
window.CustomPlaylistItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function() {
        _.bindAll(this, 'render');
    },

    events: {
        'click .removeTrack': 'removeTrack'
    },

    render: function() {
        console.log('model: '+JSON.stringify(this.model));
        var deleteDiv = $("<div></div>", {});
        deleteDiv.addClass('removeTrack button');
        deleteDiv.html(' - ');
        $(this.el).html('Title: '+this.model.get('track_name')+' Artist: '+this.model.get('artist_name')+' Track ID: '+this.model.get('track_id')+' EchoNestAPI ID: '+this.model.get('api_id')+' SpotifyAPI ID: '+this.model.get('spotify_id'));//+'<div id="removeTrack" class="button">Remove From Playlist</div>');
        $(this.el).append(deleteDiv);
        return this;
    },

    removeTrack: function(ev) {
        console.log('removing track...');
        this.model.save({}, {
            success: function(model, resp) {
                console.log('Track deleted from playlist SUCCESS');
                vent.trigger("app:selectedCustomPlaylist");
                //$(this.el).remove();
                // Is $(this).close() needed here to clean up the view?
            },
            error: function(model, resp) {
                console.log('Error deleting track deleted from playlist');
            }
        });
    },

    onClose: function() {
        // Remove binding to 'click .removeTrack' event here. May not be necessary with latest version of backbone
    }
});


// Provides a blank div to replace any existing selected playlist view when user logs out
window.BlankPlaylistDisplayView = Backbone.View.extend({

});
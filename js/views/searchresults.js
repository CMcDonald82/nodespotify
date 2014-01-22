window.SearchResultsView = Backbone.View.extend({

    initialize: function() {
        this.userModel = this.options.userModel;
        this.userModel.on('change', this.render, this);
        this.childViews = [];
        this.name = this.options.name;
        this.render();
        //this.model.on('all', this.render, this);
        //this.options.vent.on("app:loginfail", this.getPlaylist, this);
        //this.options.vent.on("app:loginsuccess", this.getPlaylist, this);

    },

    render: function() {
        var results = this.model.models;
        var len = results.length;
        console.log('Page: '+this.options.page);
        var startPos = (this.options.page - 1) * 4;
        var endPos = Math.min(startPos + 4, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            console.log('Passing loggedIn status: '+this.userModel.get('loggedIn'));
            var childView = new SearchResultItemView({model: results[i], loggedIn: this.userModel.get('loggedIn')});
            this.childViews.push(childView);
            $('.thumbnails', this.el).append(childView.render().el);
        }

        $(this.el).append(new Paginator({model: this.model, page: this.options.page, term: this.options.term, artistSongs: this.options.artist}).render().el);

        return this;
    },

    onClose: function() {

        this.userModel.unbind('change', this.render, this);
        _.each(this.childViews, function(childView) {
            childView.close();
            console.log('closed view from childViews');
        });

    }
});


window.SearchResultItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        window.ArtistPlaylist.on('reset', this.displayPlaylist, this);

    },

    render: function() {
        //console.log('Model JSON: '+JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template(this.model.toJSON()));



        // Add clickable link for Artist
        var arLink = $("<a></a>", {
        });
        arLink.addClass('searchArtist');
        arLink.data('artistId', this.model.toJSON()['artist_id']);
        arLink.html(this.model.toJSON()['artist_name']);
        $(this.el).append(arLink);


        // Add button for creating artist-radio playlist
        var arDiv = $("<div></div>", {
            data: {
                attachedData: {'playlistType': 'artist-radio', 'artistId': this.model.toJSON()['artist_id']}
            }
        });
        arDiv.addClass('createArtistRadioPlist playlistButton button');
        arDiv.html('AR');
        $(this.el).append(arDiv);
        //console.log(arDiv);
        //console.log('Playlist Type Data: '+arDiv.data("attachedData").playlistType);
        //console.log('Artist ID Data: '+arDiv.data("attachedData").artistId);


        // Add button for creating song-radio playlist
        var srDiv = $("<div></div>", {
            data: {
                attachedData: {'playlistType': 'song-radio', 'songId': this.model.toJSON()['id']}
            }
        });
        srDiv.addClass('createSongRadioPlist playlistButton button');
        srDiv.html('SR');
        $(this.el).append(srDiv);
        //console.log(srDiv);
        //console.log('Playlist Type Data: '+srDiv.data("attachedData").playlistType);
        //console.log('Song ID Data: '+srDiv.data("attachedData").songId);


        // Add button for creating artist playlist
        var aDiv = $("<div></div>", {
            data: {
                attachedData: {'playlistType': 'artist', 'artistId': this.model.toJSON()['artist_id']}
            }
        });
        aDiv.addClass('createArtistPlist playlistButton button');
        aDiv.html('A');
        $(this.el).append(aDiv);
        //console.log(aDiv);
        //console.log('Playlist Type Data: '+aDiv.data("attachedData").playlistType);
        //console.log('Artist ID Data: '+aDiv.data("attachedData").artistId);


        // Add button for creating adding track to custom playlist
        if (this.options.loggedIn === true) {
            var addDiv = $("<div></div>", {
                data: {
                    attachedData: {'playlistType': 'custom', 'songId': this.model.toJSON()['id'], 'spotifyId': this.model.toJSON()['tracks'][0]['foreign_id'], 'trackName': this.model.toJSON()['title'], 'artistName': this.model.toJSON()['artist_name']}
                }
            });
            addDiv.addClass('addToCustomPlaylistButton button');
            addDiv.html('+');
            $(this.el).append(addDiv);
            //console.log(addDiv);
            //console.log('Playlist Type Data: '+addDiv.data("attachedData").playlistType);
            //console.log('Artist ID Data: '+addDiv.data("attachedData").artistId);


        }
        return this;
    },

    events: {
        //'click .playlistButton': 'makePlaylist',
        'click .addToCustomPlaylistButton': 'addToCustomPlaylist'

    },

    /*
    test: function() {
        alert('test');
    },
    */

    makePlaylist: function(ev) {

        var request = {};

        console.log('$(ev.currentTarget): '+ $(ev.currentTarget).data("attachedData").artistId);

        if ($(ev.currentTarget).data("attachedData").artistId) {
            request['artist_id'] = $(ev.currentTarget).data("attachedData").artistId; //$.data($(ev.currentTarget), "attachedData").artistId;
        }
        else if ($(ev.currentTarget).data("attachedData").songId) {
            request['song_id'] = $(ev.currentTarget).data("attachedData").songId;
        }

        //request['artist'] = 'Weezer';

        request['format'] = 'json';
        request['results'] = 20;
        request['bucket'] = ['id:spotify-WW', 'tracks'];
        request['limit'] = true;
        request['type'] = $(ev.currentTarget).data("attachedData").playlistType; //'artist-radio'
        request['variety'] = 0.2;
        request['distribution'] = 'focused'; //wandering ? 'wandering' : 'focused';

        console.log('Making Playlist of type: '+request['type']+' from Artist ID: '+request['artist_id']);

        window.ArtistPlaylist.fetch({
            data: $.param(request, true),

            success: function() {
                console.log("ARTIST PLAYLIST SUCCESS");
                // Try refactoring the displayPlaylist code to accept PREFERREDTITLE and TRACKS params. Pass in the request['type'] and
                // the ArtistPlaylist collection itself, respectively. Allows the displayPlaylist code to be reused for custom playlist loading

            }
        });
    },


    displayPlaylist: function() {

        //app.navigate('', {trigger: true});

        var embed = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:TRACKS" style="width:300px; height:380px; display:block" frameborder="0" allowtransparency="true" id="playlistPlayer"></iframe>';
        $("#results").empty();


        var tracks = "";
        var json = window.ArtistPlaylist.toJSON();
        console.log(JSON.stringify(json));
        for (var i = 0; i < json.length; i++) {
            var song = json[i];
            var tid = song.tracks[0].foreign_id.replace('spotify-WW:track:', '');
            tracks = tracks + tid + ',';
        }

        // Replaces the generic placeholders "TRACKS" and "PREFERREDTITLE" with the parsed response to create embedded, streamable versions of tracks
        var tembed = embed.replace('TRACKS', tracks);
        tembed = tembed.replace('PREFEREDTITLE', 'NEW Artist Playlist'); //artist + ' playlist');
        //var li = $("<div>").html(tembed);
        var li = $("<div>").addClass("poop").html(tembed);
        $("#results").append(li);
    },


    addToCustomPlaylist: function(ev) {

        var apiId = $(ev.currentTarget).data("attachedData").songId;
        var spotifyId = $(ev.currentTarget).data("attachedData").spotifyId.replace('spotify-WW:track:', '');
        var trackName = $(ev.currentTarget).data("attachedData").trackName;
        var artistName = $(ev.currentTarget).data("attachedData").artistName;
        var plId = $('#userPlaylists option:selected').val();
        //var request = {};

        console.log('API ID: '+apiId);
        console.log('SPOTIFY ID: '+spotifyId);
        //console.log('$(ev.currentTarget): '+ $(ev.currentTarget).data("attachedData").songId);

        /*
        request['song_id'] = $(ev.currentTarget).data("attachedData").songId;
        request['playlist_id'] = $('#userPlaylists option:selected').val();
        request['spotify_id'] = spotifyId;
        */

        // Code to add song to the playlist and store it in db (server.js)
        $.post('/save_track', { apiId: apiId, spotifyId: spotifyId, plId: plId, trackName: trackName, artistName: artistName }, function(data) {
            console.log('Saved Track '+data);
            console.log('Type Of Saved Track '+typeof(data));
            if (!data) {
                alert('This track already exists in the playlist '+$('#userPlaylists option:selected').text());
            }
            else {
                if (data === 'noplaylist') {
                    alert('No playlist is selected you retard!');
                } else {
                    alert('Successfully added track to playlist '+$('#userPlaylists option:selected').text());
                }
            }
        });

    }
});


/*
window.TopTenTracksResultsView = Backbone.View.extend({

    tagName: "ul",

    initialize: function() {
        this.userModel = this.options.userModel;
        this.userModel.on('change', this.render, this);
        this.childViews = [];
        this.name = this.options.name;
        this.render();
    },
});
*/

window.TopTenResultsView = Backbone.View.extend({

    tagName: "ul",

    initialize: function() {
        this.userModel = this.options.userModel;
        this.userModel.on('change', this.render, this);
        //this.collection.on('reset', this.render, this);
        this.options.vent.on("app:getTopTen", this.getResults, this);
        this.childViews = [];
        this.name = this.options.name;
        //this.getResults();
        //this.render();
    },


    // Might want to instead try making separate 'getResults' functions here and call them from appinit. See if this improves readability & modularization.
    // fetch the collection and make TopTenResultsView bound to collection reset (calling render())
    getResults: function() {
        console.log("SELECTED GENRE: "+$('#topTenGenres').val());
        var genre = $('#topTenGenres').val();
        var that = this;
        var request = {};
        if (this.options.type === "songs") {
            if (genre !== "all") {
                request['style'] = genre;
            }
            request['song_min_hotttnesss'] = 0.8;
            request['artist_min_familiarity'] = 0.8;
            request['sort'] = 'song_hotttnesss-desc';
            request['bucket'] = ['id:spotify-WW', 'tracks']; //'id:7digital-US', 'tracks'];
            request['limit'] = true;
        } else if (this.options.type === "artists") {
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
        var results = this.collection.models;
        var len = results.length;
        var childView;

        for (var i = 0; i < len; i++) {
            //console.log('Passing loggedIn status: '+this.userModel.get('loggedIn'));
            if (this.options.type === "songs") {
                childView = new SearchResultItemView({model: results[i], loggedIn: this.userModel.get('loggedIn')});
            } else if (this.options.type === "artists") {
                childView = new ArtistResultItemView({model: results[i], loggedIn: this.userModel.get('loggedIn')});
            } else {
                childView = new StyleResultItemView({model: results[i], loggedIn: this.userModel.get('loggedIn')});
            }
            this.childViews.push(childView);
            $(this.el).append(childView.render().el);
        }
        return this;
    },

    onClose: function() {

        this.userModel.unbind('change', this.render, this);
        this.collection.off('reset', this.render, this);
        _.each(this.childViews, function(childView) {
            childView.close();
            console.log('closed view from childViews');
        });
    }
});


window.ArtistResultItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    // Need to attach events here for clicking the .playlistButton (just like in SearchResultItemView). Might be best to refactor this piece.

    render: function() {
        console.log('Model JSON: '+JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template(this.model.toJSON()));

        // Add clickable link for Artist
        var arLink = $("<a></a>", {
        });
        arLink.addClass('searchArtist');
        arLink.data('artistId', this.model.toJSON()['id']);
        arLink.html(this.model.toJSON()['name']);
        $(this.el).append(arLink);


        // Add button for creating artist-radio playlist
        // artistId is 'id' when using EN's artist search functionality
        var arDiv = $("<div></div>", {
            data: {
                attachedData: {'playlistType': 'artist-radio', 'artistId': this.model.toJSON()['id']}
            }
        });
        arDiv.addClass('createArtistRadioPlist playlistButton button');
        arDiv.html('AR');
        $(this.el).append(arDiv);
        console.log(arDiv);
        console.log('Playlist Type Data: '+arDiv.data("attachedData").playlistType);
        console.log('Artist ID Data: '+arDiv.data("attachedData").artistId);


        // Add button for creating artist playlist
        var aDiv = $("<div></div>", {
            data: {
                attachedData: {'playlistType': 'artist', 'artistId': this.model.toJSON()['id']}
            }
        });
        aDiv.addClass('createArtistPlist playlistButton button');
        aDiv.html('A');
        $(this.el).append(aDiv);
        console.log(aDiv);
        console.log('Playlist Type Data: '+aDiv.data("attachedData").playlistType);
        console.log('Artist ID Data: '+aDiv.data("attachedData").artistId);

        return this;
    }
});


window.StyleResultItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function() {
        console.log('Model JSON: '+JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    }
});

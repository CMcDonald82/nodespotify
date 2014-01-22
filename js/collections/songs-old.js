//var app = app || {};

//(function() {
    //'use strict';

    // Used to get a collection of Songs
    window.SongList = Backbone.Collection.extend({

        model: window.Song,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var songUrlExt = 'song/search?api_key=FHPFXUKUGHZWWUXPR';
            var url = urlBase + songUrlExt;
            console.log('Request URL: '+url);
            return url;
        },

        parse: function(data) {
            console.log("PARSE");
            console.log('Response from server: '+data.response.songs);

            for (var i = 0; i < data.response.songs.length; i++) {
                var song = data.response.songs[i];
                //console.log("Found song: "+song['title']);

            }

            return data.response.songs;
        }

    });


    window.PlaylistSong = Backbone.Model.extend({

        url: "playlist_track"

    });

    window.PlaylistSongs = Backbone.Collection.extend({

        model: window.PlaylistSong,

        url: "get_playlist",

        parse: function(data) {
            //console.log('Response from server: '+data);
            if (data === "err") {
                console.log('NO PLAYLIST SELECTED');
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    var track = data[i];
                    console.log("Found track: "+track['track_id']+" apiId: "+track['api_id']);
                }
            }
            return data;
        }
    });


    window.Playlist = Backbone.Model.extend({

        /*
        defaults: {
            userid: ''
        },
        */

        url: "save_playlist",

        //initialize: function() {
        //    this.set({userid: this.options.userid});
        //},

        tracks: new PlaylistSongs() //Songs()

    });


    window.Playlists = Backbone.Collection.extend({

        model: window.Playlist,

        url: "playlists",

        parse: function(data) {
            /*
            if (data === 'err') {
                var res = {};
                res['playlist_id'] = 0;
                res['title'] = 'Error';
                return res;
            }
            */
            for (var i = 0; i < data.length; i++) {
                var pl = data[i];
                console.log("Found playlist: "+pl['title']);
            }
            return data;
        }
    });


    window.BeatportList = Backbone.Collection.extend({
        model: window.Song,

        url: function() {
            var urlBase = 'http://api.beatport.com/';
            var songUrlExt = 'catalog/tracks?';
            var url = urlBase + songUrlExt;
            console.log('Request URL: '+url);
            return url;
        },

        parse: function(data) {
            console.log("PARSE BEATPORT");
            console.log('Response from server: '+data.results);
            for (var i = 0; i < data.results.length; i++) {
                var song = data.results[i];
                console.log("Found song: "+song['name']);
            }
            return data.results;
        }
    });


    // Change this to EchoNestPlaylist (since this type of collection will be used to create, Artist, Artist-Radio & Song-Radio playlists
    // depending on params passed to it. All 3 of these types of playlist call the same URL
    window.ArtistPlaylist = Backbone.Collection.extend({
        model: window.Song,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var playlistUrlExt = 'playlist/static?api_key=FHPFXUKUGHZWWUXPR';
            var url = urlBase + playlistUrlExt;
            return url;
        },

        parse: function(data) {
            console.log("PARSE ARTIST PLAYLIST RESPONSE");

            for (var i = 0; i < data.response.songs.length; i++) {
                var song = data.response.songs[i];
                //console.log("Found song: "+song['title']);
            }

            return data.response.songs;
        }
    });


    // Used to get a collection of artists
    window.ArtistList = Backbone.Collection.extend({

        model: window.Artist,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var playlistUrlExt = 'artist/search?api_key=FHPFXUKUGHZWWUXPR';
            var url = urlBase + playlistUrlExt;
            return url;
        },


        parse: function(data) {
            console.log("PARSE ARTIST LIST RESPONSE: "+data.response.artists);

            for (var i = 0; i < data.response.artists.length; i++) {
                var artist = data.response.artists[i];
                console.log("Found ARTIST: "+artist['name']);
            }

            return data.response.artists;
        }

    });


    window.StyleList = Backbone.Collection.extend({

        model: window.Style,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var playlistUrlExt = 'artist/top_terms?api_key=FHPFXUKUGHZWWUXPR';
            var url = urlBase + playlistUrlExt;
            return url;
        },

        parse: function(data) {
            console.log("PARSE STYLE LIST RESPONSE");

            for (var i = 0; i < data.response.terms.length; i++) {
                var song = data.response.terms[i];
                //console.log("Found song: "+song['title']);
            }
            return data.response.terms;
        }
    });

    /*
    window.TopTenHotTracks = Backbone.Collection.extend({

        model: window.Song,

        url: function() {
            var urlBase = 'http://developer.echonest.com/api/v4/';
            var playlistUrlExt = 'song/search?api_key=FHPFXUKUGHZWWUXPR';
            var url = urlBase + playlistUrlExt;
            return url;
        },

        parse: function(data) {
            console.log("PARSE TopTenHotTracks RESPONSE");

            for (var i = 0; i < data.response.songs.length; i++) {
                var song = data.response.songs[i];
                //console.log("Found song: "+song['title']);
            }
            return data.response.songs;
        }

    });
    */

    window.Songs = new SongList();
    //console.log("Created new, blank collection");

    window.BeatportSongs = new BeatportList();
    //console.log("Created new, blank Beatport collection");

    window.ArtistPlaylist = new ArtistPlaylist();
    //console.log("Created new, blank Artist Playlist");

    window.playlistSongCollection = new Playlist();

    // For populating the 3 top-10 lists at bottom of page
    window.TopTenHotTracks = new SongList();
    window.TopTenHipArtists = new ArtistList();
    window.TopTenStyleTrends = new StyleList();


//}());

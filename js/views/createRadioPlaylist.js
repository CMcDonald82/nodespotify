// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var CreateRadioPlaylistView = Backbone.View.extend({

        /*
        events: {

        },
        */

        initialize: function() {
            //this.options.vent.on("app:radio", this.makeRadioPlaylist, this);
        },

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
        }


    });

    return CreateRadioPlaylistView;
});

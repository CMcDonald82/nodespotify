// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone'

], function($, _, Backbone) {

    var CustomPlaylistItem = Backbone.View.extend({

        tagName: "li",

        className: "playlistItem ui-state-default",

        initialize: function() {
            //_.bindAll(this, 'render');
        },

        events: {
            'click .removeTrack': 'removeTrack'
        },

        render: function() {
            $(this.el).data('spotify_id', this.model.get('spotify_id'));

            console.log('model: '+JSON.stringify(this.model));
            var sortableSpan = $("<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>");
            var deleteDiv = $("<div></div>", {});
            var container = $("<div class='arrowIconContainer'></div>");
            var trackDiv = $("<div class='customPlaylistItemTrack'></div>");
            var artistDiv = $("<div class='customPlaylistItemArtist'></div>");
            trackDiv.html(this.model.get('track_name'));
            artistDiv.html(this.model.get('artist_name'));
            
            deleteDiv.addClass('removeTrack');
            //deleteDiv.html(' - ');
            container.append(sortableSpan);
            $(this.el).append(container);
            $(this.el).append(trackDiv);
            $(this.el).append(artistDiv);
            
            //$(this.el).append('Title: '+this.model.get('track_name')+' Artist: '+this.model.get('artist_name')+' Track ID: '+this.model.get('track_id')+' EchoNestAPI ID: '+this.model.get('api_id')+' SpotifyAPI ID: '+this.model.get('spotify_id'));//+'<div id="removeTrack" class="button">Remove From Playlist</div>');
            
            $(this.el).append(deleteDiv);
            $(this.el).attr('id', this.model.get('track_id'));
            return this;
        },

        // Refactor to use the removeTrackFromPlaylist function in mongoFunctions (will need an explicit $.post here instead of model.save)
        /*
        removeTrack: function(ev) {
            console.log('removing track...');
            var that = this;
            var id = this.model.get('track_id');
            this.model.save({_csrf: this.options.authUser.get('token')}, {
                success: function(model, resp) {
                    console.log('Track deleted from playlist SUCCESS');
                    that.options.vent.trigger("app:selectedCustomPlaylist");
                    alert('Track ID '+id+' deleted');
                    //$(this.el).remove();
                    // Is $(this).close() needed here to clean up the view?
                },
                error: function(model, resp) {
                    console.log('Error deleting track deleted from playlist');
                }
            });
        },
        */

        // New removeTrack function (keep this one and toss the one above if this one works)
        removeTrack: function(ev) {
            var that = this;
            var plId = $('#playlistSelector option:selected').val();
            var id = this.model.get('track_id');
            
            $.post('/delete_playlist_track', { playlist_id: plId, track_id: id, _csrf: this.options.authUser.get('token') }, function(data) {
                //if (!data) {
                //    alert('This track already exists in the playlist '+$('#playlistSelector option:selected').text());
                //}
                //else {
                    if (data === 'noplaylist') {
                        alert('No playlist is selected!');
                    } else if (data === 'invalidPlaylist') {
                        alert('There is no such playlist!');
                    } else if (data === 'errorSaving') {
                        alert('There was an error saving the playlist');
                    } else {
                        alert('Successfully deleted track from playlist!');
                        that.options.vent.trigger("app:selectedCustomPlaylist");
                    }
                //}
            });

        },

        onClose: function() {
            // Remove binding to 'click .removeTrack' event here. May not be necessary with latest version of backbone
        }

    });

    return CustomPlaylistItem;
});


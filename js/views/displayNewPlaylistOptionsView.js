// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'models/playlist',
    'text!tpl/DisplayNewPlaylistOptionsView.html'
], function($, _, Backbone, Playlist, ENOptionsTemplate) {

    var DisplayNewOptionsView = Backbone.View.extend({

        events: {
            'click #createCustomPlaylist': 'newCustomPlaylist'
        },

        initialize: function() {
            this.name = this.options.name;
            this.render();
        },

        render: function() {
            var compiled_template = _.template(ENOptionsTemplate);
            $(this.el).html(compiled_template({uname: this.options.username}));
            return this;
        },
        
        newCustomPlaylist: function() {
            //alert("newCustomPlaylist");
            
            if ($('#newPlaylistTitle').val() === '') {
                alert("Please enter a title for your new playlist");
            } else {
                var that = this;
                var playlist = new Playlist({userid: this.model.get('uid')});
                console.log('Userid for custom playlist: '+this.model.get('uid'));
                playlist.save({'title': $('#newPlaylistTitle').val(), _csrf: this.model.get('token')}, {
                    success: function(model, resp) {
                        alert('New Playlist Saved');
                        console.log('RESPONSE: '+JSON.stringify(model));
                        //that.onClose();
                        //that.getPlaylists();
                        that.options.vent.trigger("app:closeChildViews");
                        that.options.vent.trigger("app:getCustomPlaylists");
                    },
                    error: function(model, resp) {
                        console.log('Error saving new playlist');
                    }

                });
            }
            
        }
        

    });

    return DisplayNewOptionsView;
});
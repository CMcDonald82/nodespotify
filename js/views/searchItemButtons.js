// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone'

], function($, _, Backbone) {

    var SearchItemButtons = Backbone.View.extend({

        className: "searchButtonsContainer", //"searchButtons",

        initialize: function() {
            this.params = this.options.params;  // was formerly this.model.toJSON()['xyz']
            this.width = this.options.width;
        },

        render: function() {

            //console.log("Is this an artist playlist? "+this.options.type);
            //console.log("WIDTH: "+this.width);

            $(this.el).append("<h6>Make Radio Station</h6><h5></h5>");

            var searchButtons = $("<div class='searchButtons'></div>");
            $(this.el).append(searchButtons);

            if (this.options.type !== "song") {
                console.log("OPTIONS TYPE IS SONG");
                $(searchButtons).addClass("artistSearchButtons");
            }

            // Add button for creating artist playlist
            var aButtonContainer = $("<div class='aCont'></div>");
            var aDiv = $("<div></div>", {
                data: {
                    attachedData: {'playlistType': 'artist', 'artistId': this.params['artist_id']}
                }
            });
            if (this.width === 50) {
                aButtonContainer.addClass('btn-50');
            } else if (this.width === 33) {
                aButtonContainer.addClass('btn-33');
            } else if (this.width === 25) {
                aButtonContainer.addClass('btn-25');
            }
            aDiv.addClass('createArtistPlist playlistButton full-width btnDiv');
            aDiv.html('Artist');
            aButtonContainer.append(aDiv);
            $(searchButtons).append(aButtonContainer);
            //console.log(aDiv);
            //console.log('Playlist Type Data: '+aDiv.data("attachedData").playlistType);
            //console.log('Artist ID Data: '+aDiv.data("attachedData").artistId);



            // Add button for creating artist-radio playlist
            var arButtonContainer = $("<div class='arCont'></div>");
            var arDiv = $("<div></div>", {
                data: {
                    attachedData: {'playlistType': 'artist-radio', 'artistId': this.params['artist_id']}
                }
            });
            if (this.width === 50) {
                arButtonContainer.addClass('btn-50');
            } else if (this.width === 33) {
                arButtonContainer.addClass('btn-33');
            } else if (this.width === 25) {
                arButtonContainer.addClass('btn-25');
            }
            arDiv.addClass('createArtistRadioPlist playlistButton full-width btnDiv');
            arDiv.html('Similar Artists');
            arButtonContainer.append(arDiv);
            $(searchButtons).append(arButtonContainer);
            //console.log(arDiv);
            //console.log('Playlist Type Data: '+arDiv.data("attachedData").playlistType);
            //console.log('Artist ID Data: '+arDiv.data("attachedData").artistId);

            if (this.options.type === "song") {
                // Add button for creating song-radio playlist
                var srButtonContainer = $("<div class='sCont'></div>");
                var srDiv = $("<div></div>", {
                    data: {
                        attachedData: {'playlistType': 'song-radio', 'songId': this.params['song_id']}
                    }
                });
                if (this.width === 33) {
                    srButtonContainer.addClass('btn-33');
                } else if (this.width === 25) {
                    srButtonContainer.addClass('btn-25');
                }
                srDiv.addClass('createSongRadioPlist playlistButton full-width btnDiv');
                srDiv.html('Similar Songs');
                srButtonContainer.append(srDiv);
                $(searchButtons).append(srButtonContainer);

                //$('.aCont').addClass("btn-33");
                //$('.aCont').removeClass("btn-50");
                //$('.btn-50').addClass("btn-33").removeClass("btn-50");
                //$('.btn-50').toggleClass('btn-50 btn-33');

                console.log("ADDED SONG RADIO BUTTON");
                //console.log(srDiv);
                //console.log('Playlist Type Data: '+srDiv.data("attachedData").playlistType);
                //console.log('Song ID Data: '+srDiv.data("attachedData").songId);



                // Add button for creating adding track to custom playlist
                if (this.options.loggedIn === true) {
                    var addButtonContainer = $("<div class='addCont'></div>");
                    var addDiv = $("<div></div>", {
                        data: {
                            attachedData: {'playlistType': 'custom', 'songId': this.params['song_id'], 'spotifyId': this.params['spotify_id'], 'trackName': this.params['track_name'], 'artistName': this.params['artist_name']}
                        }
                    });
                    if (this.width === 25) {
                        addButtonContainer.addClass('btn-25');
                    }
                    addDiv.addClass('addToCustomPlaylistButton full-width btnDiv');
                    addDiv.html('Add To Radio');
                    addButtonContainer.append(addDiv);
                    $(searchButtons).append(addButtonContainer);

                    //$('.btn-50').toggleClass('btn-50 btn-25');
                    $('.btn-33').toggleClass('btn-33 btn-25');
                    //console.log(addDiv);
                    //console.log('Playlist Type Data: '+addDiv.data("attachedData").playlistType);
                    //console.log('Artist ID Data: '+addDiv.data("attachedData").artistId);
                }

            }
            return this;
        }


    });

    return SearchItemButtons;
});

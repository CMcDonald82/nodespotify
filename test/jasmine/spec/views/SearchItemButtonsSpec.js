define(['views/searchItemButtons', 'models/authuser'], function(SearchItemButtons, authuser) {

    return describe('View :: SearchItemButtons', function() {

        var authUser = new authuser({ token: 'mytoken', loggedIn: true });
        var params = {};
        params['artist_id'] = "1234";
        params['song_id'] = "5678";
        params['spotify_id'] = "spotify-5678";
        params['track_name'] = "Black Dog";
        params['artist_name'] = "Led Zeppelin";

        describe('#initialize', function() {

            beforeEach(function() {
                this.buttons = new SearchItemButtons({ params: params });
            });

            afterEach(function() {
                this.buttons.remove();
            });

            it('should properly initialize the view', function() {
                this.buttons.initialize();
                expect(this.buttons.params).toEqual(params);
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.buttons = new SearchItemButtons({ params: params, loggedIn: authUser.get('loggedIn'), type: "song" });
            });

            afterEach(function() {
                this.buttons.remove();
            });

            it('makes sure that view renders properly', function() {
                $('#musicapp').html(this.buttons.render().el);
                expect($('.createArtistPlist')).toHaveText("Artist");
                expect($('.createArtistPlist').data("attachedData")['playlistType']).toEqual("artist");
                expect($('.createArtistPlist').data("attachedData")['artistId']).toEqual("1234");
                expect($('.createArtistRadioPlist')).toHaveText("Similar Artists");
                expect($('.createArtistRadioPlist').data("attachedData")['playlistType']).toEqual("artist-radio");
                expect($('.createArtistRadioPlist').data("attachedData")['artistId']).toEqual("1234");
                expect($('.createSongRadioPlist')).toHaveText("Similar Songs");
                expect($('.createSongRadioPlist').data("attachedData")['playlistType']).toEqual("song-radio");
                expect($('.createSongRadioPlist').data("attachedData")['songId']).toEqual("5678");
                expect($('.addToCustomPlaylistButton')).toHaveText("Add To Radio");
                expect($('.addToCustomPlaylistButton').data("attachedData")['playlistType']).toEqual("custom");
                expect($('.addToCustomPlaylistButton').data("attachedData")['songId']).toEqual("5678");
                expect($('.addToCustomPlaylistButton').data("attachedData")['spotifyId']).toEqual("spotify-5678");
                expect($('.addToCustomPlaylistButton').data("attachedData")['trackName']).toEqual("Black Dog");
                expect($('.addToCustomPlaylistButton').data("attachedData")['artistName']).toEqual("Led Zeppelin");
            });
        });


    });

});

define(['views/customPlaylistItem', 'models/song', 'models/authuser'], function(CustomPlaylistItem, Song, Authuser) {

    return describe('View :: CustomPlaylistItem', function() {

        var itemModel = new Song({
            track_name: "Jump",
            artist_name: "Kris Kross",
            track_id: 'Jump1234',
            api_id: '1234',
            spotify_id: '5678'
        });

        var authuser = new Authuser({token: "my_token"});


        describe('#render', function() {

            beforeEach(function() {
                this.plItem = new CustomPlaylistItem({model: itemModel});
            });

            afterEach(function() {
                this.plItem.remove();
            });

            it('tests that view is rendered properly', function() {
                $('#musicapp').html(this.plItem.render().el);
                //expect($('.playlistItem')).toHaveText('Title: Jump Artist: Kris Kross Track ID: Jump1234 EchoNestAPI ID: 1234 SpotifyAPI ID: 5678'+'<div class="removeTrack button"> - </div>');
                // The .removeTrack button now has an 'X' image instead of a '-' char 
                //expect($('.removeTrack')).toHaveText('-');
            });
        });


        describe('#removeTrack', function() {

            beforeEach(function() {
                var testSelect = '<select id="playlistSelector"><option value="1">Playlist 1</option><option value="2" selected>Playlist 2</option></select>';
                setFixtures(testSelect);
                this.vent = new _.extend({}, Backbone.Events);
                this.plItem = new CustomPlaylistItem({model: itemModel, authUser: authuser, vent: this.vent});
                // Now making a direct $.post call to server instead of posting via the model's save() method
                //this.eventSpy = sinon.stub(this.plItem.model, 'save').yieldsTo('success');
                this.server = sinon.fakeServer.create();

                this.server.respondWith(
                    "POST",
                    "/delete_playlist_track",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify({'success'})
                    ]
                );
                spyOn(window, "alert");
            });

            afterEach(function() {
                this.plItem.remove();
                //this.eventSpy.restore();
                this.server.restore();
            });

            it('tests that track is removed from playlist when .removeTrack button is clicked', function() {
                this.plItem.removeTrack();
                //expect(this.eventSpy.calledOnce).toBe(true);
                
                this.server.respond();
                sinon.assert.callCount($.post, 1);

                expect(window.alert).toHaveBeenCalled();
                sinon.assert.calledWith($.post, '/delete_playlist_track', { _csrf: "mytoken", playlist_id: "2", track_id: "Jump1234" });

            });
        });


    });

});

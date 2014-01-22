define(['collections/playlistsongs', '../testFixtures'], function(PlaylistSongs, fixtures) {


    return describe('Collection :: Playlistsongs', function() {

        var plsongs = new PlaylistSongs();

        describe('#url', function() {

            it('makes sure url is constructed properly', function() {
                expect(plsongs.url).toEqual('get_playlist');
            });
        });


        describe('#parse', function() {

            var jsonResponse = fixtures.playlistSongsFixture;

            beforeEach(function() {
                this.server = sinon.fakeServer.create();
                this.server.respondWith(
                    "GET",
                    'get_playlist',
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify(jsonResponse)
                    ]
                );
            });

            afterEach(function() {
                this.server.restore();
            });

            it('parses data from server correctly', function() {
                plsongs.fetch();
                this.server.respond();
                console.log("TEST PLAYLIST SONGS: "+JSON.stringify(plsongs));
                expect(plsongs.length).toEqual(3);
            });
        });





    });

});

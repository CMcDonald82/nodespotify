define(['collections/playlists', '../testFixtures'], function(Playlists, fixtures) {

    var lists = new Playlists();

    return describe('Collection :: Playlists', function() {

        describe('#url', function() {

            it('makes sure url is constructed properly', function() {
                expect(lists.url).toEqual('playlists');
            });
        });


        describe('#parse', function() {
            var jsonResponse = fixtures.playlistsFixture;

            console.log(JSON.stringify(jsonResponse));

            beforeEach(function() {
                this.server = sinon.fakeServer.create();
                this.server.respondWith(
                    "GET",
                    'playlists',
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
                lists.fetch();
                this.server.respond();
                console.log("PLAYLIST: "+JSON.stringify(lists));
                expect(lists.length).toEqual(4);
            });
        });

    });
});
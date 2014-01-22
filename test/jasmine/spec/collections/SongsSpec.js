define(['collections/songs', '../testFixtures'], function(Songs, fixtures) {


    return describe('Collection :: Songs', function() {

        var songs = new Songs();

        describe('#url', function() {

            it('makes sure url is constructed properly', function() {
                expect(songs.url()).toEqual('http://developer.echonest.com/api/v4/song/search?api_key=ZKIBJJ0Q8BLHRKH1P');
            });
        });


        describe('#parse', function() {

            var jsonResponse = fixtures.radioTracksFixture;

            beforeEach(function() {
                this.server = sinon.fakeServer.create();
                this.server.respondWith(
                    "GET",
                    'http://developer.echonest.com/api/v4/song/search?api_key=ZKIBJJ0Q8BLHRKH1P',
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
                songs.fetch();
                this.server.respond();
                expect(songs.length).toEqual(3);
            });
        });




    });

});

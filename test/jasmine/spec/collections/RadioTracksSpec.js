define(['collections/radioTracks', '../testFixtures'], function(RadioTracks, fixtures) {

    var tracks = new RadioTracks();

    return describe('Collection :: RadioTracks', function() {

        describe('#url', function() {

            it('makes sure url is constructed correctly', function() {
                expect(tracks.url()).toEqual('http://developer.echonest.com/api/v4/playlist/static?api_key=ZKIBJJ0Q8BLHRKH1P');
            });
        });


        describe('#parse', function() {
            var jsonResponse = fixtures.radioTracksFixture;

            console.log(JSON.stringify(jsonResponse));

            beforeEach(function() {
                this.server = sinon.fakeServer.create();
                this.server.respondWith(
                    "GET",
                    "http://developer.echonest.com/api/v4/playlist/static?api_key=ZKIBJJ0Q8BLHRKH1P",
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
                tracks.fetch();
                this.server.respond();
                console.log("LIST: "+JSON.stringify(tracks));
                expect(tracks.length).toEqual(3);
            });
        });


    });
});

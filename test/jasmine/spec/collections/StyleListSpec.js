define(['collections/styleList', '../testFixtures'], function(StyleList, fixtures) {


    return describe('Collection :: StyleList', function() {

        var styles = new StyleList();

        describe('#url', function() {

            it('makes sure url is constructed properly', function() {
                expect(styles.url()).toEqual('http://developer.echonest.com/api/v4/artist/top_terms?api_key=ZKIBJJ0Q8BLHRKH1P');
            });
        });


        describe('#parse', function() {

            var jsonResponse = fixtures.styleListFixture;

            beforeEach(function() {
                this.server = sinon.fakeServer.create();
                this.server.respondWith(
                    "GET",
                    'http://developer.echonest.com/api/v4/artist/top_terms?api_key=ZKIBJJ0Q8BLHRKH1P',
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
                styles.fetch();
                this.server.respond();
                expect(styles.length).toEqual(10);
            });
        });




    });

});

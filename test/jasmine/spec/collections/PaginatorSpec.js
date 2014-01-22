define(['collections/pagination', '../testFixtures'], function(Paginator, fixtures) {

    var pager = new Paginator();

    return describe('Collection :: Paginator', function() {

        describe('#url', function() {

            it('makes sure url is constructed properly', function() {
                expect(pager.paginator_core.url()).toEqual('http://developer.echonest.com/api/v4/song/search?api_key=ZKIBJJ0Q8BLHRKH1P');
            });
        });

        describe('#parse', function() {
            var jsonResponse = fixtures.paginatorFixture;

            console.log(JSON.stringify(jsonResponse));

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

            /*
            it('parses data from server correctly', function() {
                pager.fetch();
                this.server.respond();
                console.log("PAGINATOR: "+JSON.stringify(pager));
                expect(pager.length).toEqual(1);
            });
            */
        });
    });
});
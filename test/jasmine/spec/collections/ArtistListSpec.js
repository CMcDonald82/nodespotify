define(['collections/artistList', 'models/artist', '../testFixtures'], function(ArtistList, Artist, fixtures) {

    var list = new ArtistList();

    return describe('Collection :: ArtistList', function() {

        /*
        beforeEach(function() {
            this.artistStub = sinon.stub(window, "ArtistModel");
            this.model = new Backbone.Model({
                id: 5,
                title: "Foo"
            });
            this.artistStub.returns(this.model);
            this.artists = new ArtistList();
            this.artists.model = ArtistModel;
            this.artists.add({
                id: 5,
                title: "Foo"
            });
        });

        afterEach(function() {
            this.artistStub.restore();
        });

        it("should add a model", function() {
            expect(this.artists.length).toEqual(1);
        });

        it("should find a model by id", function() {
            expect(this.todos.get(5).get("id")).toEqual(5);
        });
        */

        describe('#url', function() {

            it('makes sure url is constructed correctly', function() {
                expect(list.url()).toEqual('http://developer.echonest.com/api/v4/artist/search?api_key=ZKIBJJ0Q8BLHRKH1P');
            });
        });


        describe('#parse', function() {
            var jsonResponse = fixtures.artistListFixture;

            console.log(JSON.stringify(jsonResponse));

            beforeEach(function() {
                this.server = sinon.fakeServer.create();
                this.server.respondWith(
                    "GET",
                    "http://developer.echonest.com/api/v4/artist/search?api_key=ZKIBJJ0Q8BLHRKH1P",
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
                list.fetch();
                this.server.respond();
                console.log("LIST: "+JSON.stringify(list));
                expect(list.length).toEqual(1);
            });
        });


    });
});

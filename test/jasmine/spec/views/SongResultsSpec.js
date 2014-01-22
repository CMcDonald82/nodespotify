define(['views/songResults', 'collections/pagination', 'collections/songs', 'models/authuser', '../testFixtures'], function(SongResults, Paginator, Songs, authuser, fixtures) {


    return describe('View :: SongResults', function() {

        var pager = new Paginator([
            {"tracks":
                [
                    { "foreign_release_id":"spotify-WW:release:7",
                        "catalog":"spotify-WW",
                        "foreign_id":"spotify-WW:track:62",
                        "id":"STR"
                    }
                ],
                "artist_id":"AR",
                "id":"SO",
                "artist_name":"Kanye West",
                "title":"Stronger"
            },
            {"tracks":
                [
                    { "foreign_release_id":"spotify-WW:release:8",
                        "catalog":"spotify-WW",
                        "foreign_id":"spotify-WW:track:629",
                        "id":"FIR"
                    }
                ],
                "artist_id":"LW",
                "id":"FI",
                "artist_name":"Lil Wayne",
                "title":"Fireman"
            }
        ]);
        pager.bootstrap();
        var songCollection = new Songs();
        var authUser = new authuser({ token: 'mytoken', loggedIn: true });
        var request = {};
        request['combined'] = "term";
        request['format'] = 'jsonp';
        request['results'] = 20;
        request['bucket'] = ['id:spotify-WW', 'tracks'];
        request['limit'] = true;
        request['sort'] = 'song_hotttnesss-desc';

        var jsonResponse = fixtures.paginatorFixture;




        describe('#initialize', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.songResults = new SongResults({ paginatorCollection: pager, collection: songCollection, userModel: authUser, vent: this.vent, requestParams: request, artist: false, name: "SongResultsView" });
                this.eventSpy = sinon.stub(this.songResults.paginatorCollection, 'fetch').yieldsTo('success');
                spyOn(this.songResults.paginatorCollection, 'pager');
                spyOn(this.songResults, 'render');
                //spyOn(this.songResults, 'addOne');
                //spyOn(this.songResults, 'addAll');
            });

            afterEach(function() {
                this.songResults.remove();
                this.eventSpy.restore();
            });

            it('should properly initialize the view', function() {
                this.songResults.initialize();
                expect(this.songResults.userModel).toEqual(authUser);
                expect(this.songResults.paginatorCollection).toEqual(pager);
                this.songResults.userModel.set({ loggedIn: false });
                expect(this.songResults.render).toHaveBeenCalled();
                expect(this.songResults.name).toEqual("SongResultsView");
                expect(this.songResults.artist).toBeFalsy();
                expect(this.eventSpy.calledOnce).toBe(true);
                expect(this.songResults.paginatorCollection.pager).toHaveBeenCalled();

                this.songResults.paginatorCollection.reset();
                //expect(this.songResults.addAll).toHaveBeenCalled();
                expect(this.songResults.render).toHaveBeenCalled();

                /*
                pager.add([
                    {'playlist_id': 1, 'title': 'Playlist 1'},
                    {'playlist_id': 2, 'title': 'Playlist 2'}
                ]);

                expect(this.songResults.addOne.callCount).toEqual(2);
                */

            });
        });



        describe('#addAll', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.songResults = new SongResults({ paginatorCollection: pager, collection: songCollection, userModel: authUser, vent: this.vent, requestParams: request, artist: false, name: "SongResultsView" });
                spyOn(this.songResults, 'addOne');
            });


            afterEach(function() {
                this.songResults.remove();
            });

            it('should call the addOne() method for each model in the collection', function() {
                console.log("BOOTSTRAPPED PAGINATOR: "+JSON.stringify(pager));
                pager.bootstrap();
                console.log("BOOTSTRAPPED PAGINATOR 2: "+JSON.stringify(pager));
                expect(this.songResults.addOne.callCount).toEqual(2);
            });
        });


        describe('#addOne', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.songResults = new SongResults({ paginatorCollection: pager, collection: songCollection, userModel: authUser, vent: this.vent, requestParams: request, artist: false, name: "SongResultsView" });
            });

            afterEach(function() {
                this.songResults.remove();
            });

            it('should create a SearchResultItem view for each model in collection, and append it to DOM and childViews array', function() {
                $('#musicapp').html(this.songResults.render().el);
                this.songResults.addAll(); // Will call addOne() for each model in collection
                expect(this.songResults.childViews.length).toEqual(2);
                expect($('.searchArtist:first')).toHaveText('Kanye West');
            });
        });


        describe('#onClose', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.songResults = new SongResults({ paginatorCollection: pager, collection: songCollection, userModel: authUser, vent: this.vent, requestParams: request, artist: false, name: "SongResultsView" });
                spyOn(this.songResults, 'render');
            });

            afterEach(function() {
                this.songResults.remove();
            });

            it('should close all child views', function() {
                this.songResults.addAll(); // Will fill up the childViews array with views for all models in collection
                _.each(this.songResults.childViews, function(childView) {
                    spyOn(childView, 'close');
                });
                this.songResults.onClose();
                this.songResults.userModel.set({ loggedIn: false });
                expect(this.songResults.render).not.toHaveBeenCalled();
                _.each(this.songResults.childViews, function(childView) {
                    expect(childView.close).toHaveBeenCalled();
                });
            });
        });




    });

});
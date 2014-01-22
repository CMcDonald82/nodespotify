define(['views/searchResultItem', 'models/authuser', '../testFixtures', 'models/song'], function(SearchResult, authuser, fixtures, Song) {

    return describe('View :: SearchResultItem', function() {

        var authUser = new authuser({loggedIn: true, username: "the_user", uid: "1234"});
        var songModel = new Song( {"tracks":
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
                            } );

        var testParams = {};
        testParams['artist_id'] = "AR";
        testParams['song_id'] = "SO";
        testParams['spotify_id'] = "spotify-WW:track:62";
        testParams['track_name'] = "Stronger";
        testParams['artist_name'] = "Kanye West";


        describe('#initialize', function() {

            beforeEach(function() {
                this.result = new SearchResult({ userModel: authUser, type: "song", name: "my_results", model: songModel });
                spyOn(this.result, 'createButtons');
            });

            afterEach(function() {
                this.result.remove();
            });

            it('should properly initialize the view', function() {
                this.result.initialize();
                expect(this.result.userModel).toEqual(authUser);
                this.result.userModel.set({loggedIn: false});
                expect(this.result.createButtons).toHaveBeenCalled();
                expect(this.result.type).toEqual('song');
                expect(this.result.name).toEqual('my_results');
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.result = new SearchResult({ userModel: authUser, type: "song", name: "my_results", model: songModel });
                spyOn(this.result, 'createButtons');
            });

            afterEach(function() {
                this.result.remove();
            });

            it('checks that view is rendered properly and createButtons() is called', function() {
                $('#musicapp').html(this.result.render().el);
                expect($('li').data("artistId")).toEqual("AR");
                expect($('.searchTrack')).toHaveText("Stronger");
                expect($('.searchArtist')).toHaveText("Kanye West");
                expect(this.result.createButtons).toHaveBeenCalled();
            });
        });


        describe('#createButtons', function() {

            beforeEach(function() {
                this.result = new SearchResult({ userModel: authUser, type: "song", name: "my_results", model: songModel });

            });

            afterEach(function() {
                this.result.remove();
            });

            it('should add a new searchItemButtons view for each button to be appended and store it in the searchResultItemView childViews', function() {
                // Can call the render method here since createButtons() is called from within render() in the SearchResultItem View
                $('#musicapp').html(this.result.render().el);
                expect(this.result.childViews.length).toEqual(1);
                expect(this.result.childViews[0].options.type).toEqual("song");
                expect(this.result.childViews[0].options.loggedIn).toBeFalsy(); // Because 'loggedIn' was set to false in the #initialize test
                expect(this.result.childViews[0].options.params).toEqual(testParams);
                expect($('.createArtistPlist')).toHaveText('Artist');
            });
        });

    });

});

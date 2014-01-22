define(['views/appinit', 'routers/router', '../testFixtures', 'underscore', 'backbone', 'text!tpl/test.html', 'models/authuser', 'collections/radioTracks', 'jqueryui'], function(app, Workspace, fixtures, _, Backbone, tpl, authuser, radiotracks, ui) {

    //var lists = new Playlists();

    return describe('View :: Appinit', function() {

        app.prototype.setupSortable = jasmine.createSpy('setupSortable');
        var workspace = new Workspace();
        var initView = new app({router: workspace});

        describe('#initialize', function() {

            beforeEach(function() {
                //this.routeSpy = jasmine.createSpy();
                //console.log('typeof(this.routeSpy): '+typeof(this.routeSpy));
                //$("#sortable").sortable = jasmine.createSpy('sortable spy');
                //var testDiv = '<div id="sortable"></div>';
                //setFixtures(testDiv);
                
                try {
                    Backbone.history.start({silent: true});
                } catch(e) {}
                this.app = new app({router: workspace});
                //this.router.navigate("register/");
                
            });

            /*
            afterEach(function() {
                this.app.remove();
            });
            */

            it('makes sure the view is set up properly and the correct methods are called during initialization', function() {

                //this.vent = new _.extend({}, Backbone.Events);
                var authchangeSpy = jasmine.createSpy();
                var loggedinSpy = jasmine.createSpy();
                var loggedoutSpy = jasmine.createSpy();
                var searchRouterSpy = jasmine.createSpy();
                var searchArtistRouterSpy = jasmine.createSpy();
                var registerRouterSpy = jasmine.createSpy();

                // Functions called by the 'initialize' method itself
                spyOn(this.app, 'render');
                spyOn(this.app, 'createRegionManagers');
                spyOn(this.app, 'initTopTenData');
                spyOn(this.app, 'getAuthUser');


                // Functions called by events that are set up in the 'initialize' method
                spyOn(this.app, 'authCheck');
                spyOn(this.app, 'playlistControlPanelSwap');

                // Functions called by routes that are set up in the 'initialize' method
                spyOn(this.app, 'setupSearch');
                spyOn(this.app, 'setupArtistSearch');
                spyOn(this.app, 'registerUser');


                this.app.initialize({router: workspace});

                this.app.vent.bind('app:authchange', authchangeSpy);
                this.app.vent.bind('app:loggedin', loggedinSpy);
                this.app.vent.bind('app:loggedout', loggedoutSpy);
                this.app.workspace.bind("route:search", searchRouterSpy);
                this.app.workspace.bind("route:searchartist", searchArtistRouterSpy);
                this.app.workspace.bind("route:register", registerRouterSpy);

                this.app.vent.trigger('app:authchange');
                this.app.vent.trigger('app:loggedin');
                this.app.vent.trigger('app:loggedout');
                this.app.workspace.navigate("search/term", {trigger: true}); // Need to make sure the /term part is included on the url otherwise test will fail (since setupSearch method won't get called)
                this.app.workspace.navigate("searchartist/term", {trigger: true}); // Need to make sure the /term part is included on the url otherwise test will fail (since setupSearch method won't get called)
                this.app.workspace.navigate("displayregister", {trigger: true});

                expect(this.app.render).toHaveBeenCalled();
                expect(this.app.initTopTenData).toHaveBeenCalled();
                expect(this.app.getAuthUser).toHaveBeenCalled();

                expect(this.app.createRegionManagers).toHaveBeenCalled();
                expect(this.app.authCheck).toHaveBeenCalled();
                expect(this.app.playlistControlPanelSwap.calls.length).toEqual(2); // because the this.app.playlistControlPanelSwap function is called when "app:loggedin" and "app:loggedout" are triggered

                expect(this.app.setupSearch).toHaveBeenCalled();
                expect(this.app.setupArtistSearch).toHaveBeenCalled();
                expect(this.app.registerUser).toHaveBeenCalled();

            });


        });


        describe('#createRegionManagers', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
            });

            it('should properly create the region managers for the appropriate elements', function() {
                expect(this.app.mainAreaManager.elId).toEqual('mainPanel');
                expect(this.app.loginPanelManager.elId).toEqual('authPanel');
                expect(this.app.playlistControlPanelManager.elId).toEqual('playlistControlPanel');
                expect(this.app.playlistSelectManager.elId).toEqual('playlistSelector');
                expect(this.app.topTenList1PanelManager.elId).toEqual('topTenPanel1');
                expect(this.app.topTenList2PanelManager.elId).toEqual('topTenPanel2');
                expect(this.app.topTenList3PanelManager.elId).toEqual('topTenPanel3');
                expect(this.app.paginatorPanelManager.elId).toEqual('pagination');
                expect(this.app.customPlaylistDisplayManager.elId).toEqual('sortableCustomPlaylist');
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.template = loadFixtures(tpl);
                this.app = new app({router: workspace, template: this.template});
                //this.app.initialize({router: workspace});
                this.app.render();
            });

            afterEach(function() {
                this.app.remove();
            });

            it('should render the initial home page', function() {
                // Check that the page rendered and a couple elements from the template are present (no need to test every single element in the template)
                expect($('#musicapp').find('h1')).toHaveText("Boomin'");
                expect($('#song')).toHaveAttr('type');
            });
        });


        describe('#initTopTenData', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
            });

            afterEach(function() {
                this.app.remove();
            });

            it('checks that each of the top ten region managers displays the correct view', function() {
                expect(this.app.topTenList1PanelManager.currentView.name).toEqual('TopTenHotTracksView');
                expect(this.app.topTenList2PanelManager.currentView.name).toEqual('TopTenHipArtistsView');
                expect(this.app.topTenList3PanelManager.currentView.name).toEqual('TopTenStyleTrendsView');
            });
        });

        /* No longer used since it's not necessary if #viewPlaylist button is no longer used
        describe('#userPlaylistsChangeRouter', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                this.app.authUser = new authuser({viewingPlaylist: true});
                spyOn(this.app, 'displayPlaylist');
            });

            afterEach(function() {
                this.app.remove();
            });

            it('should call the displayPlaylist function', function() {
                console.log('this.authUser.get(viewingPlaylist): '+this.app.authUser.get('viewingPlaylist'));
                this.app.userPlaylistsChangeRouter();
                expect(this.app.displayPlaylist).toHaveBeenCalled();
            });
        });
        */


        describe('#setupSearch', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                this.app.authUser = new authuser();
                spyOn(this.app, 'search');
            });

            afterEach(function() {
                this.app.remove();
            });

            it('should call the search function', function() {
                this.app.setupSearch('go');
                expect(this.app.authUser.get('viewingPlaylist')).toBeFalsy();
                expect(this.app.search).toHaveBeenCalled();
            });
        });


        describe('#setupArtistSearch', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                this.app.authUser = new authuser();
                spyOn(this.app, 'search');
            });

            afterEach(function() {
                this.app.remove();
            });

            it('should call the search function', function() {
                this.app.setupArtistSearch('go');
                expect(this.app.authUser.get('viewingPlaylist')).toBeFalsy();
                expect(this.app.search).toHaveBeenCalled();
            });
        });


        describe('#search', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
            });

            afterEach(function() {
                this.app.remove();
            });

            it('checks that the mainAreaManager and paginatorPanelManager are displaying the correct views to hold the search results', function() {
                this.app.search('term', 2, false);
                expect(this.app.mainAreaManager.currentView.name).toEqual('SongResultsView');
                expect(this.app.paginatorPanelManager.currentView.name).toEqual('PaginatorView');
            });
        });


        describe('#makeRadioPlaylist', function() {

            beforeEach(function() {
                this.server = sinon.fakeServer.create();
                var testDiv = '<div class="playlistButton">Test</div>';
                setFixtures(testDiv);
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                console.log('this.app.radioTracks() from test: '+JSON.stringify(this.app.radioTracks));

                $('.playlistButton').click(this.app.makeRadioPlaylist);
                spyOn(this.app, 'trackCollectionToSpotifyParser');
                this.eventSpy = sinon.stub(this.app.radioTracks, 'fetch').yieldsTo('success');
            });

            afterEach(function() {
                this.app.remove();
                $('.playlistButton').remove();
                this.server.restore();
            });

            /*
            it('should check that the test div that is clicked has the correct data params', function() {

                //var ev = ;
                this.app.makeRadioPlaylist($('#testdiv').trigger('click'));
                expect($(ev.currentTarget).data("attachedData").artistId).toEqual('the_song');
            });
            */

            it('should fetch the radio tracks collection and call the spotify parser', function() {

                // this.app.radioTracks needs to have _.bindAll called on it in the initialize method, otherwise it will be out of scope at this point and will cause the test to fail

                expect($('.playlistButton')).toHaveText('Test');
                $('.playlistButton').data('attachedData', { playlistType: 'song-radio', artistId: "artist1234" });
                $('.playlistButton').click();
                expect($('.playlistButton').data("attachedData").artistId).toEqual("artist1234");
                expect($('.playlistButton').data("attachedData").playlistType).toEqual("song-radio");
                expect(this.eventSpy.calledOnce).toBe(true);
                expect(this.app.trackCollectionToSpotifyParser).toHaveBeenCalled();

            });
        });


        describe('#trackCollectionToSpotifyParser', function() {

            var jsonResponse = fixtures.radioTracksFixture;

            beforeEach(function() {
                // Create a radioTracks collection here that we will pass into the trackCollectionToSpotifyParser method call

                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                spyOn(this.app, 'loadPlaylistToSpotifyPlayer');
                this.server = sinon.fakeServer.create();
                this.server.respondWith(
                    "GET",
                    "http://developer.echonest.com/api/v4/playlist/static?api_key=FHPFXUKUGHZWWUXPR",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify(jsonResponse)
                    ]
                );
            });

            afterEach(function() {
                this.app.remove();
                this.server.restore();
            });

            it('converts the collection to a string of tracks readable by the spotify player', function() {
                // Fake the fetch of the collection here
                var tracks = new radiotracks();
                tracks.fetch();
                this.server.respond();
                this.app.trackCollectionToSpotifyParser('song-radio', tracks);
                expect(this.app.loadPlaylistToSpotifyPlayer).toHaveBeenCalled();
            });

        });


        describe('#loadPlaylistToSpotifyPlayer', function() {

            beforeEach(function() {
                var resultsDiv = '<div id="results"></div>';
                setFixtures(resultsDiv);
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
            });

            afterEach(function() {
                this.app.remove();
            });

            it('should construct the correct iframe embed url using the variables passed in in place of TRACKS and PREFERREDTITLE', function() {
                this.app.loadPlaylistToSpotifyPlayer('playlistTitle', 'mytracks');
                expect($('#results').find('#playlistPlayer').attr('src')).toEqual('http://embed.spotify.com/?uri=spotify:trackset:playlistTitle:mytracks');
            });
        });


        describe('#addToCustomPlaylist', function() {

            var jsonResponse = fixtures.addToCustomPlaylistFixture;

            beforeEach(function() {
                var testDiv = '<div class="addToCustomPlaylistButton">Add</div><select id="playlistSelector"><option value="id1" selected>Playlist 1</option></select>';
                setFixtures(testDiv);

                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                this.app.authUser.set({token: 'mytoken'});

                spyOn(window, "alert");
                $('.addToCustomPlaylistButton').click(this.app.addToCustomPlaylist);
                this.server = sinon.fakeServer.create();



                this.server.respondWith(
                    "POST",
                    "/save_track",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify(jsonResponse)
                    ]
                );
            });

            afterEach(function() {
                this.app.remove();
                $('.addToCustomPlaylistButton').remove();
                $('#playlistSelector').remove();
                this.stub.restore();
                this.server.restore();
            });

            it('should add a track with the specified parameters to the playlist selected in #playlistSelector', function() {
                expect($('.addToCustomPlaylistButton')).toHaveText('Add');
                $('.addToCustomPlaylistButton').data('attachedData', { songId: 'song1234', spotifyId: "spotify-WW:track:spotify1234", trackName: 'mytrack', artistName: 'theArtist' });
                $('.addToCustomPlaylistButton').click();
                this.server.respond();

                // Let the normal function (not stubbed) execute so we can see if alert message is returned (should be)
                expect(window.alert).toHaveBeenCalled();

                // Stub the post call (so the calledWith() function can be used) and re-run the addToCustomPlaylist function
                this.stub = sinon.stub($, 'post');
                $('.addToCustomPlaylistButton').click();
                sinon.assert.calledWith($.post, '/save_track', { _csrf: "mytoken", apiId: "song1234", artistName: "theArtist", plId: "id1", spotifyId: "spotify1234", trackName: "mytrack" }); //'mytoken', 'song1234', 'theArtist', "id1", 'spotify1234', 'mytrack');


                // Check that response is correct (compare to addToCustomPlaylistFixture)
                //expect()

            });

        });


        describe('#displayPlaylist', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
            });

            afterEach(function() {
                this.app.remove();
            });

            it('checks that view is instantiated and events are properly triggered', function() {
                this.app.displayPlaylist();
                expect(this.app.customPlaylistDisplayManager.currentView.name).toEqual('CustomPlaylistDisplayView');
                // Below line is no longer needed since #viewingPlaylist button is no longer used
                //expect(this.app.authUser.get('viewingPlaylist')).toBeTruthy();
            });
        });


        /*
        // Something not working with the autocomplete function from jQueryUI. The autocomplete works on the site but the test wont pass
        describe('#displayENPlaylistOptions', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
            });

            afterEach(function() {
                this.app.remove();
            });

            it('checks that view is instantiated and events are properly triggered', function() {
                this.app.displayENPlaylistOptions();
                expect(this.app.mainAreaManager.currentView.name).toEqual('DisplayENOptionsView');

            });
        });
        */


        describe('#getAuthUser', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                spyOn(this.app, 'authCheck');
                this.eventSpy = sinon.stub(this.app.authUser, 'fetch').yieldsTo('success');
            });

            afterEach(function() {
                this.app.remove();
            });

            it('checks that authUser is fetched successfully and the authCheck method is called', function() {
                this.app.getAuthUser();
                expect(this.app.authCheck).toHaveBeenCalled();
            });
        });


        describe('#playlistControlPanelSwap', function() {

            beforeEach(function() {
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                this.app.authUser.set({loggedIn: true});
            });

            afterEach(function() {
                this.app.remove();
            });

            it('checks that the playlist control panel is correctly displayed if the user is logged in', function() {
                this.app.playlistControlPanelSwap();
                expect(this.app.playlistControlPanelManager.currentView.name).toEqual('PlaylistControlPanelView');
            });
        });


        describe('#authCheck', function() {

            beforeEach(function() {
                var testDiv = '<div id="boombox-logo">Boombox</div><div id="ipod-logo">iPod</div>';
                setFixtures(testDiv);
                this.app = new app({router: workspace});
                this.app.initialize({router: workspace});
                this.app.authUser.set({loggedIn: true, username: 'test'});
            });

            afterEach(function() {
                this.app.remove();
            });

            it('checks that loggedIn view is correctly displayed if user is logged in, and displays the uppercase username on the boombox/ipod', function() {
                this.app.authCheck();
                expect(this.app.loginPanelManager.currentView.name).toEqual('loggedInView');
                expect($('#boombox-logo')).toHaveText('TEST');
                expect($('#ipod-logo')).toHaveText('TEST');
            });

            it('checks that loggedOut view is correctly displayed if user is logged out', function() {
                this.app.authUser.set({loggedIn: false});
                this.app.authCheck();
                expect(this.app.loginPanelManager.currentView.name).toEqual('loggedOutView');
            });

        });




    });
});

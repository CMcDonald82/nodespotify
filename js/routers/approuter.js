var AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "songs": "list",
        "search/:term/:page": "search",
        "search/:term": "search",
        "searchartist/:term/:page": "searchartist",
        "searchartist/:term": "searchartist",
        "displayregister": "register",
        //"logout/:uname": "logout",
        "about": "about"
    },



    initialize: function() {
        // Put code here for calling the loginCheck function in server.js to check whether user is logged in or not. Want this to fire every time
        // any of the routes are accessed. Will return either true or false which will trigger the events 'loggedin: success' or 'loggedin: fail',
        // respectively. The LoginView() and LogoutView() views should have their render methods bound to these events so they can automatically
        // render when either of these events occur.

        this.on('all', this.isLoggedIn, this);

        console.log('appRouter init authUser username: '+authUser.get('username'));

        this.appView = new AppView();

    },


    home: function() {
        //this.isLoggedIn();
        this.homeView = new HomeView();
        $('#content').html(this.homeView.el);




        //var playlistEditorView = new CustomPlaylistPlaceholderView({model: authUser, vent: vent, name: "playlistEditorView"});
        //playlistEditorManager.showView(playlistEditorView);

        var playlists = new Playlists();
        var plView = new UserPlaylistsView({collection: playlists, model: authUser, vent: vent, name: 'UserPlaylistsView' }); //el: $('#userPlaylists')});
        playlistSelectManager.showView(plView);

        var plControlPanel = new PlaylistControlPanelView({model: authUser, name: 'PlaylistControlPanelView' });
        playlistControlPanelManager.showView(plControlPanel);

        console.log('Playlist select created. Now filling the Custom Playlist Title section');
        var selectedPlaylistTitleView = new CustomPlaylistPlaceholderView({model: authUser, vent: vent, name: "selectedPlaylistTitleView"});
        selectedPlaylistTitleManager.showView(selectedPlaylistTitleView);
        vent.trigger("app:selectedCustomPlaylist");

        $('#searchArtist').data('artistId', 'ARH6W4X1187B99274F');
        //console.log('DATA ATTR: '+$('#searchArtist').data('artistId') );

        //navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);


        var topTenView1 = new TopTenResultsView({collection: window.TopTenHotTracks, vent: vent, userModel: authUser, type: "songs", name: "TopTenTracksView"});
        topTenList1PanelManager.showView(topTenView1);

        var topTenView2 = new TopTenResultsView({collection: window.TopTenHipArtists, vent: vent, userModel: authUser, type: "artists", name: "TopTenArtistsView"});
        topTenList2PanelManager.showView(topTenView2);

        var topTenView3 = new TopTenResultsView({collection: window.TopTenStyleTrends, vent: vent, userModel: authUser, type: "styles", name: "TopTenStylesView"});
        topTenList3PanelManager.showView(topTenView3);

        vent.trigger("app:getTopTen");

        //this.appView.changeGenre();


        // Dont need this
        //$('#playlistEditor').html(this.homeView.el);
        //}


        /*
        if (!this.appView) {
            console.log('No app view');
            this.appView = new AppView();
        }

        if (!this.loginView) {
            console.log('No login view');
            //this.loginView = new LoginView();
            app.loginView = new LoginView();
        }
        $.get('/login_check', function(data) {
            //alert(data['status']);
            if (data['status'] === 'notloggedin') {
                $('#loginPanel').html(app.loginView.render().el);
                if (!this.homeView) {
                    console.log('No home view');
                    this.homeView = new HomeView();
                }
                //this.homeView.render().el;
                $('#content').html(this.homeView.el);

            }
            else {
                if (!app.logoutView) {
                    //console.log('No logout view');
                    app.logoutView = new LogoutView({username: data['uname']});
                    $('#loginPanel').html(app.logoutView.render().el);
                    var playlists = new window.Playlists();
                    new window.UserPlaylistsView({el: $('#userPlaylists'), collection: playlists});
                    var request = {};
                    request['userid'] = data['userid'];
                    playlists.fetch({
                        data: $.param(request, true),
                        success: function() {
                            if (!this.homeView) {
                                console.log('No home view');
                                this.homeView = new HomeView();
                            }
                            //this.homeView.render().el;
                            $('#content').html(this.homeView.el);
                        }
                    });
                }

            }

        });
        */
    },

    // Test functions for geolocation feature - not yet implemented
    geoSuccess: function(p) {
        alert('Geo: '+p);
    },

    geoError: function(e) {
        alert('Geo Error: '+JSON.stringify(e));
    },

    

    search: function(term, page) {
        console.log('Search view route entered');
        var p = page ? parseInt(page, 10) : 1;

        //this.searchView = new SearchView();
        //console.log('this.searchView.el: '+this.searchView.el);

        //$('#content').html(this.searchView.el);
        //this.searchView.searchOnEnter(term, page);
        authUser.set({viewingPlaylist: false});
        this.searchOnEnter(term, page, false);
    },

    searchartist: function(term, page) {
        console.log('Search Artist view route entered');
        authUser.set({viewingPlaylist: false});
        this.searchOnEnter(term, page, true);
    },


    // Might want to refactor the end of this function with the similar piece in
    searchOnEnter: function(t, p, artistSongs) {
        if (!p) {   //p === undefined
            console.log('No page set!');
            var pg = 1;
        }
        else {
            var pg = p;
        }
        //$('#searchResults').empty();//html('');
        console.log('clicked enter');

        var request = {};
        if (artistSongs) {
            request['artist_id'] = t;
            console.log("Searching ARTIST");

        } else {
            request['combined'] = t;
            console.log("Searching COMBINED");
        }
        request['format'] = 'json';
        request['results'] = 20;
        request['bucket'] = ['id:spotify-WW', 'tracks']; //'id:7digital-US', 'tracks'];
        request['limit'] = true;
        request['sort'] = 'song_hotttnesss-desc';

        window.Songs.fetch({
            data: $.param(request, true),

            success: function() {
                var searchView = new SearchResultsView({model: window.Songs, page: pg, term: t, vent: vent, userModel: authUser, name: "SearchResultsView", artist: artistSongs});
                playlistEditorManager.showView(searchView);
            }
        });
    },



    register: function() {
        console.log("entering display register");
        if (!this.registerView) {
            console.log('No register view');
            this.registerView = new RegisterView();
            //$('#content').html(this.registerView().render().el);
        }

        $('#content').html(this.registerView.render().el);
        //else {
        //    $('#content').html(this.registerView.el);
        //}
    },

    /*
    logout: function(uname) {
        console.log("displaying logout");
        if (!this.logoutView) {
            console.log('No logout view');
            this.logoutView = new LogoutView();
        }
        $('#loginPanel').html(this.logoutView.render({username: uname}).el);
    },
    */

    isLoggedIn: function() {
        authUser.fetch({
            success: function() {
                console.log('fetched authUser: '+authUser.get('loggedIn'));
                if (!authUser.get('loggedIn')) {
                    console.log('User is LOGGED OUT');


                    var loginView = new LoginView({model: authUser, vent: vent, name: "loginView"});
                    var blankView = new BlankPlaylistDisplayView();
                    //playlistEditorManager.showView(blankView);

                    loginPanelManager.showView(loginView);
                    vent.trigger("app:loginfail");

                    //vent.trigger("app:loginfail");
                    console.log('triggered app:loginfail');
                }
                else {
                    console.log('User is LOGGED IN');


                    var logoutView = new LogoutView({model: authUser, vent: vent, username: authUser.get('username'), name: "logoutView"});



                    loginPanelManager.showView(logoutView);
                    vent.trigger("app:loginsuccess");

                    console.log("triggered app:loginsuccess");
                }
            }
        });

    },

    about: function() {
        alert("About");
    }



});

utils.loadTemplate(['HomeView', 'SearchView', 'SearchResultItemView', 'LoginView', 'LogoutView', 'RegisterView', 'RegisterDoneView', 'NewPlaylistTypeView', 'CustomPlaylistPlaceholderView', 'PlaylistControlPanelView', 'DisplayENOptionsView', 'ArtistResultItemView', 'StyleResultItemView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});



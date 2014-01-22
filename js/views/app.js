





Backbone.View.prototype.close = function(){
    this.remove();
    this.unbind();
    if (this.onClose){
        this.onClose();
    }
}


window.AppView = Backbone.View.extend({


    el: '#musicapp',

        // Put a "Stats" template here, as in TODOMVC. This will list things like how many songs returned, which artist(s), etc.
        // goes here ...

    // Delegated events for song search
    events: {
        'keypress #song': 'searchClick',
        'click #login': 'login',
        'click #logout': 'logout',
        'click #account': 'account',
        'click #register': 'registerClick',
        'click #newPlaylist': 'addNewPlaylist',
        'change #userPlaylists': 'userPlaylistsChangeRouter',
        'click #viewPlaylist': 'displayUserPlaylist',
        'click #createCustomPlaylist': 'createCustomPlaylist',
        'click #newPlaylistAdd': 'playlistControlToggle',
        'click #createENPlaylist': 'createENPlaylist',
        'click #displayENPlaylistOptions': 'displayENPlaylistOptions',
        'click .searchArtist': 'artistClick',
        'change #topTenGenres': 'changeGenre'
    },

    initialize: function() {
        this.input = this.$('#song');

    },

    playlistControlToggle: function() {
        $('#createPlaylistContainer').toggle();
    },

    changeGenre: function(ev) {
        vent.trigger("app:getTopTen");
        /*
        var topTenView1 = new TopTenResultsView({collection: window.TopTenHotTracks, vent: vent, userModel: authUser, type: "songs", name: "TopTenTracksView"});
        topTenList1PanelManager.showView(topTenView1);

        var topTenView2 = new TopTenResultsView({collection: window.TopTenHipArtists, vent: vent, userModel: authUser, type: "artists", name: "TopTenArtistsView"});
        topTenList2PanelManager.showView(topTenView2);

        var topTenView3 = new TopTenResultsView({collection: window.TopTenStyleTrends, vent: vent, userModel: authUser, type: "styles", name: "TopTenStylesView"});
        topTenList3PanelManager.showView(topTenView3);
        */
    },


    userPlaylistsChangeRouter: function(ev) {
        if (!authUser.get('viewingPlaylist')) {
            //alert('Not viewin playlist');
        } else {
            //alert('Im viewin a playlist');
            this.displayUserPlaylist(ev);
        }
    },


    searchClick: function(e) {
        if (e.which !== 13 || !this.input.val().trim()) {
            console.log(e);
        }
        else {
            /*
            if (app.searchView) {
                console.log('Search View already exists');
            }
            else {
                console.log('No Search View yet');
            }
            */
            var term = this.input.val();
            console.log('Search Term: '+term);

            app.navigate('search/'+term, {trigger: true});
        }
    },


    artistClick: function(ev) {
        var term = $(ev.currentTarget).data("artistId");
        console.log("TERM: "+term);
        app.navigate('searchartist/'+term, {trigger: true});
    },


    login: function(ev) {
        var urlVar = $(ev.currentTarget).attr('id');
        var uname = $('#username').val();
        var pw = $('#password').val();
        console.log(urlVar);
        console.log("Login Uname: "+uname);
        console.log("Login Pword: "+pw);

        $.post('/login', { username: uname, password: pw }, function(resp) {
            if (resp['success']) {
                app.isLoggedIn();


                /*
                var playlists = new window.Playlists();

                var request = {};
                request['userid'] = resp['userid'];
                playlists.fetch({
                    data: $.param(request, true),
                    success: function() {
                        console.log('fetched collection successfully');
                        var plView = new UserPlaylistsView({el: $('#userPlaylists'), collection: playlists, name: 'UserPlaylistsView'});

                        console.log('plView: '+plView);
                        playlistSelectManager.showView(plView);

                    }
                });
                */


                /*
                var logoutView = new LogoutView({model: authUser, vent: vent, username: uname, name: "logoutView"});
                loginPanelManager.showView(logoutView);
                vent.trigger("app:loginsuccess");
                */

                /*
                if (!app.logoutView) {
                    console.log('No logout view');
                    app.logoutView = new LogoutView({username: uname});
                }
                $('#loginPanel').html(app.logoutView.render().el);

                // Fetch collection of user playlists
                //alert(resp['userid']);

                var playlists = new window.Playlists();
                new window.UserPlaylistsView({el: $('#userPlaylists'), collection: playlists});
                var request = {};
                request['userid'] = resp['userid'];
                playlists.fetch({
                    data: $.param(request, true),
                    success: function() {
                        if (!this.homeView) {
                            console.log('No home view');
                            this.homeView = new HomeView();

                        }
                        $('#content').html(this.homeView.el);
                        var plStatus = $('#userPlaylists').length;
                        //alert(plStatus);
                        app.CustomPlaylistView = new CustomPlaylistView({plStatus: plStatus});
                        app.CustomPlaylistView.render().el;
                    }
                });
                */

            }
            else {
                alert(data);
            }
        });

    },

    logout: function() {
        $.get('/logout', function(data) {
            //alert(data);
            if (data === "loggedout") {
                app.isLoggedIn();
                /*
                var loginView = new LoginView({model: authUser, vent: vent, name: "loginView"});
                loginPanelManager.showView(loginView);
                vent.trigger("app:loginfail");
                */

                /*
                if (!app.loginView) {
                    console.log('No login view');
                    app.loginView = new LoginView();
                }
                $('#loginPanel').html(app.loginView.render().el);
                if (!this.homeView) {
                    console.log('No home view');
                    this.homeView = new HomeView();
                }
                $('#content').html(this.homeView.el);
                var plStatus = $('#userPlaylists').length;
                app.CustomPlaylistView = new CustomPlaylistView({plStatus: plStatus});
                app.CustomPlaylistView.render().el;
                */
            }
        });
    },

    account: function() {
        $.get('/account', function(data) {
            alert(data);
        });
    },


    registerClick: function(e) {
        if (app.registerView) {
            console.log('Register View already exists');
        }
        else {
            console.log('No Register View yet');
        }
        app.navigate('displayregister', {trigger: true});
    },


    addNewPlaylist: function() {

        //if (!app.NewPlaylistTypeView) {
        //    app.NewPlaylistTypeView = new NewPlaylistTypeView();
        //}
        //app.NewPlaylistTypeView.render().el;

        var newPlView = new NewPlaylistTypeView({name: 'NewPlaylistTypeView'});
        playlistEditorManager.showView(newPlView);

    },



    displayUserPlaylist: function(ev) {

        var pl = $('#userPlaylists option:selected').text();
        var plId = $('#userPlaylists option:selected').val();
        //alert('selected playlist: '+plId);

        // Code to get songs for the selected playlist from db, then create a new playlist view and sub-views (for each row/song)
        // Get playlist from db
        //console.log('$(ev.currentTarget): '+ $(ev.currentTarget).val());
        var playlist = new Playlist();  //playlistSongCollection;
        var plView = new CustomPlaylistDisplayView({collection: playlist.tracks, model: authUser, name: 'CustomPlaylistDisplayView', plId: plId, vent: vent, pl: pl });
        //console.log('sending plview to playlistEditorManager');
        playlistEditorManager.showView(plView);
        vent.trigger("app:selectedCustomPlaylist");
        authUser.set({viewingPlaylist: true});

    },



    createCustomPlaylist: function() {
        if ($('#newPlaylistTitle').val() === '') {
            alert("Aint no title");
        } else {
            var playlist = new Playlist({userid: authUser.get('uid')});
            console.log('Userid for custom playlist: '+authUser.get('uid'));
            playlist.save({'title': $('#newPlaylistTitle').val()}, {
                success: function(model, resp) {
                    alert('New Playlist Saved');
                    vent.trigger("app:newPlaylistCreated");
                },
                error: function(model, resp) {

                }

            });
        }
    },


    displayENPlaylistOptions: function() {
        var displayView = new DisplayENOptionsView({name: 'DisplayENOptionsView'});
        playlistEditorManager.showView(displayView);
        $('#variety-slider').slider({
            min: 0,
            max: 1,
            step: 0.1,
            value: 0.5,
            slide: function(event, ui) {
                $("#variety-level").html(ui.value);
            }
        });
    },

    createENPlaylist: function() {

    },


    // Refactored from searchresults.js -> displayPlaylist. Currently only used for loading custom playlists into Spotify player but
    // probably should be used for loading all playlists (AR, SR, A, custom EN settings).
    loadSpotifyPlaylist: function(plTitle, tracks) {
        var embed = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:TRACKS" style="width:300px; height:380px; display:block" frameborder="0" allowtransparency="true" id="playlistPlayer"></iframe>';
        $("#results").empty();
        // Replaces the generic placeholders "TRACKS" and "PREFERREDTITLE" with the parsed response to create embedded, streamable versions of tracks
        var tembed = embed.replace('TRACKS', tracks);
        tembed = tembed.replace('PREFEREDTITLE', plTitle);
        var li = $("<div>").addClass("poop").html(tembed);
        $("#results").append(li);
    }

});


var vent = new _.extend({}, Backbone.Events);
console.log('created Events object: '+vent);

var authUser = new AuthUser();
console.log('created new AuthUser object: '+authUser);

// Put view manager here (handles creation and cleanup of views when switching them in/out based on events)
function RegionManager(elId){

    this.showView = function(view) {
        if (this.currentView){
            console.log('Manager for: '+elId+' oldView is: '+this.currentView.name);
            this.currentView.close();
        }

        this.currentView = view;
        //this.currentView.render();
        console.log('Manager for: '+elId+' currentView is: '+this.currentView.name);

    //this.elementId = function(elId) {
        //var elm = '#' + elId;
        //$(elm).html(this.currentView.el);
        $('#'+elId).html(this.currentView.el);
    }
}

var loginPanelManager = new RegionManager('loginPanel');
var playlistEditorManager = new RegionManager('playlistEditor');
var playlistSelectManager = new RegionManager('userPlaylists');
var selectedPlaylistTitleManager = new RegionManager('selectedPlaylistTitle');
var playlistControlPanelManager = new RegionManager('playlistControlPanel');
var topTenList1PanelManager = new RegionManager('topTenList1');
var topTenList2PanelManager = new RegionManager('topTenList2');
var topTenList3PanelManager = new RegionManager('topTenList3');


/*
window.MyView = Backbone.View.extend({

    initialize: function(){
        this.options.vent.bind("app:event", this.render, this);
    },

    render: function() {
        console.log('Event framework worked');
    }
});

//var vent = new _.extend({}, Backbone.Events);
new MyView({vent: vent});
vent.trigger("app:loginfail");
*/
// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'api_key',
    //'text!../../file2.txt',
    'text!tpl/test.html',
    'views/regionmanager',
    'models/authuser',
    'views/loggedIn',
    'views/loggedOut',
    'collections/playlists',
    'routers/router',
    'views/placeholders',
    'views/playlistControlPanel',
    'collections/songs',
    'collections/artistList',
    'collections/styleList',
    'views/songResults',
    'models/playlist',
    'views/customPlaylistDisplay',
    'views/displayENOptionsView',
    'views/displayNewPlaylistOptionsView',
    'views/topTenResults',
    //'views/createRadioPlaylist',
    'collections/radioTracks',
    'collections/pagination',
    'views/paginationView',
    'views/register',
    'views/registerDone',
    'views/autocompleteItemView',
    'views/about',
    'jqueryui'
], function($, _, Backbone, api, testTemplate, regionManager, authUser, loggedInView, loggedOutView, Playlists, workspace, blankView, playlistControlPanel, Songs, ArtistList, StyleList, SearchResults, Playlist, CustomPlaylistDisplay, DisplayENOptions, DisplayNewOptions, TopTenResults, RadioTracks, Paginator, PaginationView, RegisterView, RegistrationDoneView, AutocompleteItem, AboutView) {


    /*
        Add a close method to the base View class of Backbone. This way, each view, no matter what type, will have this method.
        Important for management of zombie views/memory leaks
    */
    Backbone.View.prototype.close = function(){
        this.remove();
        this.unbind();
        if (this.onClose){
            this.onClose();
        }
    };

    // Utility functions for this view
    //function getAuthUser() {
    //    return appView.authUser;
    //}

    /*
        This is where all initialization takes place.
    */
    var AppView = Backbone.View.extend({

        el: '#musicapp',

        template: _.template(testTemplate),

        events: {
            'keypress #song': 'searchClick',
            'click #viewPlaylist': 'displayPlaylist',
            'click #echoNestGeneratorContainer': 'displayENPlaylistOptions',
            'click .playlistButton': 'makeRadioPlaylist',
            'click .addToCustomPlaylistButton': 'addToCustomPlaylist',
            'click .searchArtist': 'artistClick',
            'change #topTenGenres': 'changeGenre',
            'change #playlistSelector': 'displayPlaylist', //'userPlaylistsChangeRouter',  - Shouldn't need this anymore since custom playlists are now rendered in their own container
            'click #register': 'registerClick',
            'click #createENPlaylist': 'makeENPlaylist',
            'click .ENParamButton': 'toggleENParam',
            'click .delete-autocomplete': 'removeAutocompleteView',
            'click #about': 'aboutClick',
            'click .topTenContainerDropdown': 'expandTopTenContainer',
            'click .searchButtonsContainer': 'expandSearchButtons',
            'click #moreResults': 'showMoreResults', 
            'click #loadPlaylist': 'loadPlaylist', 
            'click #customContainer': 'displayNewCustomPlaylistOptions'
            //'update #sortable': 'updateSort'
            //'click #test': 'test'
        },

        

        initialize: function(options) {
            //this.input = $(this.el).find($('#song'));
            //alert(api.api_key);
            
            
            var that = this;

            this.render();
            this.createRegionManagers();

            // Set up a router for history tracking
            this.workspace = options.router; //new workspace();
            //Backbone.history.start();
            this.workspace.on('route:search', this.setupSearch, this);
            this.workspace.on('route:searchartist', this.setupArtistSearch, this);
            this.workspace.on('route:register', this.registerUser, this);
            this.workspace.on('route:about', this.displayAboutView, this);



            // Attach event handlers
            this.vent = new _.extend({}, Backbone.Events);
            this.vent.on("app:authchange", this.authCheck, this);
            this.vent.on("app:loggedin", this.playlistControlPanelSwap, this);
            this.vent.on("app:loggedout", this.playlistControlPanelSwap, this);
            this.vent.on("app:clearAutocomplete", this.clearAutocompleteViews, this);


            console.log('Made it to AppView');

            // Initialize collections and models
            this.Songs = new Songs();
            this.playlists = new Playlists();
            this.radioTracks = new RadioTracks();
            this.authUser = new authUser();  // Need to call server to check auth status of user
            this.TopTenHotTracks = new Songs();
            this.TopTenHipArtists = new ArtistList();
            this.TopTenStyleTrends = new StyleList();
            //this.paginatedSearchResults = new Paginator();//this.Songs);
            //this.paginatorView = new PaginationView({collection: this.paginator});

            // For any views created as a result of autocomplete select
            this.autocompleteViews = [];
            this.selectedDescriptions = [];
            this.selectedMoods = [];

            // For population of genre and style autocomplete and select boxes
            this.defaultGenres;
            this.defaultStyles;

            /*
                The attributes below determine whether or not to send the specified param as part of the query to the Echo Nest API when creating
                a playlist based on the Echo Nest parameters. These attrs are toggled when the specified button is clicked, indicating that the user
                wishes to include the parameter in the query
            */
            //this.includeArtistMaxFamiliarity = false;
            //this.includeArtistMinFamiliarity = false;
            this.includeArtistFamiliarity = false;
            this.includeTempo = false;
            this.includeDuration = false;
            this.includeDanceability = false;
            this.includeEnergy = false;
            this.includeLiveness = false;
            this.includeSpeechiness = false;
            this.includeArtistHotttnesss = false;
            this.includeSongHotttnesss = false;


            console.log('radioTracks defined in initialize: '+JSON.stringify(this.radioTracks));
            
            console.log('CREATED AUTH USER');
            //this.authUser.on('change', this.authCheck, this);
            console.log('BOUND AUTH USER');

            //console.log('DOES THIS ELEMENT EXIST?????? '+$('#test').text());
            //var workspace = new workspace();


            //var that = this;

            // Initializes data to populate the 3 Top Ten lists
            this.initTopTenData();
            // Gets authUser model and fetches data (including loggedIn status, csrf token, uname, uid)
            this.getAuthUser();

            _.bindAll(this, "makeRadioPlaylist");
            _.bindAll(this, "addToCustomPlaylist");


            // TODO: factor this out into separate method
            this.setupSortable();


            /*
            $("#sortablePlaylistList").sortable({
                update: function() { 
                    alert("COOL!");
                    //that.updateSort(); 
                }
            });
            $("#sortablePlaylistList").disableSelection();
            */


            // messing around with parsing JSON for styles and genres. Plan to get a file of each of these from EchoNest and 
            // preprocess them so lists don't have to be fetched and parsed each time user uses autocomplete for these. Should result in saving 
            // quite a bit of time, bandwidth and processing power
            

            //var j = $.getJSON('file2.txt', function(json) {
            //    console.log("CONSOLE: "+json.response.genres.length);

                //for (var i=0; i<json.)
            //});
            

            $.get('/genres', function(resp) {
                if (resp) {
                    //alert("RESP "+resp);
                    that.defaultGenres = resp;
                }
            });
            
            $.get('/styles', function(resp) {
                if (resp) {
                    //alert("RESP "+resp);
                    that.defaultStyles = resp;
                }
            });




        },

        createRegionManagers: function() {
            // Might want to abstract these out into their own model or collection (if RegionManager is changed from a View to a Model)
            this.loginPanelManager = new regionManager({elId: 'authPanel'});
            this.playlistControlPanelManager = new regionManager({elId: 'playlistControlPanel'});
            this.playlistSelectManager = new regionManager({elId: 'playlistSelector'});
            // Will prob want to rename the mainAreaManager and its associated div 'mainPanel' to something like 'searchResultsManager' since it is now the area solely responsible for handling search results
            this.mainAreaManager = new regionManager({elId: 'mainPanel'});
            this.topTenList1PanelManager = new regionManager({elId: 'topTenPanel1'});
            this.topTenList2PanelManager = new regionManager({elId: 'topTenPanel2'});
            this.topTenList3PanelManager = new regionManager({elId: 'topTenPanel3'});
            this.paginatorPanelManager = new regionManager({elId: 'pagination'});
            this.customPlaylistDisplayManager = new regionManager({elId: 'sortableCustomPlaylist'});
            this.newPlaylistOptionsManager = new regionManager({elId: 'newPlaylistOptions'});

            /*

             var selectedPlaylistTitleManager = new RegionManager('selectedPlaylistTitle');

             */
        },



        render: function() {
            $(this.el).html(testTemplate);
        },


        initTopTenData: function() {
            topTenView1 = new TopTenResults({collection: this.TopTenHotTracks, vent: this.vent, userModel: this.authUser, type: "songs", name: "TopTenHotTracksView", elId: "topTenTracks", topTenTitle: "Hot Tracks"});
            this.topTenList1PanelManager.showView(topTenView1);
            topTenView2 = new TopTenResults({collection: this.TopTenHipArtists, vent: this.vent, userModel: this.authUser, type: "artists", name: "TopTenHipArtistsView", elId: "topTenArtists", topTenTitle: "Hip Artists"});
            this.topTenList2PanelManager.showView(topTenView2);
            topTenView3 = new TopTenResults({collection: this.TopTenStyleTrends, vent: this.vent, userModel: this.authUser, type: "styles", name: "TopTenStyleTrendsView", elId: "topTenStyles", topTenTitle: "Top Styles"});
            this.topTenList3PanelManager.showView(topTenView3);
        },

        /*
        updateSort: function() {
            var sortedIDs = $( "#sortablePlaylistList" ).sortable('toArray');
            //alert("UPDATED! "+sortedIDs);

            // Code to save the rearranged order of tracks in playlist to DB
            var plId = $('#playlistSelector option:selected').val();
            $.post('/rearrange_playlist', { tracklist: sortedIDs, plId: plId, _csrf: this.authUser.get('token') }, function(data) {
                //console.log('Saved Track '+JSON.stringify(data));
                //console.log('Type Of Saved Track '+typeof(data));
                if (!data) {
                    alert('This track already exists in the playlist '+$('#playlistSelector option:selected').text());
                }
                else {
                    if (data === 'noplaylist') {
                        alert('No playlist is selected!');
                        $("#sortablePlaylistList").sortable('cancel');
                    } else if (data === 'invalidPlaylist') {
                        alert('There is no such playlist!');
                        $("#sortablePlaylistList").sortable('cancel');
                    } else if (data === 'invalidTracks') {
                        alert('One or more tracks submitted is invalid');
                        $("#sortablePlaylistList").sortable('cancel');
                    } else {
                        alert('Successfully updated playlist! '+$('#playlistSelector option:selected').text());
                    }
                }
            });
            

        },
        */

        loadPlaylist: function(ev) {
            var plTitle = $('#playlistSelector option:selected').text();
            var spotifyIds = [];
            $('.playlistItem').each(function() {
                //alert($(this).data('spotify_id'));
                console.log('PUSHING SPOTIFY ID: '+$(this).data('spotify_id'));
                spotifyIds.push($(this).data('spotify_id'));
            });
            console.log('LOADED COLLECTION: '+JSON.stringify(spotifyIds));
            this.loadPlaylistToSpotifyPlayer(plTitle, spotifyIds);
        },


        setupSortable: function() {
            // For initializing jQueryUI Sortable menu (used for custom playlists)
            $("#sortable").sortable({
                update: function() { 
                    that.updateSort(); 
                }
            });
            $("#sortable").disableSelection();

            // Initially hide the custom playlist elements since no custom playlists will be displayed until user logs in and selects one from dropdown
            $("#sortableCustomPlaylistTitle").hide();
            $("#sortableCustomPlaylist").hide();
        },


        expandTopTenContainer: function(ev) {
            //alert('clicked top ten!');
            $(ev.currentTarget).parent().toggleClass('expanded');
        },

        expandSearchButtons: function(ev) {
            $(ev.currentTarget).toggleClass('expanded');
            $(ev.currentTarget).parent().toggleClass('expandHeight');
        },

        showMoreResults: function(ev) {
            if ($(ev.currentTarget).hasClass('expanded')) {
                $('#moreResultsLabel').text('More');
            } else {
                $('#moreResultsLabel').text('Previous');
            }
            $(ev.currentTarget).toggleClass('expanded');
            $('.searchResultsLeft').toggleClass('expanded');
            $('.searchResultsRight').toggleClass('expanded');
        },

        changeGenre: function(ev) {
            this.vent.trigger("app:getTopTen");
        },

        // Not used anymore since custom playlists are no longer rendered in the same area as search results
        /*
        userPlaylistsChangeRouter: function(ev) {
            if (!this.authUser.get('viewingPlaylist')) {
                //alert('Not viewin playlist');
            } else {
                //alert('Im viewin a playlist');
                this.displayPlaylist(ev);
            }
        },
        */

        registerClick: function(e) {
            this.workspace.navigate('displayregister', {trigger: true});
        },

        aboutClick: function(e) {
            this.workspace.navigate('displayabout', {trigger: true});
        },

        searchClick: function(e) {
            console.log('Trim: '+$('#song').val());

            if (e.which !== 13 || !$('#song').val().trim()) {
                console.log(e);
            } else {
                var term = $('#song').val();
                //console.log('Search Term: '+term);

                this.workspace.navigate('search/'+term, {trigger: true});
            }
        },

        artistClick: function(e) {
            // put code here for searching songs by artist (when artist link is clicked)
            var term = $(e.currentTarget).parent().data("artistId");
            this.workspace.navigate('searchartist/'+term, {trigger: true});
        },

        setupSearch: function(term, page) {
            console.log('Search view route entered');
            //console.log('Search TERM: '+term);
            console.log('Search PAGE: '+page);
            var p = page ? parseInt(page, 10) : 1;
            /*
            var pg;
            if (!p) {   //p === undefined
                console.log('No page set!');
                pg = 1;
            } else {
                pg = p;
            }
            */
            console.log('this.authUser called from appinit: '+JSON.stringify(this.authUser));
            // Shouldn't need to set viewingPlaylist anymore since custom playlists are now in their own container
            //this.authUser.set({viewingPlaylist: false});
            this.search(term, p, false);
        },

        setupArtistSearch: function(term, page) {
            console.log('Artist Search view route entered');
            console.log('Search TERM: '+term);
            console.log('Search PAGE: '+page);
            var p = page ? parseInt(page, 10) : 1;
            //this.authUser.set({viewingPlaylist: false});
            this.search(term, p, true);
        },


        /*
            Views based on region managers
        */

        search: function(t, p, artistSongs) {
            console.log("Search TERM: "+t);
            //console.log('clicked enter');
            var that = this;
            var request = {};
            if (artistSongs) {
                request['artist_id'] = t;
                console.log("Searching ARTIST");
            } else {
                request['combined'] = t;
                console.log("Searching COMBINED");
            }
            request['format'] = 'jsonp';
            request['results'] = 50;
            request['bucket'] = ['id:spotify-WW', 'tracks']; //'id:7digital-US', 'tracks'];
            request['limit'] = true;
            request['sort'] = 'song_hotttnesss-desc';
            //request['callback'] = '?';

            var paginatedSearchResults = new Paginator();
            var searchView = new SearchResults({collection: this.Songs, paginatorCollection: paginatedSearchResults, page: p, term: t, vent: that.vent, userModel: that.authUser, name: "SongResultsView", artist: false, requestParams: request, parent: this});
            that.mainAreaManager.showView(searchView);

            var paginatorView = new PaginationView({collection: paginatedSearchResults, vent: that.vent, name: "PaginatorView"});
            that.paginatorPanelManager.showView(paginatorView);

            this.vent.trigger("app:clearAutocomplete");
            $('#moreResults').removeClass('hidden');

            /*
            this.Songs.fetch({
                data: $.param(request, true),
                success: function() {
                    var paginatorCollection = new Paginator(that.Songs.toJSON());
                    paginatorCollection.bootstrap();
                    //paginatorCollection.pager();
                    var searchView = new SearchResults({collection: that.Songs, paginatorCollection: paginatorCollection, page: p, term: t, vent: that.vent, userModel: that.authUser, name: "SongResultsView", artist: artistSongs});
                    that.mainAreaManager.showView(searchView);

                    var paginatorView = new PaginationView({collection: paginatorCollection});
                    paginatorView.render();


                    //that.paginator.pager();
                    //that.paginator.bootstrap();
                    //that.paginatorView.render();
                    //this.vent.trigger('paginator:reset');
                    //that.songs.pager();
                }
            });
            */
        },

        registerUser: function() {
            var registerUserView = new RegisterView({userModel: this.authUser, parent: this});
            this.mainAreaManager.showView(registerUserView);
            this.vent.trigger("app:clearAutocomplete");
        },

        displayRegisterDone: function() {
            var registerDoneView = new RegistrationDoneView({});
            this.mainAreaManager.showView(registerDoneView);
            this.vent.trigger("app:clearAutocomplete");
        },


        displayAboutView: function() {
            var aboutView = new AboutView();
            this.mainAreaManager.showView(aboutView);
            this.vent.trigger("app:clearAutocomplete");
            this.vent.trigger("app:removePaginator");
        },


        toggleENParam: function(ev) {
            var id = $(ev.currentTarget).attr('id');
            //alert(id);
            $('#'+id).toggleClass('clicked');
            if (id === "artist_max_familiarity") {
                $('#artist_max_familiarity_container').toggle();
                this.includeArtistMaxFamiliarity = !this.includeArtistMaxFamiliarity;
                //alert('this.includeArtistMaxFamiliarity is: '+this.includeArtistMaxFamiliarity);
            }
            if (id === "artist_min_familiarity") {
                $('#artist_min_familiarity_container').toggle();
                this.includeArtistMinFamiliarity = !this.includeArtistMinFamiliarity;
                //alert('this.includeArtistMinFamiliarity is: '+this.includeArtistMinFamiliarity);
            }
            if (id === "artist_familiarity") {
                $('#artist_familiarity_container').toggle();
                this.includeArtistFamiliarity = !this.includeArtistFamiliarity;
                //alert('this.includeArtistFamiliarity is: '+this.includeArtistFamiliarity);
            }
            if (id === "tempo") {
                $('#tempo_container').toggle();
                this.includeTempo = !this.includeTempo;
                //alert('this.includeTempo is: '+this.includeTempo);
            }
            if (id === "duration") {
                $('#duration_container').toggle();
                this.includeDuration = !this.includeDuration;
            }
            if (id === "danceability") {
                $('#danceability_container').toggle();
                this.includeDanceability = !this.includeDanceability;
            }
            if (id === "energy") {
                $('#energy_container').toggle();
                this.includeEnergy = !this.includeEnergy;
            }
            if (id === "liveness") {
                $('#liveness_container').toggle();
                this.includeLiveness = !this.includeLiveness;
            }
            if (id === "speechiness") {
                $('#speechiness_container').toggle();
                this.includeSpeechiness = !this.includeSpeechiness;
            }
            if (id === "artist_hotttnesss") {
                $('#artist_hotttnesss_container').toggle();
                this.includeArtistHotttnesss = !this.includeArtistHotttnesss;
            }
            if (id === "song_hotttnesss") {
                $('#song_hotttnesss_container').toggle();
                this.includeSongHotttnesss = !this.includeSongHotttnesss;
            }

        },

        makeENPlaylist: function(ev) {
            //alert($('#variety-level').text());
            var request = {};
            var that = this;
            //var selectedDescriptions = [];
            //var selectedMoods = [];

            // Make sure user has selected at least one description or mood. Echo Nest needs at least one of these in order to create a playlist
            /*
            $('#description-container li').each(function(index, value) {
                that.selectedDescriptions.push($(this).text());
            });
            $('#mood-container li').each(function(index, value) {
                that.selectedMoods.push($(this).text());
            });
            */

            if (this.selectedDescriptions.length < 1 && this.selectedMoods.length < 1) {
                alert('You must select at least one description or mood');
                return;
            }
            if (this.selectedDescriptions.length > 0) {
                request['description'] = that.selectedDescriptions;
                console.log('selectedDescriptions: '+that.selectedDescriptions);
            }
            if (this.selectedMoods.length > 0) {
                request['mood'] = that.selectedMoods;
                console.log('selectedMoods: '+that.selectedMoods);
            }


            // Required params
            request['format'] = 'json';
            request['variety'] = $('#variety-level').text();
            request['results'] = $('#results-level').text();
            request['bucket'] = ['id:spotify-WW', 'tracks'];
            request['limit'] = true;
            request['type'] = 'artist-description';
            request['distribution'] = 'focused';


            // Optional params (sent in based on whether the user has clicked on the relevant button to include the specified param
            /*
            Old stuff for separate artist min familiarity & artist max familiarity params. Not needed if using a range slider for artist familiarity
            if (this.includeArtistMaxFamiliarity) {
                console.log('submitting artist_max_familiarity param: '+$('#artist-max-fam-level').text());
                request['artist_max_familiarity'] = $('#artist-max-fam-level').text();
            }

            if (this.includeArtistMinFamiliarity) {
                console.log('submitting artist_min_familiarity param: '+$('#artist-min-fam-level').text());
                request['artist_min_familiarity'] = $('#artist-min-fam-level').text();
            }

            if (this.includeArtistMinFamiliarity && this.includeArtistMaxFamiliarity && $('#artist-min-fam-level').text() >= $('#artist-max-fam-level').text()) {
                alert("Artist Min Familiarity can\'t be greater than Artist Max Familiarity");
                return false;
            }
            */


            if (this.includeArtistFamiliarity) {
                //alert('submitting min AF param: '+$('#artist-familiarity-slider').slider("values", 0));
                //alert('submitting max AF param: '+$('#artist-familiarity-slider').slider("values", 1));
                var minArtistFamiliarity = $('#artist-familiarity-slider').slider("values", 0);
                var maxArtistFamiliarity = $('#artist-familiarity-slider').slider("values", 1);
                request['artist_min_familiarity'] = minArtistFamiliarity;
                request['artist_max_familiarity'] = maxArtistFamiliarity;
            }

            if (this.includeTempo) {
                //alert('submitting min tempo param: '+$('#tempo-slider').slider("values", 0));
                //alert('submitting max tempo param: '+$('#tempo-slider').slider("values", 1));
                var minTempo = $('#tempo-slider').slider("values", 0);
                var maxTempo = $('#tempo-slider').slider("values", 1);
                request['min_tempo'] = minTempo;
                request['max_tempo'] = maxTempo;
            }

            if (this.includeDuration) {
                var minDuration = $('#duration-slider').slider("values", 0);
                var maxDuration = $('#duration-slider').slider("values", 1);
                request['min_duration'] = minDuration;
                request['max_duration'] = maxDuration;
            }

            if (this.includeDanceability) {
                var minDanceability = $('#danceability-slider').slider("values", 0);
                var maxDanceability = $('#danceability-slider').slider("values", 1);
                request['min_danceability'] = minDanceability;
                request['max_danceability'] = maxDanceability;
            }

            if (this.includeEnergy) {
                var minEnergy = $('#energy-slider').slider("values", 0);
                var maxEnergy = $('#energy-slider').slider("values", 1);
                request['min_energy'] = minEnergy;
                request['max_energy'] = maxEnergy;
            }

            if (this.includeLiveness) {
                var minLiveness = $('#liveness-slider').slider("values", 0);
                var maxLiveness = $('#liveness-slider').slider("values", 1);
                request['min_liveness'] = minLiveness;
                request['max_liveness'] = maxLiveness;
            }

            if (this.includeSpeechiness) {
                var minSpeechiness = $('#speechiness-slider').slider("values", 0);
                var maxSpeechiness = $('#speechiness-slider').slider("values", 1);
                request['min_speechiness'] = minSpeechiness;
                request['max_speechiness'] = maxSpeechiness;
            }

            if (this.includeArtistHotttnesss) {
                var minArtistHotttnesss = $('#artist_hotttnesss-slider').slider("values", 0);
                var maxArtistHotttnesss = $('#artist_hotttnesss-slider').slider("values", 1);
                request['artist_min_hotttnesss'] = minArtistHotttnesss;
                request['artist_max_hotttnesss'] = maxArtistHotttnesss;
            }

            if (this.includeSongHotttnesss) {
                var minSongHotttnesss = $('#song_hotttnesss-slider').slider("values", 0);
                var maxSongHotttnesss = $('#song_hotttnesss-slider').slider("values", 1);
                request['song_min_hotttnesss'] = minSongHotttnesss;
                request['song_max_hotttnesss'] = maxSongHotttnesss;
            }

            //request['song_max_hotttnesss'] = 0.8;
            this.radioTracks.fetch({
                data: $.param(request, true),
                success: function() {
                    console.log("ECHO NEST PLAYLIST SUCCESS");
                    console.log('Length of RadioTracks collection: '+that.radioTracks.length);
                    that.trackCollectionToSpotifyParser(request['type'], that.radioTracks);
                    //that.clearAutocompleteViews();
                    // Call method (to be created) that will empty the selectedDescriptions and selectedMoods arrays
                    that.vent.trigger("app:clearAutocomplete");
                }
            });
        },

        /*
            Used to make Artist, Artist-Radio, and Song-Radio playlists (when any of those 3 types of buttons are clicked)
        */
        makeRadioPlaylist: function(ev) {
            var request = {};
            var that = this;
            console.log('$(ev.currentTarget): '+ $(ev.currentTarget).data("attachedData").artistId);

            //console.log('$(ev.currentTarget): '+JSON.stringify($(ev.currentTarget)));
            if ($(ev.currentTarget).data("attachedData").artistId) {
                request['artist_id'] = $(ev.currentTarget).data("attachedData").artistId;
            }
            else if ($(ev.currentTarget).data("attachedData").songId) {
                request['song_id'] = $(ev.currentTarget).data("attachedData").songId;
            }

            request['format'] = 'json';
            request['results'] = 20;
            request['bucket'] = ['id:spotify-WW', 'tracks'];
            request['limit'] = true;
            request['type'] = $(ev.currentTarget).data("attachedData").playlistType; //'artist-radio'
            request['variety'] = 0.2;
            request['distribution'] = 'focused'; //wandering ? 'wandering' : 'focused';

            console.log('Making Playlist of type: '+request['type']+' from Artist ID: '+request['artist_id']);

            console.log('this.radioTracks called from appinit: '+JSON.stringify(this.radioTracks));
            this.radioTracks.fetch({
                data: $.param(request, true),
                success: function() {
                    console.log("ARTIST PLAYLIST SUCCESS");
                    // Try refactoring the displayPlaylist code to accept PREFERREDTITLE and TRACKS params. Pass in the request['type'] and
                    // the ArtistPlaylist collection itself, respectively. Allows the displayPlaylist code to be reused for custom playlist loading
                    console.log('Length of RadioTracks collection: '+that.radioTracks.length);
                    that.trackCollectionToSpotifyParser(request['type'], that.radioTracks);
                }
            });
        },


        /*
            Need this to convert the tracks in a collection to a list of ID's that the Spotify player can recognize
        */
        trackCollectionToSpotifyParser: function(type, collection) {
            var json = collection.toJSON();
            var tracks = '';
            console.log('trackCollectionToSpotifyParser collection: '+JSON.stringify(json));
            for (var i = 0; i < json.length; i++) {
                var song = json[i];
                var tid = song.tracks[0].foreign_id.replace('spotify-WW:track:', '');
                tracks = tracks + tid + ',';
            }
            this.loadPlaylistToSpotifyPlayer(type, tracks);
        },


        /*
            Actually loads the parsed tracks into the Spotify player (which is an iframe object embedded in the page)
        */
        loadPlaylistToSpotifyPlayer: function(plTitle, tracks) {
            var embed = '<iframe src="http://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:TRACKS" style="width:300px; height:380px; display:block" frameborder="0" allowtransparency="true" id="playlistPlayer"></iframe>';
            $('#tapedeck-skin').hide();
            $("#results").empty();
            // Replaces the generic placeholders "TRACKS" and "PREFERREDTITLE" with the parsed response to create embedded, streamable versions of tracks
            var tembed = embed.replace('TRACKS', tracks);
            tembed = tembed.replace('PREFEREDTITLE', plTitle);
            var li = $("<div>").addClass("embed").html(tembed);
            $("#results").append(li);

            //Not needed
            /*
            var embed = '<iframe src="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:TRACKS" style="width:300px; height:380px; display:block" frameborder="0" allowtransparency="true" id="playlistPlayer"></iframe>';
            $("#results").empty();

            var tracks = "";
            var json = window.ArtistPlaylist.toJSON();
            console.log(JSON.stringify(json));
            for (var i = 0; i < json.length; i++) {
                var song = json[i];
                var tid = song.tracks[0].foreign_id.replace('spotify-WW:track:', '');
                tracks = tracks + tid + ',';
            }

            // Replaces the generic placeholders "TRACKS" and "PREFERREDTITLE" with the parsed response to create embedded, streamable versions of tracks
            var tembed = embed.replace('TRACKS', tracks);
            tembed = tembed.replace('PREFEREDTITLE', 'NEW Artist Playlist'); //artist + ' playlist');
            //var li = $("<div>").html(tembed);
            var li = $("<div>").addClass("poop").html(tembed);
            $("#results").append(li);
            */
        },


        addToCustomPlaylist: function(ev) {

            var apiId = $(ev.currentTarget).data("attachedData").songId;
            var spotifyId = $(ev.currentTarget).data("attachedData").spotifyId.replace('spotify-WW:track:', '');
            var trackName = $(ev.currentTarget).data("attachedData").trackName;
            var artistName = $(ev.currentTarget).data("attachedData").artistName;
            var plId = $('#playlistSelector option:selected').val();

            console.log('API ID: '+apiId);
            console.log('SPOTIFY ID: '+spotifyId);
            //console.log('$(ev.currentTarget): '+ $(ev.currentTarget).data("attachedData").songId);

            // Code to add song to the playlist and store it in db (server.js)
            $.post('/save_track', { apiId: apiId, spotifyId: spotifyId, plId: plId, trackName: trackName, artistName: artistName, _csrf: this.authUser.get('token') }, function(data) {
                console.log('Saved Track '+JSON.stringify(data));
                console.log('Type Of Saved Track '+typeof(data));
                if (!data) {
                    // Not used right now since user is able to repeat songs in a playlist if they want
                    alert('This track already exists in the playlist '+$('#playlistSelector option:selected').text());
                }
                else {
                    if (data === 'noplaylist') {
                        alert('No playlist is selected!');
                    } else if (data === 'invalidPlaylist') {
                        alert('There is no such playlist!');
                    } else {
                        alert('Successfully added track to playlist '+$('#playlistSelector option:selected').text());
                    }
                }
            });

        },


        displayPlaylist: function(ev) {
            var pl = $('#playlistSelector option:selected').text();
            var plId = $('#playlistSelector option:selected').val();
            //alert('selected playlist: '+plId);
            
            
            if (plId !== "0") {
                $("#sortableCustomPlaylistTitle").show();
                $("#sortableCustomPlaylist").show();
                $("#sortableCustomPlaylistTitle").html("<h5>Playlist "+pl+"</h5>"); 
            } else {
                $("#sortableCustomPlaylistTitle").hide();
                $("#sortableCustomPlaylist").hide();
            }
            
            

            // Code to get songs for the selected playlist from db, then create a new playlist view and sub-views (for each row/song)
            // Get playlist from db
            var playlist = new Playlist();
            var plView = new CustomPlaylistDisplay({collection: playlist.tracks, model: this.authUser, name: 'CustomPlaylistDisplayView', plId: plId, vent: this.vent, pl: pl, parent: this });
            //this.mainAreaManager.showView(plView);
            this.customPlaylistDisplayManager.showView(plView);
            this.vent.trigger("app:selectedCustomPlaylist");
            
            //alert("PLAYLIST! "+JSON.stringify(playlist));

            // Shouldn't need these if displaying playlist in separate container (any container besides main panel where search results are shown)
            //this.authUser.set({viewingPlaylist: true});
            //this.vent.trigger("app:clearAutocomplete");
            //this.vent.trigger("app:removePaginator");
            
        },

        displayNewCustomPlaylistOptions: function() {
            var displayView = new DisplayNewOptions({model: this.authUser, vent: this.vent, name: 'DisplayNewOptionsView'});
            this.newPlaylistOptionsManager.showView(displayView);
        },


        displayENPlaylistOptions: function() {
            var displayView = new DisplayENOptions({name: 'DisplayENOptionsView'});
            // Make these two (selectedDescriptions and selectedMoods) global attrs so they can be reset when playlist is created and when mainAreaManager view is changed
            //var selectedDescriptions = [];
            //var selectedMoods = [];
            var that = this;
            console.log("SELECTED DESCRIPTIONS: "+this.selectedDescriptions);
            console.log("SELECTED MOODS: "+this.selectedDescriptions);
            var availableDescriptions = [
                'Rock',
                'Jazz',
                'Rap'
            ];
            var availableMoods = [
                'Happy',
                'Sad'
            ];

            this.newPlaylistOptionsManager.showView(displayView);


            $('#results-slider').slider({
                min: 1,
                max: 80,
                step: 1,
                value: 15,
                slide: function(event, ui) {
                    $("#results-level").html(ui.value);
                }
            });


            $('#variety-slider').slider({
                min: 0,
                max: 1,
                step: 0.1,
                value: 0.5,
                slide: function(event, ui) {
                    $("#variety-level").html(ui.value);
                }
            });


            $('#description-autocomplete').autocomplete({
                source: availableDescriptions,
                select: function(event, ui) {
                    // Create new view here for the li description that has been selected. Be sure to pass both the text value and the id value so they
                    // can be attached to the element (so the delete button will work properly)
                    console.log('inARRAY: '+$.inArray(ui.item.label, that.selectedDescriptions));
                    if ($.inArray(ui.item.label, that.selectedDescriptions) !== -1) {
                        alert('item already in list');
                    } else {
                        var newItem = new AutocompleteItem({ txt: ui.item.label, name: 'desc' });
                        $('#description-container').append(newItem.render().el);
                        that.selectedDescriptions.push(ui.item.label);
                        that.autocompleteViews.push(newItem);
                    }

                    /*
                    $('#description-container li').each(function(index) {
                        if ($(this).text() === ui.item.label) {
                            alert('item already in list');
                            return false;
                        }
                    });
                    */

                    $(this).val("");
                    return false;
                }
            });

            $('#mood-autocomplete').autocomplete({
                source: availableMoods,
                select: function(event, ui) {
                    // Create new view here for the li description that has been selected. Be sure to pass both the text value and the id value so they
                    // can be attached to the element (so the delete button will work properly)
                    console.log('inARRAY: '+$.inArray(ui.item.label, that.selectedMoods));
                    if ($.inArray(ui.item.label, that.selectedMoods) !== -1) {
                        alert('item already in list');
                    } else {
                        var newItem = new AutocompleteItem({ txt: ui.item.label, name: 'mood' });
                        $('#mood-container').append(newItem.render().el);
                        that.selectedMoods.push(ui.item.label);
                        that.autocompleteViews.push(newItem);
                    }

                    /*
                     $('#description-container li').each(function(index) {
                     if ($(this).text() === ui.item.label) {
                     alert('item already in list');
                     return false;
                     }
                     });
                     */

                    $(this).val("");
                    return false;
                }
            });

            // Artist_Max_Familiarity
            /*
            $('#artist-max-fam-slider').slider({
                min: 0,
                max: 1,
                step: 0.1,
                value: 0.5,
                slide: function(event, ui) {
                    $("#artist-max-fam-level").html(ui.value);
                }
            });
            */
            // Artist_Min_Familiarity
            /*
            $('#artist-min-fam-slider').slider({
                min: 0,
                max: 1,
                step: 0.1,
                value: 0.5,
                slide: function(event, ui) {
                    $("#artist-min-fam-level").html(ui.value);
                }
            });
            */

            // Artist Familiarity (range slider)
            $('#artist-familiarity-slider').slider({
                range: true,
                min: 0,
                max: 1,
                step: 0.1,
                values: [0.2, 0.8],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#artist-familiarity-amount').val("Min: "+ui.values[0]+" Max: "+ui.values[1]);
                }
            });
            // Set the initial text to the initial values of the slider
            $('#artist-familiarity-amount').val("Min: "+$('#artist-familiarity-slider').slider("values", 0)+" Max: "+$('#artist-familiarity-slider').slider("values", 1));


            // Tempo (range slider)
            $('#tempo-slider').slider({
                range: true,
                min: 0,
                max: 500,
                values: [60, 120],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#tempo-amount').val(ui.values[0]+" BPM - "+ui.values[1]+" BPM");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#tempo-amount').val($('#tempo-slider').slider("values", 0)+" BPM - "+$('#tempo-slider').slider("values", 1)+" BPM");


            // Duration (range slider)
            $('#duration-slider').slider({
                range: true,
                min: 0,
                max: 3600,
                values: [60, 600],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#duration-amount').val(ui.values[0]+" SECONDS - "+ui.values[1]+" SECONDS");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#duration-amount').val($('#duration-slider').slider("values", 0)+" SECONDS - "+$('#duration-slider').slider("values", 1)+" SECONDS");


            // Danceability (range slider)
            $('#danceability-slider').slider({
                range: true,
                min: 0,
                max: 1,
                step: 0.1,
                values: [0.2, 0.8],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#danceability-amount').val(ui.values[0]+" - "+ui.values[1]+"");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#danceability-amount').val($('#danceability-slider').slider("values", 0)+" - "+$('#danceability-slider').slider("values", 1)+"");


            // Energy (range slider)
            $('#energy-slider').slider({
                range: true,
                min: 0,
                max: 1,
                step: 0.1,
                values: [0.2, 0.8],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#energy-amount').val(ui.values[0]+" - "+ui.values[1]+"");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#energy-amount').val($('#energy-slider').slider("values", 0)+" - "+$('#energy-slider').slider("values", 1)+"");


            // Liveness (range slider)
            $('#liveness-slider').slider({
                range: true,
                min: 0,
                max: 1,
                step: 0.1,
                values: [0.2, 0.8],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#liveness-amount').val(ui.values[0]+" - "+ui.values[1]+"");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#liveness-amount').val($('#liveness-slider').slider("values", 0)+" - "+$('#liveness-slider').slider("values", 1)+"");


            // Speechiness (range slider)
            $('#speechiness-slider').slider({
                range: true,
                min: 0,
                max: 1,
                step: 0.1,
                values: [0.2, 0.8],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#speechiness-amount').val(ui.values[0]+" - "+ui.values[1]+"");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#speechiness-amount').val($('#speechiness-slider').slider("values", 0)+" - "+$('#speechiness-slider').slider("values", 1)+"");


            // Artist Hotttnesss (range slider)
            $('#artist_hotttnesss-slider').slider({
                range: true,
                min: 0,
                max: 1,
                step: 0.1,
                values: [0.2, 0.8],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#artist_hotttnesss-amount').html(ui.values[0]+" - "+ui.values[1]+"");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#artist_hotttnesss-amount').html($('#artist_hotttnesss-slider').slider("values", 0)+" - "+$('#artist_hotttnesss-slider').slider("values", 1)+"");


            // Song Hotttnesss (range slider)
            $('#song_hotttnesss-slider').slider({
                range: true,
                min: 0,
                max: 1,
                step: 0.1,
                values: [0.2, 0.8],
                slide: function(event, ui) {
                    if (ui.values[0] === ui.values[1]) {
                        return false;
                    }
                    $('#song_hotttnesss-amount').html(ui.values[0]+" - "+ui.values[1]+"");
                }
            });
            // Set the initial text to the initial values of the slider
            $('#song_hotttnesss-amount').html($('#song_hotttnesss-slider').slider("values", 0)+" - "+$('#song_hotttnesss-slider').slider("values", 1)+"");


            //this.vent.trigger("app:setupENPlaylistOptions");
            this.vent.trigger("app:removePaginator");
        },


        clearAutocompleteViews: function() {
            /*
                Need to reset these vars so that no values remain in them if user goes and does something else in the main panel and comes back to
                making an EN playlist. If these weren't cleared, in that case the user would falsely receive an 'item already in list' error if they
                tried to enter a value that they entered last time they made an EN playlist.
            */
            this.selectedDescriptions = [];
            this.selectedMoods = [];
            _.each(this.autocompleteViews, function(childView) {
                childView.close();
                console.log('closed view from autocompleteViews');
            });
        },


        removeAutocompleteView: function(ev) {
            alert($(ev.currentTarget).attr('id'));
            alert($(ev.currentTarget).attr('name'));
            //$(this).parent().remove();

            var selectedArray = '';
            if ($(ev.currentTarget).attr('name') === 'desc') {
                selectedArray = this.selectedDescriptions;
            } else if ($(ev.currentTarget).attr('name') === 'mood') {
                selectedArray = this.selectedMoods;
            }

            for (var i = selectedArray.length-1; i >= 0; i--) {
                if (selectedArray[i] === $(ev.currentTarget).attr('id')) {
                    selectedArray.splice(i, 1);
                    alert(selectedArray);
                    break;
                }
            }
            $(ev.currentTarget).parent().remove();

        },

        getAuthUser: function() {

            var that = this;
            this.authUser.fetch({
                success: function() {
                    console.log('AUTH USER FETCHED SUCCESSFULLY');
                    that.authCheck();
                },
                error: function() {
                    console.log('ERROR FETCHING AUTH USER');
                }
            });
        },

        /*
        getPlaylists: function() {
            console.log('GETTING PLAYLISTS');
            var that = this;
            var request = {};
            request['userid'] = this.authUser.get('uid');
            this.playlists.fetch({
                data: $.param(request, true),
                success: function() {
                    console.log('Fetched user\'s playlists successfully');
                    console.log("the collection: "+that.playlists.toJSON());
                    //that.playlistControlPanelSwap();
                },
                error: function() {
                    console.log('Could not fetch user\'s playlists');
                }
            });

        },
        */

        // Generalize this into a swapper for views in & out of region managers based on auth status (loginPanelManager, playlistControlPanelManager)
        playlistControlPanelSwap: function() {

            var playlistControlPanelView;
            if (!this.authUser.get('loggedIn')) {
                console.log("REMOVING PLAYLIST CONTROL PANEL (not logged in)");
                playlistControlPanelView = new blankView();
            } else {
                //console.log(this.playlists);
                console.log("ADDING PLAYLIST CONTROL PANEL (logged in)");
                playlistControlPanelView = new playlistControlPanel({model: this.authUser, vent: this.vent, username: this.authUser.get('username'), name: "PlaylistControlPanelView", collection: this.playlists, parent: this});
                //this.playlistControlPanelManager.showView(playlistControlPanelView);
                //this.getPlaylists();
            }
            this.playlistControlPanelManager.showView(playlistControlPanelView);
        },

        /*
            Used to check auth status on page load. Without this, refreshing the page would show an inaccurate status
        */
        authCheck: function() {
            //console.log('fetched authUser: '+this.authUser.get('loggedIn'));
            console.log('running authCheck...');

            if (!this.authUser.get('loggedIn')) {
                console.log('User is LOGGED OUT');

                this.loggedOutView = new loggedOutView({model: this.authUser, vent: this.vent, name: "loggedOutView"});
                this.loginPanelManager.showView(this.loggedOutView);

                this.vent.trigger("app:loggedout");
                //console.log('triggered app:loginfail');

            } else {
                console.log('User is LOGGED IN');

                this.loggedInView = new loggedInView({model: this.authUser, vent: this.vent, username: this.authUser.get('username'), name: "loggedInView"});
                this.loginPanelManager.showView(this.loggedInView);
                this.vent.trigger("app:loggedin");
                $('#boombox-logo').html(this.authUser.get('username').toUpperCase());
                $('#ipod-logo').html(this.authUser.get('username').toUpperCase());
                //console.log("triggered app:loginsuccess");
            }
            this.vent.trigger("app:getTopTen");
                
        }

    });

    return AppView;
});

define(['views/customPlaylistDisplay', 'collections/playlistsongs', 'models/playlistSong', 'underscore', 'backbone', 'jqueryui'], function(CustomPlaylistDisplay, Tracks, Song, _, Backbone, App, Workspace, ui) {


    return describe('View :: CustomPlaylistDisplay', function() {

        var playlistCollection = new Tracks();
        playlistCollection.add([
            {track: "Thriller", spotify_id: '1234'},
            {track: "Jump", spotify_id: '5678'}
        ]);

        var parentView = Backbone.View.extend({
            loadPlaylistToSpotifyPlayer: function(plTitle, spotifyIds) {
            }
        });


        //var workspace = new Workspace();
        //var app = new App({router: workspace});

        describe('#initialize', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                CustomPlaylistDisplay.prototype.setup = jasmine.createSpy('setup');
                this.playlist = new CustomPlaylistDisplay({name: "custom_playlist", vent: this.vent, collection: playlistCollection});
                
                //this.playlist.setup = jasmine.createSpy('setup');
                //sinon.stub(this.playlist, 'setup');
                /*
                    Need to create a spy here, even though the setup() function already exists, since setup() calls the $.sortable() function of jQueryUI.
                    If we were to use spyOn here instead of jasmine.createSpy, the setup() function would call the jQueryUI sortable() function and not find it, thus throwing an error.
                    By using jasmine.createSpy here, we are ensuring that the setup() function is completely mocked, and will not go ahead and call any other functions within it
                */
                
                spyOn(this.playlist, 'getPlaylist');
                
                
                this.vent.bind('app:selectedCustomPlaylist', this.playlist.getPlaylist);

            });

            afterEach(function() {
                this.playlist.remove();
            });

            it('should properly initialize the view and call getPlaylist() when app:selectedCustomPlaylist is triggered', function() {
                //var testDiv = '<div id="sortable"></div>';
                //spyOn(ui, "sortable");
                //this.playlist2 = new CustomPlaylistDisplay({name: "custom_playlist", vent: this.vent, collection: playlistCollection});
                //this.playlist2.setup = jasmine.createSpy('setup');
                
                //spyOn(this.playlist, 'setup');
                
                this.playlist.initialize();
                this.vent.trigger("app:selectedCustomPlaylist");
                expect(this.playlist.name).toEqual("custom_playlist");
                expect(this.playlist.getPlaylist).toHaveBeenCalled();
                expect(this.playlist.setup).toHaveBeenCalled();
            });
        });


        describe('#getPlaylist', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.playlist = new CustomPlaylistDisplay({name: "custom_playlist", vent: this.vent, collection: playlistCollection});
                this.eventSpy = sinon.stub(this.playlist.collection, 'fetch').yieldsTo('success', playlistCollection);
                spyOn(this.playlist, 'addAll');

            });

            afterEach(function() {
                this.playlist.remove();
                this.eventSpy.restore();
            });

            it('should fetch the custom playlist from server and call addAll() on success', function() {
                this.playlist.getPlaylist();
                expect(this.eventSpy.calledOnce).toBe(true);
                expect(this.playlist.addAll).toHaveBeenCalled();
            });
        });


        describe('#addAll', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.playlist = new CustomPlaylistDisplay({name: "custom_playlist", vent: this.vent, collection: playlistCollection, plId: 5});
                spyOn(this.playlist, 'addOne');
            });

            afterEach(function() {
                this.playlist.remove();
            });

            it('should call the addOne() method for each model in the collection', function() {
                this.playlist.addAll();
                $('#musicapp').html(this.playlist.render().el);
                expect(this.playlist.addOne.callCount).toEqual(2);
                console.log('#musicapp: '+$('#musicapp').html());
                expect(this.playlist.el.nodeName).toEqual("UL");
                // Moved the appending of #loadPlaylist to appinit so this line is no longer needed in this file
                //expect($('#loadPlaylist')).toHaveText('Load Playlist');
            });
        });


        describe('#addOne', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.playlist = new CustomPlaylistDisplay({name: "custom_playlist", vent: this.vent, collection: playlistCollection, plId: 5});
            });

            afterEach(function() {
                this.playlist.remove();
            });

            it('should create a customPlaylistItem view for each model in collection, and append it to DOM and childViews array', function() {
                this.playlist.addAll(); // Will call addOne() for each model in collection
                $('#musicapp').html(this.playlist.render().el);
                expect(this.playlist.childViews.length).toEqual(2);
                // The .removeTrack button now has an 'X' image instead of a '-' char
                //expect($('.removeTrack:first')).toHaveText('-');
            });
        });


        describe('#onClose', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.playlist = new CustomPlaylistDisplay({name: "custom_playlist", vent: this.vent, collection: playlistCollection, plId: 5});
                spyOn(this.playlist, 'getPlaylist');
                spyOn(this.playlist.collection, 'fetch');

                //this.vent.unbind('app:selectedCustomPlaylist', this.playlist.getPlaylist);
            });

            afterEach(function() {
                this.playlist.remove();
            });

            it('should remove the event handler for app:selectedCustomPlaylist and close all child views', function() {
                this.playlist.addAll(); // Will fill up the childViews array with views for all models in collection
                //console.log('CHILD VIEWS: '+JSON.stringify(this.playlist.childViews));
                _.each(this.playlist.childViews, function(childView) {
                    spyOn(childView, 'close');
                });
                this.playlist.onClose();
                this.vent.trigger("app:selectedCustomPlaylist");

                expect(this.playlist.getPlaylist).not.toHaveBeenCalled();
                _.each(this.playlist.childViews, function(childView) {
                    expect(childView.close).toHaveBeenCalled();
                });
                //expect(this.playlist.childViews.length).toEqual(0);
            });
        });


        /* Moved the loadPlaylist() function to appinit
        describe('#loadPlaylist', function() {

            beforeEach(function() {
                var testDiv = '<div id="loadPlaylist">Load</div>';
                setFixtures(testDiv);
                this.vent = new _.extend({}, Backbone.Events);
                //this.mockup = sinon.mock(Backbone);
                //this.mockup.expects('loadPlaylistToSpotifyPlayer').once().withArgs(this.playlist.pl, ['1234', '5678']);
                //this.mock = sinon.stub(this.contacts, 'loadPlaylistToSpotifyPlayer'); //sinon.mock(Song.prototype).expects("loadPlaylistToSpotifyPlayer").once();
                // Create a fake version of appinit() since including appinit.js in this file seems to cause an error with the html rendering for the addAll() and addOne() tests
                this.parentView = new parentView();
                spyOn(this.parentView, 'loadPlaylistToSpotifyPlayer');

                CustomPlaylistDisplay.prototype.setup = jasmine.createSpy('setup');
                this.playlist = new CustomPlaylistDisplay({name: "custom_playlist", vent: this.vent, collection: playlistCollection, plId: 5, pl: '80s90s', parent: this.parentView});
                spyOn(this.playlist, 'getPlaylist');
                $('#loadPlaylist').click(this.playlist.loadPlaylist);
            });

            afterEach(function() {
                this.playlist.remove();
            });

            it('should create an array of spotifyIds from the collection to pass to loadPlaylistToSpotifyPlayer() in appinit.js', function() {
                this.playlist.initialize();
                $('#loadPlaylist').trigger('click');
                expect(this.parentView.loadPlaylistToSpotifyPlayer).toHaveBeenCalledWith("80s90s", ['1234', '5678']);
            });
        });
        */



    });

});

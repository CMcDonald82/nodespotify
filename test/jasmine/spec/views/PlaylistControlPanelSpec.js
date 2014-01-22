define(['views/playlistControlPanel', 'collections/playlists', 'models/authuser'], function(PlaylistControlPanel, Playlists, authuser) {


    return describe('View :: PlaylistControlPanel', function() {

        var authUser = new authuser({loggedIn: false, username: "the_user", uid: "1234"});
        var playlistCollection = new Playlists();
        playlistCollection.add([
            {'playlist_id': 1, 'title': 'Playlist 1'},
            {'playlist_id': 2, 'title': 'Playlist 2'}
        ]);
        console.log('RESULTS OF playlistCollection: '+JSON.stringify(playlistCollection.models));

        describe('#initialize', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.controlPanel = new PlaylistControlPanel({name: "newControlPanel", vent: this.vent, model: authUser, collection: playlistCollection});
                spyOn(this.controlPanel, 'addAll');
                spyOn(this.controlPanel, 'render');
            });

            afterEach(function() {
                this.controlPanel.remove();
            });

            it('should properly initialize the view', function() {
                this.controlPanel.initialize();
                expect(this.controlPanel.name).toEqual("newControlPanel");
                this.controlPanel.collection.reset();
                expect(this.controlPanel.addAll).toHaveBeenCalled();
                expect(this.controlPanel.blankPlaylist.get('playlist_id')).toEqual(0);
                expect(this.controlPanel.blankPlaylist.get('title')).toEqual('No Playlist Selected');
                expect(this.controlPanel.render).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.controlPanel = new PlaylistControlPanel({name: "newControlPanel", vent: this.vent, model: authUser, collection: playlistCollection});
                spyOn(this.controlPanel, 'getPlaylists');
                this.vent.bind('app:getCustomPlaylists', this.controlPanel.getPlaylists);
            });

            afterEach(function() {
                this.controlPanel.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.controlPanel.render().el);

                // The #viewPlaylist button is no longer used
                //expect($('#viewPlaylist')).toHaveText('View Playlist');
                expect(this.controlPanel.getPlaylists).toHaveBeenCalled();
            });
        });


        describe('#getPlaylists', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.controlPanel = new PlaylistControlPanel({name: "newControlPanel", vent: this.vent, model: authUser, collection: playlistCollection});
                this.eventSpy = sinon.stub(this.controlPanel.collection, 'fetch').yieldsTo('success');
            });

            afterEach(function() {
                this.controlPanel.remove();
                this.eventSpy.restore();
            });

            it('tests that the user\'s playlists are fetched successfully', function() {
                this.controlPanel.getPlaylists();
                expect(this.eventSpy.calledOnce).toBe(true);
            });
        });


        describe('#addAll', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.controlPanel = new PlaylistControlPanel({name: "newControlPanel", vent: this.vent, collection: playlistCollection, model: authUser, username: authUser.get('username')});
                spyOn(this.controlPanel, 'addOne');
                playlistCollection.add([
                    {'playlist_id': 1, 'title': 'Playlist 1'},
                    {'playlist_id': 2, 'title': 'Playlist 2'}
                ]);
            });

            afterEach(function() {
                this.controlPanel.remove();
            });

            it('should call the addOne() method for each model in the collection', function() {
                this.controlPanel.addAll();
                expect(this.controlPanel.addOne.callCount).toEqual(3);
            });
        });


        describe('#addOne', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.controlPanel = new PlaylistControlPanel({name: "newControlPanel", vent: this.vent, collection: playlistCollection, model: authUser});
            });

            afterEach(function() {
                this.controlPanel.remove();
            });

            it('should create a playlistSelector view for each model in collection, and append it to DOM and childViews array', function() {
                $('#musicapp').html(this.controlPanel.render().el);
                this.controlPanel.addAll(); // Will call addOne() for each model in collection
                expect(this.controlPanel.childViews.length).toEqual(3);
                expect($('option:first')).toHaveText('No Playlist Selected');
            });
        });

        // Moved to displayNewPlaylistOptionsView.js so this test should be moved to that spec as well
        /*
        describe('#newCustomPlaylist', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.controlPanel = new PlaylistControlPanel({name: "newControlPanel", vent: this.vent, collection: playlistCollection, model: authUser});
                //this.eventSpy = sinon.stub(this.controlPanel.newPlaylist, 'save').yieldsTo('success');
                spyOn(window, "alert");
                spyOn(this.controlPanel, "onClose");
                spyOn(this.controlPanel, "getPlaylists");
            });

            afterEach(function() {
                this.controlPanel.remove();
                //this.eventSpy.restore();
            });

            it('should create a new custom playlist with the name the user has given', function() {
                this.controlPanel.newCustomPlaylist();
                //expect(this.eventSpy.calledOnce).toBe(true);
                //expect(window.alert).toHaveBeenCalled();
                //expect(this.controlPanel.onClose).toHaveBeenCalled();
                //expect(this.controlPanel.getPlaylists).toHaveBeenCalled();
            });
        });
        */


        describe('#onClose', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.controlPanel = new PlaylistControlPanel({name: "newControlPanel", vent: this.vent, collection: playlistCollection, model: authUser});
                //spyOn(this.playlist, 'getPlaylist');
            });

            afterEach(function() {
                this.controlPanel.remove();
            });

            it('should close all child views', function() {
                this.controlPanel.addAll(); // Will fill up the childViews array with views for all models in collection
                _.each(this.controlPanel.childViews, function(childView) {
                    spyOn(childView, 'close');
                });
                this.controlPanel.onClose();
                _.each(this.controlPanel.childViews, function(childView) {
                    expect(childView.close).toHaveBeenCalled();
                });
            });
        });


    });

});


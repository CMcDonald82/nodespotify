/*
var assert = require("assert")
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
})
*/


var mongoose = require('mongoose'),
    mongoFunctions = require('../serverFunctions/mongoFunctions'),
    schema = require('../mongoSchemas'),
    bcrypt = require('../serverFunctions/encryptionFunctions'),
    assert = require("assert");

mongoose.connect('mongodb://localhost/radio_test');

describe('register', function() {
    var currentUser = null;
    before(function(done) {
        var encryptedPw = bcrypt.bcryptPassword("password");
        var newUser = new schema.user({username: "testuser", password: encryptedPw});
        console.log("schema.user_username: "+newUser.username);
        done();
    });

    after(function(done) {
        schema.user.remove({}, function() {
            done();
        });
    });


    /* Registration Tests */

    it("registers a new user", function(done) {
        mongoFunctions.register("testuser2", "password", "password", function(err, doc) {
            console.log("ERR1: "+err+" DOC1: "+JSON.stringify(doc.name));
            //doc.name.should.equal("success");
            assert.equal(doc.name, "success");
            done();
        }, function(message) {
            message.should.equal(null);
            done();
        });
    });

    it("tries to register a new user with a username that already exists", function(done) {
        mongoFunctions.register("testuser2", "password", "password", function(err, doc) {
            var testErr = new Error('Username Already Exists');
            console.log("ERR2: "+err+" DOC2: "+JSON.stringify(doc)+" NEWERR2: "+testErr);
            //err.should.equal(Error('Username Already Exists'));
            assert.equal(err.message, testErr.message);
            done();
        });
    });

    it("tries to register a user with blank username", function(done) {
        mongoFunctions.register("", "password", "password", function(err, doc) {
            var testErr = new Error('Username & Password fields can\'t be blank dude!');
            console.log("ERR3: "+err+" DOC3: "+JSON.stringify(doc)+" NEWERR3: "+testErr);
            assert.equal(err.message, testErr.message);
            done();
        });
    });

    it("tries to register a user with blank password", function(done) {
        mongoFunctions.register("blankpassword", "", "password", function(err, doc) {
            var testErr = new Error('Username & Password fields can\'t be blank dude!');
            console.log("ERR4: "+err+" DOC4: "+JSON.stringify(doc)+" NEWERR4: "+testErr);
            assert.equal(err.message, testErr.message);
            done();
        });
    });

    it("tries to register a user with different passwords", function(done) {
        mongoFunctions.register("diffpasswords", "password1", "password2", function(err, doc) {
            var testErr = new Error('Passwords don\'t match');
            console.log("ERR5: "+err+" DOC5: "+JSON.stringify(doc)+" NEWERR5: "+testErr);
            assert.equal(err.message, testErr.message);
            done();
        });
    });

    it("tries to register a user with a space in username", function(done) {
        mongoFunctions.register("new user", "password", "password", function(err, doc) {
            var testErr = new Error('Can\'t have a space in your username bro');
            console.log("ERR6: "+err+" DOC6: "+JSON.stringify(doc)+" NEWERR6: "+testErr);
            assert.equal(err.message, testErr.message);
            done();
        });
    });


});




describe('createPlaylistTrack', function() {

    before(function(done) {
        this.pl = new schema.playlist({});
        this.pl.save();
        //console.log("schema.playlist_id: "+pl._id);
        this.trk = new schema.track({ track_name: 'Cant Touch This', api_id: '1234', spotify_id: '5678', artist_name: 'MC Hammer' });
        done();
    });

    after(function(done) {
        schema.playlist.remove({}, function() {
            done();
        })
    });

    it('tries to get a playlist when no playlist is selected (playlist id coming from client is 0)', function(done) {
        mongoFunctions.createPlaylistTrack('123', '456', 'Purple Haze', 'Jimi Hendrix', '0', function(doc) {
            console.log("DOC: "+JSON.stringify(doc));
            assert.equal(doc, 'noplaylist');
            done();
        });
    });

    it('saves a new track to the playlist', function(done) {
        var that = this;
        mongoFunctions.createPlaylistTrack('123', '456', 'Purple Haze', 'Jimi Hendrix', String(this.pl._id), function(doc) {
            //var testErr = new Error('createPlaylistTrack threw an error while finding playlist');
            //console.log("ERR7: "+err+" DOC7: "+JSON.stringify(doc)+" NEWERR7: "+testErr);
            assert.equal(doc.track_name, 'Purple Haze');
            //console.log('PLAYLIST AFTER CREATE PLAYLIST TRACK: '+that.pl);
            done();
        });
    });


    it('tries saving a new track to a playlist with a bogus id', function(done) {
        mongoFunctions.createPlaylistTrack('123', '456', 'Purple Haze', 'Jimi Hendrix', 'some_bogus_id', function(doc) {
            /* Use below once app.post('/save_track') in server.js is reworked to handle actual Error objects (just as /register does) instead of text strings like "noplaylist"
            var testErr = new Error('createPlaylistTrack threw an error while finding playlist');
            console.log("ERR8: "+err+" DOC8: "+JSON.stringify(doc)+" NEWERR8: "+testErr);
            assert.equal(err.message, testErr.message);
            */
            assert.equal(doc, 'invalidPlaylist');
            done();
        });
    });



});



describe('removeTrackFromPlaylist', function() {

    before(function(done) {
        this.pl = new schema.playlist({});
        this.pl.save();
        done();
    });

    after(function(done) {
        schema.playlist.remove({}, function() {
            schema.track.remove({}, function() {
                done();
            });

        })
    });

    it('tries to remove a bogus track from a legit playlist', function(done) {
        mongoFunctions.removeTrackFromPlaylist("9876", this.pl._id, function(doc) {
            console.log('DOC LENGTH: '+doc.tracks.length);
            assert.equal(doc.tracks.length, 0);
            done();
        });
    });

    it('removes a track from the playlist', function(done) {
        var that = this;
        mongoFunctions.createPlaylistTrack('123', '456', 'Midnight Rider', 'Allman Brothers Band', String(that.pl._id), function(doc) {
            assert.equal(doc.track_name, 'Midnight Rider');
            mongoFunctions.createPlaylistTrack('123', '456', 'Stunt', '50 Cent', String(that.pl._id), function(doc1) {
                assert.equal(doc1.track_name, 'Stunt');

                mongoFunctions.removeTrackFromPlaylist(doc1._id, that.pl._id, function(doc2) {
                    console.log('DOC2: '+doc2.tracks.length);
                    assert.equal(doc2.tracks.length, 1);
                    done();
                });
            });

        });
    });


    it('tries to remove a track from a bogus playlist', function(done) {
        var that = this;
        mongoFunctions.createPlaylistTrack('123', '456', 'Money For Nothin', 'Dire Straits', String(that.pl._id), function(doc1) {
            assert.equal(doc1.track_name, 'Money For Nothin');
            mongoFunctions.removeTrackFromPlaylist(doc1._id, "4567", function(doc2) {
                assert.equal(doc2, 'invalidPlaylist');
                done();
            });
        });
    });



});



describe('createPlaylist', function() {

    before(function(done) {
        var encryptedPw = bcrypt.bcryptPassword("password");
        var newUser = new schema.user({username: "testuser", password: encryptedPw});
        newUser.save();
        done();
    });

    after(function(done) {
        schema.user.remove({}, function() {
            done();
        });
    });

    it('creates a new playlist associated with an existing user', function(done) {
        schema.user.findOne({ 'username': 'testuser' }, function(err, u) {
            console.log("Users Table: "+ u._id);
            mongoFunctions.createPlaylist("my_list", u._id, function(doc) {
                assert.equal(doc.title, "my_list");
                done();
            });

        });
    });

    it('tries to create a new playlist associated with a non-existing user', function(done) {
        mongoFunctions.createPlaylist("my_list", "1234", function(doc) {
            assert.equal(doc, "invalidUser");
            done();
        });
    });

});



describe('getPlaylist', function() {

    before(function(done) {
        this.pl = new schema.playlist({});
        var that = this;
        this.pl.save(function(e) {
            console.log("this.pl._id: "+that.pl._id);
        //done();

            mongoFunctions.createPlaylistTrack('123', '456', 'Light My Fire', 'The Doors', String(that.pl._id), function(doc) {
                console.log("CREATED NEW PL TRACK: "+doc);
                done();
            });
        });
    });

    after(function(done) {
        schema.playlist.remove({}, function() {
            done();
        });
    });

    it('gets the playlist that was saved', function(done) {
        //done();
        //var that = this;
        /*
        mongoFunctions.createPlaylistTrack('123', '456', 'Purple Haze', 'Jimi Hendrix', String(this.pl._id), function(doc) {
            console.log("CREATED NEW PL TRACK: "+doc);
            mongoFunctions.getPlaylist(that.pl._id, function(doc1) {
                console.log("PL TRAX: "+doc1);
                done();
            });
        });
        */
        mongoFunctions.getPlaylist(this.pl._id, function(doc1) {
            console.log("PL TRAX: "+doc1);
            assert.equal(doc1[0].track_name, 'Light My Fire');
            done();
        });

    });

    it('tries to get a non-existent playlist', function(done) {
        mongoFunctions.getPlaylist("fake_id", function(doc) {
            assert.equal(doc, 'invalidPlaylist');
            done();
        });

    });

});



describe('getUserPlaylists', function() {

    before(function(done) {

        var encryptedPw = bcrypt.bcryptPassword("password");
        this.newUser = new schema.user({username: "testuser", password: encryptedPw});
        var that = this;
        this.newUser.save(function(e) {
            console.log("newUser._id: "+that.newUser._id);
            mongoFunctions.createPlaylist('first_playlist', String(that.newUser._id), function(doc) {
                console.log("CREATED NEW PLAYLIST FOR USER: "+doc);
                mongoFunctions.createPlaylist('second_playlist', String(that.newUser._id), function(doc1) {
                    console.log("CREATED NEW PLAYLIST FOR USER: "+doc1);
                    done();
                });
            });
        });
    });

    after(function(done) {
        schema.user.remove({}, function() {
            done();
        });
    });

    it('gets the playlists belonging to a user', function(done) {
        mongoFunctions.getUserPlaylists(this.newUser._id, function(doc1) {
            console.log("USER PLs: "+doc1);
            assert.equal(doc1.length, 2);
            assert.equal(doc1[0].title, 'first_playlist');
            assert.equal(doc1[1].title, 'second_playlist');
            done();
        });
    });

    it('tries to get playlists for a non-existent user', function(done) {
        mongoFunctions.getUserPlaylists("fake_user", function(doc) {
            assert.equal(doc, 'invalidUser');
            done();
        });
    });

});



describe('getUsers', function() {

    before(function(done) {
        var that = this;
        var encryptedPw1 = bcrypt.bcryptPassword("password");
        var encryptedPw2 = bcrypt.bcryptPassword("password2");
        this.newUser1 = new schema.user({username: "testuser1", password: encryptedPw1});
        this.newUser2 = new schema.user({username: "testuser2", password: encryptedPw2});
        this.newUser1.save(function(e) {
            console.log("newUser1._id: "+that.newUser1._id);
            that.newUser2.save(function(e) {
                console.log("newUser2._id: "+that.newUser2._id);
                done();
            });
        });
    });

    after(function(done) {
        schema.user.remove({}, function() {
            done();
        });
    });

    it('gets all users from the DB', function(done) {
        mongoFunctions.getUsers(function(doc) {
            console.log("ALL USERS: "+doc);
            assert.equal(doc.length, 2);
            assert.equal(doc[0].username, 'testuser1');
            assert.equal(doc[1].username, 'testuser2');
            done();
        });
    });
});


/* Template - delete when tests are all written */
/*
describe('', function() {

    before(function(done) {

    });

    after(function(done) {

    });

    it('', function(done) {

    });
});
*/
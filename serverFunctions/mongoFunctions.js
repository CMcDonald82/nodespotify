// These are db specific functions, i.e. functions that need to access the db to get data. Since querying Postgres is different than querying Mongo,
// these functions need to have separate versions for each db system used.


var mongoose = require('mongoose'),
    bcrypt = require('./encryptionFunctions'),
    schema = require('../mongoSchemas');
var client;

module.exports = {

    connect: function() {
        var conString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/radiodb";
        mongoose.connect(conString);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error: '));
        db.once('open', function callback() {
            console.log("Mongoose connection successful");
        });
    },

    test: function (req, res) {
        schema.user.find(function(err, users) {
            if (err) {
                console.log("getUsers threw an error");
            } else {
                console.log("Users (MongoDB): "+users);
            }
        });
        /*
        console.log("PASSED TEST");
        var sumvars = req.body.vars + 2;
        res.send('The answer is... '+sumvars);
        */
    },

    getUsers: function(callback) {
        schema.user.find(function(err, users) {
            if (err) {
                console.log("getUsers threw an error");
                return callback("noUsers");
            } else {
                console.log("Users (MongoDB): "+users);
                return callback(users);
            }
        })
    },

    getUserPlaylists: function(userid, callback) {
        schema.user.findOne({"_id": userid})
            .populate('playlists')
            .exec(function(err, user) {
                if (err) {
                    console.log("getUserPlaylists threw an error");
                    return callback("invalidUser");
                } else {
                    console.log("User Playlists (MongoDB): "+user.playlists);
                    return callback(user.playlists);
                }
            });
    },

    getPlaylist: function(plId, callback) {
        schema.playlist.findOne({"_id": plId})
            //.sort('tracks.sort_index', 1)
            .populate({path: 'tracks', options: { sort: [['sort_index', 'asc']] }})
            .exec(function(err, pl) {
                if (err) {
                    console.log("getPlaylist threw an error");
                    return callback("invalidPlaylist");
                } else {
                    console.log("Playlist Tracks (MongoDB): "+pl.tracks);
                    return callback(pl.tracks);
                }
            });
    },

    
    // Test function for rearranging order of user-created playlist with jQueryUI sorting
    rearrangePlaylist: function(plId, trackIds, callback) {
        var playlist;
        var that = this;
        if (plId === "0") {
            console.log("No playlist selected");
            return callback('noplaylist');
        }
        schema.playlist.findOne({"_id": plId}, function(err, pl) {
            if (err) {
                console.log("rearrangePlaylist threw an error while getting playlist");
                return callback('invalidPlaylist');
            } else {
                //console.log("PLAYLIST TO BE REARRANGED: "+pl);
                playlist = pl;
                // Check to make sure all of the track ID's sent from the client are actually in the playlist. If not, do not rearrange
                for (var i=0; i<trackIds.length; i++) {
                    if (playlist.tracks.indexOf(trackIds[i]) === -1) {
                        return callback('invalidTracks');
                    }
                }
                // If all tracks from client are valid tracks in the playlist, update the order of the tracks and save
                var updateSet = {};
                console.log("LENGTH OF playlist.tracks: "+playlist.tracks.length);
                for (var i=0; i<trackIds.length; i++) {
                    var idx = i;
                    console.log("RUNNING OUTER LOOP - INDEX: "+idx);
                    playlist.tracks.forEach(function(t, index) {
                        console.log("t: "+t+"    trackIds[i]: "+trackIds[i]+"    index: "+index);
                        if (t.toString() === trackIds[i].toString()) {
                            console.log("FOUND TRACK IN SUBMITTED LIST! "+t);
                            console.log("TRACK SORT INDEX: "+idx);

                            t.sort_index = idx;
                            console.log("SET TRACK SORT INDEX TO: "+t.sort_index);
                            that.abc(playlist, t, idx);
                        }
                    });

                }
                console.log("UPDATE SET: "+JSON.stringify(updateSet));
                
                return callback(playlist);
            }
        });
    },


    abc: function(pl, track, idx) {
        console.log("CALLED abc WITH INDEX OF ... "+idx);
        schema.track.findOne({"_id": track}, function(err, trk) {
            trk.sort_index = idx;
            trk.save(function(err) {
                console.log("SAVED PLAYLIST!!!");
                if (err) {
                    console.log("rearrangePlaylist threw an error while saving playlist")
                }
            });
        });
        
    },

    



    createPlaylist: function(title, uid, callback) {
        var user;
        schema.user.findOne({"_id": uid}, function(err, u) {
            if (err) {
                console.log("createPlaylist threw an error while creating user");
                return callback('invalidUser');
            } else {
                console.log("THE USER: "+u);
                user = u;
                var pl = new schema.playlist({
                    title: title
                });
                pl.playlist_id = pl._id;
                user.playlists.push(pl._id);
                user.save(function(err) {
                    if (err) {
                        console.log("createPlaylist threw an error while saving user");
                    }
                });
                pl.save(function(err) {
                    if (err) {
                        console.log("createPlaylist threw an error while saving playlist");
                    }
                });
                return callback(pl);
            }
        });
    },

    removeTrackFromPlaylist: function(trackId, plId, callback) {
        var playlist;
        if (plId === "0") {
            console.log("No playlist selected");
            return callback('noplaylist');
        }
        schema.playlist.findOne({"_id": plId}, function(err, pl) {
            if (err) {
                console.log("removeTrackFromPlaylist threw an error while getting playlist");
                return callback('invalidPlaylist');
            } else {
                console.log("THE PLAYLIST: "+pl);
                playlist = pl;
                while (playlist.tracks.indexOf(trackId) !== -1) {
                    playlist.tracks.splice(playlist.tracks.indexOf(trackId), 1);
                }
                playlist.save(function(err) {
                    if (err) {
                        console.log("removeTrackFromPlaylist threw an error while saving playlist");
                        return callback('errorSaving');
                    }
                });
                return callback(playlist);
            }
        });
    },

    createPlaylistTrack: function(enId, spotId, trackName, artistName, plId, callback) {
        var playlist;
        console.log('plId: '+plId+' Type: '+typeof(plId));
        if (plId === "0") {
            console.log("No playlist selected");
            return callback('noplaylist');
        }
        schema.playlist.findOne({"_id": plId}, function(err, pl) {
            if (err) {
                console.log("createPlaylistTrack threw an error while finding playlist");
                return callback('invalidPlaylist');
            } else {
                // Check if track already exists in playlist - might want to add this but for now, leave as is (so that user can have a playlist that
                // has the same song in it more than once (maybe they want to repeat the song several times throughout the playlist)
                //... code here
                //console.log("THE PLAYLIST: "+pl);
                //pl.tracks.length(function(err, count) {
                console.log("THE COUNT IS: "+pl.tracks.length);
                //});
                var track = new schema.track({
                    track_name: trackName,
                    api_id: enId,
                    spotify_id: spotId,
                    artist_name: artistName,
                    sort_index: pl.tracks.length += 1
                });
                track.track_id = track._id;
                pl.tracks.push(track._id);
                pl.save(function(err) {
                    if (err) {
                        console.log("createPlaylistTrack threw an error while saving playlist");
                    }
                });
                track.save(function(err) {
                    if (err) {
                        console.log("createPlaylistTrack threw an error while saving track");
                    }
                });
                console.log("THE PLAYLIST TRACKS: "+pl.tracks);
                return callback(track);
            }
        });
    },

    register: function(username, pw, pwCheck, callback) {
        /*
         Registration function with 3 steps:
         - Encrypt the password (received by the function in plaintext)
         - Check if user with username already exists in db
         - If not, create and save the user to the db with encrypted pw
         */
        if (username === '' || pw === '' || pwCheck === '') {
            return callback(new Error('Username & Password fields can\'t be blank dude!'));
        }
        if (pw !== pwCheck) {
            return callback(new Error('Passwords don\'t match'));
        }
        if (username.indexOf(' ') !== -1) {
            return callback(new Error('Can\'t have a space in your username bro'));
        }
        else {
            var encryptedPw = bcrypt.bcryptPassword(pw);
            var newUser = new schema.user({username: username, password: encryptedPw});
            newUser.save(function(err, newuser) {
                if (err) {
                    return callback(new Error('Username Already Exists'));
                } else {
                    console.log('Username: '+newuser.username);
                    return callback(null, {name: 'success'});
                }
            });
            /*
            client.query("SELECT 1 FROM users WHERE username = $1", [username], function(err, result) {
                if (!result.rows[0]) {
                    client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, encryptedPw], function(err, result) {
                        console.log('Username: '+JSON.stringify(result));
                        return callback(null, {name: 'success'});
                    });
                }
                else {
                    return callback(new Error('Username Already Exists'));
                }
            });
            */
        }
    }


};

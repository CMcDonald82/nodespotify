// These are db specific functions, i.e. functions that need to access the db to get data. Since querying Postgres is different than querying Mongo,
// these functions need to have separate versions for each db system used.


var pg = require('pg'),
    bcrypt = require('./encryptionFunctions');
var client;

module.exports = {

    connect: function() {
        var conString = "tcp://postgres:admin@localhost:5432/nodetest";
        client = new pg.Client(conString);
        client.connect();
    },

    test: function (req, res) {
        console.log("PASSED TEST");
        var sumvars = req.body.vars + 2;
        res.send('The answer is... '+sumvars);
    },

    getUsers: function (callback) {
        //pg.connect(conString, function(err, client) {
        client.query("SELECT * FROM users", function(err, result) {
            return callback(result.rows);
        });
        //});
    },

    getUserPlaylists: function(userid, callback) {
        client.query("SELECT * FROM playlist WHERE user_id = $1", [userid], function(err, result) {
            return callback(result.rows);
        });
    },

    getPlaylist: function(plId, callback) {
        client.query("SELECT * FROM track, playlist_track WHERE playlist_track.playlist_id = $1 AND track.track_id = playlist_track.track_id", [plId], function(err, result) {
            return callback(result.rows);
        });
    },

    createPlaylist: function(title, uid, callback) {
        client.query("INSERT INTO playlist(title, user_id) values($1, $2)", [title, uid], function(err, result) {
            return callback(result.rows);
        });
    },

    removeTrackFromPlaylist: function(trackId, plId, callback) {
        client.query("DELETE FROM playlist_track WHERE playlist_track.playlist_id = $1 AND playlist_track.track_id = $2", [plId, trackId], function(err, result) {
            return callback(result.rows);
        });
    },

    createPlaylistTrack: function(enId, spotId, trackName, artistName, plId, callback) {
        console.log('plId: '+plId+' Type: '+typeof(plId));
        if (plId === "0") {
            console.log("No playlist selected");
            return callback('noplaylist');
        }
        else {
            client.query("SELECT upsert_track_1($1, $2, $3, $4)", [enId, spotId, trackName, artistName], function(err, result) {
                console.log('RETURNING ID: '+JSON.stringify(result));
                console.log('ERR: '+JSON.stringify(err));

                var resTrackId = result.rows[0].upsert_track_1;
                console.log('Result of upsert_track: '+resTrackId);
                //return callback(result.rows[0].track_id);

                // Create another stored procedure in db (like upsert_track, above) to handle creating or getting the playlist/track relationship
                client.query("SELECT check_track_playlist1($1, $2)", [parseInt(resTrackId), parseInt(plId)], function(err, result) {
                    console.log('RESULT IS: '+JSON.stringify(result));
                    // return the result to callback (true=track was added, false=track already exists in specified playlist, not added)
                    return callback(result.rows[0].check_track_playlist1);
                });
            });
        }
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
        }
    }


};

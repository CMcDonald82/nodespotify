// Stays in server.js
var express = require('express'),
    path = require('path'),
    http = require('http'),
    songs = require('./routes/songs'),
    passport = require('passport'),
    flash = require('connect-flash'),
    util = require('util'),
    LocalStrategy = require('passport-local').Strategy,
    //bcrypt = require('bcrypt'),
    bcryptFunctions = require('./serverFunctions/encryptionFunctions'),
    pg = require('pg'), //native libpq bindings = `var pg = require('pg').native`
    mongoose = require('mongoose'), 
    genreList = require('./genre_list.json');
    styleList = require('./style_list.json');


// Set to "MONGO" to use MongoDB and set to "PG" to use PostgreSQL
var dbType = "MONGO";

// Postgres DB stuff - example, needs to be customized & refactored. Probably want to modularize too, so we can swap out for code for
// another DB such as Mongo very easily when we want
// Stays in server.js

/*
function dbConnect() {
    var conString = '';
    if (dbType === "PG") {
        conString = "tcp://postgres:admin@localhost:5432/nodetest";
        var client = new pg.Client(conString);
        client.connect();
    } else if (dbType === "MONGO") {
        conString = "mongodb://localhost/radiodb";
        mongoose.connect(conString);
    }
    return client;
}

var client = dbConnect();
*/


var serverFunctions = '';
if (dbType === "PG") {
    serverFunctions = require('./serverFunctions/pgFunctions');
} else if (dbType === "MONGO") {
    serverFunctions = require('./serverFunctions/mongoFunctions');
}
serverFunctions.connect();





/*
function dbConnect() {

    pg.connect(conString, function(err, client) {
        return client;
    });
}
*/

//queries are queued and executed one after another once the connection becomes available
//var client = dbConnect();


// Example node-postgres code showing some things that node-postgres can do
/*
var client = new pg.Client(conString);
client.connect();
client.query("CREATE TEMP TABLE beatles(name varchar(10), height integer, birthday timestamptz)");
client.query("INSERT INTO beatles(name, height, birthday) values($1, $2, $3)", ['Ringo', 67, new Date(1945, 11, 2)]);
client.query("INSERT INTO beatles(name, height, birthday) values($1, $2, $3)", ['John', 68, new Date(1944, 10, 13)]);


//queries can be executed either via text/parameter values passed as individual arguments
//or by passing an options object containing text, (optional) parameter values, and (optional) query name
client.query({
    name: 'insert beatle',
    text: "INSERT INTO beatles(name, height, birthday) values($1, $2, $3)",
    values: ['George', 70, new Date(1946, 02, 14)]
});

//subsequent queries with the same name will be executed without re-parsing the query plan by postgres
client.query({
    name: 'insert beatle',
    values: ['Paul', 63, new Date(1945, 04, 03)]
});
var query = client.query("SELECT * FROM beatles WHERE name = $1", ['John']);

//can stream row results back 1 at a time
query.on('row', function(row) {
    console.log(row);
    console.log("Beatle name: %s", row.name); //Beatle name: John
    console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
    console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
});

//fired after last row is emitted
query.on('end', function() {
    client.end();
});
*/

// End example node-postgres code


// Example MongoDB code
/*
mongoose.connect('mongodb://localhost/radiodb');

var Song = new mongoose.Schema({
    title: String,
    artist: String,
    releaseDate: Date
});

var SongModel = mongoose.model( 'Song', Song );

var song = new SongModel({
    title: 'New Song',
    artist: 'New Artist',
    releaseDate: Date.now()
});

song.save( function( err ) {
    if( !err ) {
        return console.log( 'created' );
    } else {
        return console.log( err );
    }
});
*/


// Add code here to get user from db (if one exists). Before making call to db, hash & salt the pw value to match it up with the
// stored value (pw will be stored in db as a salted hash value, not plaintext). Use bcrypt
/*
var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
    { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];
*/

/*
// Get users from db
function getUsers(callback) {
    pg.connect(conString, function(err, client) {
        client.query("SELECT * FROM users", function(err, result) {
            //console.log('All Users: '+JSON.stringify(result));
            //callback(new Error('crap'));
            return callback(result.rows);
        });
    });
}

// Get a specific user's playlists from db
function getUserPlaylists(userid, callback) {
    pg.connect(conString, function(err, client) {
        client.query("SELECT * FROM playlist WHERE user_id = $1", [userid], function(err, result) {
            return callback(result.rows);
        });
    });
}


// Get a specific playlist (including songs) from db
function getPlaylist(plId, callback) {
    pg.connect(conString, function(err, client) {
        client.query("SELECT * FROM track, playlist_track WHERE playlist_track.playlist_id = $1 AND track.track_id = playlist_track.track_id", [plId], function(err, result) {
            return callback(result.rows);
        });
    });
}


// Create new custom playlist and add it to db
function createPlaylist(title, uid, callback) {
    pg.connect(conString, function(err, client) {
        client.query("INSERT INTO playlist(title, user_id) values($1, $2)", [title, uid], function(err, result) {
            return callback(result.rows);
        });
    });
}


// Remove a track from a playlist but keep both the track and the playlist in the DB
function removeTrackFromPlaylist(trackId, plId, callback) {
    pg.connect(conString, function(err, client) {
        client.query("DELETE FROM playlist_track WHERE playlist_track.playlist_id = $1 AND playlist_track.track_id = $2", [plId, trackId], function(err, result) {
            return callback(result.rows);
        });
    });
}


// Create new track and add to playlist
function createPlaylistTrack(enId, spotId, trackName, artistName, plId, callback) {
    console.log('plId: '+plId+' Type: '+typeof(plId));
    if (plId === "0") {
        console.log("No playlist selected");
        return callback('noplaylist');
    }
    else {
        pg.connect(conString, function(err, client) {
            //client.query("INSERT INTO track(api_id, spotify_id) values($1, $2) RETURNING track_id", [enId, spotId], function(err, result) {
            //client.query("SELECT * FROM track WHERE api_id = $1 AND spotify_id = $2", [enId, spotId], function(err, result) {
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
        });
    }
}

*/





// Original versions
/*
function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}


function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}
*/


// New Versions (with callbacks)
// TODO: Change 'boolRes' params in callbacks to something that makes more sense. Functionality should stay the same.

function findByUsername(username, fn) {
    serverFunctions.getUsers(function(users) {
        //console.log("findByUsername: "+users);

        console.log('Users passed to findByUsername: '+JSON.stringify(users));
        for (var i = 0, len = users.length; i < len; i++) {
            var user = users[i];
            if (user.username === username) {
                console.log("Found User Name");
                return fn(null, user);
            }
        }
        return fn(null, null);
    })
}

function findById(id, fn) {
    serverFunctions.getUsers(function(users) {
        for (var i = 0, len = users.length; i < len; i++) {
            var user = users[i];
            if (user.id === id) {
                console.log("Found User ID");
                return fn(null, user);
            }
        }
        fn(new Error('User ' + id + ' does not exist'));

        // The below code will not work if any users have been deleted from the db (since id's are auto-incrementing and will not match with
        // indices if any users have been removed
        /*
        var idx = id - 1;
        if (users[idx]) {
            fn(null, users[idx]);
        } else {
            fn(new Error('User ' + id + ' does not exist'));
        }
        */
    })
}




//function register(username, pw, pwCheck, callback) {
    /*
    Registration function with 3 steps:
        - Encrypt the password (received by the function in plaintext)
        - Check if user with username already exists in db
        - If not, create and save the user to the db with encrypted pw
    */
/*
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
        var encryptedPw = bcryptPassword(pw);

        //console.log('Bcrypt PW: '+bcryptPassword(pw));
        pg.connect(conString, function(err, client) {
            client.query("SELECT 1 FROM users WHERE username = $1", [username], function(err, result) {
                if (!result.rows[0]) {
                    client.query('INSERT INTO users (username, password) VALUES ($1, $2, $3)', [username, encryptedPw], function(err, result) {
                        console.log('Username: '+JSON.stringify(result));
                        return callback(null, {name: 'success'});
                    });
                }
                else {
                    return callback(new Error('Username Already Exists'));
                }
            });
        });
    }
}
*/

/*
function bcryptPassword(pw) {
    var salt = bcrypt.genSaltSync(10);
    //var hash = bcrypt.hashSync("B4c0/\/", salt);
    var hash = bcrypt.hashSync(pw, salt);
    return hash;
}

function decryptPassword(pw, storedPw) {
    //return bcrypt.compareSync("B4c0/\/", pw);
    return bcrypt.compareSync(pw, storedPw);
}

*/

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function(err, user) {
                console.log("findByUsername: "+JSON.stringify(user));
                if (err) { console.log("There was an error"); return done(err); }
                if (!user) { console.log("No User"); return done(null, false, { message: 'Unknown user ' + username }); }
                if (!bcryptFunctions.decryptPassword(password, user.password)) { console.log("Password UNsuccessful. password: "+password+" \npwHash: "+user.password); return done(null, false, { message: 'Invalid password' }); }
                else{ console.log("Password successful. password: "+password+" \npwHash: "+user.password); }
                //if (user.password != decryptPassword(password)) { console.log("Invalid Password. Stored: "+user.password+" \nbCrypt: "+decryptPassword(password)); return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
        });
    }
));




// Stays in server.js
var app = express();

app.configure(function () {
    // Basic server setup
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname))); //, 'public')));


    //app.set('views', __dirname + '/views');
    //app.set('view engine', 'ejs');
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    // Always make sure that express.session({}) is defined BEFORE any of the Passport-specific stuff (below) when using Passport for authentication
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(flash());
    // Stuff for Passport
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.csrf());
    app.use(function(req, res, next){
        res.locals.token = req.session._csrf;
        next();
    });
    app.use(app.router);
});



app.get('/songs', songs.findAll);
app.get('/songs/:id', songs.findById);

/*
app.get('/songs', function(req, res) {
    res.send([{name:'song1'}, {name:'song2'}]);
});
app.get('/songs/:id', function(req, res) {
    res.send({id:req.params.id, name: "The Name", description: "description"});
});
*/

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});










// Put in a "routes.js" file or something (like routes/songs.js)
app.get('/', function(req, res){
    //res.render('index', { user: req.user });
    res.send('Logged In');
});

app.get('/account', ensureAuthenticated, function(req, res){
    //res.render('account', { user: req.user });
    //console.log(req);
    console.log("Logged In User's ID: "+req.user.id);
    res.send('Authenticated');

});

app.get('/login', function(req, res){
    //res.render('login', { user: req.user, message: req.flash('error') });
    //console.log("Get Req: "+JSON.stringify(req.flash()));
    var err = req.flash().error;
    if (req.flash()) {
        console.log("There was an error");
        console.log("Get Req: "+err);
        res.send(err);
    }
    else {
        res.send('Need To Log In');
    }
});

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {

        //console.log("Post Req: "+req);
        //console.log("Post Res: "+res);
        console.log('Login Success');
        res.send({success: 'success', userid: req.user.id, uname: req.user.username}); //{user: req.user.username})

    });

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
/*
 app.post('/login', function(req, res, next) {
 passport.authenticate('local', function(err, user, info) {
 if (err) { return next(err) }
 if (!user) {
 req.flash('error', info.message);
 return res.redirect('/login')
 }
 req.logIn(user, function(err) {
 if (err) { return next(err); }
 return res.redirect('/users/' + user.username);
 });
 })(req, res, next);
 });
 */

app.get('/logout', function(req, res){
    //console.log("Req: "+req.body);
    req.logout();
    //res.redirect('/');
    res.send('loggedout');
});


app.post('/register', function(req, res) {

    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.passwordCheck);
    //console.log(req.body.email);

    // Can use req.body to get params since they were passed in as args to the $.post call that the client made
    var username = req.body.username;
    var pw = req.body.password;
    var pwCheck = req.body.passwordCheck;
    //var email = req.body.email;
    serverFunctions.register(username, pw, pwCheck, function(err, resp) {
        console.log("The Err: "+err+" The Resp: "+JSON.stringify(resp));
        var msg = '';
        if (err) {
            //console.log("finally done");
            console.log(err.name);
            console.log(err.message);
            msg = err.message.toString();
            //return console.log(err.toString());
        }
        else {
            console.log("Success:", resp.name);
            msg = resp.name;
        }
        res.send(msg);
    });


});


// Parses the genres from genreList file
app.get('/genres', function(req, res) {
    var j = genreList.response.genres;
    var genreArr = [];
    // For some reason, JSON.parse doesn't work here, possibly because file is already in JSON format (comes directly from EchoNest so should be properly formatted)
    console.log("j: "+j.length);
    for (var i=0; i<j.length; i++) {
        //console.log("i= "+i);
        genreArr.push(j[i].name);
    }
    console.log("genreArr: "+JSON.stringify(genreArr));
    res.send(genreArr);
});

// Parses the styles from styleList file
app.get('/styles', function(req, res) {
    var s = styleList.response.terms;
    var styleArr = [];
    // For some reason, JSON.parse doesn't work here, possibly because file is already in JSON format (comes directly from EchoNest so should be properly formatted)
    console.log("j: "+s.length);
    for (var i=0; i<s.length; i++) {
        //console.log("i= "+i);
        styleArr.push(s[i].name);
    }
    console.log("styleArr: "+JSON.stringify(styleArr));
    res.send(styleArr);
});




app.get('/playlists', function(req, res) {
    // req.query is needed here since we used $.param to pass the data, rather than passing it as part of the req body directly
    var userid = req.query.userid;
    console.log("Playlist User ID: "+userid);
    /*
    if (userid === '') {
        console.log('blank userid');
        res.send('err');
    }
    */

    //else {
        // DB query to get the user's playlists
        serverFunctions.getUserPlaylists(userid, function(playlists) {
            console.log('All User Playlists for userid '+userid+': '+JSON.stringify(playlists));
            res.send(JSON.stringify(playlists, null, 4));
        });
    //}

});


app.get('/get_playlist', function(req, res) {
    var plId = req.query.plId;
    if (parseInt(plId) < 1) {
        console.log("Playlist ID: 0. No Playlist Selected");
        res.send("err");
    }
    else {
        console.log("Playlist ID: "+plId);
        serverFunctions.getPlaylist(plId, function(playlist) {
            console.log('All tracks in Playlist id '+plId+': '+JSON.stringify(playlist));
            res.send(JSON.stringify(playlist, null, 4));
        });
    }
});

// Old function to delete track - see if everything works if this is removed
app.post('/playlist_track', function(req, res) {
    var plId = req.body.playlist_id;
    var trackId = req.body.track_id;
    var apiId = req.body.api_id;
    console.log('Deleting track '+trackId+' apiID: '+apiId+' from playlist '+plId);
    serverFunctions.removeTrackFromPlaylist(trackId, plId, function(track) {
        console.log('Track: '+trackId+' successfully deleted from playlist ID: '+plId);
        res.send(JSON.stringify(track, null, 4));
    });
});


// New function to delete track from custom playlist
app.post('/delete_playlist_track', function(req, res) {
    var plId = req.body.playlist_id;
    var trackId = req.body.track_id;
    console.log('Deleting track '+trackId+' from playlist '+plId);
    serverFunctions.removeTrackFromPlaylist(trackId, plId, function(status) {
        console.log('Track: '+trackId+' successfully deleted from playlist ID: '+plId);
        res.send(status);
    });
}); 


app.post('/save_playlist', function(req, res) {
    //console.log(req);
    var title = req.body.title;
    var uid = req.body.userid;
    console.log('The playlist title is: '+title+' userid: '+uid);
    serverFunctions.createPlaylist(title, uid, function(playlist) {
        console.log('New Playlist: '+JSON.stringify(playlist));
        res.send(JSON.stringify(playlist, null, 4));
    });
    //res.send('');
});


// Test function for rearranging order of tracks in playlist (track ordering recieved from jQueryUI Sortable on client) 
app.post('/rearrange_playlist', function(req, res) {
    var tracklist = req.body.tracklist;
    var plId = req.body.plId;

    console.log("REARRANGING TRACKS FOR: "+plId);
    console.log("TRACKLIST IS: "+tracklist);
    
    serverFunctions.rearrangePlaylist(plId, tracklist, function(status) {
        res.send(status);
    });
    
    
});



app.post('/save_track', function(req, res) {
    var spotifyId = req.body.spotifyId;
    var apiId = req.body.apiId;
    var plId = req.body.plId;
    var trackName = req.body.trackName;
    var artistName = req.body.artistName;

    serverFunctions.createPlaylistTrack(apiId, spotifyId, trackName, artistName, plId, function(boolRes) {
        res.send(boolRes);
    });
});


app.get('/login_check', function(req, res) {
    var status = '';
    var uname = '';
    var userid = '';
    var token = res.locals.token;
    //console.log(req);
    if (req.isAuthenticated()) {
        status = 'loggedin';
        uname = req.user.username;
        userid = req.user.id;
    }
    else {
        status = 'notloggedin';
    }
    console.log('Logged In User ID: '+userid);
    console.log('Token: '+res.locals.token);
    res.send({status: status, uname: uname, userid: userid, token: token})
});


app.post('/test', serverFunctions.test);



//app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

// Put in a "routes.js" file or something (like routes/songs.js)
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', "Gotta Log In");
    res.redirect('/login')
}
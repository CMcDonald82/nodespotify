/* Schemas for MongoDB. These mirror the schemas that exist in the postgres tables */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TrackSchema = new Schema({
    sort_index: Number,
    track_name: String,
    api_id: String,
    spotify_id: String,
    artist_name: String,
    track_id: String // These are dupes of the standard "_id" property. They are needed just to maintain the same naming conventions as in the pgFunctions. This allows easier swapping of Postgres & Mongo db's
});

var PlaylistSchema = new Schema({
    title: String,
    playlist_id: String, // These are dupes of the standard "_id" property. They are needed just to maintain the same naming conventions as in the pgFunctions. This allows easier swapping of Postgres & Mongo db's
    tracks: [{type: Schema.Types.ObjectId, ref: 'Track'}]
});

var UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}]
});


var User = mongoose.model('User', UserSchema);
var Playlist = mongoose.model('Playlist', PlaylistSchema);
var Track = mongoose.model('Track', TrackSchema);


module.exports = {
    user: User,
    playlist: Playlist,
    track: Track
};

/*
var UserSchema = new Schema({

    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    playlists: [{name: {type: String},
                tracks: [{api_id: {type: String},
                        spotify_id: {type: String},
                        track_name: {type: String},
                        artist_name: {type: String}
                }]
    }]

}, {autoIndex: false});
*/

/*
var TrackSchema = new Schema({

    api_id: {type: String},
    spotify_id: {type: String},
    track_name: {type: String},
    artist_name: {type: String},
    playlist: [{title: String}]
});
*/


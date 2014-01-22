//var app = app || {};

//(function() {
//    'use strict';

    window.Song = Backbone.Model.extend({


    });

    window.Artist = Backbone.Model.extend({});

    window.Style = Backbone.Model.extend({});


window.AuthUser = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        username: 'blank',
        uid: '',
        viewingPlaylist: false
    },

    initialize: function() {
        //alert('New AuthUser initialized. LoggedIn: '+this.loggedIn);
    },

    url: 'login_check',

    parse: function(resp) {
        var status = '';
        console.log('loggedIn status: '+resp['status']);
        if (resp['status'] === 'loggedin') {
            status = true;
        }
        else {
            status = false;
        }
        this.set({loggedIn: status, username: resp['uname'], uid: resp['userid']});
        console.log('model authUser username: '+authUser.get('username'));
        console.log('model authUser userid: '+authUser.get('uid'));
    }


});

//}());

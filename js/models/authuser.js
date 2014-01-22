// Used with require.js setup
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var AuthUser = Backbone.Model.extend({

        defaults: {
            loggedIn: false,
            username: 'blank',
            uid: '',
            viewingPlaylist: false,
            token: ''
        },

        /*
        initialize: function() {
            //alert('New AuthUser initialized. LoggedIn: '+this.loggedIn);
        },
        */

        url: 'login_check',


        parse: function(resp) {
            var status = '';
            console.log('PARSED loggedIn status: '+resp['status']);
            if (resp['status'] === 'loggedin') {
                status = true;
            }
            else {
                status = false;
            }
            this.set({loggedIn: status, username: resp['uname'], uid: resp['userid'], token: resp['token']});
            console.log('AuthUser.parse: model authUser username: '+this.get('username'));
            console.log('AuthUser.parse: model authUser userid: '+this.get('uid'));
            console.log('AuthUser.parse: model authUser csrf token: '+this.get('token'));
        }

    });

    return AuthUser;
});



/* Boilerplate
define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

});
*/
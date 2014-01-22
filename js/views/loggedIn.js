// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/LogoutView.html'
], function($, _, Backbone, logoutTemplate) {

    var LoggedInView = Backbone.View.extend({

        events: {
            'click #logout': 'logout'
        },

        initialize: function(attrs) {
            //this.options.vent.on("app:loggedin", this.render, this);
            this.name = this.options.name;
            this.render();
        },

        render: function() {
            //console.log('uname: '+this.options.username);
            var compiled_template = _.template(logoutTemplate);
            $(this.el).html(compiled_template({uname: this.options.username}));
            return this;
        },

        logout: function() {
            var that = this;
            $.get('/logout', function(data) {
                if (data === "loggedout") {
                    that.options.model.set({loggedIn: false, username: '', uid: ''});
                    console.log('model authUser username: '+that.options.model.get('username'));
                    console.log('model authUser userid: '+that.options.model.get('uid'));
                    that.options.vent.trigger("app:authchange");
                    $('#boombox-logo').html("JVC");
                    $('#ipod-logo').html("iPod");
                }
            });
        },

        onClose: function(){
            //this.model.unbind("change", this.render);
            //this.options.vent.off("app:loggedin", this.render, this);
        }

    });

    return LoggedInView;
});

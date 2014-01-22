// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/LoginView.html'
], function($, _, Backbone, loginTemplate) {

    var LoggedOutView = Backbone.View.extend({

        events: {
            'click #login': 'login'
        },

        initialize: function() {
            // Want to render this view only in the case where the user is NOT logged in (i.e. the app:loginfail event is triggered)
            //console.log('LoginView vent: '+this.options.vent);

            //this.options.vent.on("app:loggedout", this.render, this);
            //this.model.bind('change', this.render);
            //console.log('get model loggedIn attr: '+this.model.get('loggedIn'));
            this.name = this.options.name;
            this.render();
        },

        render: function() {
            var compiled_template = _.template(loginTemplate);
            $(this.el).html(compiled_template());
            //$(this.el).html(loginTemplate);
            return this;
        },


        login: function() {
            var that = this;
            var uname = $('#username').val();
            var pw = $('#password').val();
            console.log("Login Uname: "+uname);
            console.log("Login Pword: "+pw);

            $.post('/login', { username: uname, password: pw, _csrf: this.model.get('token') }, function(resp) {
                if (resp['success']) {
                    that.options.model.set({loggedIn: true, username: resp['uname'], uid: resp['userid']});
                    that.options.vent.trigger("app:authchange");
                    $('#boombox-logo').html(resp['uname'].toUpperCase());
                    $('#ipod-logo').html(resp['uname'].toUpperCase());
                }
                else {
                    alert(data);
                }
            });
        },

        onClose: function(){
            //this.model.unbind("change", this.render);
            //this.options.vent.off("app:loggedout", this.render, this);
        }

    });

    return LoggedOutView;
});

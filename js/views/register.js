// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/RegisterView.html'
], function($, _, Backbone, registerTemplate) {

    var RegisterView = Backbone.View.extend({

        events: {
            'click #register': 'register'
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            $('#loginPanel').html('');
            var compiled_template = _.template(registerTemplate);
            $(this.el).html(compiled_template());
            return this;
        },

        register: function() {
            var that = this;
            var uname = $('#regUsername').val();
            var pw = $('#regPassword').val();
            var pwCheck = $('#regPasswordCheck').val();
            console.log("REGISTRATION: uname "+uname+" pw "+pw+" pwCheck "+pwCheck);
            //var email = $('#email').val();
            $.post('/register', { username: uname, password: pw, passwordCheck: pwCheck, _csrf: this.options.userModel.get('token') }, function(data) {
                //alert(data);
                if (data === "success") {
                    //$('#content').html(new RegisterDoneView().render().el);
                    that.options.parent.displayRegisterDone();
                } else {
                    $('#msgs').html(data);
                }
            });
        }

    });

    return RegisterView;
});
window.LoginView = Backbone.View.extend({

    //el: $('#loginPanel'),

    initialize: function() {
        // Want to render this view only in the case where the user is NOT logged in (i.e. the app:loginfail event is triggered)
        //console.log('LoginView vent: '+this.options.vent);
        this.options.vent.on("app:loginfail", this.render, this);
        //this.model.bind('change', this.render);
        //console.log('get model loggedIn attr: '+this.model.get('loggedIn'));
        this.name = this.options.name;
    },

    render: function() {
        $(this.el).html(this.template());
        return this;
    },

    onClose: function(){
        this.model.unbind("change", this.render);
        this.options.vent.off("app:loginfail", this.render, this);
    }

});


window.LogoutView = Backbone.View.extend({

    //el: $('#loginPanel'),

    initialize: function(attrs) {
        this.options.vent.on("app:loginsuccess", this.render, this);
        //this.model.bind('change', this.render);
        this.name = this.options.name;
        //this.options = attrs;
    },

    render: function() {
        $(this.el).html(this.template({uname: this.options.username}));
        return this;
    },

    onClose: function(){
        this.model.unbind("change", this.render);
        this.options.vent.off("app:loginsuccess", this.render, this);
    }

});


window.RegisterView = Backbone.View.extend({

    events: {
        'click #register': 'register'
    },

    render: function() {
        $('#loginPanel').html('');
        $(this.el).html(this.template());
        return this;
    },

    register: function() {
        var uname = $('#username').val();
        var pw = $('#password').val();
        var pwCheck = $('#passwordCheck').val();
        var email = $('#email').val();
        $.post('/register', { username: uname, password: pw, passwordCheck: pwCheck, email: email }, function(data) {
            //alert(data);
            $('#msgs').html(data);
            if (data === "success") {
                $('#content').html(new RegisterDoneView().render().el);
                //$('#regBlock').html("You\'ve successfully registered! Click this button to go back home and login");
                //$('#regBlock').append('<div id="backHome" class="button">Home</div>');
            }
        });
    }
});


window.RegisterDoneView = Backbone.View.extend({

    events: {
        'click #backHome': 'backHome'
    },

    render: function() {
        //$('#loginPanel').html('');
        $(this.el).html(this.template());
        return this;
    },

    backHome: function() {
        app.navigate('/', {trigger: true});
    }

});
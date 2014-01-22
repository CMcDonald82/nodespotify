window.HomeView = Backbone.View.extend({

    //el: '#musicapp',



    initialize: function() {
        //this.options.vent.on("app:loginfail", this.render, this);
        this.render();
    },

    render: function() {



        //var plStatus = $('#userPlaylists').length;
        //console.log('plStatus: '+plStatus);
        $(this.el).html(this.template({editor_status: ''}));
        return this;
    },

    events: {
        //'click #song': 'searchClick',
        /*
        'click #login': 'testButton',
        'click #logout': 'logout',
        'click #account': 'account',
        'click #register': 'register'
        */
    }


    // Moved to app.js. Can delete once confirmed it is working there.
    /*
    testButton: function(ev) {
        var urlVar = $(ev.currentTarget).attr('id');
        console.log(urlVar);
        // Make $.post request to /login, see if it will work
        $.post('/'+urlVar, { username: "bob", password: "secret" }, function(data) {
            alert(data['user']);
        });
        /*
        $.post('/login', { username: "bob", password: "secret" }, function(data) {
            alert(data);
        });
        */
    /*
    },

    logout: function() {
        $.get('/logout', function(data) {
            alert(data);
        });
    },

    account: function() {
        $.get('/account', function(data) {
            alert(data);
        });
    },

    register: function() {
        $.post('/register', { username: "dumbass", password: "secret", email: "bob@bob.com" }, function(data) {
            alert(data);
        });
    }
    */
});

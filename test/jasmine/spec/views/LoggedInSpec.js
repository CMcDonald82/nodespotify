define(['views/loggedIn', 'text!tpl/LogoutView.html', 'models/authuser'], function(LoggedIn, LoggedoutItemTemplate, authuser) {

    return describe('View :: LoggedIn', function() {

        var authUser = new authuser({loggedIn: true, username: "the_user", uid: "1234"});

        describe('#initialize', function() {

            beforeEach(function() {
                var testDiv = '<div id="#logout">Logout</div>';
                setFixtures(testDiv);
                this.loggedin = new LoggedIn({name: "logged_in"});
                spyOn(this.loggedin, 'render');
                //spyOn(this.loggedin, 'logout');
                //$('#logout').click(this.loggedin.logout);
            });

            afterEach(function() {
                this.loggedin.remove();
            });

            it('should properly initialize the view', function() {
                this.loggedin.initialize(); // Need to call initialize() here, otherwise render() will not be called
                expect(this.loggedin.name).toEqual("logged_in");
                expect(this.loggedin.render).toHaveBeenCalled();
                //$('#logout').trigger('click');
                //expect(this.loggedin.logout).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.template = loadFixtures(LoggedoutItemTemplate);
                this.loggedin = new LoggedIn({name: "logged_in"});
                spyOn(this.loggedin, 'logout');
            });

            afterEach(function() {
                this.loggedin.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.loggedin.render().el);
                $('#logout').click(this.loggedin.logout);
                expect($('#logout')).toHaveText('Logout');
                $('#logout').trigger('click');
                expect(this.loggedin.logout).toHaveBeenCalled();

            });
        });


        describe('#logout', function() {

            beforeEach(function() {
                var testDiv = '<div id="#logout">Logout</div><div id="boombox-logo"></div><div id="ipod-logo"></div>';
                setFixtures(testDiv);
                this.vent = new _.extend({}, Backbone.Events);
                this.loggedin = new LoggedIn({name: "logged_in", model: authUser, vent: this.vent});
                this.server = sinon.fakeServer.create();

                this.server.respondWith(
                    "GET",
                    "/logout",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify("loggedout")
                    ]
                );
            });

            afterEach(function() {
                this.loggedin.remove();
                this.stub.restore();
                this.server.restore();
            });

            it('checks that the /logout url is called, the authUser loggedIn property is set to false and the names on the boombox & ipod are changed back to default', function() {
                this.loggedin.logout();
                this.server.respond();

                // Regular call of the /get function
                expect(this.loggedin.model.get('loggedIn')).toBeFalsy();
                expect(this.loggedin.model.get('username')).toEqual('');
                expect(this.loggedin.model.get('uid')).toEqual('');
                expect($('#boombox-logo')).toHaveText('JVC');
                expect($('#ipod-logo')).toHaveText('iPod');

                // Stub the /get function and call logout() again so we can assert that /get was called
                this.stub = sinon.stub($, 'get');
                this.loggedin.logout();
                sinon.assert.callCount($.get, 1);
            });
        });




    });

});

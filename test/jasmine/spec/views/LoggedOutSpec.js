define(['views/loggedOut', 'text!tpl/LoginView.html', 'models/authUser'], function(LoggedOut, LoggedinItemTemplate, authuser) {


    return describe('View :: LoggedOut', function() {

        var authUser = new authuser({loggedIn: false, username: "the_user", uid: "1234"});

        describe('#initialize', function() {

            beforeEach(function() {
                var testDiv = '<div id="#login">Login</div>';
                setFixtures(testDiv);
                this.loggedout = new LoggedOut({name: "logged_out"});
                spyOn(this.loggedout, 'render');
            });

            afterEach(function() {
                this.loggedout.remove();
            });

            it('should properly initialize the view', function() {
                this.loggedout.initialize(); // Need to call initialize() here, otherwise render() will not be called
                expect(this.loggedout.name).toEqual("logged_out");
                expect(this.loggedout.render).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.template = loadFixtures(LoggedinItemTemplate);
                this.loggedout = new LoggedOut({name: "logged_out", model: authUser});
                spyOn(this.loggedout, 'login');
            });

            afterEach(function() {
                this.loggedout.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.loggedout.render().el);
                $('#login').click(this.loggedout.login);
                expect($('#login')).toHaveText('Login');
                $('#login').trigger('click');
                expect(this.loggedout.login).toHaveBeenCalled();
            });
        });


        describe('#login', function() {

            beforeEach(function() {
                var testDiv = '<div id="#login">Login</div><div id="boombox-logo"></div><div id="ipod-logo"></div>';
                setFixtures(testDiv);
                //this.template = loadFixtures(LoggedinItemTemplate);
                this.vent = new _.extend({}, Backbone.Events);
                this.loggedout = new LoggedOut({name: "logged_out", model: authUser, vent: this.vent});
                this.loggedout.model.set({token: 'mytoken'});
                this.server = sinon.fakeServer.create();

                this.server.respondWith(
                    "POST",
                    "/login",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify({'success': true, 'uname': "user1", userid: "1"})
                    ]
                );
            });

            afterEach(function() {
                this.loggedout.remove();
                this.stub.restore();
                this.server.restore();
            });

            it('checks that the /login url is called with correct params, the authUser loggedIn property is set to true and the names on the boombox & ipod are changed to name of logged in user', function() {
                $('#musicapp').html(this.loggedout.render().el);
                $('#username').val('user1');
                $('#password').val('1234');

                this.loggedout.login();
                this.server.respond();

                // Regular call of the /post function
                expect(this.loggedout.model.get('loggedIn')).toBeTruthy();
                expect(this.loggedout.model.get('username')).toEqual('user1');
                expect(this.loggedout.model.get('uid')).toEqual('1');
                expect($('#boombox-logo')).toHaveText('USER1');
                expect($('#ipod-logo')).toHaveText('USER1');

                // Stub the /get function and call logout() again so we can assert that /get was called
                this.stub = sinon.stub($, 'post');
                this.loggedout.login();
                sinon.assert.callCount($.post, 1);
                sinon.assert.calledWith($.post, '/login', { _csrf: "mytoken", username: "user1", password: "1234" }); //'mytoken', 'song1234', 'theArtist', "id1", 'spotify1234', 'mytrack');

            });
        });


    });

});

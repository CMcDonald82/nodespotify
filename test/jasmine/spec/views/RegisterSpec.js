define(['views/register', 'models/authuser'], function(Register, authuser) {


    return describe('View :: Register', function() {

        var authUser = new authuser({ token: 'mytoken' });
        var parentView = Backbone.View.extend({
            displayRegisterDone: function() {
            }
        });

        describe('#initialize', function() {

            beforeEach(function() {
                this.registration = new Register();
                spyOn(this.registration, 'render');
            });

            afterEach(function() {
                this.registration.remove();
            });

            it('should properly initialize the view and call render()', function() {
                this.registration.initialize();
                expect(this.registration.render).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.registration = new Register();
            });

            afterEach(function() {
                this.registration.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.registration.render().el);
                expect($('#register')).toHaveText('Register');
            });
        });


        describe('#register', function() {

            beforeEach(function() {
                this.parentView = new parentView();
                this.registration = new Register({ userModel: authUser, parent: this.parentView });
                spyOn(this.parentView, 'displayRegisterDone');
                this.server = sinon.fakeServer.create();

                this.server.respondWith(
                    "POST",
                    "/register",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify("success")
                    ]
                );
            });

            afterEach(function() {
                this.registration.remove();
                this.parentView.remove();
                this.stub.restore();
                this.server.restore();
            });

            it('makes sure that new user is properly registered', function() {
                $('#musicapp').html(this.registration.render().el);
                $('#regUsername').val('user1');
                $('#regPassword').val('1234');
                $('#regPasswordCheck').val('1234');


                this.registration.register();
                this.server.respond();

                // Regular call of the /post function
                expect(this.parentView.displayRegisterDone).toHaveBeenCalled();

                // Stub the /get function and call logout() again so we can assert that /get was called
                this.stub = sinon.stub($, 'post');
                this.registration.register();
                sinon.assert.callCount($.post, 1);
                sinon.assert.calledWith($.post, '/register', { _csrf: "mytoken", username: "user1", password: "1234", passwordCheck: "1234" });

            });
        });


    });

});

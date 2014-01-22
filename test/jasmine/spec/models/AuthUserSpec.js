define(['models/authuser'], function(AuthUser) {

    var mockData = { username: 'Foobar', uid: 1, token: 'csrftoken12345'};
    var authUser = new AuthUser();

    return describe('Model :: AuthUser', function() {

        beforeEach(function() {

        });

        it('should create an authUser with default settings', function() {
            expect(authUser.get('username')).toEqual('blank');
            expect(authUser.get('loggedIn')).toBeFalsy();
            expect(authUser.get('uid')).toEqual('');
            expect(authUser.get('viewingPlaylist')).toBeFalsy();
            expect(authUser.get('token')).toEqual('');
        });

        it('checks that model url is /login_check', function() {
            expect(authUser.url).toEqual('login_check');
        });

        it('should fetch authUser', function() {
            //var spy = jasmine.createSpy();
            spyOn(authUser, 'fetch');
            authUser.fetch();
            expect(authUser.fetch).toHaveBeenCalled();
        });

        describe('#save', function() {
            var jsonResponse = {status: 'loggedin', uname: 'username', userid: 1, token: 'abcd1234'};
            beforeEach(function() {
                this.server = sinon.fakeServer.create();

                this.server.respondWith(
                    "GET",
                    "login_check",
                    [
                        200,
                        {"Content-Type": "application/json"},
                        JSON.stringify(jsonResponse)
                    ]
                );
            });

            afterEach(function() {
                this.server.restore();
            });

            it('sends valid data to server', function() {
                authUser.fetch();
                var request = this.server.requests[0];
                //var stub = sinon.stub(authUser, 'get').returns({status: true, uname: 'username', userid: 1, token: 'abcd1234'});
                expect(this.server.requests.length).toEqual(1);
                expect(this.server.requests[0].method).toEqual("GET");
                expect(this.server.requests[0].url).toEqual("login_check");
            });


            it('receives valid data from server, makes sure loggedIn is set to true when status response of loggedin is received', function() {
                authUser.fetch();
                this.server.respond();
                console.log('authUser.get(username): '+authUser.get('username'));
                console.log('jsonResponse[uname]: '+jsonResponse['uname']);
                expect(authUser.get('username')).toEqual(jsonResponse['uname']);
                expect(authUser.get('uid')).toEqual(jsonResponse['userid']);
                expect(authUser.get('token')).toEqual(jsonResponse['token']);
                // Parse method on authUser model will parse the value of 'status' in jsonResponse ('loggedin') to be true, and will set authUser['loggedIn'] to true.
                expect(authUser.get('loggedIn')).toBeTruthy();
            });

        });
    });
});



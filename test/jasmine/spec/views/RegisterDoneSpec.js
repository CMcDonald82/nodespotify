define(['views/registerDone'], function(RegisterDone) {

    return describe('View :: RegisterDone', function() {


        describe('#initialize', function() {

            beforeEach(function() {
                this.regDone = new RegisterDone();
                spyOn(this.regDone, 'render');
            });

            afterEach(function() {
                this.regDone.remove();
            });

            it('should properly initialize the view and call render()', function() {
                this.regDone.initialize();
                expect(this.regDone.render).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.regDone = new RegisterDone();
            });

            afterEach(function() {
                this.regDone.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.regDone.render().el);
                expect($('.regDone')).toHaveText('You\'ve successfully registered! Click this button to go back home and login');
            });
        });



    });

});

define(['views/placeholders', 'text!tpl/BlankView.html'], function(Placeholders, placeholderTpl) {

    //var authUser = new authuser();
    //var artistModel = new artist({name: "Artist", id: "artist1234"});

    return describe('View :: Placeholders', function() {


        describe('#initialize', function() {

            beforeEach(function() {
                this.blankView = new Placeholders();
                spyOn(this.blankView, 'render');
            });

            afterEach(function() {
                this.blankView.remove();
            });

            it('should properly initialize the view', function() {
                this.blankView.initialize();
                expect(this.blankView.render).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.blankView = new Placeholders();

            });

            afterEach(function() {
                this.blankView.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.blankView.render().el);
                expect($('#musicapp')).toHaveText('Blank');
            });
        });



    });

});


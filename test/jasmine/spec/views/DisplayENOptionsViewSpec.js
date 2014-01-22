define(['views/displayENOptionsView', 'text!tpl/DisplayENOptionsView.html'], function(ENOptions) {


    return describe('View :: DisplayENOptionsView', function() {


        describe('#initialize', function() {

            beforeEach(function() {
                this.ENOptionsView = new ENOptions({name: "newname"});
                spyOn(this.ENOptionsView, 'render');
            });

            afterEach(function() {
                this.ENOptionsView.remove();
            });

            it('should properly initialize the view', function() {
                this.ENOptionsView.initialize();
                expect(this.ENOptionsView.name).toEqual("newname");
                expect(this.ENOptionsView.render).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.ENOptionsView = new ENOptions({name: "newname"});
            });

            afterEach(function() {
                this.ENOptionsView.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.ENOptionsView.render().el);
                expect($('#option-results-label')).toHaveText('Playlist Length');
                // Can add more tests for expecting element values to equal certain values here.
            });
        });

    });

});

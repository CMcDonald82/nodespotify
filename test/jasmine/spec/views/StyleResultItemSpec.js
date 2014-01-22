define(['views/styleResultItem', 'models/authuser', 'models/style'], function(StyleResultItem, authuser, Style) {


    return describe('View :: StyleResultItem', function() {

        var authUser = new authuser({ token: 'mytoken', loggedIn: false });
        var newStyle = new Style({ name: "Funk" });

        describe('#initialize', function() {

            beforeEach(function() {
                this.styleItem = new StyleResultItem({ userModel: authUser, name: "StyleResultItemView"});
            });

            afterEach(function() {
                this.styleItem.remove();
            });

            it('should properly initialize the view', function() {
                expect(this.styleItem.userModel).toEqual(authUser);
                expect(this.styleItem.name).toEqual("StyleResultItemView");
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.styleItem = new StyleResultItem({ userModel: authUser, name: "StyleResultItemView", model: newStyle});
            });

            afterEach(function() {
                this.styleItem.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.styleItem.render().el);
                expect($('.styleItem')).toHaveText('FUNK');
            });
        });



    });

});

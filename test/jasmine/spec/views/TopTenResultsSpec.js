define(['views/topTenResults', 'models/authuser', 'collections/styleList', 'models/style', 'underscore'], function(TopTenResults, authuser, styleCollection, Style, _) {


    return describe('View :: TopTenResults', function() {

        var authUser = new authuser({ token: 'mytoken', loggedIn: false });
        var styles = new styleCollection();
        styles.add(new Style({ name: "Punk" }));
        styles.add(new Style({ name: "Jazz" }));


        describe('#initialize', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.topTen = new TopTenResults({ userModel: authUser, collection: styles, vent: this.vent, type: "styles", name: "TopTenStyleTrendsView" });
                spyOn(this.topTen, 'getResults');
                spyOn(this.topTen, 'render');
                this.vent.bind('app:getTopTen', this.topTen.getResults);
                this.topTen.collection.bind('reset', this.topTen.render);
            });

            afterEach(function() {
                this.topTen.remove();
            });

            it('should properly initialize the view', function() {
                expect(this.topTen.userModel).toEqual(authUser);
                expect(this.topTen.name).toEqual("TopTenStyleTrendsView");
                expect(this.topTen.type).toEqual("styles");
                console.log('styleslength: '+styles.length);
                this.vent.trigger("app:getTopTen");
                expect(this.topTen.getResults).toHaveBeenCalled();
                this.topTen.collection.reset();
                expect(this.topTen.render).toHaveBeenCalled();
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                // Need to 'refill' the styles collection, since it was reset in the #initialize test
                styles.add(new Style({ name: "Rock" }));
                styles.add(new Style({ name: "Blues" }));
                this.topTen = new TopTenResults({ userModel: authUser, collection: styles, vent: this.vent, type: "styles", name: "TopTenStyleTrendsView" });
            });

            afterEach(function() {
                this.topTen.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.topTen.render().el);
                expect(this.topTen.childViews.length).toEqual(2);
                //expect($('.styleItem:first')).toHaveText('Rock');
            });
        });


        describe('#getResults', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.topTen = new TopTenResults({ userModel: authUser, collection: styles, vent: this.vent, type: "styles", name: "TopTenStyleTrendsView" });
                this.eventSpy = sinon.stub(this.topTen.collection, 'fetch').yieldsTo('success', styles);
            });

            afterEach(function() {
                this.topTen.remove();
                this.eventSpy.restore();
            });

            it('checks that the collection associated with the view is fetched', function() {
                this.topTen.getResults();
                expect(this.eventSpy.calledOnce).toBe(true);
            });
        });


        describe('#onClose', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.topTen = new TopTenResults({ userModel: authUser, collection: styles, vent: this.vent, type: "styles", name: "TopTenStyleTrendsView" });
            });

            afterEach(function() {
                this.topTen.remove();
            });

            it('should close all child views', function() {
                $('#musicapp').html(this.topTen.render().el); // Will fill up the childViews array with views for all models in collection
                spyOn(this.topTen, 'render'); // Spy on the render function after we've called the regular version first (need the non-spy version to execute in order to fill the childViews array)
                _.each(this.topTen.childViews, function(childView) {
                    spyOn(childView, 'close');
                });
                this.topTen.onClose();
                this.topTen.collection.reset();
                expect(this.topTen.render).not.toHaveBeenCalled();
                _.each(this.topTen.childViews, function(childView) {
                    expect(childView.close).toHaveBeenCalled();
                });
            });
        });


    });

});

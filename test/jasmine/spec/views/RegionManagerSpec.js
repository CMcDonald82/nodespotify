define(['views/regionmanager'], function(RegionManager) {


    return describe('View :: RegionManager', function() {

        var blankView = Backbone.View.extend({
            randomFunction: function() {
            },
            initialize: function() {
                this.name = "BLANK";
            }
        });

        describe('#initialize', function() {

            beforeEach(function() {
                this.manager = new RegionManager({ elId: "newmgr" });
            });

            afterEach(function() {
                this.manager.remove();
            });

            it('should properly initialize the view', function() {
                this.manager.initialize();
                expect(this.manager.elId).toEqual('newmgr');
            });
        });


        describe('#showView', function() {

            beforeEach(function() {
                this.manager = new RegionManager({ elId: "newmgr" });
            });

            afterEach(function() {
                this.manager.remove();
            });

            it('check that the view passed in to the region manager was constructed properly', function() {
                var v = new blankView();
                this.manager.showView(v);
                expect(this.manager.currentView.name).toEqual('BLANK');
            });
        });



    });

});

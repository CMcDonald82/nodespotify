define(['views/paginationView', 'collections/pagination', 'text!tpl/paginatorBreadcrumb.html'], function(Pagination, PagerCollection, PaginatorTpl) {

    return describe('View :: PaginationView', function() {

        var paginationCollection = new PagerCollection();


        describe('#initialize', function() {

            beforeEach(function() {
                this.vent = new _.extend({}, Backbone.Events);
                this.paginator = new Pagination({ collection: paginationCollection, vent: this.vent, name: 'PaginationView' });
                spyOn(this.paginator, 'render');
                spyOn(this.paginator, 'close');
                paginationCollection.bind('reset', this.paginator.render);
                paginationCollection.bind('change', this.paginator.render);
                this.vent.bind('app:removePaginator', this.paginator.close);
            });

            afterEach(function() {
                this.paginator.remove();
            });

            it('should properly initialize the view', function() {
                this.paginator.initialize(); // Need to call initialize() here, otherwise render() will not be called
                expect(this.paginator.name).toEqual("PaginationView");
                this.vent.trigger("app:removePaginator");
                expect(this.paginator.close).toHaveBeenCalled();

                //this.paginator.collection.reset(); // Error that it can't read property 'length' of undefined
                //expect(this.paginator.render).toHaveBeenCalled();

                /*
                paginationCollection.add([
                    {track: "Thriller", spotify_id: '1234'},
                    {track: "Jump", spotify_id: '5678'}
                ]);
                expect(this.paginator.render).toHaveBeenCalled();
                */
            });
        });


        /*
        describe('#render', function() {

            beforeEach(function() {
                this.template = loadFixtures(PaginatorTpl);
                this.vent = new _.extend({}, Backbone.Events);
                this.paginator = new Pagination({name: "PaginationView", vent: this.vent, collection: paginationCollection});
                //spyOn(this.loggedout, 'login');
            });

            afterEach(function() {
                this.paginator.remove();
            });

            it('checks that view is rendered properly', function() {
                console.log('rendering pagination view');
                this.paginator.render();
                //$('#musicapp').html(this.paginator.render().el);
                //$('#login').click(this.loggedout.login);
                //expect($('#login')).toHaveText('Login');
                //$('#login').trigger('click');
                //expect(this.loggedout.login).toHaveBeenCalled();
            });
        });
        */



    });

});

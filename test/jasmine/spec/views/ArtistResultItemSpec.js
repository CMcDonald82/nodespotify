define(['views/artistResultItem', 'models/authuser', 'models/artist', 'text!tpl/ArtistResultItemView.html'], function(ArtistResultItem, authuser, artist, ArtistItemTemplate) {

    var authUser = new authuser();
    var artistModel = new artist({name: "Artist", id: "artist1234"});

    return describe('View :: ArtistResultItem', function() {

        describe('#initialize', function() {

            beforeEach(function() {
                this.artistResults = new ArtistResultItem({userModel: authUser, name: "new artist results"});
            });

            afterEach(function() {
                this.artistResults.remove();
            });

            it('checks that the view is initialized properly', function() {
                expect(this.artistResults.userModel).toEqual(authUser);
                expect(this.artistResults.name).toEqual("new artist results");
            });
        });


        describe('#render', function() {

            beforeEach(function() {
                this.template = loadFixtures(ArtistItemTemplate);
                this.artistResults = new ArtistResultItem({userModel: authUser, name: "new artist results", template: this.template, model: artistModel});
                spyOn(this.artistResults, 'createButtons');
                //expect($(this.artistResults.el)).data("artistId").toEqual("artist1234");
                $('#musicapp').html(this.artistResults.render().el);
            });

            afterEach(function() {
                this.artistResults.remove();
            });

            it('makes sure that view renders properly', function() {
                expect($('.searchArtist')).toHaveText('Artist');
                expect(this.artistResults.createButtons).toHaveBeenCalled();
                expect(this.artistResults.$el.is(':visible')).toEqual(true);
                console.log('DATA: '+this.artistResults.$el.data("artistId"));
                expect(this.artistResults.$el.data("artistId")).toEqual("artist1234");
            });
        });


        describe('#createButtons', function() {

            beforeEach(function() {
                this.template = loadFixtures(ArtistItemTemplate);
                this.artistResults = new ArtistResultItem({userModel: authUser, name: "new artist results", template: this.template, model: artistModel, type: "artists"});

            });

            afterEach(function() {
                this.artistResults.remove();
            });

            it('should add a new searchItemButtons view for each button to be appended and store it in the artistResultItemView childViews', function() {
                //this.artistResults.createButtons();
                // Can call the render method here since createButtons() is called from within render() in the ArtistResultItem View
                $('#musicapp').html(this.artistResults.render().el);
                expect(this.artistResults.childViews.length).toEqual(1);
                expect(this.artistResults.childViews[0].options.type).toEqual("artists");
                //$('#musicapp').html(this.artistResults.childViews[0].render().el);
                expect($('.createArtistPlist')).toHaveText('Artist');
                //expect(this.artistResults.childViews[0].$el).find($('.createArtistPlist')).toHaveText('A');
            });

        });


    });
});
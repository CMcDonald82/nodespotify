define(['views/playlistSelectorOption', 'models/playlist'], function(PlaylistSelectorOption, Playlist) {


    return describe('View :: PlaylistSelectorOption', function() {

        var pl = new Playlist({ playlist_id: '1244', title: 'my_playlist' });

        describe('#render', function() {

            beforeEach(function() {
                this.option = new PlaylistSelectorOption({ model: pl });
            });

            afterEach(function() {
                this.option.remove();
            });

            it('checks that view is rendered properly', function() {
                $('#musicapp').html(this.option.render().el);
                expect($('option:first')).toHaveText('my_playlist');
            });
        });



    });

});

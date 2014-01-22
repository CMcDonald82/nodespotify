window.SearchView = Backbone.View.extend({


    initialize: function() {
        this.render();
    },

    render: function() {
        $(this.el).html(this.template());
        return this;
    },

    // Moved to approuter for now. Can delete if that works out ok
    /*
    searchOnEnter: function(t, p) {
        if (p === undefined) {
            console.log('No page set!');
            var pg = 1;
        }
        else {
            var pg = p;
        }
        $('#searchResults').empty();//html('');
        console.log('clicked enter');

        var request = {};
        request['combined'] = t; //$('#song').val();
        request['format'] = 'json';
        request['results'] = 20;
        request['bucket'] = ['id:spotify-WW', 'id:7digital-US', 'tracks'];
        request['limit'] = true;

        //var playlists = new window.Playlists();
        window.Songs.fetch({
            data: $.param(request, true),

            success: function() {
                //alert("SUCCESS");
                //$("#content").html(new SearchResultsView({model: window.Songs, page: pg, term: t}).el);
                var searchView = new SearchResultsView({model: window.Songs, page: pg, term: t, vent: vent, userModel: authUser});
                playlistEditorManager.showView(searchView);
            }
        });

        //this.input.val('');
    },
    */

    addAll: function() {
        console.log("ADD ALL");

        $('#searchResults').html('');
        var json = window.Songs.toJSON();
        for (var i = 0; i < json.length; i++) {
            //console.log('JSON Data item ['+i+'] is: '+json[i]['title']+' BY '+json[i]['artist_name']+' Img Field '+json[i]['tracks'][0]['release_image']);
            $("#searchResults").append(json[i]['title']+' BY '+json[i]['artist_name']);
        }

        /*
        var tableView = new app.TableView({collection: app.Songs});

        $("#songResults").append(tableView.render().$el);
        $('.createArtistRadioPlist').each(function(index) {
            console.log("Index: "+index);
            $.data(this, "attachedData", {'playlistType': 'artist-radio', 'artistId': json[index]['artist_id']});
            console.log('Playlist Type Data: '+$.data(this, "attachedData").playlistType);
            console.log('Artist ID Data: '+$.data(this, "attachedData").artistId);
        });
        $('.createSongRadioPlist').each(function(index) {
            $(this).data("attachedData", {'playlistType': 'song-radio', 'songId': json[index]['id']});
            console.log('Playlist Type Data: '+$(this).data("attachedData").playlistType);
            console.log('Song ID Data: '+$(this).data("attachedData").songId);
        });
        $('.createArtistPlist').each(function(index) {
            $(this).data("attachedData", {'playlistType': 'artist', 'artistId': json[index]['artist_id']});
            console.log('Playlist Type Data: '+$(this).data("attachedData").playlistType);
            console.log('Artist ID Data: '+$(this).data("attachedData").artistId);
        });
        */
    }


});
// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'views/searchItemButtons',
    'text!tpl/ArtistResultItemView.html'
], function($, _, Backbone, SearchItemButtons, ArtistItemTemplate) {

    var ArtistResultItem = Backbone.View.extend({

        tagName: "li",

        className: "topTenItem",

        initialize: function() {
            //this.model.bind("change", this.render, this);
            //this.model.bind("destroy", this.close, this);
            this.userModel = this.options.userModel;
            this.userModel.bind("change", this.createButtons, this);
            //this.type = this.options.type;
            this.childViews = [];
            this.name = this.options.name;
        },

        render: function() {
            // Render template for the search result item (either song or artist)
            console.log("Rendering Artist Items");
            var compiled_template = _.template(ArtistItemTemplate);
            $(this.el).html(compiled_template({artist: this.model.get('name')}));

            // Might want to try adding the artist link to the li element ($this.el) instead just to clean things up a bit. Should work the same though
            $(this.el).data('artistId', this.model.toJSON()['id']);
            // Add clickable link for Artist
            /*
            var arLink = $("<a></a>", {
            });
            arLink.addClass('searchArtist');
            arLink.data('artistId', this.model.toJSON()['id']);
            arLink.html(this.model.toJSON()['name']);
            $(this.el).append(arLink);
            */

            this.createButtons();
            return this;
        },

        createButtons: function() {

            // Need to close any existing child views if createButtons is re-run while this view is active (such as if a user remains on search page
            // but logs in or out
            _.each(this.childViews, function(childView) {
                childView.close();
                console.log('closed view from childViews');
            });

            //console.log("THE MODEL: "+JSON.stringify(this.model.get('tracks')[0]['foreign_id']));
            var params = {};
            // might need to replace .get with .toJSON if .get doesnt work
            /*
            if (this.type === "song") {
                params['artist_id'] = this.model.get('artist_id');
                params['song_id'] = this.model.get('id');
                params['spotify_id'] = this.model.get('tracks')[0]['foreign_id'];
                params['track_name'] = this.model.get('title');
                params['artist_name'] = this.model.get('artist_name');

            } else {
            */
            params['artist_id'] = this.model.get('id');
            //}

            console.log("THE PARAMS: "+JSON.stringify(params));

            var buttons = new SearchItemButtons({type: this.options.type, loggedIn: this.userModel.get('loggedIn'), params: params, width: 50 });
            this.childViews.push(buttons);
            $(this.el).append(buttons.render().el);
        }

    });

    return ArtistResultItem;
});

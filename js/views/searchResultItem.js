// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone',
    'views/searchItemButtons',
    'text!tpl/searchResultItem.html'
], function($, _, Backbone, SearchItemButtons, SearchItemTemplate) {

    var SearchResultItem = Backbone.View.extend({

        tagName: "li",

        className: "topTenItem",

        initialize: function() {

            /*
             Trying out the binding to 'loggedin'/'loggedout' events here. This prevents needing to pass authUser in, and on initiation of the
             view instance, we can just pass in the loggedIn status of the user at that point in time (as this.options.loggedIn).
             Also avoids binding to authUser model's 'change' event, which will fire on changes other than just login.
            */
            //this.vent.on("app:loggedin", this. this);
            //this.vent.on("app:loggedout", this. this);

            /*
             Model binding might work better here rather than trying to set attributes (to pass to SearchItemButtons) based on multiple, separate
             events. Other changes to the user model (such as changing the 'viewingPlaylist' status) will not apply here since this view will be replaced
             by a playlistView anyway in that case.
            */
            this.userModel = this.options.userModel;
            this.userModel.bind("change", this.createButtons, this);

            this.type = this.options.type;
            this.childViews = [];
            this.name = this.options.name;

        },

        render: function() {
            // Render template for the search result item (either song or artist)
            console.log("Rendering Search Items");
            var compiled_template = _.template(SearchItemTemplate);
            $(this.el).html(compiled_template({artist: this.model.get('artist_name'), track: this.model.get('title')}));
            $(this.el).data('artistId', this.model.toJSON()['artist_id']);

            //$(this.el).attr('draggable', true);

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

            console.log("THE MODEL: "+JSON.stringify(this.model.get('tracks')[0]['foreign_id']));
            var params = {};
             // might need to replace .get with .toJSON if .get doesnt work
            if (this.type === "song") {
                params['artist_id'] = this.model.get('artist_id');
                params['song_id'] = this.model.get('id');
                params['spotify_id'] = this.model.get('tracks')[0]['foreign_id'];
                params['track_name'] = this.model.get('title');
                params['artist_name'] = this.model.get('artist_name');
                // Add artist_id param, so we can store this in db as well so user can click on either the track or artist within a custom playlist sortable container to bring up info about that song/artist

            } else {
                params['artist_id'] = this.model.get('id');
            }

            console.log("THE PARAMS: "+JSON.stringify(params));

            var width;
            if (this.userModel.get('loggedIn')) {
                width = 25;
            } else {
                width = 33;
            }

            var buttons = new SearchItemButtons({type: this.type, loggedIn: this.userModel.get('loggedIn'), params: params, width: width });
            this.childViews.push(buttons);
            $(this.el).append(buttons.render().el);
        }



    });

    return SearchResultItem;
});

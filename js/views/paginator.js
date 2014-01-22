window.Paginator = Backbone.View.extend({

    className: "pagination pagination-centered",

    initialize: function() {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render: function() {
        // "this.model" here is actually a collection, but will still work
        var items = this.model.models;
        var len = items.length;
        var pageCount = Math.ceil(len / 4);


        $(this.el).html('<ul />');

        // Experimentation
        var num_display_entries = 4;
        var ne_half = Math.floor(num_display_entries/2);
        var np = pageCount;
        var upper_limit = np - num_display_entries;
        var start = this.options.page > ne_half ? Math.max( Math.min(this.options.page - ne_half, upper_limit), 0 ) : 0;
        var end = this.options.page > ne_half ? Math.min(this.options.page + ne_half + (num_display_entries % 2), np):Math.min(num_display_entries, np);
        console.log('num_display_entries: '+num_display_entries);
        console.log('ne_half: '+ne_half);
        console.log('np: '+np);
        console.log('upper_limit: '+upper_limit);
        console.log('start: '+start);
        console.log('end: '+end);


        for (var i=0; i < pageCount; i++) {
            if (this.options.artistSongs) {
                $('ul', this.el).append("<li" + ((i + 1) === this.options.page ? " class='active'" : "") + "><a href='#searchartist/"+this.options.term+"/"+(i+1)+"'>" + (i+1) + "</a></li>");
            } else {
                $('ul', this.el).append("<li" + ((i + 1) === this.options.page ? " class='active'" : "") + "><a href='#search/"+this.options.term+"/"+(i+1)+"'>" + (i+1) + "</a></li>");
            }
        }

        return this;
    }

});

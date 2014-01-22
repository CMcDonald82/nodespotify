require.config({
    baseUrl: "../../js/",
    //baseUrl: "../",
    paths: {
        /* Paths with baseUrl */
        jquery: 'lib/jquery-min',
        jqueryui: 'lib/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.min',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min',
        jasmine: '../test/lib/jasmine',
        'jasmine-html': '../test/lib/jasmine-html',
        spec: '../test/jasmine/spec',
        sinon: '../test/lib/sinon-1.6.0',
        paginator: 'lib/backbone-paginator',
        text: 'lib/require-text',
        'jasmine-jquery': '../test/lib/jasmine-jquery'
        /* Paths without baseUrl
        jquery: '../../js/lib/jquery-min',
        underscore: '../../js/lib/underscore-min',
        backbone: '../../js/lib/backbone-min',
        jasmine: '../lib/jasmine',
        'jasmine-html': '../lib/jasmine-html',
        spec: '../jasmine/spec',
        sinon: '../lib/sinon-1.6.0'
        */
    },

    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        },
        paginator: {
            deps: [
                'backbone'
            ],
            exports: 'paginator'
        },
        sinon: {
            exports: 'sinon'
        },
        text: {
            exports: 'text'
        },
        'jasmine-jquery': {
            deps: ['jasmine'],
            exports: 'jasmine-jquery'
        }
    }
});

require(['underscore', 'jquery', 'jasmine-html', 'sinon', 'paginator', 'text', 'jasmine-jquery'], function(_, $, jasmine, sinon) {

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push('spec/models/AuthUserSpec');
    specs.push('spec/collections/ArtistListSpec');
    specs.push('spec/collections/PlaylistsSpec');
    specs.push('spec/collections/PlaylistsongsSpec');
    specs.push('spec/collections/PaginatorSpec');
    specs.push('spec/collections/RadioTracksSpec');
    specs.push('spec/collections/SongsSpec');
    specs.push('spec/collections/StyleListSpec');
    specs.push('spec/views/AppinitSpec');
    specs.push('spec/views/ArtistResultItemSpec');
    specs.push('spec/views/CustomPlaylistDisplaySpec');
    specs.push('spec/views/CustomPlaylistItemSpec');
    specs.push('spec/views/LoggedInSpec');
    specs.push('spec/views/LoggedOutSpec');
    specs.push('spec/views/PaginationViewSpec');
    specs.push('spec/views/PlaceholdersSpec');
    specs.push('spec/views/PlaylistControlPanelSpec');
    specs.push('spec/views/PlaylistSelectorOptionSpec');
    specs.push('spec/views/RegionManagerSpec');
    specs.push('spec/views/RegisterSpec');
    specs.push('spec/views/RegisterDoneSpec');
    specs.push('spec/views/SearchItemButtonsSpec');
    specs.push('spec/views/SearchResultItemSpec');
    specs.push('spec/views/SongResultsSpec');
    specs.push('spec/views/StyleResultItemSpec');
    specs.push('spec/views/TopTenResultsSpec');
    specs.push('spec/views/AutocompleteItemViewSpec');
    specs.push('spec/views/DisplayENOptionsViewSpec');


    $(function() {
        require(specs, function() {
            jasmineEnv.execute();
        });
    });

});

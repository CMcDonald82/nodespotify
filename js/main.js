// Used with require.js setup

require.config({

    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        paginator: {
            deps: [
                'backbone'
            ],
            exports: 'paginator'
        }

    },

    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min', //lib/jquery-min', //'https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js',
        jqueryui: 'http://code.jquery.com/ui/1.10.3/jquery-ui', // change to custom once we know all the UI elements we need 'lib/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.min',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min',
        text: 'lib/require-text',
        paginator: 'lib/backbone-paginator'
    }

});


require([
    'views/appinit',
    'routers/router'

], function(AppView, Workspace) {
    var workspace = new Workspace();


    var appView = new AppView({router: workspace});

    // Backbone.history has to come last, otherwise copy/pasting links won't load the correct state
    Backbone.history.start();
    //workspace.on('route:search', function() {
    //    alert('Clicked Search');
    //});
});

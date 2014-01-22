/* 
	EchoNest API key - required for AJAX requests to the EchoNest API. 
	Be sure to put this in .gitignore so it is hidden from the repo. 
	Will need to temporarily include it in repo when using the repo to push live.
*/

// Used with require.js setup

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var key = "ZKIBJJ0Q8BLHRKH1P";    

    return {
    	api_key: key
    };
});
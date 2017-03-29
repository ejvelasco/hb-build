(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var YoutubeApi;

(function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/renaldo_youtube-api/packages/renaldo_youtube-api.js           //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/renaldo:youtube-api/youtube-api.js                       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
YoutubeApi = Npm.require('youtube-api');                             // 1
///////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['renaldo:youtube-api'] = {}, {
  YoutubeApi: YoutubeApi
});

})();

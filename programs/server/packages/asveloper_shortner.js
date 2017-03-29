(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/asveloper_shortner/packages/asveloper_shortner.js                                           //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                //
// packages/asveloper:shortner/server/service.js                                                  //
//                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                  //
if (Meteor.isServer) {                                                                            // 1
	Meteor.methods({                                                                                 // 2
		shortenUrl: function(longUrl) {                                                                 // 3
			var url = "https://www.googleapis.com/urlshortener/v1/url";                                    // 4
			var data = {"longUrl": longUrl};                                                               // 5
			var result = HTTP.call("POST", url, {content: "application/json", data: data, timeout: 3000}); // 6
      if(result.statusCode == 200) {                                                              // 7
        console.log("response received.");                                                        // 8
        return result.data;                                                                       // 9
      } else {                                                                                    // 10
        console.log("Response issue: ", result.statusCode);                                       // 11
        throw new Meteor.Error(result.statusCode, result.content.error);                          // 12
      }                                                                                           // 13
    }                                                                                             // 14
  });                                                                                             // 15
}                                                                                                 // 16
////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

//////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['asveloper:shortner'] = {};

})();

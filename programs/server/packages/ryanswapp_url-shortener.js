(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Router = Package['iron:router'].Router;
var RouteController = Package['iron:router'].RouteController;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var UrlShortener;

(function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/ryanswapp_url-shortener/packages/ryanswapp_url-shortener.js             //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
(function () {

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// packages/ryanswapp:url-shortener/url-shortener.js                          //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
UrlShortener = {                                                              // 1
  collection: new Mongo.Collection('short_urls'),                             // 2
  shorten: function(url, callback) {                                          // 3
      var urlObj = {                                                          // 4
        long_url: url                                                         // 5
      }                                                                       // 6
                                                                              // 7
      if (typeof callback === "function") {                                   // 8
        Meteor.call('url-shortener/shorten', urlObj, function(err, res) {     // 9
          if (err) {                                                          // 10
            callback(err, null);                                              // 11
          } else {                                                            // 12
            callback(null, res);                                              // 13
          }                                                                   // 14
        });                                                                   // 15
      } else {                                                                // 16
        throw new Meteor.Error("No Callback", "You must pass a callback function to the UrlShortener.shorten function");
      }                                                                       // 18
  },                                                                          // 19
  options: {                                                                  // 20
                                                                              // 21
  }                                                                           // 22
}                                                                             // 23
                                                                              // 24
Meteor.startup(function() {                                                   // 25
  _.defaults(UrlShortener.options, {                                          // 26
    bad_url: '',                                                              // 27
    prefix: Meteor.absoluteUrl(),                                             // 28
    url_length: 5                                                             // 29
    });                                                                       // 30
});                                                                           // 31
                                                                              // 32
////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// packages/ryanswapp:url-shortener/url-shortener-server.js                   //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
                                                                              //
if (Meteor.isServer) {                                                        // 1
  UrlShortener.collection.allow({                                             // 2
    insert: function (userId, doc) {                                          // 3
      return true;                                                            // 4
    },                                                                        // 5
                                                                              // 6
    update: function (userId, doc, fieldNames, modifier) {                    // 7
      return true;                                                            // 8
    },                                                                        // 9
                                                                              // 10
    remove: function (userId, doc) {                                          // 11
      return false;                                                           // 12
    }                                                                         // 13
  });                                                                         // 14
  UrlShortener.collection.deny({                                              // 15
    update: function (userId, doc, fieldNames, modifier) {                    // 16
      if (fieldNames.indexOf("long_url") === -1) {                            // 17
        return false;                                                         // 18
      } else {                                                                // 19
        return true;                                                          // 20
      }                                                                       // 21
    }                                                                         // 22
  });                                                                         // 23
}                                                                             // 24
                                                                              // 25
Meteor.methods({                                                              // 26
  'url-shortener/shorten': function(urlObj) {                                 // 27
    check(urlObj, {                                                           // 28
        long_url: String                                                      // 29
    });                                                                       // 30
                                                                              // 31
    var expression = /^(https|http):\/\/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}(\.[a-z]{2,4}|:[0-9]{4,5})\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);                                       // 33
                                                                              // 34
    if (!urlObj.long_url.match(regex)) {                                      // 35
      throw new Meteor.Error("Invalid URL", "That url is invalid");           // 36
    } else {                                                                  // 37
      var id = UrlShortener.collection.insert({long_url: urlObj.long_url, path: null, createdAt: new Date(), clicks: 0});
                                                                              // 39
      var newPath = id.substr(0, UrlShortener.options.url_length);            // 40
                                                                              // 41
      UrlShortener.collection.update(id, {$set: {path: newPath}});            // 42
                                                                              // 43
      return {                                                                // 44
        path: UrlShortener.options.prefix + 's/' + newPath                    // 45
      }                                                                       // 46
    }                                                                         // 47
                                                                              // 48
  },                                                                          // 49
  'url-shortener/add-click': function(url_id) {                               // 50
    check(url_id, String);                                                    // 51
                                                                              // 52
    UrlShortener.collection.update(url_id, {$inc: {clicks: 1}});              // 53
  }                                                                           // 54
});                                                                           // 55
                                                                              // 56
Meteor.publish('shortUrls', function () {                                     // 57
  return UrlShortener.collection.find({});                                    // 58
});                                                                           // 59
                                                                              // 60
Router.route('/s/:_id', {                                                     // 61
    where: 'server',                                                          // 62
    action: function() {                                                      // 63
      var url = this.params._id;                                              // 64
                                                                              // 65
      var doc = UrlShortener.collection.findOne({path: url});                 // 66
                                                                              // 67
      if (doc) {                                                              // 68
        Meteor.call('url-shortener/add-click', doc._id, function(err) {       // 69
          if (err) {                                                          // 70
            throw new Meteor.Error("Click Count Fail", "Click count failed"); // 71
          }                                                                   // 72
        });                                                                   // 73
        this.response.writeHead(302, {                                        // 74
          'Location': doc.long_url                                            // 75
        });                                                                   // 76
        this.response.end();                                                  // 77
      } else {                                                                // 78
        this.response.writeHead(302, {                                        // 79
          'Location': Meteor.absoluteUrl() + UrlShortener.options.bad_url     // 80
        });                                                                   // 81
        this.response.end();                                                  // 82
      }                                                                       // 83
                                                                              // 84
    }                                                                         // 85
});                                                                           // 86
                                                                              // 87
////////////////////////////////////////////////////////////////////////////////

}).call(this);

//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['ryanswapp:url-shortener'] = {}, {
  UrlShortener: UrlShortener
});

})();

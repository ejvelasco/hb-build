var require = meteorInstall({"lib":{"collections":{"classes.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// lib/collections/classes.js                                                                         //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// declare variables                                                                                  // 1
var d, dateString; //classes collection                                                               // 2
                                                                                                      //
Classes = new Mongo.Collection('classes');                                                            // 4
                                                                                                      //
if (Meteor.isServer) {                                                                                // 5
    // This code only runs on the server, publish classes                                             // 6
    Meteor.publish('classes', function () {                                                           // 7
        function classesPublication() {                                                               // 7
            return Classes.find({                                                                     // 8
                owner: this.userId                                                                    // 8
            });                                                                                       // 8
        }                                                                                             // 9
                                                                                                      //
        return classesPublication;                                                                    // 7
    }());                                                                                             // 7
}                                                                                                     // 10
                                                                                                      //
Meteor.methods({                                                                                      // 11
    'Classes.insert': function (classInfo) {                                                          // 12
        // Make sure the user is logged in before inserting a class                                   // 13
        if (!this.userId) {                                                                           // 14
            throw new Meteor.Error('not-authorized');                                                 // 15
        } //set date                                                                                  // 16
                                                                                                      //
                                                                                                      //
        d = new Date();                                                                               // 18
        dateString = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();                  // 19
        classInfo.dateString = dateString;                                                            // 20
        classInfo.date = d.getTime(); //set owner                                                     // 21
                                                                                                      //
        classInfo.owner = this.userId;                                                                // 23
        Classes.insert(classInfo);                                                                    // 24
    },                                                                                                // 25
    'Classes.remove': function (classId) {                                                            // 26
        //Make sure the user is logged in before removing a class                                     // 27
        if (!this.userId) {                                                                           // 28
            throw new Meteor.Error('not-authorized');                                                 // 29
        }                                                                                             // 30
                                                                                                      //
        Classes.remove(classId);                                                                      // 31
    },                                                                                                // 32
    'Classes.update': function (classInfo) {                                                          // 33
        if (!this.userId) {                                                                           // 34
            //Make sure the user is logged in before updating a class                                 // 35
            throw new Meteor.Error('not-authorized');                                                 // 36
        } //set date of update                                                                        // 37
                                                                                                      //
                                                                                                      //
        d = new Date();                                                                               // 39
        dateString = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();                  // 40
        classInfo.updated = dateString;                                                               // 41
        Classes.update({                                                                              // 42
            _id: classInfo.id                                                                         // 42
        }, {                                                                                          // 42
            $set: {                                                                                   // 42
                desc: classInfo.desc,                                                                 // 42
                updated: classInfo.updated,                                                           // 42
                title: classInfo.title                                                                // 42
            }                                                                                         // 42
        });                                                                                           // 42
    },                                                                                                // 43
    'Classes.findOne': function (classId) {                                                           // 44
        if (!this.userId) {                                                                           // 45
            //Make sure the user is logged in before finding a class                                  // 46
            throw new Meteor.Error('not-authorized');                                                 // 47
        }                                                                                             // 48
                                                                                                      //
        Classes.find({                                                                                // 49
            _id: classId                                                                              // 49
        });                                                                                           // 49
    },                                                                                                // 50
    'Classes.updateLectureCount': function (classId) {                                                // 51
        if (!this.userId) {                                                                           // 52
            //Make sure the user is logged in before updatind a class lecture count                   // 53
            throw new Meteor.Error('not-authorized');                                                 // 54
        }                                                                                             // 55
                                                                                                      //
        Classes.update({                                                                              // 56
            _id: classId                                                                              // 56
        }, {                                                                                          // 56
            $set: {                                                                                   // 56
                lectures: Lectures.find({                                                             // 56
                    parent: classId                                                                   // 56
                }).count()                                                                            // 56
            }                                                                                         // 56
        });                                                                                           // 56
    }                                                                                                 // 57
});                                                                                                   // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lectures.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// lib/collections/lectures.js                                                                        //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
//lectures collection                                                                                 // 1
Lectures = new Mongo.Collection('lectures');                                                          // 2
                                                                                                      //
if (Meteor.isServer) {                                                                                // 3
    // This code only runs on the server                                                              // 4
    Meteor.publish('lectures', function () {                                                          // 5
        function lecturesPublication(lectureId) {                                                     // 5
            if (this.userId) {                                                                        // 6
                return Lectures.find({                                                                // 7
                    owner: this.userId                                                                // 7
                }, {                                                                                  // 7
                    sort: {                                                                           // 7
                        dateParsed: -1                                                                // 7
                    }                                                                                 // 7
                });                                                                                   // 7
            } else {                                                                                  // 8
                return Lectures.find({                                                                // 9
                    _id: lectureId                                                                    // 9
                }, {                                                                                  // 9
                    sort: {                                                                           // 9
                        dateParsed: -1                                                                // 9
                    }                                                                                 // 9
                });                                                                                   // 9
            }                                                                                         // 10
        }                                                                                             // 11
                                                                                                      //
        return lecturesPublication;                                                                   // 5
    }());                                                                                             // 5
}                                                                                                     // 12
                                                                                                      //
Meteor.methods({                                                                                      // 13
    'Lectures.insert': function (lectureInfo) {                                                       // 14
        //Make sure the user is logged in before inserting a lecture                                  // 15
        if (!this.userId) {                                                                           // 16
            throw new Meteor.Error('not-authorized');                                                 // 17
        } // set owner                                                                                // 18
                                                                                                      //
                                                                                                      //
        lectureInfo.owner = this.userId;                                                              // 20
        Lectures.insert(lectureInfo);                                                                 // 21
    },                                                                                                // 22
    'Lectures.remove': function (lectureId) {                                                         // 23
        // Make sure the user is logged in before removing a lecture                                  // 24
        if (!this.userId) {                                                                           // 25
            throw new Meteor.Error('not-authorized');                                                 // 26
        }                                                                                             // 27
                                                                                                      //
        Lectures.remove(lectureId);                                                                   // 28
    },                                                                                                // 29
    'Lectures.update': function (lectureInfo) {                                                       // 30
        // Make sure the user is logged in before updating a lecture                                  // 31
        if (!this.userId) {                                                                           // 32
            throw new Meteor.Error('not-authorized');                                                 // 33
        }                                                                                             // 34
                                                                                                      //
        Lectures.update({                                                                             // 35
            _id: lectureInfo.id                                                                       // 35
        }, {                                                                                          // 35
            $set: lectureInfo.infoToUpdate                                                            // 35
        });                                                                                           // 35
    },                                                                                                // 36
    'Lectures.updateQuestionCount': function (lectureInfo) {                                          // 37
        // update question count                                                                      // 38
        Lectures.update({                                                                             // 39
            _id: lectureInfo.lectureId                                                                // 39
        }, {                                                                                          // 39
            $set: {                                                                                   // 39
                lectureCount: Questions.find({                                                        // 39
                    parentLecture: lectureInfo.lectureId                                              // 39
                }).count()                                                                            // 39
            }                                                                                         // 39
        });                                                                                           // 39
    }                                                                                                 // 40
});                                                                                                   // 13
////////////////////////////////////////////////////////////////////////////////////////////////////////

},"questions.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// lib/collections/questions.js                                                                       //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// declare variables                                                                                  // 1
var d, dateString, questions, parsedDate, commentId;                                                  // 2
Questions = new Mongo.Collection('questions');                                                        // 4
                                                                                                      //
if (Meteor.isServer) {                                                                                // 5
    // This code only runs on the server                                                              // 6
    Meteor.publish('questions', function () {                                                         // 7
        function questionsPublication() {                                                             // 7
            questions = Questions.find({});                                                           // 8
            return questions;                                                                         // 9
        }                                                                                             // 10
                                                                                                      //
        return questionsPublication;                                                                  // 7
    }());                                                                                             // 7
}                                                                                                     // 11
                                                                                                      //
Meteor.methods({                                                                                      // 12
    'Questions.insert': function (questionInfo) {                                                     // 13
        // set date and insert                                                                        // 14
        d = new Date();                                                                               // 15
        dateString = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        questionInfo.dateString = dateString;                                                         // 17
        questionInfo.date = d.getTime();                                                              // 18
        Questions.insert(questionInfo);                                                               // 19
    },                                                                                                // 20
    'Questions.remove': function (questionId) {                                                       // 21
        //remove question                                                                             // 22
        Questions.remove({                                                                            // 23
            _id: questionId                                                                           // 23
        });                                                                                           // 23
    },                                                                                                // 24
    'Questions.update': function (questionInfo) {                                                     // 25
        // set date of update and update                                                              // 26
        d = new Date();                                                                               // 27
        d = d.getTime();                                                                              // 28
        questionInfo.updated = d;                                                                     // 29
        Questions.update({                                                                            // 30
            _id: questionInfo.id                                                                      // 30
        }, {                                                                                          // 30
            $set: {                                                                                   // 30
                text: questionInfo.text,                                                              // 30
                updated: questionInfo.updated                                                         // 30
            }                                                                                         // 30
        });                                                                                           // 30
    },                                                                                                // 31
    'Questions.updateStarCount': function (questionInfo) {                                            // 32
        // update star count                                                                          // 33
        Questions.update({                                                                            // 34
            _id: questionInfo.id                                                                      // 34
        }, {                                                                                          // 34
            $inc: {                                                                                   // 34
                stars: questionInfo.amount                                                            // 34
            }                                                                                         // 34
        });                                                                                           // 34
    },                                                                                                // 35
    'Questions.insertComment': function (questionInfo) {                                              // 36
        // set date and push comment into comment array                                               // 37
        d = new Date();                                                                               // 38
        questionInfo.commentDate = d.getTime();                                                       // 39
        commentId = new Meteor.Collection.ObjectID()._str;                                            // 40
        Questions.update({                                                                            // 41
            _id: questionInfo.id                                                                      // 41
        }, {                                                                                          // 41
            $push: {                                                                                  // 41
                "comments": {                                                                         // 41
                    text: questionInfo.commentText,                                                   // 41
                    date: questionInfo.commentDate,                                                   // 41
                    id: commentId                                                                     // 41
                }                                                                                     // 41
            }                                                                                         // 41
        });                                                                                           // 41
    },                                                                                                // 42
    'Questions.deleteComment': function (questionInfo) {                                              // 43
        //pull comment from comments array                                                            // 44
        Questions.update({                                                                            // 45
            _id: questionInfo.id                                                                      // 46
        }, {                                                                                          // 46
            $pull: {                                                                                  // 47
                "comments": {                                                                         // 47
                    id: questionInfo.commentId                                                        // 47
                }                                                                                     // 47
            }                                                                                         // 47
        });                                                                                           // 47
    }                                                                                                 // 49
});                                                                                                   // 12
////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// lib/collections/users.js                                                                           //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Users = new Mongo.Collection('Users');                                                                // 1
////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"router.js":["wolfram",function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// lib/router.js                                                                                      //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// declare variables                                                                                  // 1
var one; //only require npm packages in server                                                        // 2
                                                                                                      //
if (Meteor.isServer) {                                                                                // 4
	var wolfram = require('wolfram').createClient("8EA3RR-JGLKVRG3X6"); //function used to query wolfram
                                                                                                      //
                                                                                                      //
	var queryWolfram = function (res, queryStr) {                                                        // 7
		wolfram.query(queryStr, function (err, result) {                                                    // 8
			if (err) {                                                                                         // 9
				throw err;                                                                                        // 10
			} else {                                                                                           // 11
				res.end(JSON.stringify(result));                                                                  // 12
			}                                                                                                  // 13
		});                                                                                                 // 14
	};                                                                                                   // 15
} //wait on accounts service                                                                          // 16
                                                                                                      //
                                                                                                      //
Router.configure({                                                                                    // 18
	waitOn: function () {                                                                                // 19
		Accounts.loginServicesConfigured();                                                                 // 20
	}                                                                                                    // 21
}); //define routes                                                                                   // 18
                                                                                                      //
Router.route('/', {                                                                                   // 24
	name: 'welcome',                                                                                     // 25
	template: 'welcome'                                                                                  // 26
});                                                                                                   // 24
Router.route('/home-instructor', {                                                                    // 28
	name: 'homeInstructor',                                                                              // 29
	template: 'homeInstructor'                                                                           // 30
});                                                                                                   // 28
Router.route('/classes', {                                                                            // 32
	name: 'classes',                                                                                     // 33
	template: 'classes'                                                                                  // 34
});                                                                                                   // 32
Router.route('/:classId/lectures', {                                                                  // 36
	name: 'lectures',                                                                                    // 37
	template: 'lectures',                                                                                // 38
	data: function () {                                                                                  // 39
		one = Classes.findOne({                                                                             // 40
			_id: this.params.classId                                                                           // 40
		});                                                                                                 // 40
		return one;                                                                                         // 41
	}                                                                                                    // 42
});                                                                                                   // 36
Router.route('/:lectureId/questions-page', {                                                          // 44
	name: 'questionsPage',                                                                               // 45
	template: 'questionsPage',                                                                           // 46
	loadingTemplate: 'loading',                                                                          // 47
	waitOn: function () {                                                                                // 48
		return [Meteor.subscribe('questions')];                                                             // 49
	},                                                                                                   // 50
	data: function () {                                                                                  // 51
		Meteor.subscribe('lectures', this.params.lectureId);                                                // 52
		one = Lectures.findOne({                                                                            // 53
			_id: this.params.lectureId                                                                         // 53
		});                                                                                                 // 53
		return one;                                                                                         // 54
	}                                                                                                    // 55
});                                                                                                   // 44
Router.route('/:lectureId/resources', {                                                               // 57
	name: 'resource',                                                                                    // 58
	template: 'resources',                                                                               // 59
	loadingTemplate: 'loading',                                                                          // 60
	waitOn: function () {                                                                                // 61
		return [Meteor.subscribe('questions')];                                                             // 62
	},                                                                                                   // 63
	data: function () {                                                                                  // 64
		Meteor.subscribe('lectures', this.params.lectureId);                                                // 65
		one = Lectures.findOne({                                                                            // 66
			_id: this.params.lectureId                                                                         // 66
		});                                                                                                 // 66
		return one;                                                                                         // 67
	}                                                                                                    // 68
}); //restful routes                                                                                  // 57
                                                                                                      //
Router.route('queryWolfram/:queryString', {                                                           // 71
	where: 'server'                                                                                      // 71
}).get(function () {                                                                                  // 71
	var request = this.request;                                                                          // 72
	var response = this.response;                                                                        // 73
	var queryString = decodeURIComponent(this.params.queryString);                                       // 74
	queryWolfram(response, queryString);                                                                 // 75
}); // layout                                                                                         // 76
                                                                                                      //
Router.configure({                                                                                    // 78
	layoutTemplate: 'layout'                                                                             // 79
}); //protect pages that require log in                                                               // 78
                                                                                                      //
var requireLogin = function () {                                                                      // 82
	if (!Meteor.user() && !Meteor.loggingIn()) {                                                         // 83
		Router.go('/');                                                                                     // 84
	} else {                                                                                             // 85
		this.next();                                                                                        // 86
	}                                                                                                    // 87
};                                                                                                    // 88
                                                                                                      //
var alreadyLoggedIn = function () {                                                                   // 89
	if (Meteor.user()) {                                                                                 // 90
		Router.go('/classes');                                                                              // 91
	} else {                                                                                             // 92
		this.next();                                                                                        // 93
	}                                                                                                    // 94
};                                                                                                    // 96
                                                                                                      //
Router.onBeforeAction(alreadyLoggedIn, {                                                              // 97
	only: ['welcome']                                                                                    // 97
});                                                                                                   // 97
Router.onBeforeAction(requireLogin, {                                                                 // 98
	only: ['classes', 'homeInstructor', 'lectures']                                                      // 98
});                                                                                                   // 98
////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"server":{"login-config.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// server/login-config.js                                                                             //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
//configure facebook service                                                                          // 1
ServiceConfiguration.configurations.remove({                                                          // 2
    service: 'facebook'                                                                               // 3
});                                                                                                   // 2
ServiceConfiguration.configurations.insert({                                                          // 6
    service: 'facebook',                                                                              // 7
    appId: '171694710004750',                                                                         // 8
    secret: '17b5a5f7bd3ab9b379474cfe1a7519f5'                                                        // 9
});                                                                                                   // 6
////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":["meteor/meteor",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// server/main.js                                                                                     //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var Meteor = void 0;                                                                                  // 1
module.import('meteor/meteor', {                                                                      // 1
  "Meteor": function (v) {                                                                            // 1
    Meteor = v;                                                                                       // 1
  }                                                                                                   // 1
}, 0);                                                                                                // 1
Meteor.startup(function () {// code to run on server at startup                                       // 3
});                                                                                                   // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./lib/collections/classes.js");
require("./lib/collections/lectures.js");
require("./lib/collections/questions.js");
require("./lib/collections/users.js");
require("./lib/router.js");
require("./server/login-config.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map

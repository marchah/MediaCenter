var mongoose = require('mongoose');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var Channel = require('./app/models/channel');
var User    = require('./app/models/user');
var Video    = require('./app/models/video');

var user = function() {
    console.log("****** User Begin ******");

    var newUser            = new User();
    newUser.name	   = 'User Test 1';
    newUser.local.login    = 'user1';
    newUser.local.email    = 'user1@test.com';
    newUser.local.password = newUser.generateHash('totoauzoo');

    newUser.save(function(err){if(err)console.log(err); console.log("****** User End ******");});
}

var channel = function() {
    console.log("****** Channel Begin ******");

    var arrayChannel = ["Action and Adventure",
			"Cartoons and Animations",
			"Comedy",
			"Family",
			"Drama",
			"Food and Leisure",
			"Home and Garden",
			"Horror and Suspense",
			"News and Information",
			"Reality and Game Shows",
			"Science Fiction",
			"Sports",
			"Talk and Interview",
			"Pilot",
			"VOD Radio",
			"Music Videos",
			"Live Sports"];

    for (var i = 0; i < arrayChannel.length; i++) {
	var ch = new Channel();
	ch.name = arrayChannel[i];
	ch.save(function(err){if(err)console.log(err); console.log("****** Channel End ******");});
    }
};

var video = function() {
    console.log("****** Video Begin ******");
    Channel.find({}, function(err, listChannel) {
	if(err) {
	    console.log(err);
	    return ;
	}

	var newVideo1 = new Video();
	newVideo1.title = "Video 1";
	newVideo1.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
	newVideo1.duration = "5min";
	newVideo1.path = "video/video.mp4";
	newVideo1.type = ".avi";
	newVideo1.idUser = null;
	newVideo1.idChannel = listChannel[1]._id;
	newVideo1.save(function(err) {
	    if (err)
		console.log(err);
	    console.log("****** Video 1 End ******");
	});

	var newVideo2 = new Video();
	newVideo2.title = "Video 2";
	newVideo2.description = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
	newVideo2.duration = "12min";
	newVideo2.path = "video/video.mp4";
	newVideo2.type = ".avi";
	newVideo2.idUser = null;
	newVideo2.idChannel = listChannel[2]._id;
	newVideo2.save(function(err) {
	    if (err)
		console.log(err);
	    console.log("****** Video 2 End ******");
	});

	var newVideo3 = new Video();
	newVideo3.title = "Video 3";
	newVideo3.description = "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?";
	newVideo3.duration = "35min";
	newVideo3.path = "video/video.mp4";
	newVideo3.type = ".avi";
	newVideo3.idUser = null;
	newVideo3.idChannel = listChannel[3]._id;
	newVideo3.save(function(err) {
	    if (err)
		console.log(err);
	    console.log("****** Video 3 End ******");
	});
    });

};

user();
//channel();
//video();

console.log("Ctrl + c for exit");

return ;

// var mongoose   = require("mongoose");
// var Campground = require("./models/campground.ejs");
// var Comment    = require("./models/comment.js");

// //new data for our site
// // var data = [
// //   {
// //   	name: "Sunset Peak",
// //   	image: "https://images.unsplash.com/photo-1594900532235-f3c9209b2fb3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// //   	description: "What can replace sunset peak time with wind blowing and a cup of coffee with your solemate?"
// //   },
// //   {
// //   	name: "Coffee and Couple",
// //   	image: "https://images.unsplash.com/photo-1594933878077-f15b1c406ebf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// //   	description: "Best thing with best person! What else can we expect from the day! Come and do some relaxing with your person at our place with some soft music!"
// //   }

// //   ]

// // function seedDB(){
// // 	//removing the previos data so that we don't have to work adding properties to the older version ourself code by code
// // Campground.remove({}, function(err){
// // 	if(err){
// // 		console.log(err);
// // 	}
// // 	console.log("removed data");
// // 	add a few new campgrounds
// //   data.forEach(function(seed){
// //   	Campground.create(seed, function(err, campground){
// //   		if(err){
// //   			console.log(err);
// //   		}
// //   		else{
// //   			console.log("added a campground");
// //   			//create a comment
// //   			Comment.create(
// //   			{
// //   				text: "This place is great! But i wish i find someone!",
// //   				author: "yawar"
// //   			}, function(err, comment){
// //   				if(err){
// //   					console.log(err);
// //   				}
// //   				else{
// //   					campground.comments.push(comment);
// //   					campground.save();
// //   					console.log("created new comment");
// //   				}
// //   			});
// //   		}
// //   	});
// //   });
// // });	

// // }

// module.exports = seedDB;
// ****************************************
//Comment Routes
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware"); 

var Teacher    = require("../models/teacher.ejs");
var Comment    = require("../models/comment");

router.get("/teachers/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Teacher.findById(req.params.id, function(err, teacher){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {teacher: teacher});
        }
    })
});

router.post("/teachers/:id/comments", middleware.isLoggedIn,  function(req, res){
    //lookup campground id
    Teacher.findById(req.params.id, function(err, teacher){
        if(err){
            console.log(err);
            res.redirect("/teachers");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    //ad username
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                   

                    //save comment
                    comment.save();
                    teacher.comments.push(comment);
            teacher.save();
            req.flash("success", "Successfully Added A New Comment");
            res.redirect("/teachers/"+ teacher._id);
                }
            });
            
        }
    });
});


module.exports = router;

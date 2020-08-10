// ****************************************
//Comment Routes
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware"); 

var Teacher    = require("../models/teacher.ejs");
var Student    = require("../models/student.js");
// let { checkCommentOwnership, isLoggedIn, isPaid } = require("../middleware");
// router.use(isLoggedIn, isPaid);

var Comment    = require("../models/comment");

router.get("/teachers/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find teacher by id
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
    //lookup teacher id
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

//********************
//student comment
router.get("/students/:id/comments/snew", middleware.isLoggedIn, function(req, res){
    //find student by id
    Student.findById(req.params.id, function(err, student){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/snew", {student: student});
        }
    })
});

router.post("/students/:id/comments", middleware.isLoggedIn,  function(req, res){
    //lookup student id
    Student.findById(req.params.id, function(err, student){
        if(err){
            console.log(err);
            res.redirect("/students");
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
                    student.comments.push(comment);
            student.save();
            req.flash("success", "Successfully Added A New Comment");
            res.redirect("/students/"+ student._id);
                }
            });
            
        }
    });
});


module.exports = router;

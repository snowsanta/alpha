//INDEX - show all campgrounds
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");  //since our content is inside index file and index file automatically behaves as the root main file so we dont necessarily need to name it here.
var Student    = require("../models/student.js");
var Comment    = require("../models/comment");

// let { checkStudentOwnership, isLoggedIn, isPaid } = require("../middleware");
// router.use(isLoggedIn, isPaid);

//Index-Show all students:
router.get("/students", function(req, res){
    console.log(req.user);
    // if (req.query.paid) res.locals.success = 'Payment succeeded, welcome to Tutor Delhi!';
    //Get all students form DB.
    Student.find({}, function(err, allstudents){
       if(err){
           console.log(err);
       } else {
          res.render("students/index",{students:allstudents, currentUser: req.user});
       }
    });

});

//CREATE - add new students to DB
router.post("/students",middleware.isLoggedIn, function(req, res){
    // get data from form and add to students array
    var name       = req.body.name;
    var mail       = req.body.email;
    var location   = req.body.location;
    var preference = req.body.preference;
    var phone      = req.body.phone;
    var address    = req.body.address;
    var subject    = req.body.subject;
    var budget     = req.body.budget;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newstudent = {name: name, subject: subject, location: location, preference: preference, author: author, email: mail,
                         phone: phone, address: address, budget: budget}
    // Create a new student and save to DB
    
    Student.create(newstudent, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to students page
            console.log(newlyCreated);
            res.redirect("/students");
        }
    });
});

//NEW - show form to create new students
router.get("/students/new", middleware.isLoggedIn, function(req, res){
        req.flash("error", "You need to logIn to do that!");

   res.render("students/new.ejs"); 
});

// SHOW - shows more info about one students
router.get("/students/:id",middleware.isLoggedIn, function(req, res){
    //find the students with provided ID
    Student.findById(req.params.id).populate("comments").exec(function(err, foundStudent){
        if(err){
            req.flash("error", err.message);
        } else {
            //render show template with that students
            res.render("students/show", {student: foundStudent});
        }
    });
});

//show student contact details
router.get("/students/:id/:phone",middleware.isLoggedIn, middleware.isPaid,function(req, res){
    //find the students with provided ID
    Student.findById(req.params.id).populate("comments").exec(function(err, foundStudent){
        if(err){
            req.flash("error", err.message);
        } else {
            //render show template with that students
            res.render("students/cShow", {student: foundStudent});
        }
    });
});


//EDIT route
router.get("/students/:id/edit", middleware.checkStudentOwnership, function(req,res){
       Student.findById(req.params.id, function(err, foundStudent){
            res.render("students/edit", { student: foundStudent});   
        });
            });
//EDIT route
router.get("/students/:id/:phone/edit", middleware.checkStudentOwnership, function(req,res){
       Student.findById(req.params.id, function(err, foundStudent){
            res.render("students/cEdit", { student: foundStudent});   
        });
            });


//update router
router.put("/students/:id",middleware.checkStudentOwnership, function(req, res){
    //find and update the correct teachers
    Student.findByIdAndUpdate(req.params.id, req.body.student, function(err, UpdatedStudent){
        if(err){
            res.redirect("/students");
        }
        else{
            res.redirect("/students/" + req.params.id);
        }
    });
});

//Delete Route
router.delete("/students/:id",middleware.checkStudentOwnership, function(req, res){
    Student.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/students");
        }
        else{
                req.flash("Success", "Success!");

            res.redirect("/students");
        }
    });
});


//Edit Comment
router.get("/students/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
        res.redirect("back");
    }
    else{
        res.render("comments/sedit", { student_id: req.params.id, comment: foundComment});
    }
   });
});

//update comment
router.put("/students/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/students/"+ req.params.id);
        }
    });
});
//delete comment
router.delete("/students/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //find and remove 
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
                req.flash("success", "Success!");

            res.redirect("/students/" + req.params.id);
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function escapeRegey(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};




module.exports = router;

//INDEX - show all campgrounds
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");  //since our content is inside index file and index file automatically behaves as the root main file so we dont necessarily need to name it here.
var Teacher    = require("../models/teacher.ejs");
var Comment    = require("../models/comment");







router.get("/teachers", function(req, res){
    console.log(req.user);
    if(req.query.Subject){
        const regex = new RegExp(escapeRegex(req.query.Subject), 'gi');
       Teacher.find({subject: regex}, function(err, allteachers){
       if(err){
           console.log(err);
       } else {
          res.render("teachers/sindex",{teachers:allteachers, currentUser: req.user});
         
       }
    });
    }
    else  if(req.query.address){
            const regey = new RegExp(escapeRegey(req.query.address), 'gi');
            Teacher.find({address: regey}, function(err, allteachers){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("teachers/s2index", {teachers: allteachers, currentUser: req.user});
                }
            });
          }
          else  if(req.query.experience){
            const regex = new RegExp(escapeRegex(req.query.address), 'gi');
            Teacher.find({experience: regex}, function(err, allteachers){
                if(err){
                    console.log(err);
                }
                else{
                    res.render("teachers/s3index", {teachers: allteachers, currentUser: req.user});
                }
            });
          }
    else{
    // Get all teacherss from DB
    Teacher.find({}, function(err, allteachers){
       if(err){
           console.log(err);
       } else {
          res.render("teachers/index",{teachers:allteachers, currentUser: req.user});
       }
    });
}
});

//CREATE - add new teachers to DB
router.post("/teachers",middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name       = req.body.name;
    var mail       = req.body.email;
    var experience = req.body.experience;
    var phone      = req.body.phone;
    var address    = req.body.address;
    var subject    = req.body.subject;
    var desc       = req.body.description;
    var age        = req.body.age;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newteacher = {name: name, subject: subject, description: desc,age: age, author: author, email: mail, experience: experience,
                         phone: phone, address: address}
    // Create a new teacher and save to DB
    
    Teacher.create(newteacher, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to teacherss page
            console.log(newlyCreated);
            res.redirect("/teachers");
        }
    });
});

//NEW - show form to create new teachers
router.get("/teachers/new", middleware.isLoggedIn, function(req, res){
        req.flash("error", "You need to logIn to do that!");

   res.render("teachers/new.ejs"); 
});

// SHOW - shows more info about one teachers
router.get("/teachers/:id", middleware.isLoggedIn, function(req, res){
    //find the teachers with provided ID
    Teacher.findById(req.params.id).populate("comments").exec(function(err, foundTeacher){
        if(err){
            console.log(err);
        } else {
            //render show template with that teachers
            res.render("teachers/show", {teacher: foundTeacher});
        }
    });
});

//EDIT route
router.get("/teachers/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
       Teacher.findById(req.params.id, function(err, foundTeacher){
            res.render("teachers/edit", { teacher: foundTeacher});   
        });
            });

//update router
router.put("/teachers/:id",middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct teachers
    Teacher.findByIdAndUpdate(req.params.id, req.body.teacher, function(err, UpdatedTeacher){
        if(err){
            res.redirect("/teachers");
        }
        else{
            res.redirect("/teachers/" + req.params.id);
        }
    });
});

//Delete Route
router.delete("/teachers/:id",middleware.checkCampgroundOwnership, function(req, res){
    Teacher.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/teachers");
        }
        else{
                req.flash("Success", "Success!");

            res.redirect("/teachers");
        }
    });
});

//Edit Comment
router.get("/teachers/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
        res.redirect("back");
    }
    else{
        res.render("comments/edit", { teacher_id: req.params.id, comment: foundComment});
    }
   });
});

//update comment
router.put("/teachers/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/teachers/"+ req.params.id);
        }
    });
});
//delete comment
router.delete("/teachers/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //find and remove 
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
                req.flash("success", "Success!");

            res.redirect("/teachers/" + req.params.id);
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

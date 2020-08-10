//all middle ware goes here
var Teacher = require("../models/teacher.ejs");
var Student = require("../models/student.js");
var Comment = require("../models/comment.js");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if(req.isAuthenticated()){
       Teacher.findById(req.params.id, function(err, foundteacher){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        else{
            //does user own the teacherDetails?
            if(foundteacher.author.id.equals(req.user._id) || req.user.isAdmin){
            next();  
            } 
            else{
                res.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
            }
        });
            
        }
        else{
            res.redirect("back")
        }
}

//*********************
//student authentication:
middlewareObj.checkStudentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
       Student.findById(req.params.id, function(err, foundstudent){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        else{
            //does user own the teacherDetails?
            if(foundstudent.author.id.equals(req.user._id) || req.user.isAdmin){
            next();  
            } 
            else{
                res.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
            }
        });
            
        }
        else{
            res.redirect("back")
        }
}


middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
       Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            //does user own the comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            next();  
            } 
            else{
                    req.flash("error", "Access Denied! LogIn first");

                res.redirect("back");
            }
            }
        });
            
        }
        else{
                req.flash("error", "You need to logIn to do that!");

            res.redirect("back")
        }
}
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    if(req['headers']['content-type'] === 'application/json') {
        return res.send({ error: 'Login required' });
    }
    req.flash("error", "You need to logIn to do that!");
    res.redirect("/login");
}

middlewareObj.isPaid = function(req, res, next){
    if (req.user.isPaid || req.user.isAdmin ) return next();
    req.flash("error", "Please pay registration fee before continuing");
    res.redirect("/checkout");
}




module.exports  = middlewareObj;
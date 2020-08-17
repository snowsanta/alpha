var express       = require("express"),
    app           = express(),
    flash         = require("connect-flash"),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Teacher       = require("./models/teacher.ejs"),
    Comment       = require("./models/comment"),
    Student       = require("./models/student"),
    seedDB        = require("./seeds"),
    User          = require("./models/user"),
    cookieParser  = require("cookie-parser"),
    dotenv        = require("dotenv"),
    methodOverride= require("method-override"),
    exphbs        = require('express-handlebars');
    require('dotenv').config()    

//require routes
var commentRoute     = require("./routes/comments"),    
    teacherRoute     = require("./routes/teacher"),
    indexRoute       = require("./routes/index"),
    studentRoute     = require("./routes/student"),
    middleware = require("./middleware");  //since our content is inside index file and index file automatically behaves as the root main file so we dont necessarily need to name it here.

const { resolve } = require("path");

// mongoose.connect("mongodb://localhost:27017/yelp_camp_teacherdirectoryP",{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect("mongodb+srv://dbadmin:Tutor@6969@shenanigansproj1.qyliq.mongodb.net/tutorSitedb?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// app.use(cookieParser('secret'));
// seedDB(); 
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

//Passport Configuration
app.use(require("express-session")({
    secret:            "She again got the em brown eyes",
    resave:            false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.coins       = 1000;
    
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});
    
app.get("/", function(req, res){
    res.render("landing");
});
app.use(indexRoute);
app.use(teacherRoute);
app.use(commentRoute);
app.use(studentRoute);

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("working server");
});
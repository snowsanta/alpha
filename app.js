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
    methodOverride= require("method-override");
require('dotenv').config()    

//require routes
var commentRoute     = require("./routes/comments"),    
    teacherRoute     = require("./routes/teacher"),
    indexRoute       = require("./routes/index"),
    studentRoute     = require("./routes/student"),
 middleware = require("./middleware");  //since our content is inside index file and index file automatically behaves as the root main file so we dont necessarily need to name it here.

   
//    configure dotenv
// require('dotenv').load();

const { resolve } = require("path");

// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")("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");
// const stripe = require("stripe")("sk_test_51HDZnHL1Ff9f3n193kvTrQSKzUZtEyw3oa5dofIEzrxRuooznXHl5Fp7tEQntTkIktRFptNHYwxaO1Wkcm374wIp00S1OgJQis");


// mongoose.connect("mongodb://localhost:27017/yelp_camp_teacherdirectoryP",{useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect("mongodb+srv://dbadmin:Tutor@6969@shenanigansproj1.qyliq.mongodb.net/tutorSitedb?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser('secret'));
// seedDB(); 

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


// // GET checkout
app.get('/checkout', middleware.isLoggedIn, (req, res) => {
    if (req.user.isPaid) {
        req.flash('success', 'Your account is already paid');
        return res.redirect('/students');
    }
    res.render('checkout', { amount: 100 });
});

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const {  items } = req.body;
   // Listen for the event.
    // elem.addEventListener('success', function (e) { 
    //     // isPaid = true;
    //     // console.log("Payment Successfull!")
    //     paymentMethodId = paymentMethodId;   
    //     }, 
    //     );
  try{
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    // payment_method: paymentMethodId,
    // error_on_requires_action: true,
    // confirm: true
  });


  app.addEventListener('success', function(e){
       
       if (isTrue == 1) {
      console.log("💰 Payment received!");  
       }
      // console.log("💰 Payment received!");
      // req.user.isPaid = true;
      // await req.user.save();
  
  });
  // if(isTrue == 1){
  //   console.log("This is awesome");
  // }
        // The payment is complete and the money has been moved
      // You can add any post-payment code here (e.g. shipping, fulfillment, etc)
  
      // Send the client secret to the client to use in the demo

  res.send({

    clientSecret: paymentIntent.client_secret


  });

}
catch(e){
 
        res.send({ error: e.message });
      
    }



});

// // POST pay
// app.post('/create-payment-intent', middleware.isLoggedIn, async (req, res) => {
//     const { paymentMethodId, items, currency } = req.body;
  
//     try {
//       // Create new PaymentIntent with a PaymentMethod ID from the client.
//       const intent = await stripe.paymentIntents.create({
//         amount: calculateOrderAmount(items),
//         currency: "inr",
//         payment_method: paymentMethodId,
//         error_on_requires_action: true,
//         confirm: true
//       });
  
//       console.log("💰 Payment received!");

//       req.user.isPaid = true;
//       await req.user.save();
//       // The payment is complete and the money has been moved
//       // You can add any post-payment code here (e.g. shipping, fulfillment, etc)
  
//       // Send the client secret to the client to use in the demo
//       res.send({ 
//         clientSecret: intent.client_secret 
//       });
//     } catch (e) {
//       // Handle "hard declines" e.g. insufficient funds, expired card, card authentication etc
//       // See https://stripe.com/docs/declines/codes for more
//       // if (e.code === "authentication_required") {
//       //   res.send({
//       //     error:
//       //       "This card requires authentication in order to proceeded. Please use a different card."
//       //   });
//       // } else {
//       //   res.send({ error: e.message });
//       // }
//     }
// });



var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("working server");
});
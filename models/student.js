var mongoose = require("mongoose");

  var studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  preference : String,
  budget: String,
  phone: String,
  address: String,
  subject: String,
  author: {
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },
    username: String
  },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});


module.exports = mongoose.model("Student", studentSchema);
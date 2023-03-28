const mongoose = require('mongoose');
Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
        type:String,
        required: true
    },
    role:{
      type: String,
      enum:["worker", "department-manager", "manager"],
      default: "worker"
    },
    company:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Company'
    },
    department:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Department'
    },
  ]
  });

const User = mongoose.model('User', UserSchema);
module.exports = User;
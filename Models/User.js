const mongoose = require("mongoose");

const User = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  medicines: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Medicine",
    },
  ],
},{ collection: 'User' });

module.exports = mongoose.model("User", User);

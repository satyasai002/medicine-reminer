const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  compartment: {
    type: Number,
    required: true,
  },
  time:{ 
    type : Date, 
    default: Date.now,
}
},{ collection: 'Reminder' });

module.exports = mongoose.model("Reminder", reminderSchema);

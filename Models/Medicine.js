const mongoose = require("mongoose");
// id          String   @id @default(auto()) @map("_id") @db.ObjectId
//   name        String
//   compartment Int
//   number      Int
//   time        String[]
//   user        User     @relation(fields: [userID], references: [id])
//   userID      String   @db.ObjectId
const medicineSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  compartment: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  time:[
    {
      type: String,
      required: true,
    },
  ],
  userID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{ collection: 'Medicine' });

module.exports = mongoose.model("Medicine", medicineSchema);

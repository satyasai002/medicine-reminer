const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const z = require("zod")

const User = require("../Models/User");
const Medicine = require("../Models/Medicine");
const Reminder = require("../Models/Reminder");

exports.medicine_create =async (req, res) => {
  const { name, compartment, number, time } = req.body
  const userID = req.userData?.id
  if (userID === undefined) {
    res.status(401).json({
      success: false,
      message : "userID"
    })
  } else {
    try {
      if (!z.string().min(3).safeParse(name).success || !z.number().min(1).safeParse(compartment).success || !z.number().min(0).max(30).safeParse(number).success || !z.array(z.string()).min(1).max(4).safeParse(time).success) {
        console.log(number)
        res.status(400).json({
          success: false,
          message : "incorrect details"
        })
      } else {
        await Medicine.deleteMany({ compartment: compartment })
        const medicine = new Medicine({
          _id: new mongoose.Types.ObjectId(),
          name: name,
          compartment: compartment,
          number: number,
          time: time,
          userID: userID,
        });
        await medicine.save();
        User.findOneAndUpdate(
          {
            _id: userID,
          },
          {
            $push: {
              medicines: medicine._id,
            },
          }
        ).then(async (result) => {
          res.status(201).json({
            medicine,
            success: true,
          });
        });;
        
        
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error
      })
    }
  }
}
exports.medicine_decrease = async (req,res) => {
  const { userID, compartment } = req.body;

  try {
    if (
      !z.string().min(10).safeParse(userID).success ||
      !z.number().min(1).max(3).safeParse(compartment).success
    ) {
      res.status(400).json({
        success: false,
        error: "invalid input data",
      });
    } else {
      const previousData = await Medicine.findOne({
        compartment: compartment,
        userID:userID,
      });
    console.log(previousData.number)
      if (previousData !== null) {
        await Medicine.findOneAndUpdate({
            _id: previousData._id,
        },{
            number: previousData.number - 1,
          }
        );
          const reminder = new Reminder({
            _id : new mongoose.Types.ObjectId(),
            compartment: previousData.compartment,
          })
        reminder.save().then((result)=>{
            res.status(200).json({
              success: true,
            });
        })
      } else {
        res.status(400).json({
          success: false,
          error: "failed at database",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

exports.medicine_get = async (req,res) => {
  const { id } = req.body;

  try {
    if (!z.string().safeParse(id).success) {
      res.status(400).json({
        success: false,
        error: "invalid Data",
      });
    } else {
      const medicines = await  User.findOne({ _id:id}).populate("medicines");
      console.log(medicines)
      if (medicines !== null) {
        res.status(200).json({
          success: true,
          medicine: medicines.medicines.map((value) => {
            return {
              compartment: value.compartment,
              time: value.time,
            };
          }),
        });
      }
      else{
        res.status(500).json({
          success: false,
          error: "server error",
        });
      }

    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

exports.medicine_UserMedicine = async (req,res)=> {
  const { id } = req.body;

  try {
    if (!z.string().safeParse(id).success) {
      res.status(400).json({
        success: false,
        error: "invalid input data",
      });
    } else {
      const medicines = await User.findOne({ _id: id }).populate("medicines");

      if (medicines !== null) {
        res.status(200).json({
          success: true,
          medicine: medicines.medicines.map((value) => {
            return {
              id: value.id,
              name: value.name,
              userID: value.userID,
              number: value.number,
              compartment: value.compartment,
              time: value.time,
            };
          }),
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

exports.medicine_getReminder = async (req,res) => {
  const reminders = await Reminder.find();
  res.status(200).json({
    success: true,
    reminders,
  });
};

exports.medicine_deleteMedicine = async (req,res)=> {
  const compartment = req.body.compartment;
  await Medicine.deleteMany({compartment:compartment});
  res.status(200).json({
    deleted: true,
  });
};

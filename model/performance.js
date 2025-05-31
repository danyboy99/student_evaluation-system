const mongoose = require("mongoose");

const { Schema } = mongoose;

const performanceSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
  },
  attendance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const performance = mongoose.model("performance", performanceSchema);

module.exports = performance;

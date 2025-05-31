const mongoose = require("mongoose");

const { Schema } = mongoose;

const evaluationSchema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  dateOfEvaluation: {
    type: Date,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  desiredGrade: {
    type: String,
    required: true,
  },
  classParticipation: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const evaluation = mongoose.model("evaluation", evaluationSchema);

module.exports = evaluation;

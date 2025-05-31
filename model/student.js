const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSChema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

const student = mongoose.model("student", studentSChema);

module.exports = student;

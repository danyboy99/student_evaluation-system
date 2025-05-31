const Evaluation = require("../model/evaluation.js");

const createEvaluation = async (req, res) => {
  let errMsg = [];
  let successMsg = [];
  try {
    const { course, desiredGrade, classParticipation, goal, comment } =
      req.body;
    const dateOfEvaluation = Date.now();
    const studentId = req.user._id;

    const createdEvaluation = await Evaluation.create({
      studentId,
      dateOfEvaluation,
      course,
      desiredGrade,
      classParticipation,
      goal,
      comment,
    });

    if (!createdEvaluation) {
      let message = "Something went wrong, couldn't create evaluation record";
      errMsg.push(message);
      req.flash("error", errMsg);
      return res.redirect("/student/homepage");
    }

    let message = "Evaluation record created successfully";
    successMsg.push(message);
    req.flash("success", successMsg);
    return res.redirect("/student/homepage");
  } catch (err) {
    errMsg.push(err.message);
    req.flash("error", errMsg);
    return res.redirect("/student/homepage");
  }
};

module.exports = {
  createEvaluation,
};

const express = require("express");
const controller = require("../controller/evaluation.js");
const router = express.Router();
const Evaluation = require("../model/evaluation.js");

router.get("/", (req, res) => {
  return res.json("welcome to evaluation home route");
});
router.get("/create", (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  const user = req.user;

  return res.render("create-evaluation", {
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    errMsg: errMsg,
    successMsg: successMsg,
    user,
  });
});
router.post("/create", controller.createEvaluation);
router.get("/all", async (req, res) => {
  const Evaluation = require("../model/evaluation.js");
  const allEvaluation = await Evaluation.find();
  return res.json(allEvaluation);
});
router.get("/myevaluation/:id", async (req, res) => {
  let errMsg = [];
  try {
    const studentId = req.params.id;
    const foundEvaluation = await Evaluation.find({ studentId });
    return res.render("myevaluation", {
      hasEvaluation: foundEvaluation.length > 0,
      myevaluation: foundEvaluation,
    });
  } catch (err) {
    errMsg.push(err.message);
    req.flash("error", errMsg);
    return res.redirect("/student/homepage");
  }
});
module.exports = router;

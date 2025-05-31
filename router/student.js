const express = require("express");
const controller = require("../controller/student");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  return res.json("welcome to student home route");
});

router.post("/create", controller.createStudent);
router.get("/all", async (req, res) => {
  const student = require("../model/student.js");
  const allstudent = await student.find();
  return res.json(allstudent);
});
router.post(
  "/login",
  passport.authenticate("student-login", {
    failureRedirect: "/",
    failureFlash: true,
    successRedirect: "/student/homepage",
  })
);
router.get("/homepage", controller.isLoggedIn, async (req, res) => {
  try {
    let errMsg = req.flash("error");
    let successMsg = req.flash("success");
    const user = req.user;

    // Get evaluation count
    const Evaluation = require("../model/evaluation.js");
    const evaluationCount = await Evaluation.countDocuments({
      studentId: user._id,
    });

    // Get performance data
    const Performance = require("../model/performance.js");
    const performances = await Performance.find({ studentId: user._id });
    const performanceCount = performances.length;

    // Calculate average score
    let totalScore = 0;
    performances.forEach((perf) => {
      totalScore += perf.score || 0;
    });
    const averageScore =
      performanceCount > 0 ? Math.round(totalScore / performanceCount) : 0;

    // Get course labels and scores for chart
    const courseLabels = performances.map((perf) => perf.course);
    const courseScores = performances.map((perf) => perf.score);

    // Get recent performances (limit to 5)
    const recentPerformances = performances
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Determine strengths and weaknesses based on scores
    const strengths = [];
    const weaknesses = [];

    performances.forEach((perf) => {
      if (perf.score >= 80) {
        strengths.push(`Strong performance in ${perf.course} (${perf.score}%)`);
      } else if (perf.score <= 60) {
        weaknesses.push(`Needs improvement in ${perf.course} (${perf.score}%)`);
      }
    });

    return res.render("homepage", {
      hasErr: errMsg.length > 0,
      hasSuccess: successMsg.length > 0,
      errMsg: errMsg,
      successMsg: successMsg,
      user,
      evaluationCount,
      performanceCount,
      averageScore,
      courseLabels,
      courseScores,
      recentPerformances,
      strengths,
      weaknesses,
    });
  } catch (err) {
    console.error(err);
    let errMsg = ["An error occurred while loading the dashboard"];
    return res.render("homepage", {
      hasErr: true,
      hasSuccess: false,
      errMsg: errMsg,
      successMsg: [],
      user: req.user,
      evaluationCount: 0,
      performanceCount: 0,
      averageScore: 0,
      courseLabels: [],
      courseScores: [],
      recentPerformances: [],
      strengths: [],
      weaknesses: [],
    });
  }
});
module.exports = router;

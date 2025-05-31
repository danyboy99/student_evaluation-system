const express = require("express");
const controller = require("../controller/performance");
const router = express.Router();
const Performance = require("../model/performance.js");

router.get("/", (req, res) => {
  return res.json("welcome to performance home route");
});
router.get("/create", (req, res) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");
  const user = req.user;

  return res.render("create-performance", {
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    errMsg: errMsg,
    successMsg: successMsg,
    user,
  });
});
router.post("/create", controller.createPerformance);
router.get("/all", async (req, res) => {
  const performance = require("../model/performance.js");
  const allperformance = await performance.find();
  return res.json(allperformance);
});
router.get("/myperformance/:id", async (req, res) => {
  let errMsg = [];
  try {
    const studentId = req.params.id;
    const foundPerformance = await Performance.find({ studentId }).sort({
      date: -1,
    });
    const user = req.user;

    return res.render("myperformance", {
      hasPerformance: foundPerformance.length > 0,
      myPerformance: foundPerformance,
      user: user,
    });
  } catch (err) {
    errMsg.push(err.message);
    req.flash("error", errMsg);
    return res.redirect("/student/homepage");
  }
});
module.exports = router;

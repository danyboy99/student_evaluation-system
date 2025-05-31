const Student = require("../model/student");
const argon = require("argon2");

const createStudent = async (req, res) => {
  let errMsg = [];
  let successMsg = [];
  try {
    const { fullname, email, department, year, password } = req.body;
    const hashPassword = await argon.hash(password);
    const createdStudent = await Student.create({
      fullname,
      email,
      department,
      year,
      password: hashPassword,
    });
    if (!createdStudent) {
      let message = "something went wrong couldn't create student account";
      errMsg.push(message);
      req.flash("error", errMsg);
      return res.redirect("/");
    }
    let message =
      "account created successfuly login with the cridentials you created";
    successMsg.push(message);
    req.flash("success", successMsg);
    return res.redirect("/");
  } catch (err) {
    errMsg.push(err.message);
    req.flash("error", errMsg);
    return res.redirect("/");
  }
};
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  let message = "you must be loggedin to access a private route";
  let errMsg = [];
  errMsg.push(message);
  req.flash("error", errMsg);
  return res.redirect("/");
};
module.exports = {
  createStudent,
  isLoggedIn,
};

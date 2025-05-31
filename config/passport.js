const passport = require("passport");
const Student = require("../model/student");
const localStrategy = require("passport-local").Strategy;
const argon = require("argon2");

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const foundStudent = await Student.findById(id);
  if (!foundStudent) {
    return done("user not found");
  }
  return done(null, foundStudent);
});

passport.use(
  "student-login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      let errMsg = [];
      let successMsg = [];
      try {
        const foundStudent = await Student.findOne({ email });
        if (!foundStudent) {
          let message = "no student found with this email";
          errMsg.push(message);
          done(null, false, req.flash("error", errMsg));
        }
        let isPasswordCorrect = await argon.verify(
          foundStudent.password,
          password
        );
        console.log("got here");
        if (!isPasswordCorrect) {
          let message = "incorrect password";
          errMsg.push(message);
          return done(null, false, req.flash("error", errMsg));
        }
        return done(null, foundStudent);
      } catch (err) {
        errMsg.push(err.message);
        return done(null, false, req.flash("error", errMsg));
      }
    }
  )
);

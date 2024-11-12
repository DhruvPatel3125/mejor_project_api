const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
    "/signup",
    wrapAsync(async (req, res) => {
      try {
        let { username, email, password } = req.body;
  
        // Check if the username or email already exists
        const existingUser  = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser ) {
          req.flash("error", "Username or email already exists.");
          return res.redirect("/signup");
        }
  
        // Create a new user if no existing user is found
        const newUser  = new User({ email, username });
        const registerUser  = await User.register(newUser , password);
        console.log(registerUser );
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      } catch (e) {
        console.error(e); // Log the error to the console
        req.flash("error", e.message);
        res.redirect("/signup");
      }
    })
  );

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}),async(req,res)=>{
    req.flash("success","Wellcome back to Wanderlust");
    res.redirect("/listings");
})

router.get("/logout",(req,res,next)=>{
  req.logOut((err)=>{
    if(err){
     return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
})

module.exports = router;
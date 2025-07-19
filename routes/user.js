const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/signin", (req, res) => {
  try {
    return res.render("signin");
  } catch (error) {
    console.log("Error found at get request of signin page");
    return res.status(500).json({ error: error });
  }
});
router.get("/signup", (req, res) => {
  try {
    return res.render("signup");
  } catch (error) {
    console.log("Error found at get request of signup page");
    return res.status(500).json({ error: error });
  }
});
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    await User.create({ 
      fullName: fullName,
      email: email,
      password: password });
    return res.redirect("/");
  } catch (err) {
    console.log("Error found at post request of signup page");
    return res.status(500).json({ error: err });
  }
});
// router.post('/signin', async (req,res)=>{
//   try {
//     const {email,password}=req.body;
//     const user= await User.matchPassword(email,password);
//     console.log("User",user);
//     return res.redirect('/');
//   } catch (error) {
    
//   }
// })
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    //res.status(200).json({ success: true, user });
    console.log('token',token)
    return res.cookie("token",token).redirect('/');
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).render('signin',{error: "Incorrect Email or Password"}); // Send proper error response
  }
});
router.get('/logout',(req,res)=>{
  res.clearCookie('token').redirect('/');
})
module.exports = router;

require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const cookieParser=require('cookie-parser')
const mongoose = require('mongoose')
const {connect} = require('./connections/user');
connect(process.env.MONGO_URL);

const userRouter = require('./routes/user');
const blogRoute=require('./routes/blogs')

const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const PORT = process.env.PORT || 8007;
const User=require('./models/user');
const Blog = require('./models/blogs');
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

// This middleware makes user available to every EJS file
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))
//The above line says that allow the get request of all public folder

app.get('/',async (req, res) => {
  const allBlogs=await Blog.find({});
  const user=req.user;
  if(!user){
    return res.render('home',{blogs: allBlogs});
  }
  const userFromDatabase=await User.findById(user._id);
  const fullName=userFromDatabase.fullName;
  //console.log(fullName || "Manoj");
  return res.render('home',{user: user,blogs: allBlogs})
})
app.use('/user', userRouter);
app.use('/blog',blogRoute);
app.listen(PORT, () => {console.log(`Server started at localhost ${PORT} `)})
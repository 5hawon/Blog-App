require('dotenv').config();

const express = require('express');
const path = require('path');
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/blog');

const app = express();

const PORT = process.env.PORT||8000;
//console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
.then((e)=>console.log("MongoDB connected"))
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.set('view engine', 'ejs');
app.set("views",path.resolve('./views'));

app.use(express.urlencoded({ extended:false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render('home',{
        user: req.user,
        blogs: allBlogs
    });
})
app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT,()=>{
    console.log('listening on port '+PORT);
})
const {Router} =require('express');
const User = require('../models/user')

const router = Router();

router.get('/signin',(req,res)=>{
    return res.render('signin');
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.post('/signup', async(req,res)=>{
    console.log(req.body);
    const {fullName, email, password} = req.body;
    console.log(fullName);
    await User.create({
        fullName,
        email,
        password
    });
    res.redirect('/')
})



module.exports = router;
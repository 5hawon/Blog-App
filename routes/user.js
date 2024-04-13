const {Router} =require('express');
const User = require('../models/user')

const router = Router();

router.get('/signin',(req,res)=>{
    return res.render('signin');
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.post('/signin',async(req,res)=>{
    const {email, password} = req.body;
    try {
        console.log(email, password);
        const token = await User.matchPassword(email, password);
        return res.cookie("token",token).redirect('/');
        
    } catch (error) {
        return res.render('signin', {
            error: 'Incorrect email or password'
        })
        
    }

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

router.get('/logout', (req,res)=>{
    res.clearCookie("token").redirect('/');
})



module.exports = router;
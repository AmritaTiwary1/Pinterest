const express= require('express');
const router = express.Router();

const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require('./users');
const postModel=require('./posts');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/',function(req,res){
    res.send("home page");
});

router.get('/profile', isLoggedIn ,function(req,res,next){
    res.render("profile");
});

router.get('/login',function(req,res){
    res.render('login');
})

router.get('/feed',function(req,res){
    res.render('feed'); 
})

router.get('/register',function(req,res){
    res.render('register');
})

/*
router.get('/createuser', async function(req,res){
    const data = await userModel.create({
        username: "deva",
        email: "deva@gmail.com",
        password:"deva",
        posts: ["674dc08f040aa7e790ec2394","674dc132eabaf0c891e687b6"],
        fullName: "deva",
 })
 res.send(data)
})

router.get('/createpost',async function(req,res){
    let data = await postModel.create({
        postText: "second user post", 
        user: "674dbce25dc302b8cdd963fc",
        likes: "674d81e44a9f63c677213fed"
    });
   res.send(data); 
})

router.get('/userdetail', async function(req,res){
    let data= await userModel.findOne({_id:"674dc57d09b62fe95ce05869"})
    .populate("posts");  // .populate will show whole details of the id..s that are present in posts array 
    res.send(data); 
})

router.get('/allpost', async function(req,res){
    let data = await postModel.find();
    res.send(data);
})*/

router.get('/alluser', async function(req,res){
    let data = await userModel.find();
    res.send(data);
});

router.post('/register', function(req,res){
 /*  const userData = new userModel({
        username : req.body.username,
        email : req.body.email,
        fullname : req.body.fullname
    });  */

    //in short form ----
   const {username,email,fullname} = req.body;
     const userData = new userModel({username,email,fullname});

    userModel.register(userData, req.body.password)
    .then(function(){  //it is callback fn where registereduser is like res --> .then((res)=>{console.log(res)})
        passport.authenticate("local")(req,res , function(){  //to use local, remember to require passport on top of this file
            res.redirect('/profile')
        } )
    })
});

router.post('/login', passport.authenticate("local",{
     successRedirect:'/profile',
    failureRedirect:'/login'
}) , function(req,res){ } );

router.get('/logout',function(req,res){
   req.logout(function(err){
    if(err){
        return next(err);
    }
    res.redirect('/');
   });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        console.log("check if authenticated");
        return next();
    }
    res.redirect('/login');
}

module.exports = router;

const express= require('express');
const router = express.Router(); 

const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require('./users');
const postModel=require('./posts');
passport.use(new localStrategy(userModel.authenticate()));

const upload = require('./multer'); //importing upload variable from multer.js file

router.get('/',function(req,res){
    res.send("home page");
});

router.get('/profile', isLoggedIn ,async function(req,res,next){
    const user = await userModel.findOne({
        username:req.session.passport.user
    }).populate('posts');  //here, in user variable, we are populating posts field which contain postsid so that the doc of postId will be accessible from user variable 
    res.render("profile" , {user}); //we get document of user which is stored in database in user variable (IMPORTANT : req.session.passport.user return user (ie. if i am using this web ,i will get my userinfo, if dev is using this web, he will get his userdata) )
});

router.get('/login',function(req,res){
  //console.log(req.flash("error"))  ; //here, we can access flash message bcoz in route=/login(method=post) , we have write failureFlash:true , so we can access error message in failureredirect's route('/login') by writing- console.log(req.flash("error")) 
 //but if user go to login page for first time,then flash error will not be visible,bcoz there is no error at that time

  res.render('login', {error: req.flash("error") });  //sending flash message to login page , so that user can see the error , flash message is array
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
    failureRedirect:'/login',
    failureFlash:true  //to use flash message, I install connect-flash module and did setup in app.js to use it
    //if user input wrong info, this failureFlash:true will allow failureRedirect route(ie. /login) to access flash message, which hold error("username, password wrong") 
}) , function(req,res){ } );

router.get('/logout',function(req,res){
   req.logout(function(err){
    if(err){
        return next(err);
    }
    res.redirect('/'); 
   });
});

router.post('/upload', isLoggedIn , upload.single("file") ,async function(req,res,next){  // here in upload.single("file"), 
// file is the name of the input field in which we r uploading image --check profile.ejs - in form of uploading image  - 
//<input type="file" name="file"> is written , if we write name="anything" then we have to write upload.single("anything")  
   
if(!req.file){  //if user dont upload image, we'll show error 
     return res.status(404).send("no files were given");
   }
   
   //adding post details/id to user document ,so first we have to find the user(req.session.passport.user),
   // then have to add post id in post array of user doc. and also, we have to create a doc in postmodel in which user id,uploaded image,and its caption will be passed
    
   const user =await userModel.findOne({username: req.session.passport.user});
  
   const post =await postModel.create({ // once user upload image,caption , then i will run the fn create so that a doc. in postmodel will be created
      postText: req.body.fileCaption,
      image: req.file.filename,  //note : req.file is written instead of req.body bcoz req.file will return new file detail and req.file.filename return new filename (which is stored in uploads folder in public folder )
      user:user._id
    });

    /* await*/ user.posts.push(post._id); // await keyword will not be use at the time of pushing,in saving we use... In usermodel, we are pushing post id to posts field in user document , 
    await user.save();
    res.redirect('/profile');
    
}); //we have to save the uploaded file 


 


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        console.log("check if authenticated");
        return next();
    }
    res.redirect('/login');
}

module.exports = router;

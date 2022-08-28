var express = require('express');
var router = express.Router();
var User=require('../models/users');
var passport=require('passport');


var authenticate=require('../authenticate');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next)=>{

//   User.findOne({username:req.body.username})
//   .then((user)=>{
//     if(user!=null)
//     {

//       var err=new Error('User with username'+req.body.username+'already exist');
//       err.status=403;
//       next(err);

//     }

//     else
//     {
//       return User.create({

//         username:req.body.username,
//         password:req.body.password
//       });
//     }
// }).then((user)=>{
//   res.statusCode=200;
//   res.setHeader("Content-type",'application/json');
//   res.json({
//     status:"Registration successful",
//     user:user
//   })
// },err=>next(err))
// .catch(err=>next(err));

 User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{

  if(err){

    res.statusCode=500;
    res.setHeader('Content-type','application/json');
    res.json(err);

  }

  else
  {

    if(req.body.firstname) user.firstname=req.body.firstname;

    if(req.body.lastname) user.lastname=req.body.lastname;

    user.save((err,user)=>{
      if(err)
      {

    res.statusCode=500;
    res.setHeader('Content-type','application/json');
    res.json(err);

      }

      else
      {
        passport.authenticate('local') (req,res,()=>{
          res.statusCode=200;
          res.setHeader('Content-type','application/json');
        res.json({
          success:true,
          message:'Registration Successful',
          user:user
    
        })
          
        })



      }
    })
    

  }


 })

});

router.post('/login',passport.authenticate('local'),(req,res,next)=>{


  // if(!req.session.user){
  //   var authHeader=req.headers.authorization;

  //   if(!authHeader){
  //     var err=new Error("You are not authenticated");
  //     res.setHeader('WWW-Authenticate','Basic');
  //     err.status=401;
  //     next(err);
  //     return ;
  //   }



  // var auth=new Buffer.from(authHeader.split(' ')[1],'base64').
  // toString().split(':');

  // var username=auth[0];
  // var password=auth[1];

  //  User.findOne({username:username})
  //  .then((user)=>{
  //   if(user===null)
  //   {
  //     var err=new Error("User"+username+"does not exist");
  //     err.status=403;
  //     return next(err);
  //   }

  //   else if(user.password!==password){
  //     var err=new Error("Incorrect password");
  //     err.status=403;
  //     return next(err);

  //   }

  //   else if(username===user.username && password===user.password)
  //   {
  //     req.session.user='authenticated',
  //     res.statusCode=200;
  //     res.setHeader('Content-type','text/plain');
  //     res.end('You are authenticated');
  //   }
  //  },err=>next(err))
  //  .catch(err=>next(err));
  // }

  // else{
  //   res.statusCode=200;
  //   res.setHeader("Content-type",'text/plain');
  //   res.end('You are already logged in!');
  

  // }

  var token=authenticate.getToken({_id:req.user._id});



  res.statusCode=200;
  res.setHeader('Content-type','application/json');
  res.json({
    success:true,
    token:token,
    message:"Login Successful"
  })




})

router.get('/logout',(req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }

  else
  {
    var err=new Error("You are not logged in");
    err.status=403;
    return next(err);
  }

})



module.exports = router;

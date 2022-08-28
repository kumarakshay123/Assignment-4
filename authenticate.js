var passport=require('passport');

var LocalStrategy=require('passport-local').Strategy;

var JwtStrategy=require('passport-jwt').Strategy;

var ExtractJwt=require('passport-jwt').ExtractJwt;

var jwt=require('jsonwebtoken');

var config=require('./config');



var User=require('./models/users');


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());


exports.getToken=function(user){
    return jwt.sign(user,config.secretKey,{expiresIn:3600});
}


var opts={};

opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey=config.secretKey;

exports.jwtPassport=passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
    console.log("JWT Payload :",jwt_payload);
    User.findOne({_id:jwt_payload._id},(err,user)=>{
        
        
        if(err){
            return done(err,false);
        }

        else if (user)
        {
            return done(null,user);
        }

        else
        {
            return done(null,false);
        }
    })

}))



//{
exports.verifyUser=passport.authenticate('jwt',{session:false});

//}



// //

//  function verifyOrdinaryUser()
//  {
//     return passport.authenticate('jwt',{session:false});
//  }



// //

// let user=verifyOrdinaryUser();



// exports.verfiyAdmin(req.user.admin)
// {
    


//     if(req.user.admin==admin)
//     {
//         next();

//     }

//     else
//     {
//         var err=new Error("You are not authoried to perform the action");
//         err.status=403;
//         return next(err);
//     }
// }

//


exports.verifyAdmin = function(req, res, next) {
    
    
    if (!req.user.admin) {
      var err = new Error('You are not authorized to perform such actions!');
    //   err.status = 401;
    //   return next(err); // doing using json format
    res.statusCode=500;
    res.setHeader('Content-type','application/json');
    res.json({err:"You are not authorized to perform such action"});


    } else {
      return next();
    }
  };


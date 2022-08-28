var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var mongoose=require('mongoose');

var session=require('express-session');

var FileStore=require('session-file-store')(session);

var passport=require('passport');

// var authenticate=require('./authenticate');

var config=require('./config');

var dishRouter=require('./routes/dishRouter');

var leaderRouter=require('./routes/leaderRouter');

var promoRouter=require('./routes/promoRouter');

var favoriteRouter=require('./routes/favoriteRouter');

var uploadRouter=require('./routes/uploadRouter');

// var Dishes=require('./models/dishes');

const url=config.monogurl;

const connect=mongoose.connect(url);

connect.then((db)=>{

  console.log('Connected to the database');

},(err)=>{
  console.log(err);
})

var app = express();






app.use(session({


  name:'session-id',
  secret:'12345-56938-38849-38749',
  saveUninitialized:false,
  resave:false,
  store:new FileStore()

}))

app.use(passport.initialize());


app.use(passport.session());





app.use(cookieParser('12345-67890-46372-37892'));












// function auth(req,res,next){


//   // if(!req.session.user){
//   //   var err=new Error("You are not authenticated");
//   //   err.status=403;
//   //   return next(err);
//   // }

//   // else
//   // {
//   //   if(req.session.user==='authenticated'){
//   //     next();
//   //   }

//   //   else
//   //   {
//   //   var err=new Error("You are not authenticated");
//   //   err.status=403;
//   //   return next(err);

//   //   }
//   // }
//   // console.log(req.headers);
//   // var authHeader=req.headers.authorization;


//  //signedCookies
//   // if(!req.session.user){
//   //   var authHeader=req.headers.authorization;

//   //   if(!authHeader){
//   //     var err=new Error("You are not authenticated");
//   //     res.setHeader('WWW-Authenticate','Basic');
//   //     err.status=401;
//   //     next(err);
//   //     return ;
//   //   }



//   // var auth=new Buffer.from(authHeader.split(' ')[1],'base64').
//   // toString().split(':');

//   // var user=auth[0];
//   // var password=auth[1];

//   // if(user=='admin' && password=='password')
//   // {
//   //   // res.cookie('user','admin',{signed:true});
//   //   req.session.user='admin'
//   //   next();
//   // }


//   // else
//   // {
//   //   var err=new Error("You are not authenticated");
//   //   res.setHeader('WWW-Authenticate','Basic');
//   //   err.status=401;
//   //   next(err);
//   //   return ;

//   // }
    
//   // }

//   // else 
//   // {
//   //   if(req.session.user==='admin')
//   //   {
//   //     console.log(req.session.user);
//   //     next();
//   //   }

//   //   else
//   //   {
//   //   var err=new Error("You are not authenticated");
//   //   res.setHeader('WWW-Authenticate','Basic');
//   //   err.status=401;
//   //   next(err);
//   //   return ;
//   //   }
//   // }


//   // if(!authHeader){
//   //   var err=new Error("You are not authenticated");
//   //   res.setHeader('WWW-Authenticate','Basic');
//   //   err.status=401;
//   //   next(err);
//   //   return ;
//   // }

//   // var auth=new Buffer.from(authHeader.split(' ')[1],'base64').
//   // toString().split(':');

//   // var user=auth[0];
//   // var password=auth[1];

//   // if(user=='admin' && password=='password')
//   // {
//   //   next();
//   // }


//   // else
//   // {
//   //   var err=new Error("You are not authenticated");
//   //   res.setHeader('WWW-Authenticate','Basic');
//   //   err.status=401;
//   //   next(err);
//   //   return ;

//   // }



//   if(req.user){

//     next();


//   }
//   else
//   {
//     var err=new Error('You are authenticated');
//     err.status=403;
//     next(err);


//   }





// }





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all('*',(req,res,next)=>{
  if(req.secure){
    return next();
  }

  else
  {
    res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
  }
})


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/imageUpload',uploadRouter);

// app.use(auth);


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/favorites',favoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

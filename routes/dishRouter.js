

const express= require('express');

const mongoose=require('mongoose');


const authenticate=require('../authenticate');

const cors=require('./cors');

const Dishes=require('../models/dishes');

const router=express.Router();


router.route('/')

// .all((req,res,next)=>{

//     res.statusCode=200;
//     res.setHeader('Content-type','application/json');
//     next();

// })

.options(cors.corsWithOptions,(req,res)=>{res.statusCode=200})



.get(cors.cors,(req,res,next)=>{
    // res.end("Sending all  the dishes to you");

    Dishes.find({}).populate('comments.author').then((dishes)=>{

        
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);


    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})


.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    // res.end("Creating  a dish for you");

    Dishes.create(req.body)
    .then((dish)=>{
        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(dish);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})

.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.end('Not supported on ' + ' /dishes');
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    // res.end("Delete all the dishes on the server");

    Dishes.deleteMany({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(resp);
    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
});


// second section dishid

router.route('/:dishid') 

// .all((req,res,next)=>{

//     res.statusCode=200;
//     res.setHeader('Content-type','application/json');
//     next();

// })


.get(cors.cors,(req,res,next)=>{
    // res.end("Will get dish with id"+req.params.dishid);

    Dishes.findById(req.params.dishid).populate('comments.author').
    then((dish)=>{

        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(dish);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });

})


.post(authenticate.verifyUser,(req,res,next)=>{
    res.end("Post not supported on /dishes/:dishid");
})


.put(authenticate.verifyUser,(req,res,next)=>{
    // res.end("updating the dish with  id " + req.params.dishid);

    Dishes.findByIdAndUpdate(req.params.dishid,{$set:req.body},{new:true})
    .then((dish)=>{

        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(dish);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });

})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end("deleting the dish with  id " + req.params.dishid);

    Dishes.findByIdAndDelete(req.params.dishid)
    .then((resp)=>{

        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(resp);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });

})


// router.route('/:dishid/comments')


// .get((req,res,next)=>{
//     Dishes.findById(req.params.dishid)
//     .then((dish)=>{
//         if(dish!=null)
//         {
//             res.statusCode=200;
//             res.setHeader('Content-type','application/json');
//             res.json(dish.comments);
//         }

//         else
//         {
//             err =new Error('Dish'+req.params.dishid+'notfound');

//             err.status=404;

//             return next(err);

//         }

    

//     }, (err)=>next(err))
//     .catch((err)=>next(err));
//     })

//     .post((req,res,next)=>{
//         Dishes.findById(req.params.dishid)
//         .then((dish)=>{
//             if(dish!=null)
//             {
//                 dish.comments.push(req.body);
//                 dish.save()
//                 .then((dish)=>{
//                     res.statusCode=200;
//             res.setHeader('Content-type','application/json');
//             res.json(dish.comments);
//                 },(err)=>next(err));
//             }

//             else
//             {

//                 err= new Error('Dish' + req.params.dishid+'not found');
//                 err.status=404;
//                 return next(err);

//             }
            
//         },(err)=>next(err))
//             .catch((err)=>next(err));
//     })


//   .put((req,res,next)=>{
//     res.statusCode=404;
//     res.end('PUT not supported on '+'/dishes'+req.params.dishid+'/comments')

//   })

//   .delete((req,res,next)=>{PUT
//     Dishes.findById(req.params.dishid)
//     .then((dish)=>{
//         if(dish!=null)
//         {

//             for(var i=(dish.comments.length-1);i>=0;i--)
//             {
//                 dish.comments.id(dish.comments[i]._id).remove();
//             }

//             dish.save()
//             .then((dish)=>{
//                 res.statusCode=200;
//             res.setHeader('Content-type','application/json');
//             res.json(dish);
//             })

//         }

//         else
//         {
//             err= new Error('Dish' + req.params.dishid+'not found');
//                 err.status=404;
//                 return next(err);
//         }
//     },(err)=>next(err))
//         .catch((err)=>next(err));
  
//   })



router.route('/:dishid/comments')

.get(cors.cors,(req,res,next) => {

    Dishes.findById(req.params.dishid).populate('comments.author')
    .then((dish) => {
    if (dish != null) 
    {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish.comments);
    }
    else {
   err = new Error('Dish ' + req.params.dishid + ' not found');
   err.status = 404;
   return next(err);
}


}, (err) => next(err))
.catch((err) => next(err));
})



.post(authenticate.verifyUser,(req, res, next) => {

    Dishes.findById(req.params.dishid)
    .then((dish) => {
    if (dish != null) 
    {
    req.body.author=req.user._id

    dish.comments.push(req.body);



    dish.save()
   .then((dish) => {
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'application/json');
    // res.json(dish);

    Dishes.findById(dish._id)
    .populate('comments.author')
    .then((dish)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish);

    })
    }, (err) => next(err));

    }

    else 
    {
    err = new Error('Dish ' + req.params.dishid + ' not found');
    err.status = 404;
   return next(err);
    }


}, (err) => next(err))
.catch((err) => next(err));
})








.put(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
   res.end('PUT operation not supported on /dishes/'+ req.params.dishid + '/comments');
})

.delete(authenticate.verifyUser,(req, res, next) => {
  Dishes.findById(req.params.dishid)
 .then((dish) => {
  if (dish != null) 
  {
  for (var i = (dish.comments.length -1); i >= 0; i--) 
  {
  dish.comments.id(dish.comments[i]._id).remove();
  }

  dish.save()
  .then((dish) => {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'application/json');
   res.json(dish);
}, (err) => next(err));

}

else 
{
err = new Error('Dish ' + req.params.dishid + ' not found');
err.status = 404;
return next(err);
}

}, (err) => next(err))
.catch((err) => next(err));

});




router.route('/:dishid/comments/:commentId')

  // get request
  .get(cors.cors,(req,res,next) => {
   Dishes.findById(req.params.dishid)
  .then((dish) => {
   if (dish != null && dish.comments.id(req.params.commentId) != null) {
   res.statusCode = 200;
   res.setHeader('Content-Type', 'application/json');
   res.json(dish.comments.id(req.params.commentId));
}

 else if (dish == null) 
  {
  err = new Error('Dish ' + req.params.dishid + ' not found');
  err.status = 404;
  return next(err);
  }

else 
{
err = new Error('Comment ' + req.params.commentId + ' not found');
err.status = 404;
return next(err);
}


}, (err) => next(err))
.catch((err) => next(err));
})


//post request

.post(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishid + '/comments/' + req.params.commentId);
})


// put request
  
.put(authenticate.verifyUser,(req, res, next) => {
   Dishes.findById(req.params.dishid)
  .then((dish) => {

  if (dish != null && dish.comments.id(req.params.commentId) != null) {
  if (req.body.rating) {
  dish.comments.id(req.params.commentId).rating =
  req.body.rating;
}

if (req.body.comment) 
{
dish.comments.id(req.params.commentId).comment =
req.body.comment;
}


dish.save()
.then((dish) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish);
}, (err) => next(err));

}


  else if (dish == null)
  {
  err = new Error('Dish ' + req.params.dishid + ' not found');
  err.status = 404;
  return next(err);
  }


  else 
  {
  err = new Error('Comment ' + req.params.commentId + ' not found');

  err.status = 404;
  return next(err);

  }

}, (err) => next(err))
.catch((err) => next(err));
})


// delete request 
 .delete(authenticate.verifyUser,(req, res, next) => {
  Dishes.findById(req.params.dishid)
  .then((dish) => {
  if (dish != null && dish.comments.id(req.params.commentId) != null) {
  dish.comments.id(req.params.commentId).remove();
  dish.save()
  .then((dish) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(dish);
}, (err) => next(err));
}
else if (dish == null)
 {
  err = new Error('Dish ' + req.params.dishid + ' not found');
  err.status = 404;
  return next(err);
 }


else {
err = new Error('Comment ' + req.params.commentId + ' not found');
err.status = 404;
return next(err);
}
}, (err) => next(err))
.catch((err) => next(err));
});



module.exports=router;










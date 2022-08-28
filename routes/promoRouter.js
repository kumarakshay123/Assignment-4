

const express= require('express');

const mongoose=require('mongoose');


const authenticate=require('../authenticate');



const Promotions=require('../models/promotions');

const router=express.Router();


router.route('/')



.get((req,res,next)=>{
    // res.end("Sending all  the promotions to you");

    Promotions.find({}).then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);


    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})


.post(authenticate.verifyUser,(req,res,next)=>{
    // res.end("Creating  a promotion for you");

    Promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(promotion);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.end('Not supported on ' + ' /promotions');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end("Delete all the promotions on the server");

    Promotions.deleteMany({})
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


// second section leaderId

router.route('/:promoId') 

// .all((req,res,next)=>{

//     res.statusCode=200;
//     res.setHeader('Content-type','application/json');
//     next();

// })


.get((req,res,next)=>{
    // res.end("Will get leader with id"+req.params.leaderId);

    Promotions.findById(req.params.promoId)
    .then((promotion)=>{

        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(promotion);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });

})


.post(authenticate.verifyUser,(req,res,next)=>{
    res.end("Post not supported on /promotions/:promoId");
})


.put(authenticate.verifyUser,(req,res,next)=>{
    // res.end("updating the promotions with  id " + req.params.promoId);

    Promotions.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true})
    .then((promotion)=>{

        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(promotion);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });

})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end("deleting the promotion with  id " + req.params.promoId);

    Promotions.findByIdAndDelete(req.params.promoId)
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

// .all((req,res,next)=>{

//     res.statusCode=200;
//     res.setHeader('Content-type','application/json');
//     next();

// })




// .get((req,res,next)=>{
//     res.end("will get promotion");
// })


// .post((req,res,next)=>{
//     res.end(" Create a promotion");
// })


// .put((req,res,next)=>{
//     res.end('Not supported on ' + ' /promotions');
// })

// .delete((req,res,next)=>{
//     res.end("Delete all the promotions on the server");
// });


// second section dishid

// router.route('/:promoId') 

// .all((req,res,next)=>{

//     res.statusCode=200;
//     res.setHeader('Content-type','application/json');
//     next();

// })


// .get((req,res,next)=>{
//     res.end("Will get promo with id"+req.params.promoId);
// })


// .post((req,res,next)=>{
//     res.end("Post not supported on /promotions/:promoid");
// })


// .put((req,res,next)=>{
//     res.end("updating the promotion with  id " + req.params.promoId);
// })

// .delete((req,res,next)=>{
//     res.end("deleting the promotion with  id " + req.params.promoId);
// })


module.exports=router;


















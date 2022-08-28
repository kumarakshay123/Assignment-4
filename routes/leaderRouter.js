

const express= require('express');

const mongoose=require('mongoose');


const authenticate=require('../authenticate');

const Leaders=require('../models/leaders');

const router=express.Router();


router.route('/')







.get((req,res,next)=>{
    // res.end("Sending all  the leadesrs to you");

    Leaders.find({}).then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);


    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})


.post(authenticate.verifyUser,(req,res,next)=>{
    // res.end("Creating  a leader for you");

    Leaders.create(req.body)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(leader);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.end('Not supported on ' + ' /leaders');
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end("Delete all the leaders on the server");

    Leaders.deleteMany({})
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

router.route('/:leaderId') 

// .all((req,res,next)=>{

//     res.statusCode=200;
//     res.setHeader('Content-type','application/json');
//     next();

// })


.get((req,res,next)=>{
    // res.end("Will get leader with id"+req.params.leaderId);

    Leaders.findById(req.params.leaderId)
    .then((leader)=>{

        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(leader);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });

})


.post(authenticate.verifyUser,(req,res,next)=>{
    res.end("Post not supported on /leaders/:leaderId");
})


.put(authenticate.verifyUser,(req,res,next)=>{
    // res.end("updating the leader with  id " + req.params.leaderId);

    Leaders.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true})
    .then((leader)=>{

        res.statusCode=200;
        res.setHeader("content-type","application/json");
        res.json(leader);

    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });

})

.delete(authenticate.verifyUser,(req,res,next)=>{
    // res.end("deleting the leader with  id " + req.params.leaderid);

    Leaders.findByIdAndDelete(req.params.leaderId)
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
//     res.end("get  the leaders to you");
// })

// .post((req,res,next)=>{
//     res.end("Creating  a leader for you");
// })


// .put((req,res,next)=>{
//     res.end('Not supported on ' + ' /leaders');
// })

// .delete((req,res,next)=>{
//     res.end("Delete all the leaders on the server");
// });




// second section dishid

// router.route('/:leaderId') 

// .all((req,res,next)=>{

//     res.statusCode=200;
//     res.setHeader('Content-type','application/json');
//     next();

// })

// .get((req,res,next)=>{
//     res.end("get leader  with id"+req.params.leaderId);
// })


// .post((req,res,next)=>{
//     res.end("Post not supported on /dishes/:dishid");
// })


// .put((req,res,next)=>{
//     res.end("updating the leader with  id " + req.params.leaderId);
// })

// .delete((req,res,next)=>{
//     res.end("deleting the leader with  id " + req.params.leaderId);
// })


module.exports=router;










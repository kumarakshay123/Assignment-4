const express = require('express');

const mongoose = require('mongoose');



const authenticate=require('../authenticate');

const Favorites = require('../models/favorites');




const router = express.Router();


router.route('/')

.get( authenticate.verifyUser, (req, res, next)=> {
    Favorites.find({"author": req.user._id})  
        .populate('author')
        .populate('dishes')
        .exec(function (err, favs) {
        if (err) 
        throw err;
         
        res.json(favs);
    });
})

.post( authenticate.verifyUser, (req, res, next)=>{
    Favorites.findOne({"author":req.user._id }, function (err, favs) { 
        if(!favs){

            
                 Favorites.create(null,function (err, favs) {
                    if (err)
                    throw err;

                    favs.author= req.user._id; 
                    for(var i=0;i<req.body.length;i++)
                    favs.dishes.push(req.body[i]._id);

                     favs.save(function (err, favs) {
                        if (err)
                        throw err;
                        res.json(favs);
                    }); 
                  }); 

          

        } else{
              

            for(var i=0;i<req.body.length;i++)
            {
              var index= favs.dishes.indexOf(req.body[i]._id);
              if(index > -1){
                 continue;
              }else{
              favs.dishes.push(req.body[i]._id);
              }
            }
                favs.save(function (err, favs) {
                  if (err) 
                  throw err;

                  res.json(favs);
                 });
              } 
    });  
})

.delete(authenticate.verifyUser, (req, res, next)=>{
    Favorites.remove({"author":req.user._id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.route('/:favsId')



.post( authenticate.verifyUser, function (req, res, next){
    Favorites.findOne({"author":req.user._id }, function (err, favs) { 
        if(!favs){
                 Favorites.create(req.params,function (err, favs) {
                    if (err) 
                    throw err;

                    favs.author= req.user._id; 
                    favs.dishes.push(req.params.favsId);
                     favs.save(function (err, favs) {
                        if (err)
                        throw err;
                        res.json(favs);
                    }); 
                  }); 

        }
        
        
        else{
              
              var index = favs.dishes.indexOf(req.params.favsId);

              if(index > -1){
                 var err = new Error('This dish exists already in  your dish favorite list');
                 err.status = 401;
                return next(err);
              }
              
              else{
              favs.dishes.push(req.params.favsId);
                favs.save(function (err, favs) {
                  if (err) 
                  throw err;
                 res.json(favs);
                 });
              }
              } 
    });  
})







.delete(authenticate.verifyUser, (req, res, next)=>{
    Favorites.findOne({"author": req.user._id}, function (err, favs) {
        if (err)
        throw err;

        if (favs) {
            var index = favs.dishes.indexOf(req.params.favsId);
            if (index > -1) {
                favs.dishes.splice(index, 1);
            }
            favs.save(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
        } 
        
        
        else {
            var err = new Error('There\' no Favorites');
            err.status = 401;
            return next(err);
        }
    });
});



module.exports = router;
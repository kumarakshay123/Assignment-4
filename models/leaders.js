const mongoose=require('mongoose');
require('mongoose-currency').loadType(mongoose);


// const Currency=mongoose.Types.Currency;

const Schema=mongoose.Schema;



const leaderSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },

    image:{
        type:String,
        required:true

    },

    designation:{
        type:String,
        required:true

    },

    

    abbr:{
        type:String,
        required:true

    },

    description:{
        type:String,
        required:true

    },

    // price:{
    //     type:Currency,
    //     required:true,
    //     min:0

    // },


    featured:{
        type:Boolean,
        required:false

    },


},{
 
    timestamps:true

});

const Leaders=mongoose.model('Leader',leaderSchema);

module.exports=Leaders;
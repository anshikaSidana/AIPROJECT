const Mongoose =  require('mongoose');
const Rate = require('./review.js')

const pro =  new Mongoose.Schema({
    title:{
        type:String,
    },

    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    image:{
        type:String,
    },

    review: [{
        type: Mongoose.Schema.Types.ObjectId,
        ref: Rate,
    }] ,


    username:{
        type:String,
    }
})

const product =  new Mongoose.model('product',pro);

module.exports = product;
const mongoose = require('mongoose');
const reviewSchema  = new mongoose.Schema({
    content:{
        type:String,
    },

    rating:{
        type :Number,
        min:1,
        max:5,
    },

    createdAt:{
        type :Date,
        default:Date.now(),
    },

    author:{
        type:String,
        required:true,
    },

    isFake: {
        type: Boolean,
        default: false
    }
})

const Rate = mongoose.model('Rate',reviewSchema);

module.exports = Rate;
const mongoose = require('mongoose');
const passportlocalmongoose =  require('passport-local-mongoose');
const Userschema  =  new mongoose.Schema({
    email :{
        type:String,
        required:true
    }
})

Userschema.plugin(passportlocalmongoose);

const User = mongoose.model('User',Userschema);

module.exports = User;

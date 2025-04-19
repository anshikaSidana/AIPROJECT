require('dotenv').config();
const mongoose = require('mongoose');
const data =  require('./list')


const connectDB = ()=>{
    async function main(){
        await mongoose.connect(process.env.MONGOURL);
    }
    main()
    .then(async ()=>{
        console.log("connection successful");
    })
    .catch((err)=>{
        console.log("ERROR IS : "+err);
    })
}

module.exports =connectDB;
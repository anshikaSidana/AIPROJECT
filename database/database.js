require('dotenv').config();
const mongoose = require('mongoose');
const data =  require('./list')


const connectDB = ()=>{
    async function main(){
        mongoose.connect(process.env.MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true
          })
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
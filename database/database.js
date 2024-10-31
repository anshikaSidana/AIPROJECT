const mongoose = require('mongoose');
const product = require('../model/product')
const data =  require('./list')


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/products');
}
main()
.then(async ()=>{
    console.log("connection successful");
    await product.deleteMany({});
    await product.insertMany(data);
})
.then(()=>{
    console.log("data is inserted..")
})
.catch((err)=>{
    console.log("ERROR IS : "+err);
})

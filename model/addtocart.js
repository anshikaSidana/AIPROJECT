const mongoose = require('mongoose');
const Product  =  require('./product')

const userCartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId,
         ref: Product },
    quantity: { type: Number, default: 1 }
  }]
});

module.exports = mongoose.model('UserCart', userCartSchema);

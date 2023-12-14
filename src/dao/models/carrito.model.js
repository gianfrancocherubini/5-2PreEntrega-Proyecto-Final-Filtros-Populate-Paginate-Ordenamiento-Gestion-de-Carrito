const mongoose = require('mongoose');

const cartsColeccion = 'carts';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
}, {
  timestamps: true, 
  strict: false,    
});

const Cart = mongoose.model(cartsColeccion, cartSchema);

module.exports = Cart;
const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const productsColeccion = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnails: {
        type: [String], 
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    category: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true, 
    strict: false 
});

productSchema.plugin(paginate)

const ProductEsquema = mongoose.model('products', productSchema);

module.exports = ProductEsquema;
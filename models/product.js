const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    product_Name: {
        type: String,
        required: true
    },

    sku_Id: {
        type: Number,
        required: true,
        unique: true
    },

    category: {
        type: String,
        required: true,
    },

    sub_category: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true
    },
});


const Product = mongoose.model('Product', productSchema);
module.exports = Product;
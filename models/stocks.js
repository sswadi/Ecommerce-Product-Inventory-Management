const mongoose = require('mongoose');
const Warehouse = require('./warehouse');
const Product = require('./product');

const stockSchema = new mongoose.Schema({

    sku_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
        
    },

    warehouse_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Warehouse,
        
    },

    stock_quantity: {
        type: Number,
        required: true
    },

});




const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
const mongoose = require('mongoose');
const State = require('./states');

const warehouseSchema = new mongoose.Schema({

    warehouse_Id: {
        type: String,
        required: true,
        unique: true
    },

    warehouse_Name: {
        type: String,
        required: true
    },

    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: State,
        required: true,
    },

    loca_tion: {
        type: String,
        required: true
    },

    stockLimit: {
        type: Number,
        default: Infinity,  
    },

    currQty: {
        type: Number,
        default: Infinity, 
    }
});


const Warehouse = mongoose.model('Warehouse', warehouseSchema);
module.exports = Warehouse;

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    cust_Id: {
        type: String,
        required: true,
        unique: true,
    },
    cust_Name: {
        type: String,
        required: true,
    },
    cust_Location: {
        type: String,
        required: true,
    },

});




const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
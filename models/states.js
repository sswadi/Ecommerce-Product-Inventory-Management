const mongoose = require('mongoose');
const Warehouse = require('./warehouse');

const indianStates = ['ANDHRA_PRADESH','ARUNACHAL_PRADESH','ASSAM','BIHAR','CHHATTISGARH','GOA','GUJARAT','HARYANA','HIMACHAL_PRADESH','JHARKHAND','KARNATAKA','KERALA','MADHYA_PRADESH','MAHARASHTRA','MANIPUR','MEGHALAYA','MIZORAM','NAGALAND','ODISHA','PUNJAB','RAJASTHAN','SIKKIM','TAMIL NADU','TELANGANA','TRIPURA','UTTAR_PRADESH','UTTARAKHAND','WEST_BENGAL'];

const stateSchema = new mongoose.Schema({
  stateName: { 
    type: String, 
    required: true, 
    enum: indianStates
  },

  state_id : {
    type: String,
    required: true,
    unique: true
  }
  
});


const State = mongoose.model('State', stateSchema);
module.exports = State;

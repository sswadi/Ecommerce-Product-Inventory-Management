const mongoose = require('mongoose');//importing mongoose

mongoose.connect('mongodb://localhost/Ecom_Inventory_Management');

const db = mongoose.connection; //creating an instance(db)


db.on('error', console.error.bind(console, "Error connecting to DB")); //failure

//on connecting successfuly
db.once('open', function(){
    console.log('Connected to db : MongoDB');
});

module.exports = db;
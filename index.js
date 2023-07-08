const express = require('express');
const port = 8000;
const db = require('./config/mongoose');
const readline = require('readline');
const func = require('./assets/repl');


const app = express();

// Function to start the command line REPL
function startRepl() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> ',
    });
  
    rl.prompt();
  
    rl.on('line', async (line) => {
      // const args = line.trim().split(/(?<!\[.*),(?![^\[]*\])/).map((input) => input.trim());
      const args = line.trim().split(" ");
      const command = args[0].toUpperCase();

      switch (command) {
        case 'ADD':
          const subCommand = args[1].toUpperCase();
          switch (subCommand) {
            case 'PRODUCT':
              const productName = args[2];
              const skuId = parseInt(args[3]);
              const category = args[4];
              const subCategory = args[5];
              const imageLink = args[6];
              await func.addProduct(productName, skuId, category, subCategory, imageLink);
              break;
              
            case 'WAREHOUSE':
              const warehouseName = args[3].trim();
              const state = args[4];
              // const location1 = args[5].slice(1, -1).split(',');
              // const location2 = args[6].slice(1, -1).split(',');
              let location = args[5]; 
              const stockLimit = args[6] ? parseInt(args[6]) : Infinity;
              await func.addWarehouse( warehouseName, state, location, stockLimit);
              break;

            case 'STATE':
              const newState = args[2];
              await func.addState(newState);
              break;

            case 'STOCK':
              const sku = parseInt(args[2]);
              const warehouseNumberStock = args[3];
              const quantity = parseInt(args[4]);
              await func.addStock(sku, warehouseNumberStock, quantity);
              break;

            case 'CUSTOMER':
              const customerId = args[2];
              const customerName = args[3];
              const customerLocation = args[4];
              await func.addCustomer(customerId, customerName, customerLocation);
              break;

            default:
              console.log('Invalid command');
              break;
          }

        case 'VIEW':
          const subCommand2 = args[1].toUpperCase();
          switch (subCommand2) {

            case 'STATE':
              const state = args[2];
              await func.viewState(state);
              break;

          }
        case 'PROCESS':
          const subCommand3 = args[1].toUpperCase();
          switch (subCommand3) {

            case 'ORDER':
              const customerId = args[2];
              const sku = args[3];
              const orderQty = args[4];
              const customerLocation = args[5];
              await func.processOrder(customerId, sku, orderQty, customerLocation);
              break;
 
          }

        case 'LIST':
          const subCommand4 = args[1].toUpperCase();
          switch (subCommand4) {

            case 'PRODUCTS':
              await func.listProducts();
              break;  

            case 'WAREHOUSES':
              await func.listWarehouses();
              break;
          } 
          
        case 'WAREHOUSE':
          const subCommand5 = args[1].toUpperCase();
          switch(subCommand5){
            
            case 'INFO':
            const warehouseID = args[2];
            await func.warehouseInfo(warehouseID);
            break;
          } 
      }
      rl.prompt();
    
    }).on('close', () => {
      console.log('Exiting the program');
      process.exit(0);
    });
}

startRepl();

app.listen(port, function(err){
    if(err){
        console.log('Error connecting to the server! Try again');
    }else{
        console.log(`Successfully connected to the server at port : ${port}`);
    }
})





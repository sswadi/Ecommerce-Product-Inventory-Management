
const Product = require('../models/product');
const Warehouse = require('../models/warehouse');
const Stock = require('../models/stocks');
const State = require('../models/states');
const Customer = require('../models/customer');


// Function to add a product
async function addProduct(productName, skuId, category, subCategory, imageLink) {
  
  const product = new Product({
    product_Name: productName,
    sku_Id: skuId,
    category: category,
    sub_category: subCategory,
    image: imageLink,
  });

  try {
    await product.save();
    console.log('Product added:', product._id);
  } catch (err) {
    console.error('Error adding product: /n', err.message);
  }
}

// Function to add a warehouse
async function addWarehouse( warehouseName, state, location, stockLimit) {

  let placeId = state.slice(0, 2).toUpperCase();
  let stateObj = await State.findOne({state_id: placeId });

  if(!stateObj){
    console.log("The entered state is either wrong or has not been registered yet. Enter again or register the state by the following command -> ADD STATE StateName ");
    return;
  }
     //generating warehouse#
    let randomNum = Math.floor(1000 + Math.random() * 9000);
    let warehouseNumber = stateObj.state_id + randomNum.toString();

    const warehouse = new Warehouse({
      warehouse_Id: warehouseNumber,
      warehouse_Name: warehouseName,
      state: stateObj._id,
      loca_tion: location,
      stockLimit: stockLimit,
      currQty: stockLimit
    });

    try {
      await warehouse.save();
      console.log('Warehouse added:', warehouse._id);

    } catch (err) {
      console.error('Error adding warehouse: /n', err.message);
    }
  
}

// Function to add stock
async function addStock(sku, warehouseNumberStock, quantity) {

  const warehouse = await Warehouse.findOne({ warehouse_Id: warehouseNumberStock });
  const product_sku = await Product.findOne({sku_Id : sku});

  if (!warehouse) {
    console.log('Warehouse not found! Either incorrect warehouse number or it does not exist.');
    return;
  }

  if(!product_sku){
    console.log('Product not found! Either incorrect sku number or it does not exist. ');
    return;
  }

  if (quantity > warehouse.currQty) {
    console.log('Warning: Stock limit exceeded');
    quantity = warehouse.currQty;
  }

  const stock = new Stock({
    sku_Id: product_sku._id,
    warehouse_Id: warehouse._id,
    stock_quantity: quantity,
  });

  try {
    await stock.save();
    console.log('Stock added:', stock._id);
  } catch (err) {
    console.error('Error adding stock:', err.message);
  }

  //trying to update the same changes in warehouse schema : As stock is added, then currQty should also get updated
  var currentQuantity = Math.abs(warehouse.currQty-quantity);

  const result = await Warehouse.findOneAndUpdate(
    { _id: warehouse._id },
    { $set: { currQty: currentQuantity } }
  );
 
}

// Function to add a state
async function addState(newState) {

  let stateName = newState.toUpperCase();
  let stateId = newState.slice(0, 2).toUpperCase();

  const state = new State({
    state_id: stateId,
    stateName: stateName,
  });

  try {
    await state.save();
    console.log('State added:', state._id);
  } catch (err) {
    console.error('Error adding state:', err.message);
  }
}

async function viewState(state) {

  let stateObj = await State.findOne({stateName: state});

  if(!stateObj){
    console.log("Incorrect state name");
  }

  let stateCode = stateObj.state_id;

  let warehouses = await Warehouse.find({ state: stateObj }).populate('state');
  console.log('Warehouse State Code:', stateCode);
  // Access the state information for each warehouse
  warehouses.forEach((warehouse) => {
    console.log('Warehouse City:', warehouse.loca_tion);
    console.log('Warehouse#:', warehouse.warehouse_Id);
    console.log('Total Capacity', warehouse.stockLimit);
    console.log('Available Quantity: ', warehouse.currQty);
  });  

}

async function listProducts() {
  try {
    // Find all products
    const products = await Product.find();

    // Iterate over each product
    for (const product of products) {
      // Find the stock entries for the current product
      const stockEntries = await Stock.find({ sku_Id: product._id }).populate('warehouse_Id');

      console.log('Product Name:', product.product_Name);
      console.log('Current Stock Quantity:', stockEntries.length);

      // Iterate over each stock entry
      for (const stockEntry of stockEntries) {

        console.log('Warehouse Name:', stockEntry.warehouse_Id.warehouse_Name);
        console.log('Location:', stockEntry.warehouse_Id.loca_tion);
        console.log('Stock Quantity:', stockEntry.stock_quantity);
        console.log('------------------------');
      }

      console.log('========================');
    }
  } catch (error) {
    console.error('Error listing products:', error);
  }
}

async function listWarehouses() {
  try {
    // Find all warehouses and populate the state field
    const warehouses = await Warehouse.find().populate('state');

    // Iterate over each warehouse
    for (const warehouse of warehouses) {
      console.log('Warehouse ID:', warehouse.warehouse_Id);
      console.log('State:', warehouse.state.stateName);
      console.log('Location:', warehouse.loca_tion);
      console.log('------------------------');
    }
  } catch (error) {
    console.error('Error listing warehouses:', error);
  }
}


async function warehouseInfo(warehouseId) {
  try {
    // Find the warehouse based on the given warehouse ID
    const warehouse = await Warehouse.findOne({ warehouse_Id: warehouseId }).populate('state');
    
    if (!warehouse) {
      console.log('Warehouse not found');
      return;
    }

    console.log('Warehouse ID:', warehouse.warehouse_Id);
    console.log('State:', warehouse.state.stateName);
    console.log('Location:', warehouse.loca_tion);

    // Find all stock entries in the warehouse
    const stockEntries = await Stock.find({ warehouse_Id: warehouse._id }).populate('sku_Id');

    console.log('Available SKUs:');

    // Iterate over each stock entry
    for (const stockEntry of stockEntries) {
      console.log('SKU ID:', stockEntry.sku_Id.sku_Id);
      console.log('Stock Quantity:', stockEntry.stock_quantity);
      console.log('------------------------');
    }

    console.log('Available Storage:', warehouse.stockLimit);
  } catch (error) {
    console.error('Error retrieving warehouse information:', error);
  }
}

async function processOrder(customerId, sku, orderQty, customerLocation) {
  try {
    // Find the customer based on the provided customer ID
    const customer = await Customer.findOne({ cust_Id: customerId });

    if (!customer) {
      console.log('Customer not found');
      return;
    }

    // Find the nearest warehouse to the customer location
    const nearestWarehouse = await Warehouse.findOne({
      loca_tion: customerLocation,
    }).sort({ currQty: -1 });

    if (!nearestWarehouse) {
      console.log('No warehouse found near the customer location');
      return;
    }

    const skuu = Product.findOne({sku_Id: sku});
    // const whID = Product.findOne({sku_Id: sku});

    // Find the stock entry for the requested SKU in the nearest warehouse
    // const stockEntry = await Stock.findOne({
    //   sku_Id: skuu._id,
    //   warehouse_Id: nearestWarehouse._id,
    // });

    console.log(skuu.populate('sku_Id'));
    console.log("--------------");
    console.log(nearestWarehouse);
    // if (!stockEntry || stockEntry.stock_quantity < orderQty) {
    //   console.log('Out of stock');
    //   return;
    // }

    // console.log('Order processed successfully');
    // console.log('Customer ID:', customer.cust_Id);
    // console.log('SKU:', sku);
    // console.log('Order Quantity:', orderQty);
    // console.log('Customer Location:', customerLocation);
    // console.log('Warehouse ID:', nearestWarehouse.warehouse_Id);
    // console.log('Warehouse Location:', nearestWarehouse.loca_tion);

  } catch (error) {
    console.error('Error processing order:', error);
  }
}

async function addCustomer(customerId, customerName, customerLocation) {
  try {
    // Create a new customer instance
    const customer = new Customer({
      cust_Id: customerId,
      cust_Name: customerName,
      cust_Location: customerLocation,
    });

    // Save the customer to the database
    await customer.save();

    console.log('Customer added successfully');
  } catch (error) {
    console.error('Error adding customer:', error);
  }
}



module.exports = {
  addProduct,
  addWarehouse,
  addStock,
  addState,
  viewState,
  listProducts,
  listWarehouses,
  warehouseInfo,
  processOrder,
  addCustomer,
  
};




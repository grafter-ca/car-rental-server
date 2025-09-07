const Product = require("../models/Product");
const insertDocument = require("../utils/insertDocument");

const newProduct = {
  name: "Car Rental",
  price: 2000,
  description: "One day rental",
};

insertDocument(Product, newProduct)
  .then(doc => console.log("Product inserted:", doc))
  .catch(err => console.error(err));

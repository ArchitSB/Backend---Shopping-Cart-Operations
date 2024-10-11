const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

app.use(express.static('static'));

let cart = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 }
];

function addItemToCart(productId,name,price,quantity){
  let existingItem = cart.find(item => item.productId === productId);

  if (!existingItem) {
    cart.push({
      productId,
      name,
      price,
      quantity
    });
  } 
}
app.get('/cart/add', (req, res) => {
  let productId = req.query.productId;
  let name = req.query.name;
  let price = req.query.price;
  let quantity = req.query.quantity;
  addItemToCart(productId,name,price,quantity);
  res.json({cartItems: cart});
});

function updateCartByProductId(cart, productId, quantity){
  for(let i=0; i<cart.length;i++){
    if(cart[i].productId === productId){
      cart[i].quantity = quantity;
      break;
    }
  }
  return cart;
}
app.get('/cart/edit', (req,res) => {
  let productId = parseInt(req.query.productId);
  let quantity = parseInt(req.query.quantity);
  let result = updateCartByProductId(cart, productId, quantity);
  cart = result;
  res.json({cartItems: cart});
});

function removeCartItems(productId, item){
  return item.productId !== productId;
}
app.get('/cart/delete', (req,res) => {
  let productId = parseInt(req.query.productId);
  let result = cart.filter(item => removeCartItems(productId, item));
  cart = result;
  res.json({cartItems: cart})
});

app.get('/cart', (req,res) => {
  res.json({cartItems: cart});
});

function totalQuantity(total){
  for(let i=0;i<cart.length; i++){
    total+=cart[i].quantity;
  }
  return total;
}
app.get('/cart/total-quantity', (req,res) => {
  let total = 0;
  let quantity = totalQuantity(total);
  res.json({'totalQuantity': quantity});
});

function totalPrice(total){
  for(let i=0;i<cart.length; i++){
    total+=cart[i].quantity*(cart[i].price);
  }
  return total;
}
app.get('/cart/total-price', (req,res) => {
  let total = 0;
  let price = totalPrice(total);
  res.json({'totalPrice': price});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

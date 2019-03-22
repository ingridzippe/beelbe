"use strict";

var express = require('express');
var app = express();
var path = require('path');
const https = require('https');
const http = require('http');
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// import stripePackage from 'stripe';
// const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

var products = require('./products.json');
console.log(typeof products);
console.log(products["1"]);
console.log(products["2"]);

// var products = JSON.parse(productsraw);

var exphbs = require('express-handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
  if(!products) {
    res.json({'err': 'no products here'});
  } else {
    res.render('products', { 
      products: products,
      encodedJson : encodeURIComponent(JSON.stringify(products)) 
    })
  }
});

app.get('/productpage/:pid', function(req, res, next) {
  console.log("log product id");
  console.log(req.params.pid);
  var pid = req.params.pid
  var thisproduct = products[pid.toString()];
  console.log(thisproduct);
  var datakey = process.env.STRIPE_DATA_KEY;
  console.log(datakey);
  var mydatakey = process.env.MY_STRIPE_DATA_KEY;
  res.render('individualproduct', {product: thisproduct, datakey: datakey, mydatakey: mydatakey});
})

app.post('/checkout', (req, res, next) => {
  console.log("arrived");
  console.log(req.body);
  console.log("checkout token");
  console.log(req.body.stripeToken);
  const token = req.body.stripeToken; // Using Express
  const charge = stripe.charges.create({
    amount: 120,
    currency: 'usd',
    description: 'Merch Payments',
    source: token,
  });
  res.render('checkout');
})
app.get('/paysuccess', function(req, res) {
  res.render('index', {

  });
});
app.get('/charge', function(req, res) {
  res.render('index', {

  });
});



var port = process.env.PORT || 8080;
app.listen(port);
console.log('Express started. Listening on port %s', port);

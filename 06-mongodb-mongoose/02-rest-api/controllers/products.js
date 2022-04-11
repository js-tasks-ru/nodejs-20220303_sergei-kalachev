const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid object id'};
    return;
  }

  const products = await Product.find({'subcategory': subcategory});

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  ctx.body = {
    products: products.map(mapProduct),
  };
};

module.exports.productById = async function productById(ctx, next) {
  if (!ctx.params.id) {
    ctx.status = 400;
    ctx.body = {error: 'No product id provided'};
    return;
  }

  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid object id'};
    return;
  }

  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.status = 404;
    ctx.body = {error: 'Product is not found'};
  } else {
    ctx.body = {
      product: mapProduct(product),
    };
  }
};

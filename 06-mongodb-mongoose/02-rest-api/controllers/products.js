const mongoose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    throw new Error('Invalid subcategory id');
  }

  const products = await Product.find({'subcategories._id': subcategory});

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
    throw new Error('No product id provided');
  }

  const product = await Product.findById(ctx.params.id);

  ctx.body = {
    product: product ? mapProduct(product) : null,
  };
};

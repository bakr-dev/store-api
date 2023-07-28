const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// get one product by id
const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError(`no product with this id ${id}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

const addProduct = async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    throw new BadRequestError('Please provide product name and price');
  }

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const updateProductPrice = async (req, res) => {
  const { price } = req.body;
  if (!price) {
    throw new BadRequestError('Please provide product price');
  }
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError(`no product with this id ${id}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndRemove({ _id: id });
  if (!product) {
    throw new NotFoundError(`no product with this id ${id}`);
  }

  res.status(StatusCodes.OK).json('Product Deleted');
};

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  updateProductPrice,
  deleteProduct,
};

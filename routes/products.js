const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProductPrice,
  addProduct,
} = require('../controllers/products');

const authenticateUser = require('../middleware/authentication');

router.route('/').get(getAllProducts);
router
  .route('/:id')
  .get(getProduct)
  .delete(authenticateUser, deleteProduct)
  .patch(authenticateUser, updateProductPrice);

router.route('/add').post(authenticateUser, addProduct);

module.exports = router;

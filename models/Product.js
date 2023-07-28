const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'product name must be provided'],
    },
    price: {
      type: Number,
      required: [true, 'product price must be provided'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'caressa', 'marcos', 'unknown'],
        message: '{VALUE} is not supported',
      },
      default: 'unknown',
      // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

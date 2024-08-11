const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true},
  product_type: { type: Number, required: true},
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  supplier: { type: String, required: true },
  latitude: { type: Number, required: true},
  longitude: { type: Number, required: true },
  sku: { type: String, required: true },
  status: { type: Number, required: false }
});

/**
 * use this set item for convert _id to id
 */
schema.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

module.exports = mongoose.model('Product', schema);
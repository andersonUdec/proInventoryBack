const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  document_id: { type: String, unique: true, required: true },
  document_type: { type: Number, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: Number, required: false },
  password: { type: String, required: true }
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

module.exports = mongoose.model('User', schema);
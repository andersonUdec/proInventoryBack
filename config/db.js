const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const main = async function () {
  await mongoose.connect('mongodb://localhost:27017/mongobootcamp');
};

main()
  .then(function (connect) {
    console.log('MongoDB Connected');
  })
  .catch(function (err) {
    console.log(err);
  });

module.exports = {
  User: require('../models/users.model'),
};
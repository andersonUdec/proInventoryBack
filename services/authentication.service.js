const Promise = require('bluebird');
var jwt = require('jsonwebtoken');
const config = require('../middlewares/config.json');
const db = require('../config/db');
const User = db.User;
const enumStatus = require('../enumerators/enumStatus')
const helpers = require('../helpers/helpers');

const login = async function (email, password){
  try {
    const userAuth =  await User.findOne({email: email, password: helpers.encodeBase64(password), status: enumStatus.ACTIVE});
    if(!userAuth){
      throw { code: 404, message: 'Lo sentimos, correo electrónico o contraseña incorrectos.'};
    }
    const token = jwt.sign(
      {
        email: email,
        first_name: userAuth.first_name,
        last_name: userAuth.last_name,
        phone: userAuth.phone
      },
      config.secret,
      {expiresIn: '1h'}
    );
    return Promise.resolve(token)
  } catch (err) {
    return Promise.reject(err);
  }    
};

const logout = async function (email, date) {
  try {
    const userAuth =  await User.findOne({email: email, password: password, status: enumStatus.ACTIVE});
    if(!userAuth){
      throw { code: 404, message: 'Lo sentimos, correo electrónico o contraseña incorrectos.'};
    }
    const token = jwt.sign(
      {
        email: email,
        first_name: userAuth.first_name,
        last_name: userAuth.last_name,
        phone: userAuth.phone
      },
      config.secret,
      {expiresIn: '1h'}
    );
    return Promise.resolve(token)
  } catch (err) {
    return Promise.reject(err);
  } 
};

module.exports = {
  login,
  logout
};
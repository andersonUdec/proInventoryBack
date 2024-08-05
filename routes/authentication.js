const express = require('express');
const router = express.Router();

const authService = require('../services/authentication.service')

const errorModel = require('../models/internal/error.model');
const successModel = require('../models/internal/success.model');

const loginController = function (req, res) {
  return authService.login(req.body.email, req.body.password)
    .then((user) => res.status(200).json(new successModel(200, 'Usuario logeado correctamente.', user)))
    .catch(err => res.status(err.code).json(err.message));
};

const logoutController = function (req, res) {
  return authService.logout(req.body.email, req.body.date)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(err.code).json(err.message));
};

router.post('/login', loginController);
router.post('/logout', logoutController);

module.exports = router;
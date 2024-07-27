const express = require('express');
const router = express.Router();

const userServices = require('../services/users.service');

/**
 * @method
 * @description This method use with receive request HTTP GET through middleware from Node.JS and expressJS and response
 * object Request. Use method or verb GET
 * @param req
 * @param res
 * @param next
 */
const getAllUsersController = function (req, res, next) {
  userServices.getAllUsersService()
    .then(users => res.json(users))
    .catch(err => next(JSON.stringify(err)));
};

/**
 * @method
 * @description This method use with receive request HTTP POST through middleware from Node.JS and expressJS and
 * response object Request. Use method or verb POST
 * @param req
 * @param res
 * @param next
 */
const createUserController = async function (req, res, next) {
  await userServices.createUserService(req.body)
    .then(user => res.status(user.code).json(user))
    .catch(err => next(JSON.stringify(err)));
};

/**
 * @method
 * @description This method use with receive an email request HTTP GET through middleware from Node.JS and expressJS
 * and response object Request. Use method or verb GET
 * @param req
 * @param res
 * @param next
 */
const getUserByEmailController = function (req, res, next) {
  userServices.getUserByEmailService(req.params.email)
    .then(user => res.json(user))
    .catch(err => next(JSON.stringify(err)));
};

/**
 * @method
 * @description This method use with receive an email and body request HTTP PUT through middleware
 * from Node.JS and expressJS and response object Request. Use method or verb PUT
 * @param req
 * @param res
 * @param next
 */
const updateUserByEmailController = function (req, res) {
  userServices.updateUserByEmailService(req.params.email, req.body)
    .then(user => res.json(user))
    .catch(err => next(JSON.stringify(err)));
};

/**
 * @method
 * @description This method use with receive an email by request HTTP DELETE through middleware
 * from Node.JS and expressJS and response No Content Request. Use method or verb DELETE
 * @param req
 * @param res
 * @param next
 */
const deleteUserByEmailController = function (req, res, next) {
  return userServices.deleteUserByEmailService(req.params.email)
    .then(() => res.sendStatus(204))
    .catch(err => next(JSON.stringify(err)));
};

/**
 * @description This definition section is responsible for indicating the methods or verbs that HTTP uses to receive
 * the Request and its respective Response.
 */
router.get('/', getAllUsersController);
router.post('/create', createUserController);
router.get('/:email/detail', getUserByEmailController);
router.put('/:email/update', updateUserByEmailController);
router.delete('/:email/delete', deleteUserByEmailController);

module.exports = router;

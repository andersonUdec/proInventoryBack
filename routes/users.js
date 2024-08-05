const express = require('express');
const router = express.Router();

const userServices = require('../services/users.service');
const verifyToken = require('../middlewares/authMiddleware');

const errorModel = require('../models/internal/error.model');
const successModel = require('../models/internal/success.model');



/**
 * @method
 * @description This method use with receive request HTTP GET through middleware from Node.JS and expressJS and response
 * object Request. Use method or verb GET
 * @param req
 * @param res
 * @param next
 */
const getAllUsersController = async function (req, res, next) {
  await userServices.getAllUsersService()
    .then(users => res.status(200).json(new successModel(200, null, users)))
    .catch(err => res.status(err.code).json(err.message));;
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
    .then(user => res.status(201).json(new successModel(201, 'Usuario creado correctamente.', user)))
    .catch(err => res.status(err.code).json(err.message));
};

/**
 * @method
 * @description This method use with receive an email request HTTP GET through middleware from Node.JS and expressJS
 * and response object Request. Use method or verb GET
 * @param req
 * @param res
 * @param next
 */
const getUserByEmailController = async function (req, res, next) {
  await userServices.getUserByEmailService(req.params.email)
    .then(user => res.status(200).json(new successModel(200, null, user)))
    .catch(err => res.status(err.code).json(err.message));
};

/**
 * @method
 * @description This method use with receive an email and body request HTTP PUT through middleware
 * from Node.JS and expressJS and response object Request. Use method or verb PUT
 * @param req
 * @param res
 * @param next
 */
const updateUserByEmailController = async function (req, res, next) {
  await userServices.updateUserByEmailService(req.params.email, req.body)
    .then(user => res.status(200).json(new successModel(200, 'Usuario editado correctamente.', user)))
    .catch(err => res.status(err.code).json(err.message));
};

/**
 * @method
 * @description This method use with receive an email by request HTTP DELETE through middleware
 * from Node.JS and expressJS and response No Content Request. Use method or verb DELETE
 * @param req
 * @param res
 * @param next
 */
const deleteUserByEmailController = async function (req, res, next) {
  await userServices.deleteUserByEmailService(req.params.email)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(err.code).json(err.message));
};

/**
 * @description This definition section is responsible for indicating the methods or verbs that HTTP uses to receive
 * the Request and its respective Response.
 */
router.get('/', verifyToken,getAllUsersController);
router.post('/create', createUserController);
router.get('/:email/detail',verifyToken, getUserByEmailController);
router.put('/:email/update', verifyToken,updateUserByEmailController);
router.delete('/:email/delete', verifyToken,deleteUserByEmailController);

module.exports = router;

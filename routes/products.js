const express = require('express');
const router = express.Router();

const productService = require('../services/products.service');
const verifyToken = require('../middlewares/authMiddleware');

const successModel = require('../models/internal/success.model');



/**
 * @method
 * @description This method use with receive request HTTP GET through middleware from Node.JS and expressJS and response
 * object Request. Use method or verb GET
 * @param req
 * @param res
 * @param next
 */
const getAllProductsController = async function (req, res, next) {
  await productService.getAllProductsService()
    .then(products => res.status(200).json(new successModel(200, null, products)))
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
  await productService.createProductService(req.body)
    .then(product => res.status(201).json(new successModel(201, 'Producto creado correctamente.', product)))
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
const getProductBySkuController = async function (req, res, next) {
  await productService.getProductBySkuService(req.params.sku)
    .then(product => res.status(200).json(new successModel(200, null, product)))
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
const updateProductBySkuController = async function (req, res, next) {
  await productService.updateProductBySkuService(req.params.sku, req.body)
    .then(product => res.status(200).json(new successModel(200, 'Producto editado correctamente.', product)))
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
const deleteProductByskuController = async function (req, res, next) {
  await productService.deleteProductBySkuService(req.params.sku)
    .then(() => res.sendStatus(204))
    .catch(err => res.status(err.code).json(err.message));
};

/**
 * @description This definition section is responsible for indicating the methods or verbs that HTTP uses to receive
 * the Request and its respective Response.
 */
router.get('/', verifyToken, getAllProductsController);
router.post('/create',verifyToken, createUserController);
router.get('/:sku/detail',verifyToken, getProductBySkuController);
router.put('/:sku/update', verifyToken,updateProductBySkuController);
router.delete('/:sku/delete', verifyToken,deleteProductByskuController);

module.exports = router;

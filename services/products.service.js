const db = require('../config/db');
const Product = db.Product;
const enumStatus = require('../enumerators/enumStatus');
const helpers = require('../helpers/helpers');
/**
 * @method
 * @description This method use for get all list of products
 * @returns {Promise<*>}
 */
const getAllProductsService = async function () {
    try {
        return await Product
            .find({ status: enumStatus.ACTIVE })
            .select('_id name quantity sku')
            .exec();
    } catch (err) {
        if (!err.code) {
            throw { code: 500, message: 'Error interno del servidor. Por favor intenta nuevamente.' };
        }
        throw err;
    }
};

/**
 * @method
 * @param productParam
 * @description This method use for create product, and receive productParam object
 * @returns {Promise}
 */
const createProductService = async function (productParam, next) {
    try {
        const existinProduct = await Product.findOne({
            sku: productParam.sku,
            status: enumStatus.ACTIVE
        });

        if (existinProduct) {
            throw { code: 409, message: 'Lo sentimos, el sku ya se encuentra registrado.' };    
        }

        const produt = new Product(productParam);
        produt.status = enumStatus.ACTIVE;
        const savedProdut = await produt.save()
        return savedProdut.id;
    } catch (err) {
        console.log(err);
        if (!err.code) {
            throw { code: 500, message: 'Error interno del servidor. Por favor intenta nuevamente.' };
        }
        throw err;
    }
};

/**
 * @method
 * @description This method use for get product by sku, and receive sku object
 * @param sku SKU-XXX-1111-xx-1111
 * @returns {Promise<*>}
 */
const getProductBySkuService = async function (sku) {
    try {
        const product = await Product.findOne({ sku: sku, status: enumStatus.ACTIVE })
            .select('id name product_type quantity price supplier latitude longitude sku')
            .exec();
        if (!product) {
            throw { code: 404, message: 'Lo sentimos, el producto no existe.' };
        }
        return product;
    } catch (err) {
        if (!err.code) {
            throw { code: 500, message: 'Error interno del servidor. Por favor intenta nuevamente.' };
        }
        throw err;
    }
};


/**
 * @method
 * @description This method use for update product by sku, and receive sku object
 * @param sku
 * @param productParam
 * @returns {Promise<*>}
 */
const updateProductBySkuService = async function (sku, productParam) {
    try {
        
        const productForUpdate = await Product.findOne({ sku: sku, status: enumStatus.ACTIVE });

        if (!productForUpdate) {
            throw { code: 404, message: 'Lo sentimos, el producto no existe.' };
        }

        const productUpdatedResult = await Product.findByIdAndUpdate(productForUpdate.id,
            {
                name: productParam.name,
                product_type: productParam.product_type,
                quantity: productParam.quantity,
                price: productParam.price,
                supplier: productParam.supplier,
                latitude: productParam.latitude,
                longitude: productParam.longitude
            }
        )

        if (productUpdatedResult && productUpdatedResult.errors) {
            throw { code: 400, message: productUpdatedResult.errors };
        }

        return getProductBySkuService(productForUpdate.sku);
    } catch (err) {
        console.log(err)
        if (!err.code) {
            throw { code: 500, message: 'Error interno del servidor. Por favor intenta nuevamente.' };
        }
        throw err;
    }
};

/**
 * @method
 * @description This method use for delete product by sku
 * @param sku
 * @returns {Promise<*>}
 */
const deleteProductBySkuService = async function (sku) {
    try {
        const productForSoftDelete = await Product.findOne({ sku: sku, status: enumStatus.ACTIVE });

        if (!productForSoftDelete) {
            throw { code: 404, message: 'Lo sentimos, el producto no existe.' };
        }

        const productSoftDeleteResult = await Product
            .findByIdAndUpdate(productForSoftDelete.id,
                { status: enumStatus.DELETE });

        if (productSoftDeleteResult && productSoftDeleteResult.errors) {
            throw { code: 400, message: productSoftDeleteResult.errors };
        }
    } catch (err) {
        if (!err.code) {
            throw { code: 500, message: 'Error interno del servidor. Por favor intenta nuevamente.' };
        }
        throw err;
    }
};
/**
 * @description Export services for use in the controller or routes * @type {{getAllProductsService: (function(*): Promise),
 * createProductService: (function(productParam): Promise),
 * getProductBySkuService: (function(sku): Promise),
 * updateProductBySkuService: (function(productParam): Promise),
 * deleteProductBySkuService: (function(sku): Promise)}}
 */
module.exports = {
    getAllProductsService,
    createProductService,
    getProductBySkuService,
    updateProductBySkuService,
    deleteProductBySkuService
};
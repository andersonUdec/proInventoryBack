const db = require('../config/db');
const User = db.User;
const enumStatus = require('../enumerators/enumStatus')
const errorModel = require('../models/internal/error.model');
const successModel = require('../models/internal/success.model');

/**
 * @method
 * @description This method use for get all list of users
 * @returns {Promise<*>}
 */
const getAllUsersService = async function () {
    return await User
        .find()
        .select('first_name last_name email phone status id document_type document_id address')
        .exec();
};

/**
 * @method
 * @param userParam
 * @description This method use for create user, and receive userParam object
 * @returns {Promise}
 */
const createUserService = async function (userParam, next) {

    try {
        const existingUser = await User.findOne({
            $or: [
                { email: userParam.email },
                { document_id: userParam.document_id },
                { phone: userParam.phone }
            ],
        });

        if (existingUser) {
            if (existingUser.email === userParam.email) {
                return new errorModel(409, 'Lo sentimos, el correo ya se encuentra registrado.', null );
            }
            if (existingUser.document_id === userParam.document_id) {
                return new errorModel(409, 'Lo sentimos, el número de identificación ya se encuentra registrado.', null );
            }
            if (existingUser.phone === userParam.phone) {
                return new errorModel(409, 'Lo sentimos, el número telefónico ya se encuentra registrado.', null );
            }
        }

        const user = new User(userParam);
        user.status = enumStatus.ACTIVO;
        const savedUser = await user.save();
        return new successModel(201,'Usuario creado correctamente' ,savedUser._id);
    } catch (err) {
        if (!err.code) {
            return new errorModel(500, 'Error interno del servidor. Por favor intenta nuevamente.', null);
        }
        throw err;
    }
};

/**
 * @method
 * @description This method use for get user by email, and receive email object
 * @param email lmedy23w@gesties.com
 * @returns {Promise<*>}
 */
const getUserByEmailService = async function (email) {
    const user = await User.findOne({ email: email })
        .select('first_name last_name email phone status id document_type document_id address')
        .exec();

    if (!user) {
        throw { code: 404, message: 'User ' + email + ' does not exist' };
    }
    return user;
};

/**
 * @method
 * @description This method use for update user by email, and receive email object
 * @param email
 * @param userParam
 * @returns {Promise<*>}
 */
const updateUserByEmailService = async function (email, userParam) {
    const userForUpdate = await User.findOne({ email: email, status: true });

    if (!userForUpdate) {
        throw { code: 404, message: 'User ' + email + ' does not exist' };
    }

    const userUpdatedResult = await User
        .findByIdAndUpdate(userForUpdate.id,
            {
                first_name: userParam.first_name,
                last_name: userParam.last_name, phone: userParam.phone
            });

    if (userUpdatedResult && userUpdatedResult.errors) {
        throw { code: 400, message: userUpdatedResult.errors };
    }

    return getUserByEmailService(userForUpdate.email);
};

/**
 * @method
 * @description This method use for delete user by email
 * @param email
 * @returns {Promise<*>}
 */
const deleteUserByEmailService = async function (email) {
    const userForSoftDelete = await User.findOne({ email: email, status: true });

    if (!userForSoftDelete) {
        throw { code: 404, message: 'User ' + email + ' does not exist' };
    }

    const userSoftDeleteResult = await User
        .findByIdAndUpdate(userForSoftDelete.id,
            { status: false });

    if (userSoftDeleteResult && userSoftDeleteResult.errors) {
        throw { code: 400, message: userSoftDeleteResult.errors };
    }
};

/**
 * @description Export services for use in the controller or routes * @type {{getUserByEmail: (function(*): Promise),
 * getAllUsers: (function(): Promise),
 * authenticate: (function({email: *, password: *}): Promise),
 * createUser: (function(*): Promise),
 * deleteUserByEmail: (function(*): Promise),
 * updateUserByEmail: (function(*, *): Promise)}}
 */
module.exports = {
    getAllUsersService,
    createUserService,
    getUserByEmailService,
    updateUserByEmailService,
    deleteUserByEmailService,
};
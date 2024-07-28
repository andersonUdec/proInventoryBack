const db = require('../config/db');
const User = db.User;
const enumStatus = require('../enumerators/enumStatus');

/**
 * @method
 * @description This method use for get all list of users
 * @returns {Promise<*>}
 */
const getAllUsersService = async function () {
    try{
        return await User
        .find({status: enumStatus.ACTIVE})
        .select('first_name last_name email phone id document_type document_id address')
        .exec();
    }catch (err) {
        if (!err.code) {
            throw {code: 500, message:  'Error interno del servidor. Por favor intenta nuevamente.'};
        }
        throw err;
    }
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
            status: enumStatus.ACTIVE
        });

        if (existingUser) {
            if (existingUser.email === userParam.email) {
                throw  {code: 409, message: 'Lo sentimos, el correo ya se encuentra registrado.'};
            }
            if (existingUser.document_id === userParam.document_id) {
                throw  {code: 409, message: 'Lo sentimos, el número de identificación ya se encuentra registrado.'};
            }
            if (existingUser.phone === userParam.phone) {
                throw  {code: 409, message: 'Lo sentimos, el número telefónico ya se encuentra registrado.'};
            }
        }

        const user = new User(userParam);
        user.status = enumStatus.ACTIVE;
        const savedUser = await user.save();
        return savedUser._id;
    } catch (err) {
        if (!err.code) {
            throw {code: 500, message:  'Error interno del servidor. Por favor intenta nuevamente.'};
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
    const user = await User.findOne({ email: email, status: enumStatus.ACTIVE})
        .select('first_name last_name email phone id document_type document_id address')
        .exec();
    if (!user) {
        throw { code: 404, message: 'Lo sentimos, el usuario no existe.' };
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
    const userForUpdate = await User.findOne({ email: email, status: enumStatus.ACTIVE });

    if (!userForUpdate) {
        throw { code: 404, message: 'Lo sentimos, el usuario no existe' };
    }

    const userUpdatedResult = await User
        .findByIdAndUpdate(userForUpdate.id,
            {
                first_name: userParam.first_name,
                last_name: userParam.last_name,
                phone: userParam.phone,
                address: userParam.address
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
    const userForSoftDelete = await User.findOne({ email: email, status: enumStatus.ACTIVE });

    if (!userForSoftDelete) {
        throw { code: 404, message: 'Lo sentimos, el usuario no existe.'};
    }

    const userSoftDeleteResult = await User
        .findByIdAndUpdate(userForSoftDelete.id,
            { status: enumStatus.DELETE });

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
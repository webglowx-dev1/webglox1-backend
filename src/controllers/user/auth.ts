import { Request, Response } from "express";
import bcrypt from "bcrypt";
import response from "@helpers/responseMiddleware";
import log4js from "log4js";
const logger = log4js.getLogger();
import UserModel from "@models/user-model";
import UserToken from "@models/user-token-model";
// import jwt from '@helpers/jwt';
import { JWT_EXPIRATION, JWT_SECRET } from "@config/index";
import jwt from "jsonwebtoken";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================================= Over Here Include Library =============================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const userDataGet = async (id: any) => {
    const userData = await UserModel.findByPk(id, {
        attributes: ['id', 'name', 'user_name', 'profile_pic', 'status', 'is_deleted', 'createdAt', 'updatedAt']
    });

    return userData;
};

const register = async (req: Request, res: Response) => {
    try {
        const {
            name,
            user_name,
            password,
            firebase_token,
        } = req.body;

        const passwordHash = await bcrypt.hash(password, Number(10));

        let updateData: any = {
            name: name,
            user_name: user_name,
            password: passwordHash,
        }
        const userData: any = await UserModel.create(updateData);

        let sendData: any = await userDataGet(userData.id);
        const sendResponse: any = {
            data: sendData,
            message: "User created successfully",
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        return response.sendError(res, sendResponse);
    }
};

const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { user_name } = req.body;

        const user: any = await UserModel.findOne({ where: { user_name: user_name } });

        if (!user) {
            const sendResponse: any = {
                message: process.env.APP_WITH_EMAIL_NOT_EXITS,
            };
            return response.sendError(res, sendResponse);
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString(); //four digit otp

        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10);

        let token: any;

        const sendResponse: any = {
            data: {
                token: token,
                otp: otp,
            },
            message: process.env.APP_OTP_SEND_EMAIL,
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        return response.sendError(res, sendResponse);
    }
};

// const resetPassword = async (req: Request, res: Response) => {
//     try {
//         const { password, confirm_password, token } = req.body
//         if (!token) {
//             const sendResponse: any = {
//                 message: process.env.APP_INVALID_TOKEN_MESSAGE,
//             };
//             return response.sendError(res, sendResponse);
//         }
//         const clientData: any = await jwt.decode(token);
//         const expired = new Date(clientData.expiry) <= new Date();
//         if (expired) {
//             const sendResponse: any = {
//                 message: process.env.APP_INVALID_OTP_MESSAGE,
//             };
//             return response.sendError(res, sendResponse);
//         }
//         const passwordHash = await bcrypt.hash(password, Number(10));
//         await User.findByIdAndUpdate(clientData.user_id, {
//             password: passwordHash,
//         });
//         const sendResponse: any = {
//             message: process.env.APP_PASSWROD_CHANGED_MESSAGE,
//             data: {}
//         };
//         return response.sendSuccess(req, res, sendResponse);
//     } catch (err: any) {
//         const sendResponse: any = {
//             message: err.message,
//         };
//         return response.sendError(res, sendResponse);
//     }
// };

const login = async (req: Request, res: Response) => {
    try {
        const { user_name, password, firebase_token } = req.body;
        const userData: any = await UserModel.findOne({
            where: {
                user_name: user_name
            }
        });

        if (userData) {
            if (!userData.password) {
                const sendResponse: any = {
                    message: 'Password not found',
                };
                return response.sendError(res, sendResponse);
            }
            const ispasswordmatch = await bcrypt.compare(
                password,
                userData.password
            );

            if (!ispasswordmatch) {
                const sendResponse: any = {
                    message: 'Password not match',
                };
                return response.sendError(res, sendResponse);
            } else {
                const dataPAss = {
                    name: userData.name,
                    user_name: userData.user_name,
                    user_id: userData.id?.toString(),
                }
                const token = await jwt.sign(dataPAss, JWT_SECRET as string, { expiresIn: JWT_EXPIRATION }); // Token expires in 1 hour
                if (userData && userData.id) {
                    await UserToken.create({
                        token: token,
                        firebase_token: firebase_token,
                        user_id: userData.id,
                    });
                }
                const sendData: any = {};
                sendData["user"] = await userDataGet(userData.id);
                sendData["access_token"] = token;
                const sendResponse: any = {
                    data: sendData,
                    message: 'Login Successfully',
                };
                return response.sendSuccess(req, res, sendResponse);
            }
        } else {
            const sendResponse: any = {
                message: 'User not found',
            };
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

// const changePassword = async (req: Request, res: Response) => {
//     try {
//         const { old_password, password } = req.body;
//         // @ts-ignore
//         const user_id = req?.user?._id;
//         const userData: any = await User.findOne({
//             _id: new mongoose.Types.ObjectId(user_id),
//         });

//         if (userData) {
//             const isComparePassword = await bcrypt.compare(
//                 old_password,
//                 userData.password
//             );
//             if (isComparePassword) {
//                 const passwordhash = await bcrypt.hash(password, Number(10));

//                 await User.findByIdAndUpdate(
//                     new mongoose.Types.ObjectId(user_id),
//                     {
//                         password: passwordhash,
//                         updated_by: userData.first_name,
//                         updated_on: new Date(),
//                     },
//                     {
//                         new: true,
//                     }
//                 );

//                 const sendResponse: any = {
//                     message: process.env.APP_PASSWROD_CHANGED_MESSAGE,
//                     data: {}
//                 };
//                 return response.sendSuccess(req, res, sendResponse);
//             } else {
//                 const sendResponse: any = {
//                     message: process.env.APP_PASSWORD_INCORRECT_MESSAGE,
//                 };
//                 return response.sendError(res, sendResponse);
//             }
//         } else {
//             const sendResponse: any = {
//                 message: process.env.APP_ADMIN_NOT_FOUND_MESSAGE,
//             };
//             return response.sendError(res, sendResponse);
//         }
//     } catch (err: any) {
//         const sendResponse: any = {
//             message: err.message,
//         };
//         logger.info(process.env.APP_PASSWROD_CHANGED_MESSAGE);
//         logger.info(err);
//         return response.sendError(res, sendResponse);
//     }
// };

const getProfile = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user_id = req?.user._id;

        const sendResponse: any = {
            data: await userDataGet(user_id),
            message: process.env.APP_PROFILE_GET_MESSAGE,
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info(process.env.APP_PROFILE_GET_MESSAGE);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const updateProfile = async (req: Request, res: Response) => {
    try {
        const {
            name,
            profile_pic,
            user_name,
        } = req.body;

        // @ts-ignore
        const user_id = req?.user?.id;
        let updateData: any = {
            profile_pic :profile_pic,
            name: name,
            user_name: user_name,
        }

        await UserModel.update(updateData, {
            where: {
                id: user_id
            }
        })
        const sendData: any = {};
        sendData["user"] = await userDataGet(user_id);
        const sendResponse: any = {
            data: sendData,
            message: 'Profile Updated Successfully',
        };

    
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info(process.env.APP_PROFILE_UPDATE_MESSAGE);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const user_id = req?.user?._id;
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info(process.env.APP_LOGOUT_MESSAGE);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};



// Export default
export default {
    register,
    forgetPassword,
    // resetPassword,
    login,
    // changePassword,
    getProfile,
    updateProfile,
    logout,
};

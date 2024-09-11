import { Request, Response } from 'express';
import jwt from '@helpers/jwt';
import bcrypt from 'bcrypt';
import response from '@helpers/responseMiddleware';
import log4js from "log4js";
const logger = log4js.getLogger();
import Admin from '@models/admin-model';
import AdminToken from '@models/admin-token-model';
import OtpModel from "@models/otp-model";
import CommonFunction from "@helpers/commonFunction";
// import jwt from "jsonwebtoken";
import { JWT_EXPIRATION, JWT_SECRET } from "@config/index";



const changePassword = (async (req: Request, res: Response) => {
    try {
        const { old_password, password } = req.body;
        // @ts-ignore
        const admin_id = req?.admin?.id;
        const adminData: any = await Admin.findOne({
            where: {
                id: admin_id,
            },
        });
        if (adminData) {
            const isComparePassword: any = await bcrypt.compare(old_password, adminData.password);
            if (isComparePassword) {
                const passwordhash: any = await bcrypt.hash(password, Number(10));
                // Update the admin's password
                const updatedAdmin = await Admin.update(
                    {
                        password: passwordhash,
                    },
                    {
                        where: {
                            id: admin_id,
                        },
                        returning: true, // To get the updated record
                    }
                );

                const sendResponse: any = {
                    message: "password changed successfully",
                }
                return response.sendSuccess(req, res, sendResponse);
            } else {
                const sendResponse: any = {
                    message: 'Oops, provide password is incorrect. Please try again with correct password.',
                }
                return response.sendError(res, sendResponse);
            }
        } else {
            const sendResponse: any = {
                message: 'Admin not found',
            }
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("change Password");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const getProfile = (async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const admin_id = req?.admin?.id;
        const adminData: any = await Admin.findOne({
            where: {
                id: admin_id,
            },
        });
        const sendResponse: any = {
            data: adminData,
            message: 'get profile successfully',
        }
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("get Profile");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const updateProfile = (async (req: Request, res: Response) => {
    try {
        const { name, email, profile_pic } = req.body;
        // @ts-ignore
        const admin_id = req?.admin?.id;

        const dataUpdate = {
            profile_pic: profile_pic,
            name: name,
            email: email,
        }
        const [updatedRows] = await Admin.update(dataUpdate, {
            where: {
                id: admin_id,
            },
        });


        const adminData: any = await Admin.findOne({
            where: {
                id: admin_id,
            },
        });
        const sendResponse: any = {
            data: adminData,
            message: 'update profile successfully',
        }
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("update Profile");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const logout = (async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const admin_id = req?.admin?.id;
        //const token = req.headers['authorization']?.split(" ")[1];
        const jwtToken:any = req.headers["j-authorization"];
        const token = jwtToken.split(' ')[1];

        let getToken: any = await AdminToken.findOne({
            where: {
                admin_id: admin_id,
                token: token,
            },
        });

        if (getToken) {
            const deletedRows = await AdminToken.destroy({
                where: {
                    id: getToken.id,
                },
            });
            const sendResponse: any = {
                message: 'logout Admin successfully',
            }
            return response.sendSuccess(req, res, sendResponse);
        } else {
            const sendResponse: any = {
                message: "Invalid token",
            }
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("Logout");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({
            where: {
                email,
            },
        });

        if (!admin) {
            const sendResponse: any = {
                message: "admin with given email doesn't exist",
            };
            return response.sendError(res, sendResponse);
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString(); //four digit otp

        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10);

        const token = await jwt.sign({
            email: email,
            admin_id: admin.id,
            expiry: expiry,
        });


        // @ts-ignore
        await OtpModel.create([
            {
                otp: otp,
                token: token,
                admin_id: admin.id,
                is_active: true,
                expiry: expiry,
            },
        ]);


        logger.info("token");
        logger.info(token);

        if (admin) {

            try {
                let to: any = admin.email;
                let subject: any = process.env.APP_NAME + ' Reset Password Link';
                let template: any = 'forget-code-admin'
                let sendEmailTemplatedata: any = {
                    name: admin.name,
                    token: token,
                    app_name: process.env.APP_NAME,
                    reset_button: process.env.ADMIN_LINK + 'reset-password/' + token,
                }

                let datta: any = {
                    to: to,
                    subject: subject,
                    template: template,
                    sendEmailTemplatedata: sendEmailTemplatedata
                }

                await CommonFunction.sendEmailTemplate(datta)
            } catch (err) {
                logger.info("Forget Password send email  ");
                logger.info(err);
            }
        }

        // Email Services write down
        const sendResponse: any = {
            message: "Link sent on the registred Mail Id",
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        return response.sendError(res, sendResponse);
    }
};

const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password, confirm_password, token } = req.body

        if (!token) {
            const sendResponse: any = {
                message: "token is not valid or missing",
            };
            return response.sendError(res, sendResponse);
        }

        const clientData: any = await jwt.decode(token);

        const expired = new Date(clientData.expiry) <= new Date();
        if (expired) {
            const sendResponse: any = {
                message: "Otp is not valid",
            };
            return response.sendError(res, sendResponse);
        }


        const passwordHash = await bcrypt.hash(password, Number(10));

        const [updatedRows] = await Admin.update(
            {
                password: passwordHash,
            },
            {
                where: {
                    id: clientData.admin_id,
                },
            }
        );

        const sendResponse: any = {
            message: "Password Successfully Changed",
            data: {}
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        return response.sendError(res, sendResponse);
    }
};

const adminsDataGet = (async (id: any) => {
    const adminData = await Admin.findOne({
        where: { id },
        attributes: ['id', 'name', 'email', 'profile_pic'],
    });
    return adminData;
})

const login = async (req: Request, res: Response) => {
    try {
        const { email, password, firebase_token } = req.body;

        // Find an admin by email
        const adminData = await Admin.findOne({
            where: {
                email,
            },
        });

        if (adminData) {
            // Check if the admin has a password
            if (!adminData.password) {
                const sendResponse: any = {
                    message: 'The password you entered is invalid. Please check your password and try again.',
                };
                return response.sendError(res, sendResponse);
            }

            // Compare the provided password with the hashed password
            const isPasswordMatch = await bcrypt.compare(password, adminData.password);

            if (!isPasswordMatch) {
                const sendResponse: any = {
                    message: 'The password you entered is invalid. Please check your password and try again.',
                };
                return response.sendError(res, sendResponse);
            } else {
                // Generate a JWT token
                // const token: any = await jwt.sign({
                //     email,
                //     admin_id: adminData.id?.toString(),
                // });
                let token: any = null;
                if (adminData && adminData.id) {

                    const dataPass: PassData = {
                        name: adminData.name,
                        email: adminData.email,
                        admin_id: adminData.id?.toString(),
                    }
                    token = await jwt.sign(dataPass);
                    //token = await generateToken(dataPass);
                    // Create an AdminToken record
                    await AdminToken.create({
                        token,
                        firebase_token,
                        admin_id: adminData.id,
                    });
                }
                // Get admin data
                const sendData = await adminsDataGet(adminData.id);
                const AdminsData = sendData?.toJSON();
                AdminsData['access_token'] = token;


                const sendResponse: any = {
                    data: AdminsData ? AdminsData : {},
                    message: 'You are logged in successfully',
                };

                return response.sendSuccess(req, res, sendResponse);
            }
        } else {
            const sendResponse: any = {
                message: 'The email or password is incorrect.',
            };
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };

        logger.info('Login');
        logger.info(err);

        return response.sendError(res, sendResponse);
    }
};

interface PassData {
    email: string;
    name: string;
    admin_id: string;
    // add other properties as needed
}



export default {
    changePassword,
    getProfile,
    updateProfile,
    logout,
    forgetPassword,
    login,
    resetPassword
}
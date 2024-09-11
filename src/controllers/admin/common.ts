import response from "@helpers/responseMiddleware";
import fs from "fs";
import aws from "@helpers/aws";
import jwt from "@helpers/jwt";
import { nonReSizeImage, reSizeImage } from "@helpers/sizeImage";
import OtpModel from "@models/otp-model";
import Gallery  from '@models/gallery-model';
const log4js = require("log4js");
const logger = log4js.getLogger();

const otpVerification = async (req: any, res: any) => {
    try {
        const { otp, token } = req.body;

        if (!token) {
            const sendResponse: any = {
                message: "token is not valid or missing",
            };
            return response.sendAuthError(res, sendResponse);
        }

        const clientData: any = await jwt.decode(token);

        const getOtp: any = await OtpModel.findOne({
            where: {
                user_id: clientData.user_id,
                token: token,
            }
        });

        const matchOtp: any = getOtp.otp == otp;

        if (!matchOtp) {
            const sendResponse: any = {
                message: "OTP is incorrect",
                data: {},
            };
            return response.sendAuthError(res, sendResponse);
        }

        const expired: any = new Date(clientData.expiry) <= new Date();

        if (expired) {
            const sendResponse: any = {
                message: "OTP is incorrect or Expired",
                data: {},
            };
            return response.sendAuthError(res, sendResponse);
        }

        const passwordResetToken: any = await jwt.sign({
            otp: otp,
            user_id: clientData.user_id,
            mobile_no: clientData.mobile_no,
        });

        // await OtpModel.findByIdAndUpdate(getOtp._id, {
        //     token: passwordResetToken,
        //     isVerified: true,
        //     isActive: false,
        // });

        await OtpModel.destroy({
            where: {
                id: getOtp.id,
            },
        });
        const sendResponse: any = {
            // data: null,
            token: passwordResetToken,
            message: "OTP Verified",
            data: {}
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            // data: err.message,
            message: "OTP Expired",
        };
        return response.sendError(res, sendResponse);
    }
};

const uploadFiles = async (req: any, res: any) => {
    try {
        const imagePath = req.files[0].path;
        const blob = fs.readFileSync(imagePath);
        const originalFile = req.files[0].originalname;

        if (imagePath && blob) {
            let imageName = "file/" + Date.now() + originalFile;
            const uploadedImageData: any = await aws.uploadFileToS3(imageName, blob);

            fs.unlinkSync(req.files[0].path);
            const responseData: any = {
                data: {
                    url: uploadedImageData.Location,
                },
                message: "upload files successfully",
            };

            return response.sendResponse(res, responseData);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("uploadImage");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const uploadVideo = async (req: any, res: any) => {
    try {
        const imagePath = req.files[0].path;
        const type: number = req.query.type;
        const blob = fs.readFileSync(imagePath);
        const originalFile = req.files[0].originalname;
        if (imagePath && blob) {
            let imageName = "admin/" + Date.now() + originalFile;

            const uploadedImageData: any = await aws.uploadFileToS3(imageName, blob);
            fs.unlinkSync(req.files[0].path);

            const responseData: any = {
                data: {
                    image_url: uploadedImageData.Location,
                },
                message: "upload video successfully",
            };

            return response.sendResponse(res, responseData);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("uploadImage");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const uploadImage = async (req: any, res: any) => {
    try {
        const imagePath = req.files[0].path;
        const type: number = req.query.type;
        const blob = fs.readFileSync(imagePath);
        const originalFile = req.files[0].originalname;
        if (imagePath && blob) {
            let imageName = "admin/" + Date.now();
            if (Number(type) === 1) {
                imageName = "admin/" + Date.now();
            }
            if (Number(type) === 2) {
                imageName = "admin/gallery/" + Date.now();
            }
            if (Number(type) === 3) {
                imageName = "profile_pics/" + Date.now();
            }
            let comparessedImageData: any = await reSizeImage(blob, 400, 400);
            if (Number(type) === 7 || Number(type) === 2) {
                comparessedImageData = await nonReSizeImage(blob);
            }
            const uploadedImageData: any = await aws.uploadImageToS3(
                imageName,
                comparessedImageData
            );
            fs.unlinkSync(req.files[0].path);

            const responseData: any = {
                data: {
                    image_url: uploadedImageData.Location,
                },
                message: "upload image successfully",
            };

            return response.sendResponse(res, responseData);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("uploadImage");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const uploadImageMulti = async (req: any, res: any) => {
    try {
        let imgData: any = []
        req.files.map(async (val: any, i: number) => {
            const imagePath = req.files[i].path;
            const type: number = req.query.type;
            const blob = fs.readFileSync(imagePath);
            const originalFile = req.files[i].originalname;

            if (imagePath && blob) {
                let imageName = "admin/" + Date.now() + originalFile;
                if (Number(type) === 1) {
                    imageName = "admin/" + Date.now() + originalFile;
                }

                // const uploadedImageData: any = await aws.uploadImageToS3(imageName, blob);

                const comparessedImageData: any = await reSizeImage(blob, 400, 400);

                const uploadedImageData: any = await aws.uploadImageToS3(
                    imageName,
                    comparessedImageData
                );
                imgData.push(uploadedImageData.Location)
                fs.unlinkSync(req.files[i].path);
            }

            if (imgData.length === req.files.length) {
                const responseData: any = {
                    data: imgData,
                    message: "upload image successfully",
                };

                return response.sendResponse(res, responseData);
            }
        })


    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("upload Image Multipal ");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const getGallery = async (req: any, res: any) => {
    try {
        const items = await Gallery.findAll({
            where: {
                is_active: true
            }
        });

        const sendResponse = {
            message: process.env.APP_GET_MESSAGE,
            data: items,
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err:any) {
        const sendResponse = {
            message: err.message,
        };
        logger.info("gallery Data get");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
}



export default {
    otpVerification,
    uploadFiles,
    uploadVideo,
    uploadImage,
    uploadImageMulti,
    getGallery
};

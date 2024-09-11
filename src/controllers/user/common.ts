import response from "@helpers/responseMiddleware";
import log4js from "log4js";
const logger = log4js.getLogger();
import AWS from 'aws-sdk';
import fs from 'fs';
import util from 'util';
import TeamModel from '@models/team-model';
import GalleryModel from "@models/gallery-model";
import ClientModel from "@models/client-model";
import ServicesModel from "@models/services-model";
import RecentProjectmodel from "@models/recent-projects-model";
import SliderModel from "@models/slider-model";
import CmsModel from "@models/cms-model";

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================================= Over Here Include Library =============================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const uploadFiles = async (req: any, res: any) => {
    try {
        console.log(req.file);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info(process.env.APP_UPLOAD_FILE_MESSAGE);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const uploadImage = async (req: any, res: any) => {
    try {
        const baseUrl = 'http://localhost:7003/uploads/' + req.file.filename;
        const data = {
            image_url: baseUrl,
        };

        const sendResponse: any = {
            data: data,
            message: 'Image uploaded successfully',
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info(process.env.APP_UPLOAD_FILE_MESSAGE);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const uploadImage123 = async (req: any, res: any) => {
    try {

        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const s3 = new AWS.S3({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.REGION, // replace with your bucket region
        });
        const fileContent = await readFile(req.file.path);
        const params: any = {
            Bucket: process.env.PROFILE_BUCKET_NAME,
            Key: new Date().toISOString().replace(/:/g, '-') + '-' + req.file.originalname, // Key is case sensitive
            Body: fileContent, // assuming that req.file.buffer contains the file data
            Metadata: { fieldName: req.file.fieldname } // Metadata is case sensitive
        }

        try {
            const upload = await s3.upload(params).promise();
            const sendResponse: any = {
                data: {
                    image_url: upload.Location, // multer-s3 adds the location to the file object
                },
                message: 'Image uploaded successfully',
            };
            return response.sendSuccess(req, res, sendResponse);
        } catch (err) {
            console.error(err);
        }



    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info(process.env.APP_UPLOAD_FILE_MESSAGE);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};




const getGallery = async (req: Request, res: Response) => {
    try {
        const sendResponse: any = {
            data:  await GalleryModel.findAll({
                where: {
                  is_active: true
                }
              }),
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
const getClient = async (req: Request, res: Response) => {
    try {
        const sendResponse: any = {
            data:  await ClientModel.findAll({
                where: {
                  is_active: true
                }
              }),
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
const getRecentProjects = async (req: Request, res: Response) => {
    try {
        const sendResponse: any = {
            data:  await RecentProjectmodel.findAll({
                where: {
                  is_active: true
                }
              }),
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
const getServices = async (req: Request, res: Response) => {
    try {
        const sendResponse: any = {
            data:  await ServicesModel.findAll({
                where: {
                  is_active: true
                }
              }),
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
const getTeam = async (req: Request, res: Response) => {
    try {
        const sendResponse: any = {
            data:  await TeamModel.findAll({
                where: {
                  is_active: true
                }
              }),
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
const getSlider = async (req: Request, res: Response) => {
    try {
        const sendResponse: any = {
            data:  await SliderModel.findAll({
                where: {
                  is_active: true
                }
              }),
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

const getCms  = async (req: Request, res: Response) => {
    try {
        const sendResponse: any = {
            data:  await CmsModel.findAll({
                where: {
                  is_active: true
                }
              }),
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

// Export default                                                   
export default {
    uploadFiles,
    uploadImage,
    getGallery,
    getTeam,
    getClient,
    getRecentProjects,
    getServices,
    getSlider,
    getCms

};

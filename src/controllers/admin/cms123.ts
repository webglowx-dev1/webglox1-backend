import { Request, Response } from 'express';
import response from '@helpers/responseMiddleware';
import log4js from "log4js";
const logger = log4js.getLogger();
import Cms from '@models/cms-model';
import { Op } from 'sequelize';
import { sequelize } from '@models/init';


const get = (async (req: Request, res: Response) => {
    try {
        const data: any = await Cms.findAll();
        let fees_map: any = {};
        fees_map = await new Map(data.map((values: any) => [
            values.key, values.value
        ]));
        let feesMapArray: any = await Object.fromEntries(fees_map.entries());

        const sendResponse: any = {
            data: feesMapArray ? feesMapArray : {},
            message: 'CMS' + process.env.APP_GET_MESSAGE,
        }
        return response.sendSuccess(req, res, sendResponse);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info('CMS' + process.env.APP_GET_MESSAGE);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})


// *******************************************************************************************
// ================================= Store Record In Database =================================
// *******************************************************************************************

const store = (async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            about_us,
            who_we_are,
            terms_condition,
            privacy_policy,
            feature,
            app_store,
            play_store,
        } = req.body;
        await Cms.update({ value: who_we_are }, { where: { key: 'who_we_are' } });
        await Cms.update({ value: about_us }, { where: { key: 'about_us' } });
        await Cms.update({ value: terms_condition }, { where: { key: 'terms_condition' } });
        await Cms.update({ value: privacy_policy }, { where: { key: 'privacy_policy' } });
        await Cms.update({ value: feature }, { where: { key: 'feature' } });
        await Cms.update({ value: play_store }, { where: { key: 'play_store' } });
        await Cms.update({ value: app_store }, { where: { key: 'app_store' } });


        const message = 'CMS store successfully';
        const responseData = {
            message,
            data: [],
        };
        await transaction.commit();
        return response.sendSuccess(req, res, responseData);


    } catch (err: any) {
        await transaction.rollback();
        const sendResponse = {
            message: err.message,
        };
        logger.info('CMS Data');
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})



export default {
    get,
    store
};

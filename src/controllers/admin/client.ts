import { Request, Response } from 'express';
import response from '@helpers/responseMiddleware';
import log4js from "log4js";
const logger = log4js.getLogger();
import Client from '@models/client-model';
import { Op } from 'sequelize';
import { sequelize } from '@models/init';

const titleName = 'Client';
const allFiled = [
    "id",
    "client_name",
    "client_company",
    "description",
    "ratings",
    "image_path",
    "is_active",
    "createdAt",
]
const project: any = {}

const getAllFiled = async () => {
    await allFiled.map(function async(item: any) {
        project[item] = 1;
    })
}

const get = async (req: Request, res: Response) => {
    try {
        const { search, per_page, page, sort_field, sort_direction } = req.query;
        const pageFind = page ? (Number(page) - 1) : 0;
        const perPage = per_page == undefined ? 10 : Number(per_page);

        const where = {
        };

        const order = sort_field
            ? [[sort_field as string, sort_direction === "ascend" ? "ASC" : "DESC"]]
            : [["createdAt", "DESC"]];

        let queryOptions: any = {
            where,
            order,
            limit: perPage,
            offset: perPage * pageFind,
        };

        if (search) {
            const searchFields = allFiled.map(field => ({
                [field]: {
                    [Op.like]: `%${search}%`,
                },
            }));

            queryOptions.where = {
                [Op.or]: searchFields,
            };
        }

        const [items, totalCount] = await Promise.all([
            Client.findAll(queryOptions),
            Client.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / perPage);

        const sendResponse = {
            message: `${titleName} data successfully retrieved`,
            data: {
                docs: items,
                total: totalCount,
                limit: perPage,
                page: pageFind + 1,
                pages: totalPages,
            },
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse = {
            message: err.message,
        };
        logger.info(`${titleName} data successfully retrieved`);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const id = req.query.id;
        const numDeleted = await Client.destroy({
            // @ts-ignore
            where: {
                id: id,
            },
        });
        if (numDeleted > 0) {
            const responseData = {
                message: `${titleName} record has been deleted`,
                data: {},
            };
            return response.sendSuccess(req, res, responseData);
        } else {
            const sendResponse = {
                message: `${titleName} record not found or already deleted`,
            };
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse = {
            message: err.message,
        };
        logger.info(`${titleName} record has been deleted`);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
}


const getData = async (id: any) => {
    try {
        const itemData = await Client.findByPk(id, {
            attributes: project,
        });

        return itemData ? itemData.toJSON() : {};
    } catch (err: any) {
        // Handle any errors here
        console.error(`Error while fetching ${titleName} data:`, err);
        return {};
    }
};

const edit = async (req: Request, res: Response) => {
    try {
        const id = req.query.id;

        // Retrieve data by primary key using Sequelize
        const data = await getData(id);

        if (data) {
            const responseData = {
                message: `${titleName} edit data get successfully`,
                data,
            };
            return response.sendSuccess(req, res, responseData);
        } else {
            const sendResponse = {
                message: `${titleName} data not found`,
            };
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse = {
            message: err.message,
        };
        logger.info(`${titleName} edit data get successfully`);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = req.body.id;
        const status = req.body.status;
        const itemData = await Client.findByPk(id);
        if (itemData) {
            itemData.is_active = status;
            await itemData.save();
            const message = `${titleName} status ${status === true ? 'Approved' : 'Rejected'} successfully`;
            const responseData = {
                message,
                data: true,
            };
            return response.sendSuccess(req, res, responseData);
        } else {
            const sendResponse = {
                message: `${titleName} data not found`,
            };
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse = {
            message: err.message,
        };
        logger.info(`${titleName} data not found`);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const store = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const bodyData = {
            id: req.body.id,
            client_name: req.body.client_name,
            client_company: req.body.client_company,
            description: req.body.description,
            ratings: req.body.ratings, 
            image_path: req.body.image_path,
        }
        const [itemData, created] = await Client.upsert(bodyData, {
            transaction: transaction
        });
        if (!itemData) {
            throw new Error(`Failed to create a new ${titleName}`);
        }
        const message = `${titleName} store successfully`;
        const responseData = {
            message,
            data: await getData(itemData.id), // Use the Sequelize primary key, which is "id"
        };
        await transaction.commit();
        return response.sendSuccess(req, res, responseData);

    } catch (err: any) {
        await transaction.rollback();
        const sendResponse = {
            message: err.message,
        };
        logger.info(`${titleName} store successfully`);
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};


export default {
    get,
    destroy,
    edit,
    changeStatus,
    store,
};

import { Request, Response, NextFunction } from "express";
// import jwtUtil from "@helpers/jwt";
import response from "@helpers/responseMiddleware";
import AdminToken from "@models/admin-token-model";
import Admin from "@models/admin-model";
import jwtUtil from '@helpers/jwt';

// Constants
/**
 * Middleware to verify if admin is an Customer.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function authAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        // Get json-web-token
        const jwtToken:any = req.headers["j-authorization"];
        if (!jwtToken) {
            const sendResponse: any = {
                error: "unauthorized admin token nthi",
            };
            return response.sendAuthError(res, sendResponse);
        } else {
            const token = jwtToken.split(' ')[1];
            const clientData: any = await jwtUtil.decode(token); // Assuming jwtUtil can decode the token
            if (clientData) {
                let gettoken: any = await AdminToken.findOne({
                    where: {
                        admin_id: clientData.admin_id,
                        token: token
                    }
                });
                const admin: any = await Admin.findOne({
                    where: {
                        id: clientData.admin_id
                    },
                    attributes: ['id', 'name', 'email']
                });
                // @ts-ignore
                req.admin = admin;
                if (gettoken) {
                    next();
                } else {
                    const sendResponse: any = {
                        error: "unauthorized Token",
                    };
                    return response.sendAuthError(res, sendResponse);
                }
            } else {
                const sendResponse: any = {
                    error: "unauthorized clientData",
                };
                return response.sendAuthError(res, sendResponse);
            }
        }
    } catch (err) {
        const sendResponse: any = {
            error: "unauthorized wrr",
        };
        console.log(err);
        return response.sendAuthError(res, sendResponse);
    }
}

import { Request, Response, NextFunction } from "express";
// import jwtUtil from "@helpers/jwt";
import response from "@helpers/responseMiddleware";
import UserToken from "@models/user-token-model";
import User from "@models/user-model";
import jwtLib from 'jsonwebtoken';
import { JWT_SECRET } from "@config/index";

// Constants
/**
 * Middleware to verify if user is an Customer.
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function authUser(req: Request, res: Response, next: NextFunction) {
    try {
        // Get json-web-token
        const jwt:any = req.headers["j-authorization"];
        if (!jwt) {
            const sendResponse: any = {
                error: "unauthorized user token nthi",
            };
            return response.sendAuthError(res, sendResponse);
        } else {
            const clientData: any = await jwtLib.verify(jwt, JWT_SECRET as string);
            if (clientData) {
                let gettoken: any = await UserToken.findOne({
                    where: {
                        user_id: clientData.user_id,
                        token: jwt
                    }
                });
                const user: any = await User.findOne({
                    where: {
                        id: clientData.user_id
                    },
                    attributes: ['id', 'name', 'user_name']
                });
                // @ts-ignore
                req.user = user;
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
        return response.sendAuthError(res, sendResponse);
    }
}

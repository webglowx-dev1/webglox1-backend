import { Router } from "express";

import teamController from '@controllers/admin/team';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const teamRouter = Router();

teamRouter.use(authAdmin);

teamRouter.get(`/team/get`, teamController.get);
teamRouter.post(`/team/store`, teamController.store);
teamRouter.get(`/team/edit-get`, teamController.edit);
teamRouter.delete(`/team/delete`, teamController.destroy);
teamRouter.post(`/team/change-status`, teamController.changeStatus);

// Export default
export default teamRouter;

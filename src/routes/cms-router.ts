import { Router } from "express";

import cmsController from '@controllers/admin/cms';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const cmsRouter = Router();

cmsRouter.use(authAdmin);
cmsRouter.get(`/cms/get`, cmsController.get);
cmsRouter.post(`/cms/store`, cmsController.store);
cmsRouter.get(`/cms/edit-get`, cmsController.edit);
cmsRouter.delete(`/cms/delete`, cmsController.destroy);
cmsRouter.post(`/cms/change-status`, cmsController.changeStatus);


// Export default
export default cmsRouter;

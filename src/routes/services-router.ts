import { Router } from "express";

import servicesController from '@controllers/admin/services';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const servicesRouter = Router();

servicesRouter.use(authAdmin);

servicesRouter.get(`/services/get`, servicesController.get);
servicesRouter.post(`/services/store`, servicesController.store);
servicesRouter.get(`/services/edit-get`, servicesController.edit);
servicesRouter.delete(`/services/delete`, servicesController.destroy);
servicesRouter.post(`/services/change-status`, servicesController.changeStatus);

// Export default
export default servicesRouter;

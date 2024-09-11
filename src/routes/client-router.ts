import { Router } from "express";

import clientController from '@controllers/admin/client';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const clientRouter = Router();

clientRouter.use(authAdmin);

clientRouter.get(`/client/get`, clientController.get);
clientRouter.post(`/client/store`, clientController.store);
clientRouter.get(`/client/edit-get`, clientController.edit);
clientRouter.delete(`/client/delete`, clientController.destroy);
clientRouter.post(`/client/change-status`, clientController.changeStatus);

// Export default
export default clientRouter;

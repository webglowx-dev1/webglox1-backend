import { Router } from "express";

import recentProjectsController from '@controllers/admin/recent-projects';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const recentProjectsRouter = Router();

recentProjectsRouter.use(authAdmin);

recentProjectsRouter.get(`/recentProjects/get`, recentProjectsController.get);
recentProjectsRouter.post(`/recentProjects/store`, recentProjectsController.store);
recentProjectsRouter.get(`/recentProjects/edit-get`, recentProjectsController.edit);
recentProjectsRouter.delete(`/recentProjects/delete`, recentProjectsController.destroy);
recentProjectsRouter.post(`/recentProjects/change-status`, recentProjectsController.changeStatus);

// Export default
export default recentProjectsRouter;

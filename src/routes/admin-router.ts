import { Router } from "express";

import adminController from '@controllers/admin/auth';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const adminRouter = Router();

adminRouter.use(authAdmin);
adminRouter.post(`/admin/change-password`, adminController.changePassword);
adminRouter.post(`/admin/logout`, adminController.logout);
adminRouter.post(`/admin/profile-update`, adminController.updateProfile);
adminRouter.get(`/admin/profile`, adminController.getProfile);


// Export default
export default adminRouter;

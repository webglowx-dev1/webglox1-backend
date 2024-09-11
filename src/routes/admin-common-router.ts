import { Router } from "express";

import commonController from '@controllers/admin/common';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const commonRouter = Router();

commonRouter.use(authAdmin);
commonRouter.post(`/admin/gallery`, commonController.getGallery);


// Export default
export default commonRouter;

import { Router } from "express";

import galleryController from '@controllers/admin/gallery';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const galleryRouter = Router();

galleryRouter.use(authAdmin);

galleryRouter.get(`/gallery/get`, galleryController.get);
galleryRouter.post(`/gallery/store`, galleryController.store);
galleryRouter.get(`/gallery/edit-get`, galleryController.edit);
galleryRouter.delete(`/gallery/delete`, galleryController.destroy);
galleryRouter.post(`/gallery/change-status`, galleryController.changeStatus);

// Export default
export default galleryRouter;

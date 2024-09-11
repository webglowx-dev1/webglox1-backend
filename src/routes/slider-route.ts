import { Router } from "express";

import sliderController from '@controllers/admin/slider';
import { authAdmin } from "@helpers/AdminAuth";

// Constants
const sliderRouter = Router();

sliderRouter.use(authAdmin);

sliderRouter.get(`/slider/get`, sliderController.get);
sliderRouter.post(`/slider/store`, sliderController.store);
sliderRouter.get(`/slider/edit-get`, sliderController.edit);
sliderRouter.delete(`/slider/delete`, sliderController.destroy);
sliderRouter.post(`/slider/change-status`, sliderController.changeStatus);

// Export default
export default sliderRouter;

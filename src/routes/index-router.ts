import { Router } from "express";
import authService from "@controllers/user/auth";
import commonService from "@controllers/user/common";
import multer from "multer";
import adminController from "@controllers/admin/auth";

// Constants
const indexRouter = Router();
// indexRouter.use(decMiddleware.DecryptedData);
indexRouter.get("/juhisss", (req, res) => {
  res.send("juhisss");
});

//Start here for local storage
const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.replace(/\s/g, "_");

    cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + filename);
  },
});

const uploadaa = multer({ storage: storage });
const uploadFilesMiddleware = uploadaa.single("files");
//  End here for local storage

//const upload = multer({ dest: "uploads/" });
//const uploadFilesMiddleware = upload.single('files');

indexRouter.post("/singup", authService.register);
indexRouter.post("/singin", authService.login);

indexRouter.post(
  "/image_upload",
  uploadFilesMiddleware,
  commonService.uploadImage
);
indexRouter.post(
  "/upload_image",
  uploadFilesMiddleware,
  commonService.uploadImage
);
indexRouter.post(`/admin/login`, adminController.login);
indexRouter.get(`/common_get_team`, commonService.getTeam);
indexRouter.get(`/common_get_client`, commonService.getClient);
indexRouter.get(`/common_get_recentprojects`, commonService.getRecentProjects);
indexRouter.get(`/common_get_services`, commonService.getServices);
indexRouter.get(`/common_get_gallery`, commonService.getGallery);
indexRouter.get(`/common_get_slider`, commonService.getSlider);
indexRouter.get(`/common_get_cms`, commonService.getCms)

// Export default
export default indexRouter;

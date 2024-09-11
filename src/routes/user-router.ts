import { Router } from "express";
import authService from "@controllers/user/auth";
import authValidation from "@validation/user/auth-validation";
// import { authUser } from "@helpers/UserAuth";


// Constants
const userRouter = Router();

// userRouter.use(authUser);
userRouter.post("/logout", authService.logout);
userRouter.post("/profile", authValidation.profile, authService.updateProfile);
userRouter.get("/profile", authService.getProfile);
// Export default
export default userRouter;

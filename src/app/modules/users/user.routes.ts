import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUpload";
import { UserValidation } from "./user.validation";

const router = Router();

router.get("/", UserController.getAllUser);

router.get("/me", checkAuth(...Object.values(UserRole)), UserController.getMe);

router.post(
  "/create-user",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUserValidationSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.createUser(req, res, next);
  },
);

router.post(
  "/create-host",
  // checkAuth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createHostValidationSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.createHost(req, res, next);
  },
);

router.patch(
  "/update-user-profile",
  checkAuth(...Object.values(UserRole)),

  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.updateHostValidationSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.updateUserProfile(req, res, next);
  },
);

router.patch(
  "/update-host-profile",
  checkAuth(...Object.values(UserRole)),

  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.updateHostValidationSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.updateHostProfile(req, res, next);
  },
);

router.patch(
  "/delete-profile",
  checkAuth(...Object.values(UserRole)),
  UserController.softDeleteUser,
);
router.patch("/host-status/:id", UserController.updateHostStatus);
router.patch("/user-status/:id", UserController.updateUserStatus);

export const userRoutes = router;

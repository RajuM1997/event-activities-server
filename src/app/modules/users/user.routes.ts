import { Admin } from "./../../../../node_modules/.prisma/client/index.d";
import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import checkAuth from "../../middleware/checkAuth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get("/", UserController.getAllUser);
router.post("/create-user", UserController.createUser);
router.post(
  "/create-admin",
  checkAuth(UserRole.ADMIN),
  UserController.createAdmin
);
router.post(
  "/create-host",
  checkAuth(UserRole.ADMIN),
  UserController.createHost
);

export const userRoutes = router;

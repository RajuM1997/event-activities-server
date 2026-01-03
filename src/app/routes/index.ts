import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { eventRoutes } from "../modules/events/event.route";
import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/event",
    route: eventRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

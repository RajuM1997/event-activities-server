import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expire: process.env.JWT_ACCESS_EXPIRES,
    refresh_expire: process.env.JWT_REFRESH_EXPIRES,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
  },
};

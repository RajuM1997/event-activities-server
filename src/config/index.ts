import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expire: process.env.JWT_ACCESS_EXPIRES,
    refresh_expire: process.env.JWT_REFRESH_EXPIRES,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  stripe: {
    stripe_secret: process.env.STRIPE_SECRET_KEY,
    stripe_web_hook_secret: process.env.STRIPE_WEB_HOOK_SECRET,
  },
};

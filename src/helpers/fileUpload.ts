import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.filename,
    })
    .catch((error) => {
      console.log(error);
    });
  return uploadResult;
};

const deleteFromCloudinary = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
};

const deleteFromLocal = async (filename: string) => {
  const filePath = path.join(process.cwd(), "uploads", filename);

  try {
    await fs.unlink(filePath);
    console.log("Local file deleted");
  } catch (error) {
    console.error("Local delete failed:", error);
  }
};

const deleteImageEverywhere = async (publicId: string, filename: string) => {
  await deleteFromCloudinary(publicId);
  await deleteFromLocal(filename);
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
  deleteImageEverywhere,
};

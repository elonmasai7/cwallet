import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

const enabled =
  Boolean(env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(env.CLOUDINARY_API_KEY) &&
  Boolean(env.CLOUDINARY_API_SECRET);

if (enabled) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(filePath: string) {
  if (!enabled) {
    return { secure_url: filePath };
  }

  return cloudinary.uploader.upload(filePath, {
    folder: "civicwallet/reports",
  });
}


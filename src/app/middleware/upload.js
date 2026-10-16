import imageCompression from "browser-image-compression";
import { uploadCatalogImage, uploadCatalogImages } from "../lib/image-upload.mjs";

export const uploadImageToCloudinary = file => uploadCatalogImage(file, {
  compress: imageCompression,
  uploadUrl: "https://api.cloudinary.com/v1_1/domw8nflv/image/upload",
  uploadPreset: "uefnmap",
});

export const uploadMultipleImagesToCloudinary = files => uploadCatalogImages(files, uploadImageToCloudinary);

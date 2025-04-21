import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "foodconnect-produtos",
    resource_type: "image",
    format: file.mimetype.split("/")[1], // pega o formato dinamicamente
    public_id: file.originalname.split('.')[0], // opcional: nome do arquivo
  }),
});

export const upload = multer({ storage });

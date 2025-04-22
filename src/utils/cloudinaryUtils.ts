import { v2 as cloudinary } from "cloudinary";

export const extractPublicId = (url: string): string | null => {
  const match = url.match(/\/([^\/]+)\.(jpg|jpeg|png|webp|gif)$/);
  return match ? match[1] : null;
};

export const deletarImagemCloudinary = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(`foodconnect-produtos/${publicId}`);
    console.log("🧹 Imagem antiga removida:", publicId);
  } catch (error) {
    console.error("Erro ao deletar imagem do Cloudinary:", error);
  }
};
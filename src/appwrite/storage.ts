import { ID } from "appwrite";
import { config } from "./config";
import { storage } from "./index";

export const uploadStickerImage = async (file: File) => {
  try {
    const res = await storage.createFile({
      bucketId: config.APPWRITE_STORAGE_BUCKET_ID,
      fileId: ID.unique(),
      file,
    });
    return { success: true, data: res, message: "File uploaded successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const deleteStickerImage = async (fileId: string) => {
  try {
    await storage.deleteFile({
      bucketId: config.APPWRITE_STORAGE_BUCKET_ID,
      fileId,
    });
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getStickerThumbnailUrl = (fileId: string, width = 400, height = 400) => {
  return storage.getFilePreview({
    bucketId: config.APPWRITE_STORAGE_BUCKET_ID,
    fileId,
    width,
    height,
  });
};

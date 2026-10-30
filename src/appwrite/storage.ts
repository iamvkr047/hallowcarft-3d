import { ID, Permission, Role } from 'appwrite';
import { config } from './config';
import { storage } from './index';

export const uploadStickerImage = async (file: File, userId: string) => {
  try {
    const res = await storage.createFile({
      bucketId: config.APPWRITE_STORAGE_BUCKET_ID,
      fileId: ID.unique(),
      file,
      permissions: [
        // Grant update and delete access ONLY to the author
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });
    return { success: true, data: res, message: 'File uploaded successfully' };
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
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const getStickerThumbnailUrl = (fileId: string, _width = 400, _height = 400) => {
  return storage.getFileView({
    bucketId: config.APPWRITE_STORAGE_BUCKET_ID,
    fileId,
  });
};

export const downloadStickerThumbnailUrl = (fileId: string) => {
  return storage.getFileDownload({
    bucketId: config.APPWRITE_STORAGE_BUCKET_ID,
    fileId,
  });
};

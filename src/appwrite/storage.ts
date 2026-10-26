import { config } from "./config";
import { storage } from "./index";

export const getStickerThumbnailUrl = (fileId: string, width = 400, height = 400) => {
    return storage.getFilePreview({
        bucketId: config.APPWRITE_STORAGE_BUCKET_ID,
        fileId,
        width,
        height
    });
};
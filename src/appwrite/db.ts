import { type Models, ID, Query } from "appwrite";
import { tablesDb } from "./index";
import { config } from "./config";
import type { StickersType } from "../types";
import { uploadStickerImage, deleteStickerImage } from "./storage";

export type UserStickersType = Models.DefaultRow & StickersType;

export const getAllPublishedStickers = async (limit = 25, offset = 0) => {
  try {
    const res = await tablesDb.listRows<UserStickersType>({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_STICKERS_TABLE_ID,
      queries: [
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
        Query.offset(offset),
      ],
    });
    return {
      status: true,
      data: res.rows,
      total: res.total,
      message: "Stickers fetched successfully",
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
};

export const getUserStickers = async (userId: string, limit = 50, offset = 0) => {
  try {
    const res = await tablesDb.listRows<UserStickersType>({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_STICKERS_TABLE_ID,
      queries: [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
        Query.offset(offset),
      ],
    });
    return {
      status: true,
      data: res.rows,
      total: res.total,
      message: "User stickers fetched successfully",
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
};

export const createStickers = async (data: StickersType) => {
  try {
    const res = await tablesDb.createRow<UserStickersType>({
      rowId: ID.unique(),
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_STICKERS_TABLE_ID,
      data: {
        ...data,
        likesCount: 0,
      },
    });
    return {
      status: true,
      data: res,
      message: "sticker created successfully",
    };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
};

/**
 * Uploads snapshot image to Storage and creates sticker row in DB.
 * If DB creation fails, automatically rolls back by deleting the uploaded file.
 */
export const publishStickerWithImage = async (
  file: File,
  data: Omit<StickersType, "fileId">
) => {
  // 1. Upload snapshot file
  const uploadRes = await uploadStickerImage(file);
  if (!uploadRes.success || !uploadRes.data) {
    return {
      status: false,
      message: uploadRes.message || "Failed to upload sticker image",
    };
  }

  const fileId = uploadRes.data.$id;

  // 2. Create database row
  try {
    const res = await createStickers({
      ...data,
      fileId,
    });

    if (!res.status) {
      throw new Error(res.message);
    }

    return {
      status: true,
      data: res.data,
      message: "Sticker published successfully",
    };
  } catch (error) {
    // 3. Rollback: delete orphaned file
    await deleteStickerImage(fileId);
    return {
      status: false,
      message: (error as Error).message || "Failed to create sticker record",
    };
  }
};

export const deleteSticker = async (rowId: string, fileId?: string) => {
  try {
    await tablesDb.deleteRow({
      databaseId: config.APPWRITE_DATABASE_ID,
      tableId: config.APPWRITE_STICKERS_TABLE_ID,
      rowId,
    });
    if (fileId) {
      await deleteStickerImage(fileId);
    }
    return { status: true, message: "Sticker deleted successfully" };
  } catch (error) {
    return { status: false, message: (error as Error).message };
  }
};

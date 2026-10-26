import { type Models, ID, Query } from "appwrite";
import { tablesDb } from "./index";
import { config } from "./config";
import type { StickersType } from "../types";


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

// TODO: UPDATE AND DELETE Function wrappers

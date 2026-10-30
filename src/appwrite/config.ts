export const config = {
  APPWRITE_PROJECT_ID: (import.meta.env.VITE_APPWRITE_PROJECT_ID || '') as string,
  APPWRITE_ENDPOINT: (import.meta.env.VITE_APPWRITE_ENDPOINT || '') as string,
  APPWRITE_DATABASE_ID: (import.meta.env.VITE_APPWRITE_DATABASE_ID || '') as string,
  APPWRITE_STICKERS_TABLE_ID: (import.meta.env.VITE_APPWRITE_STICKERS_TABLE_ID || '') as string,
  APPWRITE_STORAGE_BUCKET_ID: (import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || '') as string,
};

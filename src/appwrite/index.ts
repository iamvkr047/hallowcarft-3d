import { Client, Account, TablesDB, Storage } from "appwrite";
import { config } from "./config";

const client = new Client()
  .setEndpoint(config.APPWRITE_ENDPOINT)
  .setProject(config.APPWRITE_PROJECT_ID);

const account = new Account(client);
const tablesDb = new TablesDB(client);
const storage = new Storage(client);

export { client, account, tablesDb, storage };
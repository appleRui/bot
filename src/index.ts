/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import LawsonWeb from "./LawsonWeb";
import { createPushMessage } from "./utils/message";
import { pushMessageBySlack } from "./utils/webhook";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const notice = onRequest(async (_, response) => {
  const html = await LawsonWeb.fetchHtml();
  const newDessertList = await LawsonWeb.getNewDessert(html);
  const blocks = createPushMessage(newDessertList);
  logger.log(JSON.stringify(blocks));
  await pushMessageBySlack(blocks);
  response.send(blocks);
});

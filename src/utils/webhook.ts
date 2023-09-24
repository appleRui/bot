import axios from "axios";
import * as logger from "firebase-functions/logger";

export const pushMessageBySlack = async (blocks: unknown) => {
  const res = await axios
    .post(
      process.env.SLACK_WEBHOOK_URL as string,
      { blocks },
      {
        headers: { "Content-Type": "application/json" },
      },
    )
    .catch((error) => {
      const { status, statusText } = error.response;
      const errorMessage = `Error: ${status} ${statusText}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    });
  logger.log(res);
  return res;
};

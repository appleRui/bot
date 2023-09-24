import { Product } from "../LawsonWeb";

export const createPushMessage = (newDessertList: Product[]) => {
  const blockMessage = newDessertList.map((product, index) => {
    return {
      type: "section",
      block_id: `section${index}`,
      text: {
        type: "mrkdwn",
        text: `<${product.url}|${product.name}> \n ${product.price}`,
      },
      accessory: {
        type: "image",
        image_url: `${product.image.url}`,
        alt_text: `${product.name}`,
      },
    };
  });
  return blockMessage;
};

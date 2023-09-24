import axios from "axios";
import * as cheerio from "cheerio";

export type Product = {
  name: string;
  price: string;
  url: string;
  image: {
    url: string;
    alt: string;
  };
};

// ローソンのデザート商品一覧URL
const ORIGIN = "https://www.lawson.co.jp";
const URL = ORIGIN + "/recommend/original/dessert/";

class LawsonWeb {
  /**
   * ローソンのデザートデザート一覧ページのHTMLを取得
   * @return HTML
   */
  async fetchHtml(): Promise<string> {
    const { data: html } = await axios.get<string>(URL);
    return html;
  }

  /**
   * 指定したクラス属性を持つ要素を取得
   * @param element HTML要素
   * @param selector セレクター
   * @return 要素のテキスト
   */
  findElementByClassAttribute(
    element: cheerio.Cheerio<cheerio.Element>,
    selector: string,
  ) {
    const SEARCH_VALUE = "\n\t\t\t\t\t\t\t\t\t\t";
    return element.find(selector).text().replace(SEARCH_VALUE, "");
  }

  /**
   * 新発売の商品かどうかを判定
   * @param element HTML要素
   * @return 新発売かどうか
   */
  hasNewProductLabel(element: cheerio.Cheerio<cheerio.Element>) {
    const SEARCH_VALUE = "\n\t\t\t\t\t\t\t\t\t\t";
    return (
      element.find(".ico_new").text().replace(SEARCH_VALUE, "") === "新発売"
    );
  }

  /**
   * 新発売のデザート商品を取得
   * @param html HTML
   * @return 新発売のデザート商品リスト
   */
  async getNewDessert(html: string) {
    const newDessertList: Product[] = [];

    const $ = cheerio.load(html);
    const newProductElements = $(".heightLineParent > li");

    newProductElements.map((_, element) => {
      if (!this.hasNewProductLabel($(element))) return;

      const productName = this.findElementByClassAttribute($(element), ".ttl");
      const productPrice = this.findElementByClassAttribute(
        $(element),
        ".price > span",
      );
      const productUrl = $(element).find(".img > a").attr("href");
      const productImageUrl = $(element).find(".img > a > img").attr("src");
      newDessertList.push({
        name: productName,
        price: productPrice,
        url: ORIGIN + productUrl,
        image: {
          url: ORIGIN + productImageUrl,
          alt: productName,
        },
      });
    });
    return newDessertList;
  }
}

export default new LawsonWeb();

import { describe, expect, it } from "vitest";

import {
  calculateDetectionConfidence,
  detectProduct,
  extractJsonLdProduct,
  findPurchaseActions,
} from "./product-detection";

type Stub = {
  textContent?: string | null;
  attributes?: Record<string, string>;
  children?: Record<string, Stub | null>;
};

function element(stub: Stub): Element {
  return {
    textContent: stub.textContent ?? null,
    getAttribute: (name: string) => stub.attributes?.[name] ?? null,
    hasAttribute: (name: string) => stub.attributes?.[name] !== undefined,
    querySelector: (selector: string) =>
      stub.children?.[selector] ? element(stub.children[selector]!) : null,
  } as unknown as Element;
}

function documentWith(
  selectors: Record<string, Stub[] | Stub | null>,
): Document {
  return {
    title: "Demo",
    querySelector: (selector: string) => {
      const value = selectors[selector];
      const first = Array.isArray(value) ? value[0] : value;
      return first ? element(first) : null;
    },
    querySelectorAll: (selector: string) => {
      const value = selectors[selector];
      const values = Array.isArray(value) ? value : value ? [value] : [];
      return values.map(element);
    },
  } as unknown as Document;
}

describe("product detection", () => {
  it("extracts a high-confidence Product/Offer JSON-LD record", () => {
    const doc = documentWith({
      'script[type="application/ld+json"]': {
        textContent: JSON.stringify({
          "@type": "Product",
          name: "Cloudstep Runner Sneakers",
          image: "https://shop.test/shoe.png",
          category: "footwear",
          offers: { price: "149.95", priceCurrency: "AUD" },
        }),
      },
    });
    const product = extractJsonLdProduct(doc, "https://shop.test/item");
    expect(product).toMatchObject({
      name: "Cloudstep Runner Sneakers",
      price: 149.95,
      currency: "AUD",
    });
    expect(detectProduct(doc, "https://shop.test/item").confidence).toBe(
      "high",
    );
  });

  it("falls back to semantic product data at medium confidence", () => {
    const doc = documentWith({
      "[data-product-root], main": {
        children: {
          h1: { textContent: "Simple shoes" },
          "[data-product-price]": {
            attributes: {
              "data-product-price": "80",
              "data-product-currency": "AUD",
            },
          },
        },
      },
    });
    const result = detectProduct(doc, "https://shop.test/simple");
    expect(result.source).toBe("semantic");
    expect(result.confidence).toBe("medium");
  });

  it("does not raise confidence for missing product evidence", () => {
    expect(calculateDetectionConfidence(null, null)).toEqual({
      score: 0,
      confidence: "none",
    });
  });

  it("finds only accessible purchase intent actions", () => {
    const doc = documentWith({
      'button, [role="button"], input[type="submit"], [data-purchase-action]': [
        { textContent: "Add to cart" },
        { textContent: "View size guide" },
        { attributes: { "aria-label": "Buy now" } },
      ],
    });
    expect(findPurchaseActions(doc)).toHaveLength(2);
  });
});

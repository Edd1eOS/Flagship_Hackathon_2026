export type DetectedStoreProduct = {
  name: string;
  sourceUrl: string;
  price?: number;
  currency?: "AUD";
  merchant?: string;
  category?: string;
  imageUrl?: string;
  job?: string;
};

export type DetectionSource = "json-ld" | "open-graph" | "semantic";
export type DetectionConfidence = "none" | "low" | "medium" | "high";
export type ProductDetection = {
  product: DetectedStoreProduct | null;
  source: DetectionSource | null;
  score: number;
  confidence: DetectionConfidence;
};

type QueryDocument = Pick<
  Document,
  "querySelector" | "querySelectorAll" | "title"
>;

function text(element: Element | null): string | undefined {
  const value = element?.textContent?.trim();
  return value || undefined;
}

function content(
  document: QueryDocument,
  selector: string,
): string | undefined {
  return (
    document.querySelector(selector)?.getAttribute("content")?.trim() ||
    undefined
  );
}

function price(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function aud(value: unknown): "AUD" | undefined {
  return String(value).toUpperCase() === "AUD" ? "AUD" : undefined;
}

function productNode(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    return value.map(productNode).find(Boolean) ?? null;
  }
  const node = value as Record<string, unknown>;
  if (node["@type"] === "Product") return node;
  const graph = node["@graph"];
  return Array.isArray(graph)
    ? (graph.map(productNode).find(Boolean) ?? null)
    : null;
}

export function extractJsonLdProduct(
  document: QueryDocument,
  sourceUrl: string,
): DetectedStoreProduct | null {
  for (const script of document.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    try {
      const node = productNode(JSON.parse(script.textContent ?? ""));
      if (!node || typeof node.name !== "string") continue;
      const offers = Array.isArray(node.offers) ? node.offers[0] : node.offers;
      const offer =
        offers && typeof offers === "object"
          ? (offers as Record<string, unknown>)
          : {};
      const image = Array.isArray(node.image) ? node.image[0] : node.image;
      const properties = Array.isArray(node.additionalProperty)
        ? node.additionalProperty
        : [node.additionalProperty];
      const jobProperty = properties.find(
        (property) =>
          property &&
          typeof property === "object" &&
          (property as Record<string, unknown>).name === "job",
      ) as Record<string, unknown> | undefined;
      return {
        name: node.name.trim(),
        sourceUrl,
        price: price(offer.price),
        currency: aud(offer.priceCurrency),
        category: typeof node.category === "string" ? node.category : undefined,
        imageUrl: typeof image === "string" ? image : undefined,
        job:
          typeof jobProperty?.value === "string"
            ? jobProperty.value
            : undefined,
      };
    } catch {
      /* Ignore malformed public metadata and continue to fallbacks. */
    }
  }
  return null;
}

export function extractOpenGraphProduct(
  document: QueryDocument,
  sourceUrl: string,
): DetectedStoreProduct | null {
  const name = content(document, 'meta[property="og:title"]');
  if (!name) return null;
  return {
    name,
    sourceUrl,
    price: price(content(document, 'meta[property="product:price:amount"]')),
    currency: aud(content(document, 'meta[property="product:price:currency"]')),
    imageUrl: content(document, 'meta[property="og:image"]'),
    merchant: content(document, 'meta[property="og:site_name"]'),
  };
}

export function extractSemanticProduct(
  document: QueryDocument,
  sourceUrl: string,
): DetectedStoreProduct | null {
  const root = document.querySelector("[data-product-root], main");
  const name = text(root?.querySelector("h1") ?? document.querySelector("h1"));
  if (!name) return null;
  const priceElement = root?.querySelector("[data-product-price]") ?? null;
  return {
    name,
    sourceUrl,
    price: price(priceElement?.getAttribute("data-product-price")),
    currency: aud(priceElement?.getAttribute("data-product-currency")),
    category: text(
      root?.querySelector("[data-product-category]") ?? null,
    )?.replace(/^Category:\s*/i, ""),
  };
}

export function calculateDetectionConfidence(
  product: DetectedStoreProduct | null,
  source: DetectionSource | null,
): { score: number; confidence: DetectionConfidence } {
  if (!product || !source) return { score: 0, confidence: "none" };
  let score = source === "json-ld" ? 0.65 : source === "open-graph" ? 0.4 : 0.3;
  score += product.name ? 0.15 : 0;
  score += product.price !== undefined ? 0.1 : 0;
  score += product.currency ? 0.05 : 0;
  score += product.imageUrl ? 0.05 : 0;
  score = Math.min(1, score);
  return {
    score,
    confidence:
      score >= 0.8
        ? "high"
        : score >= 0.6
          ? "medium"
          : score >= 0.35
            ? "low"
            : "none",
  };
}

export function detectProduct(
  document: QueryDocument,
  sourceUrl: string,
): ProductDetection {
  const candidates: Array<[DetectionSource, DetectedStoreProduct | null]> = [
    ["json-ld", extractJsonLdProduct(document, sourceUrl)],
    ["open-graph", extractOpenGraphProduct(document, sourceUrl)],
    ["semantic", extractSemanticProduct(document, sourceUrl)],
  ];
  const [source, product] = candidates.find(([, candidate]) => candidate) ?? [
    null,
    null,
  ];
  return { product, source, ...calculateDetectionConfidence(product, source) };
}

const PURCHASE_PATTERN = /\b(add to (?:cart|bag)|buy now|purchase)\b/i;
export function findPurchaseActions(document: QueryDocument): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      'button, [role="button"], input[type="submit"], [data-purchase-action]',
    ),
  ).filter((element) => {
    const label =
      element.getAttribute("aria-label") ??
      element.getAttribute("value") ??
      element.textContent ??
      "";
    return (
      PURCHASE_PATTERN.test(label) ||
      element.hasAttribute("data-purchase-action")
    );
  });
}

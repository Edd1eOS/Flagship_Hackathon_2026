import type { DetectedStoreProduct } from "../detection/product-detection";

export type PendingHandoff = {
  importId: string;
  product: DetectedStoreProduct;
  createdAt: string;
};

export type BridgeRequest =
  | { type: "STORE_HANDOFF"; handoff: PendingHandoff }
  | { type: "GET_PENDING_HANDOFF" }
  | { type: "ACK_HANDOFF"; importId: string };

export type BridgeResponse =
  { ok: true; handoff?: PendingHandoff | null } | { ok: false; error: string };

export const PENDING_HANDOFF_KEY = "lemonade.pending-handoff.v1";

import type { DetectedProduct } from "@lemonade/domain";

export type PendingHandoff = {
  importId: string;
  product: DetectedProduct;
  createdAt: string;
};

type Response =
  { ok: true; handoff?: PendingHandoff | null } | { ok: false; error: string };

export function sendBridgeRequest(
  request:
    { type: "GET_PENDING_HANDOFF" } | { type: "ACK_HANDOFF"; importId: string },
  timeoutMs = 1200,
): Promise<Response> {
  const requestId = crypto.randomUUID();
  return new Promise((resolve) => {
    const listener = (event: MessageEvent) => {
      if (
        event.source !== window ||
        event.data?.source !== "lemonade-extension" ||
        event.data?.requestId !== requestId
      )
        return;
      window.clearTimeout(timeout);
      window.removeEventListener("message", listener);
      resolve(event.data.response as Response);
    };
    const timeout = window.setTimeout(() => {
      window.removeEventListener("message", listener);
      resolve({ ok: false, error: "Extension bridge unavailable" });
    }, timeoutMs);
    window.addEventListener("message", listener);
    window.postMessage(
      { source: "lemonade-page", requestId, request },
      location.origin,
    );
  });
}

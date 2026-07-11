import {
  PENDING_HANDOFF_KEY,
  type BridgeRequest,
  type BridgeResponse,
  type PendingHandoff,
} from "../src/bridge/messages";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    async (message: BridgeRequest): Promise<BridgeResponse> => {
      if (message.type === "STORE_HANDOFF") {
        await browser.storage.local.set({
          [PENDING_HANDOFF_KEY]: message.handoff,
        });
        return { ok: true };
      }
      if (message.type === "GET_PENDING_HANDOFF") {
        const result = await browser.storage.local.get(PENDING_HANDOFF_KEY);
        return {
          ok: true,
          handoff:
            (result[PENDING_HANDOFF_KEY] as PendingHandoff | undefined) ?? null,
        };
      }
      const result = await browser.storage.local.get(PENDING_HANDOFF_KEY);
      const pending = result[PENDING_HANDOFF_KEY] as PendingHandoff | undefined;
      if (pending?.importId === message.importId) {
        await browser.storage.local.remove(PENDING_HANDOFF_KEY);
      }
      return { ok: true };
    },
  );
});

import { ALLOWED_MATCHES } from "../src/allowed-origins";
import type { BridgeRequest, BridgeResponse } from "../src/bridge/messages";

type PageRequest = {
  source: "lemonade-page";
  requestId: string;
  request: Extract<
    BridgeRequest,
    { type: "GET_PENDING_HANDOFF" | "ACK_HANDOFF" }
  >;
};

export default defineContentScript({
  matches: ALLOWED_MATCHES,
  main() {
    const listener = async (event: MessageEvent<PageRequest>) => {
      if (event.source !== window || event.data?.source !== "lemonade-page")
        return;
      const response = (await browser.runtime.sendMessage(
        event.data.request,
      )) as BridgeResponse;
      window.postMessage(
        {
          source: "lemonade-extension",
          requestId: event.data.requestId,
          response,
        },
        location.origin,
      );
    };
    window.addEventListener("message", listener);
  },
});

"use client";

import { useEffect, useState } from "react";

import { sendBridgeRequest } from "../../bridge/extension-bridge-client";
import { useLemonade } from "../../repositories/repository-provider";
import { CHARACTER_MANIFEST } from "../../assets/manifest";
import { AssetTile } from "../world/asset-tile";

type ReturnState = "idle" | "returning" | "landed";

export function BridgeImportController() {
  const status = useLemonade((state) => state.status);
  const dispatch = useLemonade((state) => state.dispatch);
  const [returnState, setReturnState] = useState<ReturnState>("idle");

  useEffect(() => {
    if (status !== "ready") return;
    let active = true;
    void sendBridgeRequest({ type: "GET_PENDING_HANDOFF" }).then(
      async (response) => {
        if (!active || !response.ok || !response.handoff) return;
        const handoff = response.handoff;
        const result = await dispatch({
          type: "IMPORT_DETECTED_PRODUCT",
          commandId: `import-${handoff.importId}`,
          importId: handoff.importId,
          product: handoff.product,
        });
        if (!active || !result.ok) return;
        await sendBridgeRequest({
          type: "ACK_HANDOFF",
          importId: handoff.importId,
        });
        setReturnState("returning");
        window.setTimeout(() => active && setReturnState("landed"), 900);
      },
    );
    return () => {
      active = false;
    };
  }, [dispatch, status]);

  if (returnState === "idle") return null;
  return (
    <div
      role="status"
      className={`pointer-events-none fixed right-6 top-20 z-40 flex items-center gap-2 rounded-lg border-2 border-[var(--color-ink)] bg-[var(--color-lemon)] px-4 py-3 text-sm font-bold shadow-lg ${returnState === "returning" ? "animate-[pulse_450ms_ease-in-out_2]" : ""}`}
    >
      <AssetTile
        src={CHARACTER_MANIFEST["scout.carry"].src}
        sprite={CHARACTER_MANIFEST["scout.carry"].sprite}
        alt=""
        tint="transparent"
        className="h-16 w-16"
      />
      {returnState === "returning"
        ? "Scout is returning through Browser Gate…"
        : "Scout landed. Your decision is Cooling."}
    </div>
  );
}

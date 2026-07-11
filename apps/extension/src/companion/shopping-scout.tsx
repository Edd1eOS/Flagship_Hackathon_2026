"use client";

import { useEffect, useState } from "react";

import type { ProductDetection } from "../detection/product-detection";
import type { BridgeResponse, PendingHandoff } from "../bridge/messages";

export type ShoppingScoutProps = {
  detection: ProductDetection;
  purchaseActions: HTMLElement[];
};

type ScoutState = "hidden" | "peeking" | "curious" | "prompting" | "paused";

export function ShoppingScout({
  detection,
  purchaseActions,
}: ShoppingScoutProps) {
  const siteKey = `lemonade.snoozed.${location.hostname}`;
  const promptKey = `lemonade.prompted.${location.pathname}`;
  const [state, setState] = useState<ScoutState>(() => {
    if (sessionStorage.getItem(siteKey) || sessionStorage.getItem(promptKey))
      return "hidden";
    return detection.confidence === "high"
      ? "peeking"
      : detection.confidence === "medium"
        ? "curious"
        : "hidden";
  });

  useEffect(() => {
    if (detection.confidence !== "high" || state === "hidden") return;
    const handleIntent = () => {
      if (!sessionStorage.getItem(promptKey)) setState("prompting");
    };
    purchaseActions.forEach((action) =>
      action.addEventListener("click", handleIntent),
    );
    return () =>
      purchaseActions.forEach((action) =>
        action.removeEventListener("click", handleIntent),
      );
  }, [detection.confidence, promptKey, purchaseActions, state]);

  if (state === "hidden" || !detection.product) return null;

  const continueNeutral = () => {
    sessionStorage.setItem(promptKey, "continued");
    setState("peeking");
  };
  const snooze = () => {
    sessionStorage.setItem(siteKey, "true");
    setState("hidden");
  };
  const hide = () => {
    sessionStorage.setItem(promptKey, "hidden");
    setState("hidden");
  };
  const pause = async () => {
    const handoff: PendingHandoff = {
      importId: crypto.randomUUID(),
      product: detection.product!,
      createdAt: new Date().toISOString(),
    };
    const response = (await browser.runtime.sendMessage({
      type: "STORE_HANDOFF",
      handoff,
    })) as BridgeResponse;
    if (!response.ok) return;
    sessionStorage.setItem(promptKey, "paused");
    setState("paused");
    window.open(
      `${location.origin}/?handoff=${encodeURIComponent(handoff.importId)}`,
      "lemonade-lane",
    );
  };

  return (
    <aside
      className={`lemonade-scout lemonade-scout--${state}`}
      aria-label="Lemonade Browser Scout"
    >
      <div
        className="lemonade-scout__mouse"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${browser.runtime.getURL("/scout-sheet.png")})`,
          backgroundPosition:
            state === "paused"
              ? "100% 0%"
              : state === "prompting"
                ? "50% 0%"
                : "0% 0%",
        }}
      />
      {state === "prompting" ? (
        <div
          className="lemonade-scout__prompt"
          role="dialog"
          aria-label="Pause before buying"
        >
          <p className="lemonade-scout__eyebrow">Before you buy</p>
          <strong>{detection.product.name}</strong>
          <p>Want to pause and check what you already own?</p>
          <div className="lemonade-scout__actions">
            <button type="button" onClick={() => void pause()}>
              Pause
            </button>
            <button type="button" onClick={continueNeutral}>
              Continue anyway
            </button>
          </div>
          <div className="lemonade-scout__secondary">
            <button type="button" onClick={snooze}>
              Snooze this site for this tab
            </button>
            <button type="button" onClick={hide}>
              Hide
            </button>
          </div>
        </div>
      ) : state === "paused" ? (
        <div className="lemonade-scout__prompt" role="status">
          <strong>Paused in this tab</strong>
          <p>
            No checkout data was read. The product is safely waiting for
            Lemonade Lane.
          </p>
          <button type="button" onClick={hide}>
            Close
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="lemonade-scout__peek"
          onClick={() =>
            detection.confidence === "high" && setState("prompting")
          }
          aria-label={
            state === "curious"
              ? "Possible product detected; open Lemonade Scout"
              : "Open Lemonade Scout"
          }
        >
          {state === "curious" ? "Possible product" : "Scout ready"}
        </button>
      )}
    </aside>
  );
}

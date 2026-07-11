"use client";

import { findSameJobMatches, type OwnedItem } from "@lemonade/domain";
import { ArrowLeft, Camera, MousePointer2, PenLine } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import type { LemonadeStoreState } from "../../store/lemonade-store";

type Classification = "need" | "replacement" | "want";

const CLASSIFICATION_MOTIVE = {
  need: "need",
  replacement: "replacement",
  want: "mood",
} as const;

export type CaptureFlowProps = {
  ownedItems: OwnedItem[];
  dispatch: LemonadeStoreState["dispatch"];
  onClose: () => void;
};

export function CaptureFlow({
  ownedItems,
  dispatch,
  onClose,
}: CaptureFlowProps) {
  const [name, setName] = useState("Everyday walking sneakers");
  const [price, setPrice] = useState("149.95");
  const [category, setCategory] = useState("footwear");
  const [job, setJob] = useState("daily walking");
  const [classification, setClassification] = useState<Classification>("want");
  const [mode, setMode] = useState<"manual" | "photo">("manual");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewAt, setReviewAt] = useState<string | null>(null);

  const matches = useMemo(
    () => findSameJobMatches({ name, category, job }, ownedItems).slice(0, 3),
    [category, job, name, ownedItems],
  );
  const bestMatch = matches[0] ?? null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericPrice = Number(price);
    if (!name.trim() || !category.trim() || !job.trim()) {
      setError("Name, category, and job are required.");
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Enter a valid AUD price.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const capture = await dispatch({
      type: "CAPTURE_DECISION",
      commandId: crypto.randomUUID(),
      draft: {
        name: name.trim(),
        price: numericPrice,
        currency: "AUD",
        category: category.trim(),
        job: job.trim(),
        motive: CLASSIFICATION_MOTIVE[classification],
        origin: "manual",
      },
    });
    if (!capture.ok) {
      setError(capture.error.message);
      setSubmitting(false);
      return;
    }

    const decision = capture.state.decisions.at(-1);
    if (!decision) {
      setError("The captured decision could not be found.");
      setSubmitting(false);
      return;
    }
    const cooling = await dispatch({
      type: "START_COOLING",
      commandId: crypto.randomUUID(),
      decisionId: decision.id,
    });
    if (!cooling.ok) {
      setError(cooling.error.message);
      setSubmitting(false);
      return;
    }
    const cooledDecision = cooling.state.decisions.find(
      (candidate) => candidate.id === decision.id,
    );
    setReviewAt(cooledDecision?.reviewAt ?? null);
    setSubmitting(false);
  }

  if (reviewAt) {
    return (
      <aside
        aria-label="Cooling confirmation"
        className="flex h-full w-full flex-col gap-5 overflow-y-auto p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-6"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-sky)]">
          Cooling started
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Give it 24 hours
        </h2>
        <p className="text-sm text-[var(--color-ink)]/70">
          {name} is safely parked. Nothing has been bought or counted as saved.
        </p>
        <dl className="border-y border-[var(--color-line)] py-4 text-sm">
          <dt className="font-semibold text-[var(--color-ink)]/60">
            Review after
          </dt>
          <dd className="mt-1 font-semibold">
            {new Date(reviewAt).toLocaleString()}
          </dd>
        </dl>
        <button
          type="button"
          onClick={onClose}
          className="mt-auto rounded-full bg-[var(--color-ink)] px-4 py-3 text-sm font-bold text-white"
        >
          Back to town
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Capture a purchase decision"
      className="flex h-full w-full flex-col overflow-y-auto p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-6"
    >
      <button
        type="button"
        onClick={onClose}
        className="mb-4 flex items-center gap-1.5 self-start text-sm font-semibold text-[var(--color-ink)]/70"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Today
      </button>
      <h2 className="font-[family-name:var(--font-display)] text-3xl">
        What are you tempted by?
      </h2>

      <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Capture method">
        <button
          type="button"
          aria-pressed={mode === "manual"}
          onClick={() => setMode("manual")}
          className={`flex min-h-11 items-center justify-center gap-1 rounded-lg border-2 text-xs font-bold ${mode === "manual" ? "border-[var(--color-lemon)]" : "border-[var(--color-line)]"}`}
        >
          <PenLine size={14} aria-hidden="true" /> Manual
        </button>
        <button
          type="button"
          aria-pressed={mode === "photo"}
          onClick={() => setMode("photo")}
          className={`flex min-h-11 items-center justify-center gap-1 rounded-lg border-2 text-xs ${mode === "photo" ? "border-[var(--color-lemon)] font-bold" : "border-[var(--color-line)]"}`}
        >
          <Camera size={14} aria-hidden="true" /> Photo
        </button>
        <button
          type="button"
          disabled
          title="Extension prefill arrives in Stage 12"
          className="flex min-h-11 items-center justify-center gap-1 rounded-lg border border-[var(--color-line)] text-xs opacity-50"
        >
          <MousePointer2 size={14} aria-hidden="true" /> Scout
        </button>
      </div>

      <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
        {mode === "photo" ? (
          <label className="rounded-lg border border-dashed border-[var(--color-line)] p-3 text-sm font-semibold">
            Product photo
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setPhotoName(event.target.files?.[0]?.name ?? null)
              }
              className="mt-2 block w-full text-xs font-normal"
            />
            <span className="mt-2 block text-xs font-normal text-[var(--color-ink)]/60">
              {photoName ?? "Photo stays in this form and is not uploaded."}
            </span>
          </label>
        ) : null}
        <label className="text-sm font-semibold">
          Item name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 font-normal"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-semibold">
            Price (AUD)
            <input
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            Category
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 font-normal"
            />
          </label>
        </div>
        <label className="text-sm font-semibold">
          What job should it do?
          <input
            value={job}
            onChange={(event) => setJob(event.target.value)}
            className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] bg-white px-3 font-normal"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-semibold">How does this feel?</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["need", "replacement", "want"] as const).map((value) => (
              <label
                key={value}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-2 text-xs font-bold capitalize ${
                  classification === value
                    ? "border-[var(--color-lemon)] bg-[var(--color-lemon)]/20"
                    : "border-[var(--color-line)]"
                }`}
              >
                <input
                  type="radio"
                  name="classification"
                  value={value}
                  checked={classification === value}
                  onChange={() => setClassification(value)}
                  className="sr-only"
                />
                {value}
              </label>
            ))}
          </div>
        </fieldset>

        <section className="border-y border-[var(--color-line)] py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-leaf)]">
            Same-job check
          </p>
          {bestMatch ? (
            <>
              <p className="mt-2 text-sm font-bold">{bestMatch.item.name}</p>
              <p className="mt-1 text-sm text-[var(--color-ink)]/70">
                {bestMatch.reasons[0]}
              </p>
              {matches.length > 1 ? (
                <p className="mt-1 text-xs text-[var(--color-ink)]/50">
                  +{matches.length - 1} more possible match
                  {matches.length > 2 ? "es" : ""}
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-ink)]/60">
              No same-job item found. You can still continue.
            </p>
          )}
        </section>

        {error ? (
          <p
            role="alert"
            className="text-sm font-semibold text-[var(--color-coral)]"
          >
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 rounded-full bg-[var(--color-ink)] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {submitting ? "Starting Cooling…" : "Pause for 24 hours"}
        </button>
      </form>
    </aside>
  );
}

"use client";

import type { LemonadeStoreState } from "../../store/lemonade-store";
import type { OwnedItem } from "@lemonade/domain";
import { useState, type FormEvent } from "react";

export type MyStuffPanelProps = {
  items: OwnedItem[];
  dispatch: LemonadeStoreState["dispatch"];
};

export function MyStuffPanel({ items, dispatch }: MyStuffPanelProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [useTag, setUseTag] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await dispatch({
      type: "QUICK_ADD_OWNED_ITEM",
      commandId: crypto.randomUUID(),
      name: name.trim(),
      category: category.trim(),
      useTag: useTag.trim(),
      condition: "unknown",
    });
    if (!result.ok) return setError(result.error.message);
    setName("");
    setCategory("");
    setUseTag("");
    setAdding(false);
    setError(null);
  }

  return (
    <aside
      aria-label="My Stuff"
      className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[400px] lg:shrink-0 lg:border-l lg:border-[var(--color-line)] lg:p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          My Stuff
        </h2>
        <button
          type="button"
          onClick={() => setAdding((value) => !value)}
          className="min-h-11 rounded-full bg-[var(--color-ink)] px-4 text-sm font-bold text-white"
        >
          Quick Add
        </button>
      </div>
      {adding ? (
        <form
          onSubmit={submit}
          className="grid gap-3 border-y border-[var(--color-line)] py-4"
        >
          <label className="text-sm font-semibold">
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] px-3 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            Category
            <input
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] px-3 font-normal"
            />
          </label>
          <label className="text-sm font-semibold">
            What job does it do?
            <input
              required
              value={useTag}
              onChange={(event) => setUseTag(event.target.value)}
              className="mt-1 min-h-11 w-full rounded-lg border border-[var(--color-line)] px-3 font-normal"
            />
          </label>
          <button
            type="submit"
            className="min-h-11 rounded-full bg-[var(--color-leaf)] text-sm font-bold text-white"
          >
            Add to My Stuff
          </button>
          {error ? (
            <p role="alert" className="text-sm text-[var(--color-coral)]">
              {error}
            </p>
          ) : null}
        </form>
      ) : null}
      {items.length ? (
        <ul className="grid gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-b border-[var(--color-line)] py-2"
            >
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-[var(--color-ink)]/60">
                {item.category} · {item.condition} · {item.useTags.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--color-ink)]/60">
          Nothing saved yet. Quick Add an item, or continue without a match.
        </p>
      )}
    </aside>
  );
}

import { Radar } from "lucide-react";

import { NAV_ITEMS, type NavId } from "./nav-items";

export type NavRailProps = {
  active: NavId;
  onSelect: (id: NavId) => void;
  patrolLabel: string;
};

export function NavRail({ active, onSelect, patrolLabel }: NavRailProps) {
  return (
    <nav
      aria-label="Primary"
      className="hidden w-16 shrink-0 flex-col items-center justify-between border-r border-[var(--color-line)] bg-[var(--color-paper)] py-4 lg:flex"
    >
      <ul className="flex flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                title={item.label}
                aria-label={item.label}
                aria-current={selected ? "page" : undefined}
                onClick={() => onSelect(item.id)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                  selected
                    ? "bg-[var(--color-lemon)] text-[var(--color-ink)]"
                    : "text-[var(--color-ink)]/70 hover:bg-[var(--color-cream)]"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <div
        title={`Patrol: ${patrolLabel}`}
        aria-label={`Patrol: ${patrolLabel}`}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-[var(--color-ink)]/50"
      >
        <Radar size={20} aria-hidden="true" />
      </div>
    </nav>
  );
}

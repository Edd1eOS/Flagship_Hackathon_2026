import { NAV_ITEMS, type NavId } from "./nav-items";

export type MobileBottomNavProps = {
  active: NavId;
  onSelect: (id: NavId) => void;
};

export function MobileBottomNav({ active, onSelect }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Primary"
      className="flex h-16 shrink-0 items-stretch border-t border-[var(--color-line)] bg-[var(--color-paper)] lg:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-current={selected ? "page" : undefined}
            onClick={() => onSelect(item.id)}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
              selected
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-ink)]/50"
            }`}
          >
            <Icon size={20} aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

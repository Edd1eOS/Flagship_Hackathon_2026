export type OnboardingHintProps = {
  onDismiss: () => void;
};

export function OnboardingHint({ onDismiss }: OnboardingHintProps) {
  return (
    <div
      role="note"
      className="flex flex-wrap items-center justify-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-cream)] px-4 py-2 text-center text-sm"
    >
      <span>
        {
          "New here? Tap \"I'm tempted\" before buying something, or tap a building in town to see what's happening there."
        }
      </span>
      <button
        type="button"
        onClick={onDismiss}
        className="min-h-11 shrink-0 rounded-full border border-[var(--color-line)] px-3 text-xs font-bold"
      >
        Got it
      </button>
    </div>
  );
}

export type OnboardingModalProps = {
  onClose: () => void;
};

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Lemonade Lane"
        className="flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-lg"
      >
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Welcome to Lemonade Lane
        </h2>
        <p className="text-sm text-[var(--color-ink)]/80">
          Before buying something new, Lemonade helps you check whether you
          already own something that does the same job.
        </p>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-leaf)]">
            Try this first
          </p>
          <ol className="mt-2 flex list-decimal flex-col gap-2 pl-5 text-sm">
            <li>
              You already have one decision waiting - tap{" "}
              <strong>Review now</strong> to see it.
            </li>
            <li>
              Tap &quot;I&apos;m tempted&quot; any time you&apos;re about to buy
              something new.
            </li>
            <li>
              Tap a building in town. Locked ones explain what unlocks them.
            </li>
            <li>
              Use the icons on the side (or the bottom bar on mobile) to jump to
              Decisions, My Stuff, or your Goal.
            </li>
          </ol>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 min-h-11 w-full rounded-full bg-[var(--color-ink)] text-sm font-bold text-white"
        >
          Got it, let&apos;s explore
        </button>
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

import { AppShell } from "../components/shell/app-shell";
import { BridgeImportController } from "../components/bridge/bridge-import-controller";

// RepositoryProvider touches window.localStorage in its lazy useState
// initializer, so it must never run during server rendering.
const RepositoryProvider = dynamic(
  () =>
    import("../repositories/repository-provider").then(
      (module) => module.RepositoryProvider,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-paper)]">
        <p className="text-sm font-semibold text-[var(--color-ink)]/70">
          Loading Lemonade Lane…
        </p>
      </div>
    ),
  },
);

export default function HomePage() {
  return (
    <RepositoryProvider>
      <BridgeImportController />
      <AppShell />
    </RepositoryProvider>
  );
}

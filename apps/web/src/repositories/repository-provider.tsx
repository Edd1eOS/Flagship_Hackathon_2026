"use client";

import { SystemClock, SystemIdGenerator } from "@lemonade/domain";
import { createTownEngine } from "@lemonade/game-engine";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";

import {
  createLemonadeStore,
  type LemonadeStore,
  type LemonadeStoreState,
} from "../store/lemonade-store";
import { WebLocalRepository } from "./web-local-repository";

const LemonadeStoreContext = createContext<LemonadeStore | null>(null);

function createBrowserStore(): LemonadeStore {
  const repository = new WebLocalRepository(
    new SystemClock(),
    new SystemIdGenerator(),
    window.localStorage,
    { townEngine: createTownEngine() },
  );
  return createLemonadeStore(repository);
}

// Touches window.localStorage during the lazy useState initializer, so this
// provider must only ever render on the client. Import it at the usage site
// with next/dynamic(() => import(...), { ssr: false }).
export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createBrowserStore);
  return (
    <LemonadeStoreContext.Provider value={store}>
      {children}
    </LemonadeStoreContext.Provider>
  );
}

export function useLemonade<T>(selector: (state: LemonadeStoreState) => T): T {
  const store = useContext(LemonadeStoreContext);
  if (!store) {
    throw new Error("useLemonade must be used inside RepositoryProvider");
  }
  return useStore(store, selector);
}

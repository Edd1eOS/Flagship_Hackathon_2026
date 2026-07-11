import type {
  AppState,
  Command,
  LemonadeRepository,
  TransactionResult,
  TransientEffect,
} from "@lemonade/domain";
import { createStore } from "zustand/vanilla";

export type LemonadeStoreState = {
  status: "loading" | "ready" | "error";
  appState: AppState | null;
  loadError: string | null;
  uiEffects: TransientEffect[];
  // Components change state only through commands; there is no setter API.
  dispatch: (command: Command) => Promise<TransactionResult>;
  resetDemo: () => Promise<void>;
  consumeUiEffect: () => void;
};

export type LemonadeStore = ReturnType<typeof createLemonadeStore>;

export function createLemonadeStore(repository: LemonadeRepository) {
  const store = createStore<LemonadeStoreState>(() => ({
    status: "loading",
    appState: null,
    loadError: null,
    uiEffects: [],

    dispatch: async (command) => {
      const result = await repository.transact(command);
      if (result.ok && result.effects.length > 0) {
        store.setState((state) => ({
          uiEffects: [...state.uiEffects, ...result.effects],
        }));
      }
      return result;
    },

    resetDemo: async () => {
      await repository.resetDemo();
    },

    consumeUiEffect: () => {
      store.setState((state) => ({ uiEffects: state.uiEffects.slice(1) }));
    },
  }));

  repository.subscribe((state) => {
    store.setState({ status: "ready", appState: state, loadError: null });
  });

  void repository
    .load()
    .then((state) => {
      store.setState({ status: "ready", appState: state, loadError: null });
    })
    .catch((error: unknown) => {
      store.setState({
        status: "error",
        loadError: error instanceof Error ? error.message : String(error),
      });
    });

  return store;
}

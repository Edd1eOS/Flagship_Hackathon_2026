import type {
  AppState,
  Command,
  LemonadeRepository,
  RepositoryOptions,
  StateListener,
  TransactionResult,
} from "@lemonade/domain";
import type { Clock, IdGenerator } from "@lemonade/domain";
import {
  createCommandDependencies,
  executeCommand,
  migrateAppState,
  promoteReadyDecisions,
} from "@lemonade/domain";

export const APP_STATE_STORAGE_KEY = "lemonade.app-state.v1";

// Narrow view of the Web Storage API so tests can inject a fake.
export type KeyValueStorage = Pick<Storage, "getItem" | "setItem">;

export class WebLocalRepository implements LemonadeRepository {
  #deps;
  #storage: KeyValueStorage;
  #state: AppState | null = null;
  #listeners = new Set<StateListener>();

  constructor(
    clock: Clock,
    ids: IdGenerator,
    storage: KeyValueStorage,
    options: RepositoryOptions = {},
  ) {
    this.#deps = createCommandDependencies(
      clock,
      ids,
      options.seedFactory,
      options.townEngine,
    );
    this.#storage = storage;
    this.#state = options.initialState ?? null;
  }

  async load(): Promise<AppState> {
    if (this.#state) {
      return this.#state;
    }

    const raw = this.#storage.getItem(APP_STATE_STORAGE_KEY);
    if (raw !== null) {
      try {
        const migrated = migrateAppState(JSON.parse(raw));
        this.#state = promoteReadyDecisions(migrated, this.#deps.clock.now());
        if (this.#state !== migrated) this.#persist(this.#state);
        return this.#state;
      } catch (error) {
        console.warn(
          "[lemonade] Stored state was invalid or from an unsupported version; falling back to the demo seed.",
          error,
        );
      }
    }

    this.#state = this.#deps.createSeed();
    this.#persist(this.#state);
    return this.#state;
  }

  async transact(command: Command): Promise<TransactionResult> {
    const current = await this.load();
    const result = executeCommand(current, command, this.#deps);
    if (result.ok && !result.duplicateCommand) {
      this.#state = result.state;
      this.#persist(result.state);
      this.#notify(result.state);
    }
    return result;
  }

  subscribe(listener: StateListener): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  async resetDemo(): Promise<AppState> {
    const result = await this.transact({
      type: "RESET_DEMO",
      commandId: this.#deps.ids.nextId("cmd"),
    });
    if (!result.ok) {
      throw new Error(`Reset failed: ${result.error.message}`);
    }
    return result.state;
  }

  #persist(state: AppState): void {
    this.#storage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(state));
  }

  #notify(state: AppState): void {
    for (const listener of this.#listeners) {
      listener(state);
    }
  }
}

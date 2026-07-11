import type { Clock } from "./clock";
import type { Command } from "./commands/command";
import type { IdGenerator } from "./ids";
import type { AppState } from "./schemas/app-state";
import { createSeedState } from "./seed";
import type {
  CommandDependencies,
  TownEngine,
  TransactionResult,
} from "./transaction";
import { executeCommand } from "./transaction";

export type StateListener = (state: AppState) => void;

export interface LemonadeRepository {
  load(): Promise<AppState>;
  transact(command: Command): Promise<TransactionResult>;
  subscribe(listener: StateListener): () => void;
  resetDemo(): Promise<AppState>;
}

export type RepositoryOptions = {
  initialState?: AppState;
  seedFactory?: () => AppState;
  townEngine?: TownEngine;
};

export function createCommandDependencies(
  clock: Clock,
  ids: IdGenerator,
  seedFactory?: () => AppState,
  townEngine?: TownEngine,
): CommandDependencies {
  return {
    clock,
    ids,
    createSeed: seedFactory ?? (() => createSeedState(clock, ids)),
    town: townEngine,
  };
}

export class InMemoryRepository implements LemonadeRepository {
  #deps: CommandDependencies;
  #state: AppState | null;
  #listeners = new Set<StateListener>();

  constructor(clock: Clock, ids: IdGenerator, options: RepositoryOptions = {}) {
    this.#deps = createCommandDependencies(
      clock,
      ids,
      options.seedFactory,
      options.townEngine,
    );
    this.#state = options.initialState ?? null;
  }

  async load(): Promise<AppState> {
    if (!this.#state) {
      this.#state = this.#deps.createSeed();
    }
    return this.#state;
  }

  async transact(command: Command): Promise<TransactionResult> {
    const current = await this.load();
    const result = executeCommand(current, command, this.#deps);
    if (result.ok && !result.duplicateCommand) {
      this.#state = result.state;
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

  #notify(state: AppState): void {
    for (const listener of this.#listeners) {
      listener(state);
    }
  }
}

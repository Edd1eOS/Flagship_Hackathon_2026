// crypto.randomUUID exists in both Node.js >=22 and browsers; declared locally
// because this package deliberately excludes DOM and Node type libraries.
declare const crypto: { randomUUID(): string };

export interface IdGenerator {
  nextId(kind: string): string;
}

export class SystemIdGenerator implements IdGenerator {
  nextId(kind: string): string {
    return `${kind}_${crypto.randomUUID()}`;
  }
}

export class DeterministicIdGenerator implements IdGenerator {
  #counters = new Map<string, number>();

  nextId(kind: string): string {
    const next = (this.#counters.get(kind) ?? 0) + 1;
    this.#counters.set(kind, next);
    return `${kind}_${String(next).padStart(4, "0")}`;
  }
}

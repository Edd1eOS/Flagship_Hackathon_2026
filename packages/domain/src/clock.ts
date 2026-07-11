export interface Clock {
  now(): Date;
}

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}

export class FixedClock implements Clock {
  #current: Date;

  constructor(startAt: string | Date) {
    const parsed = startAt instanceof Date ? startAt : new Date(startAt);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error(
        `FixedClock received an invalid start time: ${String(startAt)}`,
      );
    }
    this.#current = parsed;
  }

  now(): Date {
    return new Date(this.#current.getTime());
  }

  advanceByMinutes(minutes: number): void {
    this.#current = new Date(this.#current.getTime() + minutes * 60_000);
  }
}

export function toIsoTimestamp(date: Date): string {
  return date.toISOString();
}

import { DOMAIN_PACKAGE_NAME } from "@lemonade/domain";

export const GAME_ENGINE_PACKAGE_NAME = "@lemonade/game-engine" as const;

export const GAME_ENGINE_DOMAIN_DEPENDENCY = DOMAIN_PACKAGE_NAME;

export * from "./effects";
export * from "./eligibility";
export * from "./projector";
export * from "./assignments";
export * from "./simulate-cycle";
export * from "./invariants";
export * from "./progression";
export * from "./selectors";
export * from "./town-engine";

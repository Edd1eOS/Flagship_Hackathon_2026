import type { OwnedItemCondition } from "../schemas/owned-item";
import type {
  DecisionMotive,
  DecisionOrigin,
} from "../schemas/purchase-decision";
import type { ReflectionOutcome } from "../schemas/reflection";
import type { ReuseAction } from "../schemas/reuse-commitment";
import type { MissionType } from "../schemas/mission";
import type { LocationId } from "../schemas/town";

type CommandBase<TType extends string> = {
  // Stable client-generated ID used to deduplicate replayed commands.
  commandId: string;
  type: TType;
};

export type CaptureDecisionCommand = CommandBase<"CAPTURE_DECISION"> & {
  draft: {
    name: string;
    price: number;
    currency: "AUD";
    category: string;
    job: string;
    motive: DecisionMotive;
    origin: DecisionOrigin;
    imageRef?: string;
    sourceUrl?: string;
    merchant?: string;
  };
};

export type StartCoolingCommand = CommandBase<"START_COOLING"> & {
  decisionId: string;
};

export type ResolveDecisionCommand = CommandBase<"RESOLVE_DECISION"> & {
  decisionId: string;
  outcome: ReflectionOutcome;
  reason?: string;
  // Buy is neutral; optionally record the purchase as an owned item.
  addToMyStuff?: boolean;
};

export type ExtendCoolingCommand = CommandBase<"EXTEND_COOLING"> & {
  decisionId: string;
};

export type QuickAddOwnedItemCommand = CommandBase<"QUICK_ADD_OWNED_ITEM"> & {
  name: string;
  category: string;
  useTag: string;
  condition?: OwnedItemCondition;
};

export type CommitReuseCommand = CommandBase<"COMMIT_REUSE"> & {
  decisionId: string;
  ownedItemId: string;
  action: ReuseAction;
  note?: string;
};

export type OfferMissionCommand = CommandBase<"OFFER_MISSION"> & {
  decisionId: string;
  ownedItemId?: string;
  missionType: MissionType;
};

export type AcceptMissionCommand = CommandBase<"ACCEPT_MISSION"> & {
  missionId: string;
};

export type CompleteMissionCommand = CommandBase<"COMPLETE_MISSION"> & {
  missionId: string;
};

export type CancelMissionCommand = CommandBase<"CANCEL_MISSION"> & {
  missionId: string;
};

export type PlanAllocationCommand = CommandBase<"PLAN_ALLOCATION"> & {
  decisionId: string;
  goalId: string;
  amount: number;
};

export type DetectedProduct = {
  name: string;
  sourceUrl: string;
  price?: number;
  currency?: "AUD";
  merchant?: string;
  category?: string;
  imageUrl?: string;
  job?: string;
};

export type ImportDetectedProductCommand =
  CommandBase<"IMPORT_DETECTED_PRODUCT"> & {
    importId: string;
    product: DetectedProduct;
  };

export type PreviewAssignmentCommand = CommandBase<"PREVIEW_ASSIGNMENT"> & {
  residentId: string;
  locationId: LocationId;
};

export type CancelAssignmentCommand = CommandBase<"CANCEL_ASSIGNMENT"> & {
  residentId: string;
};

export type ConfirmTownPlanCommand = CommandBase<"CONFIRM_TOWN_PLAN"> & {
  assignments: ReadonlyArray<{ residentId: string; locationId: LocationId }>;
};

export type SelectRewardCommand = CommandBase<"SELECT_REWARD"> & {
  rewardId: string;
};

export type ResetDemoCommand = CommandBase<"RESET_DEMO">;

export type Command =
  | CaptureDecisionCommand
  | StartCoolingCommand
  | ResolveDecisionCommand
  | ExtendCoolingCommand
  | QuickAddOwnedItemCommand
  | CommitReuseCommand
  | OfferMissionCommand
  | AcceptMissionCommand
  | CompleteMissionCommand
  | CancelMissionCommand
  | PlanAllocationCommand
  | ImportDetectedProductCommand
  | PreviewAssignmentCommand
  | CancelAssignmentCommand
  | ConfirmTownPlanCommand
  | SelectRewardCommand
  | ResetDemoCommand;

export type CommandType = Command["type"];

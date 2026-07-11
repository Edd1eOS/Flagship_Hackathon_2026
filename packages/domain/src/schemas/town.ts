import { z } from "zod";

import { entityIdSchema } from "./primitives";

export const locationIdSchema = z.enum([
  "home_nook",
  "browser_gate",
  "workshop",
  "picnic_green",
  "little_station",
  "quiet_garden",
]);
export type LocationId = z.infer<typeof locationIdSchema>;

export const locationStateSchema = z.enum([
  "locked",
  "available",
  "assigned",
  "active",
  "lived_in",
]);
export type LocationState = z.infer<typeof locationStateSchema>;

export const townLocationSchema = z.strictObject({
  id: locationIdSchema,
  state: locationStateSchema,
});
export type TownLocation = z.infer<typeof townLocationSchema>;

export const residentRoleSchema = z.enum(["scout", "mender", "host"]);
export type ResidentRole = z.infer<typeof residentRoleSchema>;

export const companionModeSchema = z.enum([
  "patrol",
  "returning",
  "cooler_check",
  "acknowledge",
]);
export type CompanionMode = z.infer<typeof companionModeSchema>;

export const residentStateSchema = z
  .strictObject({
    id: entityIdSchema,
    role: residentRoleSchema,
    assignable: z.boolean(),
    locationId: locationIdSchema,
    projectId: entityIdSchema.nullable(),
    activityId: entityIdSchema.nullable(),
  })
  .superRefine((resident, ctx) => {
    if (resident.role === "scout" && resident.assignable) {
      ctx.addIssue({
        code: "custom",
        path: ["assignable"],
        message: "Scout is never assignable to town projects",
      });
    }
  });
export type ResidentState = z.infer<typeof residentStateSchema>;

export const townStateSchema = z
  .strictObject({
    locations: z.array(townLocationSchema),
    residents: z.array(residentStateSchema),
    scoutMode: companionModeSchema,
  })
  .superRefine((town, ctx) => {
    const locationIds = new Set(town.locations.map((location) => location.id));
    if (locationIds.size !== town.locations.length) {
      ctx.addIssue({
        code: "custom",
        path: ["locations"],
        message: "Town locations must be unique",
      });
    }

    const roles = town.residents.map((resident) => resident.role);
    if (new Set(roles).size !== roles.length) {
      ctx.addIssue({
        code: "custom",
        path: ["residents"],
        message: "Each resident role may appear at most once",
      });
    }

    for (const [index, resident] of town.residents.entries()) {
      if (!locationIds.has(resident.locationId)) {
        ctx.addIssue({
          code: "custom",
          path: ["residents", index, "locationId"],
          message: `Resident location "${resident.locationId}" is not part of the town`,
        });
      }
    }
  });
export type TownState = z.infer<typeof townStateSchema>;

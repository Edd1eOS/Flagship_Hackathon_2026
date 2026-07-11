import { ClipboardList, Home, Package, Target } from "lucide-react";
import type { ComponentType } from "react";

export type NavId = "town" | "decisions" | "my-stuff" | "goal";

export type NavItem = {
  id: NavId;
  label: string;
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" }>;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "town", label: "Town", icon: Home },
  { id: "decisions", label: "Decisions", icon: ClipboardList },
  { id: "my-stuff", label: "My Stuff", icon: Package },
  { id: "goal", label: "Goal", icon: Target },
];

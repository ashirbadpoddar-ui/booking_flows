export type Actor = { id: string; role: "customer" | "staff" | "admin" } | null;
export function canReadBooking(actor: Actor, customerId: string) { return !!actor && (actor.role === "admin" || actor.id === customerId); }
export function canManageBusiness(actor: Actor) { return actor?.role === "admin"; }
export function canUpdateBooking(actor: Actor, customerId: string, action: "cancel" | "complete" | "no-show") {
  if (!actor) return false;
  if (actor.role === "admin") return true;
  return actor.role === "customer" && actor.id === customerId && action === "cancel";
}

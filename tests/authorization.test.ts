import { describe, expect, it } from "vitest";
import { canManageBusiness, canReadBooking, canUpdateBooking } from "../lib/authorization";
describe('authorization rules',()=>{
 it('rejects unauthenticated access',()=>{expect(canReadBooking(null,'c1')).toBe(false);expect(canManageBusiness(null)).toBe(false)});
 it('limits customers to their own bookings',()=>{const actor={id:'c1',role:'customer' as const};expect(canReadBooking(actor,'c1')).toBe(true);expect(canReadBooking(actor,'c2')).toBe(false);expect(canUpdateBooking(actor,'c1','cancel')).toBe(true);expect(canUpdateBooking(actor,'c1','complete')).toBe(false)});
 it('allows admins to manage business records',()=>{const admin={id:'a1',role:'admin' as const};expect(canManageBusiness(admin)).toBe(true);expect(canReadBooking(admin,'c2')).toBe(true);expect(canUpdateBooking(admin,'c2','no-show')).toBe(true)});
});

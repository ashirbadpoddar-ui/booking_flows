import { describe, expect, it } from "vitest";
import { generateAvailableSlots, overlaps } from "../lib/availability";
import type { Booking } from "../lib/types";

const hours=[{weekday:1,start:'09:00',end:'17:00'}];
const booking=(time:string,serviceId='haircut'):Booking=>({id:time,customerName:'Test',customerEmail:'test@example.com',serviceId,staffId:'s1',date:'2026-08-24',time,status:'confirmed',createdAt:''});
describe('availability engine',()=>{
  it('generates slots within working hours for the service duration',()=>{const slots=generateAvailableSlots({date:'2026-08-24',staffId:'s1',duration:45,workingHours:hours,bookings:[],blockedPeriods:[],interval:15});expect(slots[0]).toBe('09:00');expect(slots.at(-1)).toBe('16:15');expect(slots).toHaveLength(30)});
  it('removes every slot that overlaps an existing booking',()=>{const slots=generateAvailableSlots({date:'2026-08-24',staffId:'s1',duration:45,workingHours:hours,bookings:[booking('10:00')],blockedPeriods:[],interval:15});expect(slots).not.toContain('09:30');expect(slots).not.toContain('10:00');expect(slots).not.toContain('10:30');expect(slots).toContain('09:15');expect(slots).toContain('10:45')});
  it('accounts for the duration of existing services',()=>{const slots=generateAvailableSlots({date:'2026-08-24',staffId:'s1',duration:30,workingHours:hours,bookings:[booking('10:00','combo')],blockedPeriods:[],interval:15});expect(slots).not.toContain('10:45');expect(slots).toContain('11:15')});
  it('removes slots that overlap blocked periods and breaks',()=>{const slots=generateAvailableSlots({date:'2026-08-24',staffId:'s1',duration:45,workingHours:hours,bookings:[],blockedPeriods:[{staffId:'s1',date:'2026-08-24',start:'12:00',end:'13:00',reason:'Lunch'}]});expect(slots).not.toContain('11:30');expect(slots).not.toContain('12:30');expect(slots).toContain('13:00')});
  it('returns no slots on a day off',()=>{expect(generateAvailableSlots({date:'2026-08-23',staffId:'s1',duration:45,workingHours:hours,bookings:[],blockedPeriods:[]})).toEqual([])});
  it('treats adjacent ranges as non-overlapping',()=>{expect(overlaps(540,600,600,660)).toBe(false);expect(overlaps(540,601,600,660)).toBe(true)});
});

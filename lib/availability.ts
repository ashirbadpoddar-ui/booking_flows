import type { BlockedPeriod, Booking, WorkingHours } from "./types";

export const toMinutes = (value: string) => { const [h, m] = value.split(":").map(Number); return h * 60 + m; };
export const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
export const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => aStart < bEnd && aEnd > bStart;

type SlotInput = {
  date: string;
  staffId: string;
  duration: number;
  workingHours: WorkingHours[];
  bookings: Booking[];
  blockedPeriods: BlockedPeriod[];
  interval?: number;
};

export function generateAvailableSlots({ date, staffId, duration, workingHours, bookings, blockedPeriods, interval = 15 }: SlotInput) {
  const day = new Date(`${date}T12:00:00`).getDay();
  const hours = workingHours.find((rule) => rule.weekday === day);
  if (!hours) return [];
  const busy = bookings
    .filter((booking) => booking.date === date && booking.staffId === staffId && booking.status !== "cancelled")
    .map((booking) => ({ start: toMinutes(booking.time), end: toMinutes(booking.time) + durationForBooking(booking) }));
  const blocked = blockedPeriods
    .filter((period) => period.date === date && period.staffId === staffId)
    .map((period) => ({ start: toMinutes(period.start), end: toMinutes(period.end) }));
  const slots: string[] = [];
  for (let start = toMinutes(hours.start); start + duration <= toMinutes(hours.end); start += interval) {
    const end = start + duration;
    if (![...busy, ...blocked].some((period) => overlaps(start, end, period.start, period.end))) slots.push(toTime(start));
  }
  return slots;
}

function durationForBooking(booking: Booking) {
  const durations: Record<string, number> = { haircut: 45, beard: 30, combo: 75, styling: 30, consultation: 20, premium: 105 };
  return durations[booking.serviceId] ?? 45;
}

export function isSlotAvailable(input: SlotInput & { time: string }) {
  return generateAvailableSlots(input).includes(input.time);
}

import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation";
import { blockedPeriods, services, staff, workingHours } from "@/lib/data";
import { isSlotAvailable } from "@/lib/availability";
import type { Booking } from "@/lib/types";
import { sendBookingConfirmation } from "@/lib/notifications";
import { demoBookings } from "@/lib/demo-store";

export async function POST(request: Request) {
  const parsed = bookingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check your booking details.", issues: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;
  const service = services.find((item) => item.id === input.serviceId && item.active);
  const member = staff.find((item) => item.id === input.staffId && item.active && item.serviceIds.includes(input.serviceId));
  if (!service || !member) return NextResponse.json({ error: "This service or specialist is no longer available." }, { status: 409 });
  const available = isSlotAvailable({ ...input, duration: service.duration, workingHours, bookings: demoBookings, blockedPeriods });
  if (!available) return NextResponse.json({ error: "This time slot is no longer available. Please choose another time." }, { status: 409 });
  const booking: Booking = { ...input, phone: input.phone || undefined, id: `BK-${1052 + demoBookings.length}`, status: "confirmed", createdAt: new Date().toISOString() };
  demoBookings.push(booking);
  await sendBookingConfirmation(booking);
  return NextResponse.json({ booking }, { status: 201 });
}

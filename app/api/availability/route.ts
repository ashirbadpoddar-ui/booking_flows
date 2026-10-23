import { NextRequest, NextResponse } from "next/server";
import { blockedPeriods, services, staff, workingHours } from "@/lib/data";
import { demoBookings } from "@/lib/demo-store";
import { generateAvailableSlots } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date") ?? "";
  const serviceId = searchParams.get("serviceId") ?? "";
  const staffId = searchParams.get("staffId") ?? "";
  const service = services.find((item) => item.id === serviceId && item.active);
  const member = staff.find((item) => item.id === staffId && item.active && item.serviceIds.includes(serviceId));
  if (!service || !member || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Invalid service, specialist, or date." }, { status: 400 });
  const slots = generateAvailableSlots({ date, staffId, duration: service.duration, workingHours, bookings: demoBookings, blockedPeriods, interval: 15 });
  return NextResponse.json({ slots, timezone: "Europe/Warsaw" });
}

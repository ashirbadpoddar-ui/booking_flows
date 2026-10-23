import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1), staffId: z.string().min(1),
  date: z.iso.date(), time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  customerName: z.string().trim().min(2).max(80), customerEmail: z.email(),
  phone: z.string().trim().min(7).max(24).optional().or(z.literal("")), notes: z.string().max(500).optional(),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(2).max(80), description: z.string().trim().min(10).max(300),
  duration: z.number().int().min(10).max(480), price: z.number().min(0).max(100000), active: z.boolean(),
});

export const scheduleSchema = z.object({
  weekday: z.number().int().min(0).max(6), start: z.string().regex(/^\d{2}:\d{2}$/), end: z.string().regex(/^\d{2}:\d{2}$/),
}).refine((v) => v.start < v.end, { message: "End time must be later than start time" });

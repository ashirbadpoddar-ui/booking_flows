import type { Booking } from "./types";

export type NotificationMessage = { to: string; subject: string; body: string };
export interface NotificationProvider { send(message: NotificationMessage): Promise<void> }
class ConsoleProvider implements NotificationProvider { async send(message: NotificationMessage) { console.info("[notification]", { to: message.to, subject: message.subject }); } }
export const notifications: NotificationProvider = new ConsoleProvider();
export async function sendBookingConfirmation(booking: Booking) { await notifications.send({ to: booking.customerEmail, subject: `Booking confirmed: ${booking.id}`, body: `Your appointment is confirmed for ${booking.date} at ${booking.time}.` }); }

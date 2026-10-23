import { seedBookings } from "./data";
import type { Booking } from "./types";

const globalStore = globalThis as typeof globalThis & { bookingflowDemoBookings?: Booking[] };
export const demoBookings = globalStore.bookingflowDemoBookings ?? [...seedBookings];
globalStore.bookingflowDemoBookings = demoBookings;

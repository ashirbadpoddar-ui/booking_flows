import type { BlockedPeriod, Booking, Service, Staff, WorkingHours } from "./types";

export const BUSINESS = {
  name: "North & Row",
  descriptor: "Barber studio",
  timezone: "Europe/Warsaw",
  address: "Mokotowska 24, Warsaw",
  phone: "+48 22 410 24 24",
};

export const services: Service[] = [
  { id: "haircut", name: "Signature Haircut", description: "Consultation, precision cut and tailored finish.", duration: 45, price: 120, active: true, category: "Hair" },
  { id: "beard", name: "Beard Trim", description: "Shape, line-up and hot towel finish.", duration: 30, price: 70, active: true, category: "Beard" },
  { id: "combo", name: "Hair + Beard", description: "Complete cut and beard service in one visit.", duration: 75, price: 175, active: true, category: "Popular" },
  { id: "styling", name: "Wash & Styling", description: "Wash, care treatment and professional styling.", duration: 30, price: 80, active: true, category: "Hair" },
  { id: "consultation", name: "Style Consultation", description: "Personal advice on cut, care and daily styling.", duration: 20, price: 45, active: true, category: "Consultation" },
  { id: "premium", name: "The Full Ritual", description: "Hair, beard, facial treatment and unhurried finish.", duration: 105, price: 260, active: true, category: "Premium" },
];

export const staff: Staff[] = [
  { id: "marcin", name: "Marcin Kowalski", role: "Senior barber", initials: "MK", color: "#1d4f45", rating: 4.9, serviceIds: services.map((s) => s.id), active: true },
  { id: "lena", name: "Lena Wójcik", role: "Stylist", initials: "LW", color: "#935f3f", rating: 4.8, serviceIds: ["haircut", "combo", "styling", "consultation"], active: true },
  { id: "tomasz", name: "Tomasz Nowak", role: "Barber", initials: "TN", color: "#526477", rating: 4.9, serviceIds: ["haircut", "beard", "combo", "consultation", "premium"], active: true },
  { id: "amelia", name: "Amelia Zielińska", role: "Master stylist", initials: "AZ", color: "#79586e", rating: 5, serviceIds: ["haircut", "styling", "consultation", "premium"], active: true },
];

export const workingHours: WorkingHours[] = [
  { weekday: 1, start: "09:00", end: "18:00" }, { weekday: 2, start: "09:00", end: "18:00" },
  { weekday: 3, start: "10:00", end: "19:00" }, { weekday: 4, start: "09:00", end: "18:00" },
  { weekday: 5, start: "09:00", end: "19:00" }, { weekday: 6, start: "09:00", end: "15:00" },
];

const iso = (offset: number) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };

export const blockedPeriods: BlockedPeriod[] = [
  { staffId: "marcin", date: iso(2), start: "12:30", end: "13:15", reason: "Lunch" },
  { staffId: "lena", date: iso(3), start: "14:00", end: "16:00", reason: "Training" },
  { staffId: "tomasz", date: iso(5), start: "09:00", end: "15:00", reason: "Day off" },
];

export const seedBookings: Booking[] = [
  { id: "BK-1048", customerName: "Maja Lewandowska", customerEmail: "maja@example.com", serviceId: "haircut", staffId: "marcin", date: iso(1), time: "09:00", status: "confirmed", createdAt: new Date().toISOString() },
  { id: "BK-1049", customerName: "Jakub Wiśniewski", customerEmail: "jakub@example.com", serviceId: "combo", staffId: "tomasz", date: iso(1), time: "10:30", status: "confirmed", createdAt: new Date().toISOString() },
  { id: "BK-1050", customerName: "Oliwia Kamińska", customerEmail: "oliwia@example.com", serviceId: "styling", staffId: "lena", date: iso(1), time: "13:00", status: "confirmed", createdAt: new Date().toISOString() },
  { id: "BK-1051", customerName: "Antoni Dąbrowski", customerEmail: "antoni@example.com", serviceId: "beard", staffId: "marcin", date: iso(1), time: "15:15", status: "confirmed", createdAt: new Date().toISOString() },
  { id: "BK-1042", customerName: "Zofia Mazur", customerEmail: "zofia@example.com", serviceId: "premium", staffId: "amelia", date: iso(-2), time: "11:00", status: "completed", createdAt: new Date().toISOString() },
  { id: "BK-1041", customerName: "Jan Król", customerEmail: "jan@example.com", serviceId: "haircut", staffId: "tomasz", date: iso(-3), time: "14:00", status: "cancelled", createdAt: new Date().toISOString() },
];

export const money = (value: number) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(value);

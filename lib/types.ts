export type BookingStatus = "confirmed" | "completed" | "cancelled" | "no-show";

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
  category: string;
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  rating: number;
  serviceIds: string[];
  active: boolean;
};

export type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
};

export type BookingDraft = Partial<Pick<Booking, "serviceId" | "staffId" | "date" | "time" | "customerName" | "customerEmail" | "phone" | "notes">>;

export type WorkingHours = { weekday: number; start: string; end: string };
export type BlockedPeriod = { staffId: string; date: string; start: string; end: string; reason: string };

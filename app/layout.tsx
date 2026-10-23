import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "BookingFlow — Appointment scheduling", template: "%s — BookingFlow" },
  description: "Modern appointment scheduling for service businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

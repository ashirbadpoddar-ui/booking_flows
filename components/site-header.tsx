import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return <Link className="brand" href="/" aria-label="BookingFlow home" style={{color:light?"white":undefined}}><span className="brand-mark"><CalendarDays size={16}/></span>BookingFlow</Link>;
}

export function SiteHeader() {
  return <header className="site-header"><div className="container inner"><Brand/><nav className="nav" aria-label="Main navigation"><a href="#features">Features</a><a href="#how">How it works</a><a href="#faq">FAQ</a><Link href="/admin" className="btn btn-secondary">Dashboard demo</Link><Link href="/book" className="btn btn-primary">Book now <ArrowUpRight size={15}/></Link></nav></div></header>;
}

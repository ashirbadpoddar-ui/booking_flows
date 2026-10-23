import Link from "next/link";
import { Brand } from "@/components/site-header";
import { BookingWizard } from "@/components/booking-wizard";

export const metadata={title:"Book an appointment"};
export default function BookPage(){return <main className="booking-page"><header className="booking-header"><div className="container inner"><Brand/><Link className="studio-label" href="/"><span className="studio-monogram">N&R</span><span><b style={{display:'block',color:'var(--ink)'}}>North & Row</b>Warsaw · Europe/Warsaw</span></Link></div></header><div className="booking-shell"><BookingWizard/></div></main>}

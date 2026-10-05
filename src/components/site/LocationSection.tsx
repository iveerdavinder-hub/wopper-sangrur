import { Clock, Phone, MessageCircle, Navigation } from "lucide-react";
import { SITE, waLink } from "@/lib/site";

export function LocationSection() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow">Find us</p>
          <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Wopper Sangrur</h2>
          <p className="mt-6 text-lg">The Outlet, Village,<br />Sangrur, Punjab 148002</p>
          <p className="mt-4 flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" />Open daily · {SITE.hours}</p>
          <a href={`tel:${SITE.phoneTel}`} className="mt-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"><Phone className="h-4 w-4 text-primary" />{SITE.phoneDisplay}</a>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary"><Navigation className="h-4 w-4" />Get Directions</a>
            <a href={`tel:${SITE.phoneTel}`} className="btn btn-ghost"><Phone className="h-4 w-4" />Call Now</a>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp"><MessageCircle className="h-4 w-4" />WhatsApp</a>
          </div>
        </div>
        <iframe title="Map to Wopper Sangrur" src={SITE.mapsEmbed} loading="lazy" className="h-80 w-full rounded-3xl border border-border md:h-full md:min-h-96" />
      </div>
    </section>
  );
}

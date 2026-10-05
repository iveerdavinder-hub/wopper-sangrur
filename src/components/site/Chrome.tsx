import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle, CalendarCheck, MapPin, Clock } from "lucide-react";
import { NAV, SITE, waLink } from "@/lib/site";

export function Logo() {
  return (
    <Link to="/" className="font-display text-2xl font-extrabold tracking-tight" aria-label="Wopper Sangrur home">
      WOPPER<span className="text-primary">.</span>
      <span className="ml-1 align-middle text-xs font-bold tracking-[0.2em] text-muted-foreground">SANGRUR</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "!text-primary" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-ghost !min-h-10 !px-4"><MessageCircle className="h-4 w-4" />WhatsApp</a>
          <Link to="/book" className="btn btn-primary !min-h-10">Book / Enquire</Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button className="p-2" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-4 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-3 font-display text-2xl font-bold" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
          <Link to="/book" onClick={() => setOpen(false)} className="btn btn-primary mt-4 w-full">Book / Enquire Now</Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface pb-28 pt-16 lg:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-muted-foreground">Gaming, adventure and entertainment for families, friends and groups in Sangrur.</p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary" />{SITE.address}</p>
          <p className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-primary" />{SITE.hours}</p>
          <a href={`tel:${SITE.phoneTel}`} className="flex gap-2 hover:text-primary"><Phone className="h-4 w-4 shrink-0 text-primary" />{SITE.phoneDisplay}</a>
        </div>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm text-muted-foreground">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="hover:text-foreground transition-colors">{n.label}</Link>)}
          <Link to="/book" className="hover:text-foreground transition-colors">Book</Link>
          <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          <Link to="/policy" className="hover:text-foreground transition-colors">Policy & Rules</Link>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6 px-5 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p>© {new Date().getFullYear()} Wopper Sangrur · {SITE.website}</p>
          <span className="hidden sm:inline">·</span>
          <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          <span>·</span>
          <Link to="/policy" className="hover:text-foreground transition-colors">Policy & Rules</Link>
        </div>
      </div>
    </footer>
  );
}

export function MobileBar() {
  return (
    <>
      <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg transition-transform hover:scale-110 lg:flex">
        <MessageCircle className="h-6 w-6" />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-background/95 p-3 backdrop-blur-xl lg:hidden">
        <a href={`tel:${SITE.phoneTel}`} className="btn btn-ghost !px-2 !text-sm"><Phone className="h-4 w-4" />Call</a>
        <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp !px-2 !text-sm"><MessageCircle className="h-4 w-4" />WhatsApp</a>
        <Link to="/book" className="btn btn-primary !px-2 !text-sm"><CalendarCheck className="h-4 w-4" />Book</Link>
      </div>
    </>
  );
}

export function PageHero({ eyebrow, title, sub, img }: { eyebrow: string; title: string; sub?: string; img?: string }) {
  return (
    <section className="relative overflow-hidden">
      {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
      <div className="absolute inset-0 bg-fade" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-24 md:pt-32">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl animate-rise text-5xl font-extrabold leading-[0.95] md:text-7xl">{title}</h1>
        {sub && <p className="mt-6 max-w-2xl animate-rise text-lg text-muted-foreground">{sub}</p>}
      </div>
    </section>
  );
}

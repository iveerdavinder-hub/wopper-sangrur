import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Clock, Star, Phone, MessageCircle, Navigation, Users, Sparkles, PartyPopper, Gamepad2 } from "lucide-react";
import hero from "@/assets/hero.jpg";
import party from "@/assets/party.jpg";
import { ACTIVITIES, SITE, waLink } from "@/lib/site";
import { LocationSection } from "@/components/site/LocationSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wopper Sangrur — Bowling, Arcade, VR & Trampoline in Sangrur" },
      { name: "description", content: "Indoor gaming and entertainment in Sangrur: bowling, arcade, VR games, trampoline, wall climbing and pit ball. Open 10 AM – 9:30 PM." },
      { property: "og:title", content: "Wopper Sangrur — Play. Jump. Compete. Repeat." },
      { property: "og:description", content: "Gaming, adventure and entertainment together in Sangrur, Punjab." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={hero} alt="Neon-lit Wopper venue with bowling lanes, trampolines and ball pit" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-side opacity-60" />
        <div className="absolute inset-0 bg-fade" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-16">
          <p className="eyebrow animate-rise">Indoor entertainment · Sangrur</p>
          <h1 className="mt-5 animate-rise text-6xl font-extrabold leading-[0.88] sm:text-7xl md:text-[8.5rem]">
            PLAY. JUMP.<br /><span className="text-primary glow-text">COMPETE.</span> REPEAT.
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg text-muted-foreground">Wopper brings gaming, adventure and entertainment together under one roof in Sangrur.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn btn-primary">Book / Enquire Now <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/experiences" className="btn btn-ghost">Explore Experiences</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Sangrur, Punjab</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Open {SITE.hours}</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-accent text-accent" />{SITE.rating.value}/5 · {SITE.rating.count} {SITE.rating.source}</span>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl font-extrabold">
          {[...ACTIVITIES, ...ACTIVITIES].map((a, i) => <span key={i}>{a.name.toUpperCase()} ✦</span>)}
        </div>
      </div>

      {/* Experiences */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Experiences</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-6xl">Pick your game.</h2>
          </div>
          <Link to="/experiences" className="btn btn-ghost">All experiences <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-12 flex snap-x gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {ACTIVITIES.map((a) => (
            <Link key={a.slug} to="/experiences" hash={a.slug} className="card-glow group relative aspect-[4/5] w-[78vw] shrink-0 snap-start overflow-hidden rounded-3xl md:w-auto">
              <img src={a.img} alt={`${a.name} at Wopper Sangrur`} loading="lazy" width={1024} height={1280} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-fade" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{a.tag}</span>
                <h3 className="mt-3 text-3xl font-extrabold">{a.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="eyebrow">Why visit</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">More than one game.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 md:col-span-2">
            {[
              { icon: Gamepad2, t: "Multiple experiences", d: "Six ways to play in one visit — mix and match." },
              { icon: Users, t: "Indoor group fun", d: "Great for friends, families and teams, any weather." },
              { icon: Sparkles, t: "Something for everyone", d: "From high-energy jumping to competitive bowling." },
              { icon: PartyPopper, t: "Celebrations", d: "Ask us about birthdays and group occasions." },
            ].map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-3xl border border-border bg-card p-6">
                <I className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Birthday */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="relative overflow-hidden rounded-[2rem]">
          <img src={party} alt="Birthday party table set up at a neon entertainment venue" loading="lazy" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-side" />
          <div className="relative max-w-xl p-8 py-20 md:p-16">
            <p className="eyebrow">Birthdays & celebrations</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-none md:text-6xl">MAKE YOUR NEXT CELEBRATION A <span className="text-accent">PLAY DAY</span></h2>
            <p className="mt-5 text-muted-foreground">Planning a birthday? Get in touch with Wopper Sangrur and ask about available packages.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events" className="btn btn-accent">Plan a Birthday</Link>
              <a href={waLink("Hi Wopper Sangrur, I'd like to enquire about a birthday party.")} target="_blank" rel="noreferrer" className="btn btn-ghost"><MessageCircle className="h-4 w-4" />Ask on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="grid items-center gap-10 rounded-[2rem] border border-border bg-card p-8 md:grid-cols-2 md:p-16">
          <div>
            <p className="eyebrow">Group & corporate</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-none md:text-6xl">BRING YOUR GROUP. CHANGE THE ROUTINE.</h2>
          </div>
          <div>
            <p className="text-muted-foreground">Team outings, kitty parties, friends' nights — tell us what you're planning and the team will help with options.</p>
            <Link to="/events" className="btn btn-primary mt-6">Plan a Group Event <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="flex items-end justify-between">
          <h2 className="text-4xl font-extrabold md:text-5xl">Moments.</h2>
          <Link to="/gallery" className="font-semibold text-primary">View gallery →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ACTIVITIES.slice(0, 4).map((a, i) => (
            <img key={a.slug} src={a.img} alt={a.name} loading="lazy" className={`w-full rounded-2xl object-cover ${i % 2 ? "aspect-[3/4]" : "aspect-square"}`} />
          ))}
        </div>
      </section>

      <LocationSection />
    </>
  );
}


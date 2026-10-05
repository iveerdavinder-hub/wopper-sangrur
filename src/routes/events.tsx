import { createFileRoute } from "@tanstack/react-router";
import { Cake, Users, Briefcase, Heart, Sparkles, Home } from "lucide-react";
import party from "@/assets/party.jpg";
import { PageHero } from "@/components/site/Chrome";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Birthday Parties & Group Events | Wopper Sangrur" },
      { name: "description", content: "Plan birthday parties, family outings, corporate events and kitty parties at Wopper Sangrur. Enquire about available packages." },
      { property: "og:title", content: "Parties & Events at Wopper Sangrur" },
      { property: "og:description", content: "Birthdays, team outings and group celebrations — enquire with Wopper Sangrur." },
    ],
  }),
  component: Events,
});

const TYPES = [
  { icon: Cake, t: "Birthday parties", v: "Birthday" },
  { icon: Home, t: "Family outings", v: "Family Outing" },
  { icon: Users, t: "Friends & groups", v: "Friends / Group" },
  { icon: Briefcase, t: "Corporate events", v: "Corporate Event" },
  { icon: Heart, t: "Kitty parties", v: "Kitty Party" },
  { icon: Sparkles, t: "Other celebrations", v: "Other" },
];

function Events() {
  return (
    <>
      <PageHero eyebrow="Parties & events" title="Celebrate the playful way." sub="Tell us what you're planning and ask about available packages — the team will share the latest options." img={party} />
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {TYPES.map(({ icon: I, t, v }) => (
            <a key={t} href={waLink(`Hi Wopper Sangrur, I'd like to enquire about a ${v.toLowerCase()} event.`)} target="_blank" rel="noreferrer" className="card-glow rounded-3xl border border-border bg-card p-6">
              <I className="h-8 w-8 text-accent" />
              <h2 className="mt-4 text-xl font-bold md:text-2xl">{t}</h2>
              <p className="mt-1 text-sm text-primary">Enquire on WhatsApp →</p>
            </a>
          ))}
        </div>
      </section>
      <section id="enquire" className="mx-auto max-w-4xl px-5 pb-24">
        <h2 className="text-4xl font-extrabold md:text-5xl">Plan your party / event</h2>
        <p className="mb-8 mt-3 text-muted-foreground">Package details, inclusions and pricing are shared on enquiry.</p>
        <EnquiryForm kind="event" defaultType="Birthday" />
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";
import { LocationSection } from "@/components/site/LocationSection";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Directions | Wopper Sangrur" },
      { name: "description", content: "Wopper Sangrur, The Outlet, Village, Sangrur, Punjab 148002. Call +91 98880 00346. Open 10 AM – 9:30 PM." },
      { property: "og:title", content: "Contact Wopper Sangrur" },
      { property: "og:description", content: "Address, phone, hours, directions and FAQs for Wopper Sangrur." },
    ],
  }),
  component: Contact,
});

const ASK = "Please contact Wopper Sangrur for the latest information.";
const FAQ = [
  { q: "Where is Wopper Sangrur located?", a: SITE.address },
  { q: "What are the opening hours?", a: `Currently listed hours are ${SITE.hours}. ${ASK}` },
  { q: "What activities are available?", a: "Bowling, Arcade Games, VR Games, Trampoline, Wall Climbing and Pit Ball." },
  { q: "How can I contact Wopper?", a: `Call ${SITE.phoneDisplay}, message us on WhatsApp, or send an enquiry through this website.` },
  { q: "Can I enquire about birthday parties?", a: "Yes — use the Parties & Events page or WhatsApp to ask about available packages." },
  { q: "Can I enquire about group or corporate events?", a: "Yes — send an event enquiry and the team will get back to you." },
  { q: "How can I get directions?", a: "Tap “Get Directions” to open the location in Google Maps." },
  { q: "Are prices available online?", a: ASK },
];

function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Come play." sub="Call, WhatsApp or drop by — we're in Sangrur." />
      <LocationSection />
      <section className="mx-auto max-w-3xl px-5 py-24">
        <h2 className="text-4xl font-extrabold">FAQ</h2>
        <div className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-6">
              <summary className="cursor-pointer list-none font-bold marker:hidden">
                <span className="flex justify-between gap-4">{f.q}<span className="text-primary transition-transform group-open:rotate-45">+</span></span>
              </summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

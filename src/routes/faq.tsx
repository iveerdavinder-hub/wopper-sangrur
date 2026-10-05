import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";
import { SITE, waLink } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, CalendarCheck, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Frequently Asked Questions | Wopper Sangrur" },
      {
        name: "description",
        content:
          "Find answers about Wopper Sangrur opening hours, bowling, trampoline grip socks, arcade prices, and birthday event bookings.",
      },
      { property: "og:title", content: "FAQ | Wopper Sangrur" },
      {
        property: "og:description",
        content: "Common questions and answers about visiting Wopper Sangrur.",
      },
    ],
  }),
  component: FAQPage,
});

const FAQ_SECTIONS = [
  {
    category: "General & Visit",
    items: [
      {
        q: "Where is Wopper Sangrur located?",
        a: `Wopper Sangrur is located at ${SITE.address}. You can easily navigate via Google Maps or get in touch with our team for directions.`,
      },
      {
        q: "What are your operating hours?",
        a: `Our current listed timings are ${SITE.hours} every day of the week. Holiday hours may vary slightly, so feel free to message us on WhatsApp to confirm.`,
      },
      {
        q: "Do I need to book in advance or can I walk in?",
        a: "Walk-ins are always welcome! However, for peak weekends, holiday evenings, or group parties, we highly recommend submitting an enquiry or booking online in advance to guarantee lane or activity availability.",
      },
      {
        q: "Is there parking available?",
        a: "Yes, ample parking space is available at The Outlet complex for cars and two-wheelers.",
      },
    ],
  },
  {
    category: "Activities & Safety",
    items: [
      {
        q: "What entertainment activities do you offer?",
        a: "We feature a multi-lane Bowling Alley, modern Arcade games, immersive VR zones, a high-energy Trampoline Park, Wall Climbing, and a dedicated Kids Soft Play / Pit Ball arena.",
      },
      {
        q: "Are grip socks required for the Trampoline Park?",
        a: "Yes, for safety and hygiene reasons, approved anti-skid grip socks are mandatory on all trampoline beds. You can bring your own clean grip socks or purchase a pair at our front desk.",
      },
      {
        q: "Are there age or height restrictions for games?",
        a: "Most arcade games and bowling are open to all ages! Certain adventure zones like wall climbing and high trampolines have minimum age/height recommendations, and younger kids must be supervised by an adult.",
      },
      {
        q: "Is the VR equipment safe for kids?",
        a: "Yes, our VR gear is safely calibrated and continuously sanitized by staff after each player. Staff members assist with fitting headsets and guiding gameplay.",
      },
    ],
  },
  {
    category: "Bookings, Parties & Food",
    items: [
      {
        q: "How can I book a Birthday Party or Corporate Event?",
        a: "You can submit our booking form right here on the website under 'Parties & Events', or contact us directly on WhatsApp. Our events coordinator will help you customize your celebration package.",
      },
      {
        q: "Is food and drink available at Wopper Sangrur?",
        a: "Yes! We have an on-site cafe lounge offering fresh snacks, beverages, and treats so you can recharge between games.",
      },
      {
        q: "Can we bring outside food for birthday celebrations?",
        a: "Outside commercial food and catering are generally not permitted, but birthday cakes may be permitted with prior arrangement for confirmed party packages. Please check with our team when booking.",
      },
      {
        q: "How can I inquire about package prices?",
        a: `Give us a call at ${SITE.phoneDisplay} or message us on WhatsApp at +${SITE.whatsapp}. Our team will immediately share the latest pricing breakdown and combo offers.`,
      },
    ],
  },
];

function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Help & Support"
        title="FREQUENTLY ASKED QUESTIONS"
        sub="Everything you need to know before visiting Wopper Sangrur — timings, activities, safety, and bookings."
      />

      <section className="mx-auto max-w-4xl px-5 py-16 lg:py-24">
        <div className="space-y-12">
          {FAQ_SECTIONS.map((section, idx) => (
            <div key={section.category} className="space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {section.category}
                </h2>
              </div>
              <Accordion
                type="single"
                collapsible
                className="w-full rounded-2xl border border-border bg-card px-6 divide-y divide-border/60"
              >
                {section.items.map((item, itemIdx) => (
                  <AccordionItem
                    key={item.q}
                    value={`item-${idx}-${itemIdx}`}
                    className="border-border/60"
                  >
                    <AccordionTrigger className="text-base font-semibold hover:no-underline hover:text-primary transition-colors py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 rounded-3xl border border-border bg-gradient-to-br from-card to-muted/30 p-8 text-center md:p-12">
          <h3 className="font-display text-2xl font-extrabold md:text-3xl">
            Still have questions?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-sm md:text-base">
            Our friendly Sangrur team is always ready to help. Reach out on WhatsApp
            or submit an online enquiry for quick assistance.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waLink("Hi Wopper Sangrur, I have a quick question!")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp !min-h-11 !px-5"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link to="/book" className="btn btn-primary !min-h-11 !px-5">
              <CalendarCheck className="h-4 w-4" />
              Book / Enquire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

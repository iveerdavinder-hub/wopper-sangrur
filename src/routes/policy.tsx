import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";
import { SITE, waLink } from "@/lib/site";
import { ShieldAlert, FileText, Lock, MessageCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/policy")({
  head: () => ({
    meta: [
      { title: "Policies & Safety Rules | Wopper Sangrur" },
      {
        name: "description",
        content:
          "Read venue rules, trampoline safety guidelines, booking policies, and privacy terms for Wopper Sangrur.",
      },
      { property: "og:title", content: "Policies & Safety Rules | Wopper Sangrur" },
      {
        property: "og:description",
        content: "Safety guidelines, booking terms and privacy policy for Wopper Sangrur.",
      },
    ],
  }),
  component: PolicyPage,
});

function PolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Guidelines & Terms"
        title="POLICIES & SAFETY RULES"
        sub="Your safety and enjoyment are our top priorities. Please review our venue policies and activity rules."
      />

      <section className="mx-auto max-w-4xl px-5 py-16 lg:py-24 space-y-16">
        {/* Section 1: Safety & Activity Rules */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              1. Venue & Activity Safety Rules
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Trampoline Arena Rules
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Anti-slip grip socks are strictly mandatory before entering the trampoline zone.</li>
                <li>One jumper per trampoline bed at any time to prevent collisions.</li>
                <li>No rough play, pushing, or uncontrolled aerial flips.</li>
                <li>Pockets must be completely emptied (no phones, keys, or sharp items allowed).</li>
                <li>Children under 6 must be accompanied by an adult.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Wall Climbing Guidelines
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>All climbers must be secured with certified safety harnesses.</li>
                <li>Climbing must only occur under the direct supervision of trained Wopper instructors.</li>
                <li>Closed-toe athletic shoes must be worn.</li>
                <li>Never stand or sit in the designated landing fall zone underneath a climber.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Bowling Alley Etiquette
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Do not step past the foul line onto the oiled lane surface at any time.</li>
                <li>Only one bowler on the approach lane per turn.</li>
                <li>Keep food and drinks off the bowling approach and seating area.</li>
                <li>Please return bowling balls to the ball return rack after your session.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                VR & Arcade Zone
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Treat arcade machines and VR hardware with care and respect.</li>
                <li>If you experience dizziness during VR gameplay, stop immediately and notify staff.</li>
                <li>Players must stay within the marked physical VR boundary area.</li>
                <li>Food and beverages are strictly prohibited near electronics and simulator units.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Bookings & Cancellation */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              2. Booking, Rescheduling & Payments
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Walk-in Visits:</strong> Walk-in tickets are subject to immediate lane and capacity availability. During high-traffic hours, wait times may occur.
            </p>
            <p>
              <strong className="text-foreground">Event & Birthday Reservations:</strong> To confirm event party slots, a deposit may be requested upon booking confirmation. Time slots are held exclusively for your group.
            </p>
            <p>
              <strong className="text-foreground">Rescheduling & Cancellation:</strong> If you need to reschedule your event or visit, please inform us at least 24 hours in advance via WhatsApp or phone so our staff can reallocate your slot.
            </p>
            <p>
              <strong className="text-foreground">Refund Terms:</strong> Tokens, game credits, or promotional passes once issued are non-refundable and cannot be exchanged for cash.
            </p>
          </div>
        </div>

        {/* Section 3: General Code of Conduct */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              3. General Venue Conduct
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Wopper Sangrur is a family-friendly destination. We expect all guests to treat fellow visitors and our crew with courtesy and respect. Any foul language, harassment, or unsafe behavior will result in immediate removal without refund.
            </p>
            <p>
              <strong className="text-foreground">Substance Policy:</strong> Smoking, tobacco use, and alcohol consumption are strictly prohibited on the premises.
            </p>
            <p>
              <strong className="text-foreground">Personal Belongings:</strong> While we provide open cubbies and seating areas, guests are responsible for their valuables. Wopper is not liable for lost, stolen, or misplaced personal items.
            </p>
          </div>
        </div>

        {/* Section 4: Privacy Policy */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              4. Privacy Policy
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Wopper Sangrur respects your personal privacy. When you contact us or submit an enquiry via this website, we collect your name, phone number, email (if provided), and event requirements solely to coordinate your visit and answer questions.
            </p>
            <p>
              We do not sell, rent, or share your contact information with external marketing agencies or unrelated third parties.
            </p>
            <p>
              If you wish to view, update, or request deletion of any contact information you have previously submitted, please contact our support desk directly at <a href={`tel:${SITE.phoneTel}`} className="text-primary hover:underline">{SITE.phoneDisplay}</a>.
            </p>
          </div>
        </div>

        {/* Help footer */}
        <div className="rounded-3xl border border-border bg-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-xl font-bold">Have questions regarding policies?</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Contact our management desk directly and we will be happy to assist you.
            </p>
          </div>
          <a
            href={waLink("Hello Wopper Sangrur, I have a question about your policies and rules.")}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            Contact via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}

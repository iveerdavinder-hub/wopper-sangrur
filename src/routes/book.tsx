import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Chrome";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book / Enquire | Wopper Sangrur" },
      { name: "description", content: "Send a visit enquiry to Wopper Sangrur — bowling, arcade, VR, trampoline and more." },
      { property: "og:title", content: "Book / Enquire — Wopper Sangrur" },
      { property: "og:description", content: "Plan your visit to Wopper Sangrur in a few taps." },
    ],
  }),
  component: Book,
});

function Book() {
  return (
    <>
      <PageHero eyebrow="Book / Enquire" title="Plan your visit." sub="Share a few details and the team will confirm availability with you." />
      <section className="mx-auto max-w-4xl px-5 pb-24">
        <EnquiryForm />
      </section>
    </>
  );
}

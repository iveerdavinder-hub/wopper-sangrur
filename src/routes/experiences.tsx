import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { ACTIVITIES, waLink } from "@/lib/site";
import { PageHero } from "@/components/site/Chrome";

export const Route = createFileRoute("/experiences")({
  head: () => ({
    meta: [
      { title: "Experiences — Bowling, Arcade, VR, Trampoline | Wopper Sangrur" },
      { name: "description", content: "Explore bowling, arcade games, VR games, trampoline, wall climbing and pit ball at Wopper Sangrur." },
      { property: "og:title", content: "Experiences at Wopper Sangrur" },
      { property: "og:description", content: "Six ways to play in Sangrur — bowling, arcade, VR, trampoline, climbing and pit ball." },
    ],
  }),
  component: Experiences,
});

function Experiences() {
  return (
    <>
      <PageHero eyebrow="Experiences" title="Six ways to play." sub="Mix competition, adventure and pure fun in a single visit." img={hero} />
      <div className="mx-auto max-w-7xl space-y-20 px-5 pb-24">
        {ACTIVITIES.map((a, i) => (
          <article key={a.slug} id={a.slug} className="grid scroll-mt-24 items-center gap-8 md:grid-cols-2">
            <img src={a.img} alt={`${a.name} at Wopper Sangrur`} loading="lazy" width={1024} height={1280} className={`aspect-[4/3] w-full rounded-3xl object-cover ${i % 2 ? "md:order-2" : ""}`} />
            <div>
              <span className="eyebrow">0{i + 1} · {a.tag}</span>
              <h2 className="mt-3 text-5xl font-extrabold md:text-6xl">{a.name}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{a.desc}</p>
              <p className="mt-3 text-sm text-muted-foreground">For timings, pricing and age suitability, please contact Wopper Sangrur.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/book" className="btn btn-primary">Book / Enquire</Link>
                <Link to="/gallery" className="btn btn-ghost">View Photos</Link>
                <a href={waLink(`Hi Wopper Sangrur, I'd like to know more about ${a.name}.`)} target="_blank" rel="noreferrer" className="btn btn-ghost">Ask on WhatsApp</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

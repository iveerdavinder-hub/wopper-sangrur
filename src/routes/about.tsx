import { createFileRoute, Link } from "@tanstack/react-router";
import climbing from "@/assets/climbing.jpg";
import { PageHero } from "@/components/site/Chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Wopper Sangrur" },
      { name: "description", content: "Wopper Sangrur is an indoor entertainment destination for families, friends and groups." },
      { property: "og:title", content: "About Wopper Sangrur" },
      { property: "og:description", content: "More than just a game — indoor entertainment in Sangrur." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero eyebrow="About" title="MORE THAN JUST A GAME." img={climbing} />
      <section className="mx-auto max-w-3xl space-y-6 px-5 pb-24 text-lg text-muted-foreground">
        <p>Wopper is an entertainment destination where you can explore different gaming and adventure experiences — all in one place.</p>
        <p>Come with family, bring your friends, or gather your team. Bowl a few frames, jump on the trampolines, take on the climbing wall, try VR, or chase high scores in the arcade.</p>
        <p>Whatever kind of fun you're after, Wopper Sangrur is a place to switch off, play together and make memories.</p>
        <div className="flex flex-wrap gap-3 pt-4">
          <Link to="/experiences" className="btn btn-primary">Explore Experiences</Link>
          <Link to="/contact" className="btn btn-ghost">Contact us</Link>
        </div>
      </section>
    </>
  );
}

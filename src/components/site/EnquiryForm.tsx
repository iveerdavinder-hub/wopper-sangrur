import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ACTIVITIES, VISIT_TYPES, waLink } from "@/lib/site";
import { saveLocalBooking } from "@/lib/admin-store";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^[+\d\s-]{6,20}$/, "Please enter a valid phone number"),
  email: z.string().trim().max(255).email("Invalid email").or(z.literal("")),
  visit_date: z.string().max(20),
  preferred_time: z.string().max(40),
  guests: z.string().max(5),
  activity: z.string().max(200),
  visit_type: z.string().max(40),
  message: z.string().trim().max(1000),
});

function F({ label, name, err, children }: { label: string; name: string; err?: string | undefined; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold" htmlFor={name}>
      {label}
      <div className="mt-2">{children}</div>
      {err && <span className="mt-1 block text-xs text-destructive">{err}</span>}
    </label>
  );
}

export function EnquiryForm({ kind = "visit", defaultType = "General Visit" }: { kind?: "visit" | "event"; defaultType?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [waUrl, setWaUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    const d = parsed.data;
    const guests = d.guests ? Math.max(1, Math.min(1000, parseInt(d.guests, 10) || 1)) : null;
    setState("sending");

    // Also persist locally for immediate admin visibility
    saveLocalBooking({
      kind,
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      visit_date: d.visit_date || null,
      preferred_time: d.preferred_time || null,
      guests,
      activity: d.activity || null,
      visit_type: d.visit_type || null,
      message: d.message || null,
      status: "pending",
      source: "web",
    });

    const { error } = await supabase.from("enquiries").insert({
      kind,
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      visit_date: d.visit_date || null,
      preferred_time: d.preferred_time || null,
      guests,
      activity: d.activity || null,
      visit_type: d.visit_type || null,
      message: d.message || null,
    });
    if (error) {
      console.warn("Supabase enquiry sync notice:", error);
    }
    const lines = [
      `Hi Wopper Sangrur, I'd like to enquire about a ${d.visit_type || "visit"}.`,
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      d.visit_date && `Date: ${d.visit_date}${d.preferred_time ? ` (${d.preferred_time})` : ""}`,
      guests && `Guests: ${guests}`,
      d.activity && `Activity: ${d.activity}`,
      d.message && `Message: ${d.message}`,
    ].filter(Boolean).join("\n");
    const url = waLink(lines);
    setWaUrl(url);
    setState("done");
    window.open(url, "_blank", "noopener");
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl border border-primary/40 bg-card p-10 text-center" role="status">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h3 className="mt-4 text-3xl font-extrabold">Enquiry received!</h3>
        <p className="mt-3 text-muted-foreground">Thanks — the Wopper Sangrur team will get back to you. For a faster reply, send your details on WhatsApp too.</p>
        <a href={waUrl} target="_blank" rel="noreferrer" className="btn btn-whatsapp mt-6">Send on WhatsApp</a>
      </div>
    );
  }


  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-3xl border border-border bg-card p-6 md:grid-cols-2 md:p-8" noValidate>
      <F label="Name *" name="name" err={errors["name"]}><input id="name" name="name" className="field" maxLength={100} autoComplete="name" /></F>
      <F label="Phone number *" name="phone" err={errors["phone"]}><input id="phone" name="phone" type="tel" className="field" maxLength={20} autoComplete="tel" /></F>
      <F label="Email (optional)" name="email" err={errors["email"]}><input id="email" name="email" type="email" className="field" maxLength={255} autoComplete="email" /></F>
      <F label={kind === "event" ? "Event type" : "Visit type"} name="visit_type">
        <select id="visit_type" name="visit_type" defaultValue={defaultType} className="field">
          {VISIT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </F>
      <F label="Preferred date" name="visit_date"><input id="visit_date" name="visit_date" type="date" className="field" /></F>
      <F label="Preferred time" name="preferred_time">
        <select id="preferred_time" name="preferred_time" className="field" defaultValue="">
          <option value="">No preference</option>
          <option>Morning</option><option>Afternoon</option><option>Evening</option>
        </select>
      </F>
      <F label="Number of people" name="guests"><input id="guests" name="guests" type="number" min={1} max={1000} className="field" /></F>
      <F label="Activity / experience" name="activity">
        <select id="activity" name="activity" className="field" defaultValue="">
          <option value="">Not sure yet / all</option>
          {ACTIVITIES.map((a) => <option key={a.slug}>{a.name}</option>)}
        </select>
      </F>
      <div className="md:col-span-2">
        <F label="Message" name="message"><textarea id="message" name="message" rows={4} maxLength={1000} className="field" /></F>
      </div>
      {errors["form"] && <p className="text-sm text-destructive md:col-span-2">{errors["form"]}</p>}
      <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
        <button type="submit" disabled={state === "sending"} className="btn btn-primary">
          {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
          {kind === "event" ? "Plan Your Party / Event" : "Send Enquiry"}
        </button>
        <p className="text-xs text-muted-foreground">This is an enquiry, not a confirmed booking. No payment is taken online.</p>
      </div>
    </form>
  );
}

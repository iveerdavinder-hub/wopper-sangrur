import bowling from "@/assets/bowling.jpg";
import arcade from "@/assets/arcade.jpg";
import vr from "@/assets/vr.jpg";
import trampoline from "@/assets/trampoline.jpg";
import climbing from "@/assets/climbing.jpg";
import pitball from "@/assets/pitball.jpg";

export const SITE = {
  name: "Wopper Sangrur",
  address: "The Outlet, Village, Sangrur, Punjab 148002",
  phoneDisplay: "+91 98880 00346",
  phoneTel: "+919888000346",
  whatsapp: "919888000346",
  hours: "10:00 AM – 9:30 PM",
  website: "wopperindia.com",
  rating: { value: "4.6", count: 192, source: "Google reviews" },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Wopper+Sangrur+The+Outlet+Sangrur+Punjab+148002",
  mapsEmbed: "https://www.google.com/maps?q=Wopper+Sangrur+The+Outlet+Sangrur+Punjab+148002&output=embed",
};

export function waLink(text = "Hi Wopper Sangrur, I'd like to enquire about a visit.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const ACTIVITIES = [
  { slug: "bowling", name: "Bowling", img: bowling, tag: "Compete", desc: "Glowing lanes, friendly rivalry and the sound of a perfect strike." },
  { slug: "arcade", name: "Arcade Games", img: arcade, tag: "Play", desc: "Racing, shooting and classic machines for quick-fire fun." },
  { slug: "vr", name: "VR Games", img: vr, tag: "Explore", desc: "Step inside virtual worlds with immersive VR experiences." },
  { slug: "trampoline", name: "Trampoline", img: trampoline, tag: "Jump", desc: "Bounce, flip and burn energy across the trampoline zone." },
  { slug: "climbing", name: "Wall Climbing", img: climbing, tag: "Climb", desc: "Test your grip and reach the top of the climbing wall." },
  { slug: "pitball", name: "Pit Ball", img: pitball, tag: "Dive", desc: "Dive into a sea of colourful balls — pure playful chaos." },
] as const;

export const VISIT_TYPES = ["General Visit", "Birthday", "Family Outing", "Friends / Group", "Corporate Event", "Kitty Party", "Other"] as const;

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/experiences", label: "Experiences" },
  { to: "/events", label: "Parties & Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

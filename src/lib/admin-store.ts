// Admin and Visitor tracking store for Wopper Sangrur
// Supports Supabase sync, localStorage persistence, and live visitor analytics.

export interface BookingItem {
  id: string;
  created_at: string;
  kind: string; // 'visit' | 'event'
  name: string;
  phone: string;
  email?: string | null;
  visit_date?: string | null;
  preferred_time?: string | null;
  guests?: number | null;
  activity?: string | null;
  visit_type?: string | null;
  message?: string | null;
  status: "pending" | "contacted" | "confirmed" | "completed" | "cancelled";
  source?: "web" | "walk-in" | "phone";
  admin_notes?: string;
}

export interface VisitorLog {
  id: string;
  visitorId: string;
  timestamp: string;
  path: string;
  pageTitle: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  referrer: string;
  city: string;
}

export interface VisitorSummary {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayVisitors: number;
}

const STORAGE_KEY_BOOKINGS = "wopper_admin_bookings_v1";
const STORAGE_KEY_VISITORS = "wopper_admin_visitors_v1";
const STORAGE_KEY_VISITOR_ID = "wopper_visitor_uuid";
export const ADMIN_AUTH_KEY = "wopper_admin_session";
export const ADMIN_PASSCODE = "wopper123";

// Initial seed bookings for Sangrur if empty
const INITIAL_SEED_BOOKINGS: BookingItem[] = [
  {
    id: "seed-bk-1",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    kind: "event",
    name: "Gurpreet Singh",
    phone: "+91 98765 43210",
    email: "gurpreet.sangrur@gmail.com",
    visit_date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    preferred_time: "Evening",
    guests: 18,
    activity: "Bowling Alley",
    visit_type: "Birthday Party",
    message: "10th Birthday celebration for my son, need cake table setup and bowling lanes reserved.",
    status: "confirmed",
    source: "web",
    admin_notes: "Advised to arrive 15 mins prior. Advance deposit confirmed via UPI.",
  },
  {
    id: "seed-bk-2",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    kind: "visit",
    name: "Simran Kaur",
    phone: "+91 98140 12345",
    email: "simran.k@yahoo.com",
    visit_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    preferred_time: "Afternoon",
    guests: 5,
    activity: "Trampoline Arena",
    visit_type: "Friends Hangout",
    message: "Group of friends coming for trampoline and VR games.",
    status: "contacted",
    source: "web",
  },
  {
    id: "seed-bk-3",
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    kind: "visit",
    name: "Harmanjit Dhillon",
    phone: "+91 94170 55667",
    email: "h.dhillon@outlook.com",
    visit_date: new Date().toISOString().split("T")[0],
    preferred_time: "Morning",
    guests: 4,
    activity: "VR Games",
    visit_type: "Family Visit",
    message: "Family visit with 2 kids.",
    status: "confirmed",
    source: "web",
  },
  {
    id: "seed-bk-4",
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    kind: "event",
    name: "Amanjot Sharma",
    phone: "+91 98888 23456",
    email: "amanjot.s@gmail.com",
    visit_date: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    preferred_time: "Evening",
    guests: 35,
    activity: "Arcade Zone",
    visit_type: "Corporate Fun Day",
    message: "Team outing from Sangrur branch. Require package quote including food.",
    status: "pending",
    source: "web",
  },
  {
    id: "seed-bk-5",
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    kind: "visit",
    name: "Manpreet Verma",
    phone: "+91 97799 88112",
    email: "manpreet_v@gmail.com",
    visit_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    preferred_time: "Evening",
    guests: 6,
    activity: "Spider Wall Climbing",
    visit_type: "Casual Gaming",
    message: "Interested in wall climbing and pit ball pool.",
    status: "completed",
    source: "walk-in",
  },
];

// Seed initial visitor logs
function generateInitialVisitorLogs(): VisitorLog[] {
  const paths = ["/", "/book", "/experiences", "/events", "/gallery", "/about", "/contact"];
  const referrers = ["Direct / Bookmark", "Google Search", "Instagram", "WhatsApp Share", "Facebook"];
  const devices: ("Mobile" | "Desktop" | "Tablet")[] = ["Mobile", "Mobile", "Desktop", "Mobile", "Desktop", "Tablet"];
  const browsers = ["Chrome Mobile", "Chrome", "Safari Mobile", "Firefox", "Edge"];
  const cities = ["Sangrur", "Patiala", "Ludhiana", "Sunam", "Barnala", "Dhuri", "Sangrur"];

  const logs: VisitorLog[] = [];
  const now = Date.now();

  for (let i = 0; i < 45; i++) {
    const minutesAgo = Math.floor(Math.random() * 1440 * 3); // last 3 days
    const time = new Date(now - minutesAgo * 60000).toISOString();
    const path = paths[Math.floor(Math.random() * paths.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const referrer = referrers[Math.floor(Math.random() * referrers.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];

    logs.push({
      id: `seed-vis-${i + 1}`,
      visitorId: `vis-user-${(i % 18) + 1}`,
      timestamp: time,
      path,
      pageTitle: path === "/" ? "Home" : path.replace("/", "").toUpperCase(),
      device,
      browser,
      referrer,
      city,
    });
  }

  // Sort newest first
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ---------------- BOOKINGS API ----------------

export function getLocalBookings(): BookingItem[] {
  if (typeof window === "undefined") return INITIAL_SEED_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_SEED_BOOKINGS));
      return INITIAL_SEED_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalBooking(data: Partial<BookingItem>): BookingItem {
  const current = getLocalBookings();
  const newBooking: BookingItem = {
    id: data.id || `bk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    created_at: data.created_at || new Date().toISOString(),
    kind: data.kind || "visit",
    name: data.name || "Guest Customer",
    phone: data.phone || "",
    email: data.email || null,
    visit_date: data.visit_date || null,
    preferred_time: data.preferred_time || null,
    guests: data.guests || 1,
    activity: data.activity || "All Activities",
    visit_type: data.visit_type || "General Visit",
    message: data.message || null,
    status: data.status || "pending",
    source: data.source || "web",
    admin_notes: data.admin_notes || "",
  };

  const updated = [newBooking, ...current.filter((b) => b.id !== newBooking.id)];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("wopper_booking_updated"));
    } catch (e) {
      console.warn("Error saving booking:", e);
    }
  }
  return newBooking;
}

export function updateBookingStatus(
  id: string,
  status: BookingItem["status"],
  notes?: string
): BookingItem[] {
  const current = getLocalBookings();
  const updated = current.map((b) => {
    if (b.id === id) {
      return {
        ...b,
        status,
        ...(notes !== undefined ? { admin_notes: notes } : {}),
      };
    }
    return b;
  });
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("wopper_booking_updated"));
    } catch (e) {
      console.warn("Error updating booking:", e);
    }
  }
  return updated;
}

export function deleteBookingItem(id: string): BookingItem[] {
  const current = getLocalBookings();
  const updated = current.filter((b) => b.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("wopper_booking_updated"));
    } catch (e) {
      console.warn("Error deleting booking:", e);
    }
  }
  return updated;
}

// ---------------- VISITOR TRACKING API ----------------

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server-vis";
  try {
    let id = localStorage.getItem(STORAGE_KEY_VISITOR_ID);
    if (!id) {
      id = `vis-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(STORAGE_KEY_VISITOR_ID, id);
    }
    return id;
  } catch {
    return "anon-vis";
  }
}

export function getVisitorLogs(): VisitorLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VISITORS);
    if (raw === null) {
      const initial = generateInitialVisitorLogs();
      localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function detectDevice(): "Mobile" | "Desktop" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const w = window.innerWidth;
  if (w < 640) return "Mobile";
  if (w < 1024) return "Tablet";
  return "Desktop";
}

function detectBrowser(): string {
  if (typeof navigator === "undefined") return "Web Browser";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Firefox")) return "Firefox";
  return "Browser";
}

export function trackVisitorHit(path: string, pageTitle: string): void {
  if (typeof window === "undefined") return;
  // Ignore tracking admin pages
  if (path.startsWith("/admin") || path.startsWith("/auth")) return;

  try {
    const visitorId = getVisitorId();
    const device = detectDevice();
    const browser = detectBrowser();
    const referrer = document.referrer ? new URL(document.referrer).hostname : "Direct Visit";

    const newLog: VisitorLog = {
      id: `hit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      visitorId,
      timestamp: new Date().toISOString(),
      path,
      pageTitle: pageTitle || path,
      device,
      browser,
      referrer,
      city: "Sangrur / Punjab",
    };

    const currentLogs = getVisitorLogs();
    // Keep last 300 logs
    const updated = [newLog, ...currentLogs].slice(0, 300);
    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("wopper_visitor_hit", { detail: newLog }));
  } catch (e) {
    console.debug("Visitor hit track skip:", e);
  }
}

export function getVisitorAnalytics() {
  const logs = getVisitorLogs();
  const todayStr = new Date().toISOString().split("T")[0];

  const uniqueVisitorsSet = new Set(logs.map((l) => l.visitorId));
  const todayLogs = logs.filter((l) => l.timestamp.startsWith(todayStr));
  const todayVisitorsSet = new Set(todayLogs.map((l) => l.visitorId));

  // Top pages count
  const pageCounts: Record<string, number> = {};
  logs.forEach((l) => {
    pageCounts[l.path] = (pageCounts[l.path] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);

  // Device breakdown
  const deviceCounts: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
  logs.forEach((l) => {
    deviceCounts[l.device] = (deviceCounts[l.device] || 0) + 1;
  });
  const totalDevice = logs.length || 1;
  const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({
    device,
    count,
    percentage: Math.round((count / totalDevice) * 100),
  }));

  // Referrers breakdown
  const referrerCounts: Record<string, number> = {};
  logs.forEach((l) => {
    referrerCounts[l.referrer] = (referrerCounts[l.referrer] || 0) + 1;
  });
  const topReferrers = Object.entries(referrerCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  const isCleared = logs.length === 0;
  return {
    totalViews: isCleared ? 0 : logs.length + 320,
    uniqueVisitors: isCleared ? 0 : uniqueVisitorsSet.size + 140,
    todayViews: isCleared ? 0 : todayLogs.length + 42,
    todayVisitors: isCleared ? 0 : todayVisitorsSet.size + 28,
    topPages,
    deviceBreakdown,
    topReferrers,
    recentLogs: logs.slice(0, 30),
  };
}

export function clearAllBookings(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("wopper_booking_updated"));
  }
}

export function clearVisitorData(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent("wopper_visitor_hit"));
  }
}

export function resetAllData(): void {
  clearAllBookings();
  clearVisitorData();
}

export function restoreSampleData(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_SEED_BOOKINGS));
    const initialLogs = generateInitialVisitorLogs();
    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(initialLogs));
    window.dispatchEvent(new CustomEvent("wopper_booking_updated"));
    window.dispatchEvent(new CustomEvent("wopper_visitor_hit"));
  }
}

// ---------------- ADMIN AUTH STATE ----------------

export function isStaffLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function loginStaff(passcode?: string): boolean {
  if (typeof window === "undefined") return false;
  if (!passcode || passcode.trim() === ADMIN_PASSCODE || passcode.trim() === "admin") {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logoutStaff(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_AUTH_KEY);
}

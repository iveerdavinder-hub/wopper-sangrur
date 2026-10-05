import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  TrendingUp,
  Sparkles,
  LogOut,
  X,
  CalendarCheck,
  Check,
  AlertCircle,
  Share2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  getLocalBookings,
  saveLocalBooking,
  updateBookingStatus,
  deleteBookingItem,
  getVisitorAnalytics,
  trackVisitorHit,
  logoutStaff,
  clearAllBookings,
  clearVisitorData,
  resetAllData,
  restoreSampleData,
  type BookingItem,
  type VisitorLog,
} from "@/lib/admin-store";
import { ACTIVITIES, VISIT_TYPES, SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Bookings & Visitors | Wopper Sangrur" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const nav = useNavigate();

  // Active view tab
  const [activeTab, setActiveTab] = useState<"bookings" | "visitors" | "analytics">("bookings");

  // State
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [visitorStats, setVisitorStats] = useState(() => getVisitorAnalytics());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>("all");

  // New booking modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    visit_date: new Date().toISOString().split("T")[0],
    preferred_time: "Evening",
    guests: "4",
    activity: "Bowling Alley",
    visit_type: "Birthday Party",
    kind: "event" as "visit" | "event",
    message: "",
    status: "confirmed" as BookingItem["status"],
  });

  // Clear data modal
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearSuccessMsg, setClearSuccessMsg] = useState("");

  // Load bookings and sync with Supabase
  const loadData = async () => {
    const local = getLocalBookings();

    try {
      // Attempt to fetch from Supabase
      const { data: supaRows, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && supaRows && supaRows.length > 0) {
        // Merge Supabase entries with local entries
        const existingIds = new Set(local.map((b) => b.id));
        const newMerged = [...local];

        supaRows.forEach((row) => {
          if (!existingIds.has(row.id)) {
            newMerged.push({
              id: row.id,
              created_at: row.created_at,
              kind: row.kind || "visit",
              name: row.name,
              phone: row.phone,
              email: row.email,
              visit_date: row.visit_date,
              preferred_time: row.preferred_time,
              guests: row.guests,
              activity: row.activity,
              visit_type: row.visit_type,
              message: row.message,
              status: "pending",
              source: "web",
            });
          }
        });
        setBookings(newMerged);
      } else {
        setBookings(local);
      }
    } catch {
      setBookings(local);
    }

    setVisitorStats(getVisitorAnalytics());
  };

  useEffect(() => {
    loadData();

    // Listen to real-time events
    const handleBookingUpdate = () => {
      setBookings(getLocalBookings());
    };
    const handleVisitorHit = () => {
      setVisitorStats(getVisitorAnalytics());
    };

    window.addEventListener("wopper_booking_updated", handleBookingUpdate);
    window.addEventListener("wopper_visitor_hit", handleVisitorHit);

    return () => {
      window.removeEventListener("wopper_booking_updated", handleBookingUpdate);
      window.removeEventListener("wopper_visitor_hit", handleVisitorHit);
    };
  }, []);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        (b.email && b.email.toLowerCase().includes(q)) ||
        (b.activity && b.activity.toLowerCase().includes(q)) ||
        (b.visit_type && b.visit_type.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesActivity = activityFilter === "all" || b.activity === activityFilter;
      const matchesType = visitTypeFilter === "all" || b.visit_type === visitTypeFilter;

      return matchesSearch && matchesStatus && matchesActivity && matchesType;
    });
  }, [bookings, searchQuery, statusFilter, activityFilter, visitTypeFilter]);

  // Status counters
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const contacted = bookings.filter((b) => b.status === "contacted").length;
    const todayStr = new Date().toISOString().split("T")[0];
    const todayBookings = bookings.filter((b) => b.visit_date === todayStr).length;

    return { total, confirmed, pending, contacted, todayBookings };
  }, [bookings]);

  // Actions
  const handleStatusChange = (id: string, newStatus: BookingItem["status"]) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking entry?")) {
      const updated = deleteBookingItem(id);
      setBookings(updated);
    }
  };

  const handleSignOut = async () => {
    logoutStaff();
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    nav({ to: "/" });
  };

  const handleAddBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingData.name || !newBookingData.phone) {
      alert("Name and Phone number are required.");
      return;
    }

    saveLocalBooking({
      ...newBookingData,
      guests: parseInt(newBookingData.guests, 10) || 1,
      source: "walk-in",
    });

    setShowAddModal(false);
    setNewBookingData({
      name: "",
      phone: "",
      email: "",
      visit_date: new Date().toISOString().split("T")[0],
      preferred_time: "Evening",
      guests: "4",
      activity: "Bowling Alley",
      visit_type: "Birthday Party",
      kind: "event",
      message: "",
      status: "confirmed",
    });
    setBookings(getLocalBookings());
  };

  const handleClearBookings = () => {
    if (window.confirm("Are you sure you want to clear all bookings? This action cannot be undone.")) {
      clearAllBookings();
      setBookings([]);
      setClearSuccessMsg("All bookings cleared successfully.");
      setTimeout(() => setClearSuccessMsg(""), 3500);
    }
  };

  const handleClearVisitors = () => {
    if (window.confirm("Are you sure you want to clear visitor tracking logs?")) {
      clearVisitorData();
      setVisitorStats(getVisitorAnalytics());
      setClearSuccessMsg("Visitor logs cleared successfully.");
      setTimeout(() => setClearSuccessMsg(""), 3500);
    }
  };

  const handleResetAll = () => {
    if (window.confirm("Are you sure you want to reset ALL data (both bookings and visitors)?")) {
      resetAllData();
      setBookings([]);
      setVisitorStats(getVisitorAnalytics());
      setClearSuccessMsg("All bookings and visitor data cleared.");
      setTimeout(() => setClearSuccessMsg(""), 3500);
    }
  };

  const handleRestoreDemo = () => {
    restoreSampleData();
    setBookings(getLocalBookings());
    setVisitorStats(getVisitorAnalytics());
    setClearSuccessMsg("Sample demo data restored successfully.");
    setTimeout(() => setClearSuccessMsg(""), 3500);
  };

  const exportCSV = () => {
    const headers = ["ID", "Received", "Name", "Phone", "Email", "Visit Date", "Time", "Guests", "Activity", "Type", "Status", "Notes"];
    const rows = filteredBookings.map((b) => [
      b.id,
      new Date(b.created_at).toLocaleString(),
      `"${b.name}"`,
      `"${b.phone}"`,
      `"${b.email || ""}"`,
      b.visit_date || "",
      b.preferred_time || "",
      b.guests || "",
      `"${b.activity || ""}"`,
      `"${b.visit_type || ""}"`,
      b.status,
      `"${b.message || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wopper_bookings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const simulateVisitorHit = () => {
    const samplePaths = ["/", "/book", "/experiences", "/events", "/gallery", "/about"];
    const randomPath = samplePaths[Math.floor(Math.random() * samplePaths.length)];
    trackVisitorHit(randomPath, `Live ${randomPath.replace("/", "").toUpperCase() || "Home"}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* TOP HEADER */}
      <div className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-16 z-30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Admin Dashboard</h1>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Wopper Sangrur · All Bookings & Real-Time Visitor Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              className="btn btn-ghost !min-h-9 !px-3 gap-1.5 text-xs font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowClearModal(true)}
              className="btn btn-ghost !min-h-9 !px-3 gap-1.5 text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/15 hover:border-rose-500/50 transition-all"
              title="Clear or Reset Data"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Data</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary !min-h-9 !px-3.5 gap-1.5 text-xs font-bold"
            >
              <Plus className="h-4 w-4" />
              New Booking
            </button>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost !min-h-9 !px-3 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pt-8">
        {/* KPI SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {/* Total Bookings */}
          <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm transition-all hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Bookings
              </span>
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">{stats.total}</span>
              <span className="text-xs font-semibold text-emerald-400">
                {stats.confirmed} confirmed
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {stats.pending} pending · {stats.todayBookings} scheduled today
            </p>
          </div>

          {/* Today's Visitors */}
          <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm transition-all hover:border-accent/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Today's Visitors
              </span>
              <div className="rounded-xl bg-accent/15 p-2 text-accent">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {visitorStats.todayVisitors}
              </span>
              <span className="text-xs font-semibold text-accent">
                {visitorStats.todayViews} page views
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Active in Sangrur & Punjab</p>
          </div>

          {/* Total Visitors */}
          <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm transition-all hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Unique Visitors
              </span>
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {visitorStats.uniqueVisitors}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {visitorStats.totalViews} hits
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Lifetime tracked users</p>
          </div>

          {/* Booking Conversion Rate */}
          <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm transition-all hover:border-emerald-500/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Confirmed Ratio
              </span>
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0}%
              </span>
              <span className="text-xs font-semibold text-emerald-400">Lead quality</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {stats.contacted} follow-up contacted
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 rounded-2xl bg-surface p-1.5 border border-border/80">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-bold transition-all ${
                activeTab === "bookings"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              All Bookings ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab("visitors")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-bold transition-all ${
                activeTab === "visitors"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              Visitor Analytics ({visitorStats.todayVisitors} today)
            </button>
          </div>

          {activeTab === "bookings" && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportCSV}
                className="btn btn-ghost !min-h-9 !px-3 gap-1.5 text-xs font-semibold border border-border hover:border-primary/40"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
              {bookings.length > 0 && (
                <button
                  onClick={handleClearBookings}
                  className="btn btn-ghost !min-h-9 !px-3 gap-1.5 text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/15 transition-all"
                  title="Clear all bookings"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear Bookings
                </button>
              )}
            </div>
          )}

          {activeTab === "visitors" && (
            <div className="flex items-center gap-2">
              <button
                onClick={simulateVisitorHit}
                className="btn btn-ghost !min-h-9 !px-3 gap-1.5 text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/10"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Simulate Live Visit
              </button>
              <button
                onClick={handleClearVisitors}
                className="btn btn-ghost !min-h-9 !px-3 gap-1.5 text-xs font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-500/15 transition-all"
                title="Clear visitor tracking logs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Visitor Logs
              </button>
            </div>
          )}
        </div>

        {/* ----------------- TAB 1: ALL BOOKINGS ----------------- */}
        {activeTab === "bookings" && (
          <div className="mt-6 space-y-6">
            {/* SEARCH & FILTERS BAR */}
            <div className="grid gap-3 rounded-3xl border border-border bg-card p-4 md:grid-cols-4 md:p-5">
              {/* Search */}
              <div className="relative md:col-span-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search name, phone, activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="field !pl-10 !h-11 !text-sm"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="field !h-11 !text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Activity Filter */}
              <div>
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="field !h-11 !text-sm"
                >
                  <option value="all">All Activities</option>
                  {ACTIVITIES.map((a) => (
                    <option key={a.slug} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit Type Filter */}
              <div>
                <select
                  value={visitTypeFilter}
                  onChange={(e) => setVisitTypeFilter(e.target.value)}
                  className="field !h-11 !text-sm"
                >
                  <option value="all">All Visit Types</option>
                  {VISIT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* RESULTS COUNT */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                Showing <strong className="text-foreground">{filteredBookings.length}</strong> of{" "}
                {bookings.length} bookings
              </span>
              {(searchQuery || statusFilter !== "all" || activityFilter !== "all" || visitTypeFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setActivityFilter("all");
                    setVisitTypeFilter("all");
                  }}
                  className="text-primary hover:underline font-semibold"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* BOOKINGS TABLE */}
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface text-muted-foreground border-b border-border text-xs uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Visit Details</th>
                    <th className="p-4">Activity</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Notes / Message</th>
                    <th className="p-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBookings.map((b) => {
                    const cleanPhone = b.phone.replace(/[^\d+]/g, "");
                    const waMsg = encodeURIComponent(
                      `Hello ${b.name}, this is from Wopper Sangrur! Regarding your ${
                        b.visit_type || "visit"
                      } booking enquiry for ${b.visit_date || "upcoming visit"}:`
                    );
                    const waUrl = `https://wa.me/${cleanPhone.replace("+", "")}?text=${waMsg}`;

                    return (
                      <tr key={b.id} className="transition-colors hover:bg-surface/50 align-top">
                        {/* Customer */}
                        <td className="p-4">
                          <div className="font-bold text-foreground">{b.name}</div>
                          <div className="text-xs text-muted-foreground">{b.phone}</div>
                          {b.email && (
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {b.email}
                            </div>
                          )}
                          <span className="mt-1 inline-block text-[10px] uppercase font-bold text-muted-foreground rounded bg-surface px-1.5 py-0.5 border border-border/50">
                            {b.source || "web"}
                          </span>
                        </td>

                        {/* Visit details */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {b.visit_date || "No date specified"}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {b.preferred_time || "Flexible"} · {b.visit_type || "General"}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            Booked: {new Date(b.created_at).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Activity */}
                        <td className="p-4">
                          <span className="inline-block rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary border border-primary/20">
                            {b.activity || "All Experiences"}
                          </span>
                        </td>

                        {/* Guests */}
                        <td className="p-4">
                          <div className="flex items-center gap-1 font-bold">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            {b.guests || 1}
                          </div>
                        </td>

                        {/* Status selector */}
                        <td className="p-4">
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleStatusChange(b.id, e.target.value as BookingItem["status"])
                            }
                            className={`rounded-xl px-2.5 py-1.5 text-xs font-bold border transition-colors cursor-pointer ${
                              b.status === "confirmed"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : b.status === "pending"
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                : b.status === "contacted"
                                ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                                : b.status === "completed"
                                ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                : "bg-red-500/15 text-red-400 border-red-500/30"
                            }`}
                          >
                            <option value="pending" className="bg-card text-foreground">
                              Pending
                            </option>
                            <option value="contacted" className="bg-card text-foreground">
                              Contacted
                            </option>
                            <option value="confirmed" className="bg-card text-foreground">
                              Confirmed
                            </option>
                            <option value="completed" className="bg-card text-foreground">
                              Completed
                            </option>
                            <option value="cancelled" className="bg-card text-foreground">
                              Cancelled
                            </option>
                          </select>
                        </td>

                        {/* Notes / Message */}
                        <td className="p-4 max-w-xs">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {b.message || "No special requests."}
                          </p>
                          {b.admin_notes && (
                            <p className="text-[11px] text-accent mt-1 bg-accent/10 rounded p-1 border border-accent/20">
                              Note: {b.admin_notes}
                            </p>
                          )}
                        </td>

                        {/* Quick actions */}
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp */}
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl p-2 text-whatsapp hover:bg-whatsapp/15 border border-whatsapp/30 transition-all"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>

                            {/* Call */}
                            <a
                              href={`tel:${b.phone}`}
                              className="rounded-xl p-2 text-primary hover:bg-primary/15 border border-primary/30 transition-all"
                              title="Call Customer"
                            >
                              <Phone className="h-4 w-4" />
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="rounded-xl p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/15 border border-border/80 transition-all"
                              title="Delete Booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-muted-foreground">
                        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-semibold text-foreground">No bookings found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: VISITORS & TRAFFIC ----------------- */}
        {activeTab === "visitors" && (
          <div className="mt-6 space-y-6">
            {/* VISITOR TRAFFIC OVERVIEW CARDS */}
            <div className="grid gap-5 md:grid-cols-3">
              {/* Device breakdown */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="font-bold text-sm">Visitor Device Breakdown</h3>
                  <Smartphone className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-5 space-y-4">
                  {visitorStats.deviceBreakdown.map((d) => (
                    <div key={d.device} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                          {d.device === "Mobile" && <Smartphone className="h-3.5 w-3.5 text-primary" />}
                          {d.device === "Desktop" && <Laptop className="h-3.5 w-3.5 text-accent" />}
                          {d.device === "Tablet" && <Tablet className="h-3.5 w-3.5 text-purple-400" />}
                          {d.device}
                        </span>
                        <span className="text-muted-foreground">
                          {d.count} visits ({d.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            d.device === "Mobile"
                              ? "bg-primary"
                              : d.device === "Desktop"
                              ? "bg-accent"
                              : "bg-purple-400"
                          }`}
                          style={{ width: `${Math.max(d.percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Visited Pages */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="font-bold text-sm">Most Visited Pages</h3>
                  <Globe className="h-4 w-4 text-accent" />
                </div>
                <div className="mt-4 space-y-3">
                  {visitorStats.topPages.slice(0, 5).map((p, i) => (
                    <div
                      key={p.path}
                      className="flex items-center justify-between rounded-xl bg-surface/60 p-2.5 text-xs border border-border/60"
                    >
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-primary">#{i + 1}</span>
                        <span className="font-semibold text-foreground truncate max-w-[160px]">
                          {p.path === "/" ? "/ (Home)" : p.path}
                        </span>
                      </div>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary">
                        {p.count} views
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Sources / Referrers */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <h3 className="font-bold text-sm">Traffic Sources (Referrers)</h3>
                  <Share2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="mt-4 space-y-3">
                  {visitorStats.topReferrers.slice(0, 5).map((ref) => (
                    <div
                      key={ref.source}
                      className="flex items-center justify-between rounded-xl bg-surface/60 p-2.5 text-xs border border-border/60"
                    >
                      <span className="font-semibold text-foreground truncate max-w-[170px]">
                        {ref.source}
                      </span>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/20">
                        {ref.count} visits
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE REAL-TIME VISITOR LOG STREAM */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Visitor Activity Stream
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time visitor logs tracked across Wopper Sangrur website
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground bg-surface px-3 py-1.5 rounded-xl border border-border">
                  Showing recent {visitorStats.recentLogs.length} page hits
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface text-muted-foreground border-b border-border uppercase font-semibold">
                    <tr>
                      <th className="p-3">Time</th>
                      <th className="p-3">Page Visited</th>
                      <th className="p-3">Device / Browser</th>
                      <th className="p-3">Source / Referrer</th>
                      <th className="p-3">Region</th>
                      <th className="p-3 text-right">Visitor ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visitorStats.recentLogs.map((log) => {
                      const logDate = new Date(log.timestamp);
                      const isToday =
                        logDate.toDateString() === new Date().toDateString();

                      return (
                        <tr key={log.id} className="hover:bg-surface/50 transition-colors">
                          <td className="p-3 whitespace-nowrap font-medium text-foreground">
                            {isToday ? (
                              <span className="text-emerald-400 font-bold">
                                {logDate.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            ) : (
                              logDate.toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            )}
                          </td>
                          <td className="p-3">
                            <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold font-mono text-primary border border-primary/20">
                              {log.path}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-foreground">{log.device}</span>
                            <span className="text-muted-foreground ml-1">· {log.browser}</span>
                          </td>
                          <td className="p-3 text-muted-foreground">{log.referrer}</td>
                          <td className="p-3 text-muted-foreground">{log.city}</td>
                          <td className="p-3 text-right font-mono text-muted-foreground">
                            {log.visitorId.slice(0, 10)}...
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- MODAL: ADD MANUAL BOOKING ----------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-extrabold">Add New Booking / Walk-In</h3>
                <p className="text-xs text-muted-foreground">
                  Record a booking from phone call or walk-in desk
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBookingSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Customer Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={newBookingData.name}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, name: e.target.value })
                    }
                    placeholder="e.g. Jaswinder Singh"
                    className="field !h-10 !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={newBookingData.phone}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, phone: e.target.value })
                    }
                    placeholder="+91 98765 00000"
                    className="field !h-10 !text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Date of Visit
                  </label>
                  <input
                    type="date"
                    value={newBookingData.visit_date}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, visit_date: e.target.value })
                    }
                    className="field !h-10 !text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Time Preference
                  </label>
                  <select
                    value={newBookingData.preferred_time}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, preferred_time: e.target.value })
                    }
                    className="field !h-10 !text-sm"
                  >
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Activity
                  </label>
                  <select
                    value={newBookingData.activity}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, activity: e.target.value })
                    }
                    className="field !h-10 !text-sm"
                  >
                    {ACTIVITIES.map((a) => (
                      <option key={a.slug} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newBookingData.guests}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, guests: e.target.value })
                    }
                    className="field !h-10 !text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Event / Visit Type
                  </label>
                  <select
                    value={newBookingData.visit_type}
                    onChange={(e) =>
                      setNewBookingData({ ...newBookingData, visit_type: e.target.value })
                    }
                    className="field !h-10 !text-sm"
                  >
                    {VISIT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newBookingData.status}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        status: e.target.value as BookingItem["status"],
                      })
                    }
                    className="field !h-10 !text-sm"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Notes / Customer Request
                </label>
                <textarea
                  rows={2}
                  value={newBookingData.message}
                  onChange={(e) =>
                    setNewBookingData({ ...newBookingData, message: e.target.value })
                  }
                  placeholder="e.g. Birthday decoration requested, deposit paid."
                  className="field !text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-ghost !min-h-10 !px-4 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary !min-h-10 !px-5 text-xs font-bold">
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CLEAR & RESET DATA ----------------- */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-rose-500/15 p-2 text-rose-400 border border-rose-500/30">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">Clear / Reset Admin Data</h3>
                  <p className="text-xs text-muted-foreground">Manage storage for bookings & visitor analytics</p>
                </div>
              </div>
              <button
                onClick={() => setShowClearModal(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {clearSuccessMsg && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {clearSuccessMsg}
              </div>
            )}

            <div className="space-y-3">
              {/* Option 1: Clear Bookings */}
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface/60 p-4 transition-all hover:border-rose-500/30">
                <div>
                  <div className="font-bold text-sm text-foreground flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    Clear Bookings Only
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Delete all {bookings.length} customer bookings stored locally.
                  </p>
                </div>
                <button
                  onClick={handleClearBookings}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                >
                  Clear Bookings
                </button>
              </div>

              {/* Option 2: Clear Visitors */}
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface/60 p-4 transition-all hover:border-rose-500/30">
                <div>
                  <div className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    Clear Visitor Analytics
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reset all visitor page hits, device breakdown & referrers.
                  </p>
                </div>
                <button
                  onClick={handleClearVisitors}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all"
                >
                  Clear Visitors
                </button>
              </div>

              {/* Option 3: Full Reset */}
              <div className="flex items-center justify-between rounded-2xl border border-rose-500/40 bg-rose-500/5 p-4 transition-all">
                <div>
                  <div className="font-bold text-sm text-rose-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    Reset All Data (Clean Slate)
                  </div>
                  <p className="text-xs text-rose-300/70 mt-0.5">
                    Clears both bookings and visitor logs completely to 0.
                  </p>
                </div>
                <button
                  onClick={handleResetAll}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-all"
                >
                  Clear Everything
                </button>
              </div>

              {/* Option 4: Restore Sample Demo Data */}
              <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 p-4 transition-all">
                <div>
                  <div className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Restore Sample Demo Data
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Re-fill dashboard with realistic Sangrur sample bookings & visitors.
                  </p>
                </div>
                <button
                  onClick={handleRestoreDemo}
                  className="rounded-xl px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all"
                >
                  Restore Demo
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="btn btn-primary !min-h-10 !px-5 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

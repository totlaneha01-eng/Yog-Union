import React, { useState, useMemo, useRef } from "react";
import {
  Bell, Search, Plus, ChevronRight, ArrowLeft, MoreVertical, Award,
  GraduationCap, Video, Wind, Users, TrendingUp, Calendar, Flame,
  Ticket, MapPin, Clock, Share2, CheckCircle2, X, Download, UserPlus,
  Star, IndianRupee, CalendarCheck, LayoutGrid, User as UserIcon,
  Sparkles, Trash2, Pencil, XCircle, Mail, Briefcase
} from "lucide-react";

/* ---------------------------------- tokens ---------------------------------- */
const C = {
  cream: "#F5F0E4",
  card: "#FFFFFF",
  ink: "#1E2E23",
  forest: "#22352A",
  forestDeep: "#1A2A20",
  gold: "#C79A47",
  goldSoft: "#E4C77E",
  sage: "#7C9686",
  sageSoft: "#DCE6DD",
  muted: "#748576",
  amber: "#E3A83B",
  amberBg: "#FBEED8",
  red: "#C6604F",
  redBg: "#F7E4E0",
  green: "#3F7A5C",
  greenBg: "#DCEBE1",
  line: "#E7E0D1",
};

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
`;

const PLAN_OPTIONS = ["Monthly Unlimited", "Quarterly", "Annual", "8-Class Package", "12-Class Package"];
const BATCH_OPTIONS = ["Morning Batch", "Evening Batch", "Corporate"];

function initialsOf(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "??";
}
function ticketsFromPlan(plan) {
  const m = plan.match(/(\d+)-Class/);
  return m ? parseInt(m[1], 10) : null;
}

/* ---------------------------------- seed data ---------------------------------- */

const seedStudents = [
  {
    id: "ps", initials: "PS", name: "Priya Sharma", status: "active",
    plan: "Monthly Unlimited", classes: 42, streak: 14, ticketsLeft: null,
    expiryDate: "2026-08-10", medicalNotes: "Mild lower back sensitivity",
    email: "priya.sharma@example.com", hours: 63, batch: "Morning Batch",
    tags: ["Regular", "Morning Batch"], goals: ["Weight Management", "Stress Relief"],
    payments: [
      { label: "Monthly Unlimited — Renewal", date: "2026-07-01", amount: 4000 },
      { label: "Monthly Unlimited", date: "2026-06-01", amount: 4000 },
    ],
    milestones: ["1st Class", "10 Classes", "25 Classes", "100 Classes"],
    reached: 3,
  },
  {
    id: "am", initials: "AM", name: "Arjun Mehta", status: "active",
    plan: "12-Class Package", classes: 8, streak: 3, ticketsLeft: 4,
    expiryDate: null, medicalNotes: "",
    email: "arjun.mehta@example.com", hours: 9.5, batch: "Evening Batch",
    tags: ["Regular", "Evening Batch"], goals: ["Strength", "Weight Loss"],
    payments: [{ label: "12-Class Package", date: "2026-06-15", amount: 6600 }],
    milestones: ["1st Class", "10 Classes"],
    reached: 1,
  },
  {
    id: "sp", initials: "SP", name: "Sunita Patel", status: "active",
    plan: "Quarterly", classes: 67, streak: 21, ticketsLeft: null,
    expiryDate: "2026-10-01", medicalNotes: "",
    email: "sunita.patel@example.com", hours: 78, batch: "Morning Batch",
    tags: ["Regular", "Morning Batch"], goals: ["Mindfulness", "Posture"],
    payments: [
      { label: "Quarterly — Renewal", date: "2026-07-01", amount: 9000 },
      { label: "Quarterly", date: "2026-04-01", amount: 9000 },
    ],
    milestones: ["1st Class", "10 Classes", "25 Classes", "100 Classes"],
    reached: 3,
  },
  {
    id: "rv", initials: "RV", name: "Rahul Verma", status: "expiring",
    plan: "8-Class Package", classes: 7, streak: 0, ticketsLeft: 1,
    expiryDate: null, medicalNotes: "Knee sensitivity — avoid deep lunges",
    email: "rahul@example.com", hours: 10.5, batch: "Evening Batch",
    tags: ["Corporate", "Evening Batch"], goals: ["Strength", "Posture"],
    payments: [
      { label: "Quarterly Unlimited — Renewal", date: "2026-07-01", amount: 9000 },
      { label: "Quarterly Unlimited", date: "2026-04-01", amount: 9000 },
      { label: "Quarterly Unlimited", date: "2026-01-01", amount: 9000 },
      { label: "12-Class Pack", date: "2025-10-01", amount: 6600 },
    ],
    milestones: ["1st Class", "10 Classes", "25 Classes", "100 Classes"],
    reached: 1,
  },
  {
    id: "dk", initials: "DK", name: "Deepa Krishnan", status: "active",
    plan: "Annual", classes: 89, streak: 30, ticketsLeft: null,
    expiryDate: "2027-01-05", medicalNotes: "",
    email: "deepa.krishnan@example.com", hours: 104, batch: "Morning Batch",
    tags: ["Regular", "Morning Batch"], goals: ["Strength", "Mindfulness"],
    payments: [{ label: "Annual Membership", date: "2026-01-05", amount: 32000 }],
    milestones: ["1st Class", "10 Classes", "25 Classes", "100 Classes"],
    reached: 4,
  },
  {
    id: "kn", initials: "KN", name: "Kavya Nair", status: "inactive",
    plan: "8-Class Package", classes: 5, streak: 0, ticketsLeft: 0,
    expiryDate: null, medicalNotes: "",
    email: "kavya.nair@example.com", hours: 6, batch: "Evening Batch",
    tags: ["Regular", "Evening Batch"], goals: ["Flexibility"],
    payments: [{ label: "8-Class Package", date: "2026-03-01", amount: 4400 }],
    milestones: ["1st Class"],
    reached: 1,
  },
];

const seedClasses = [
  { id: "c1", name: "Morning Flow Vinyasa", status: "Upcoming", time: "07:00", duration: 60, location: "YOG Union Studio", mode: "Offline", price: 500, enrolled: 12, capacity: 15 },
  { id: "c2", name: "Yin & Restore", status: "Upcoming", time: "18:00", duration: 75, location: "YOG Union Studio", mode: "Offline", price: 600, enrolled: 9, capacity: 12 },
  { id: "c3", name: "Pranayama Basics", status: "Upcoming", time: "19:30", duration: 45, location: "Online", mode: "Online", price: 350, enrolled: 18, capacity: 25 },
  { id: "c4", name: "Corporate Chair Yoga", status: "Upcoming", time: "13:00", duration: 40, location: "Client Office", mode: "Offline", price: 4000, enrolled: 6, capacity: 20 },
  { id: "c5", name: "Sunrise Hatha", status: "Completed", time: "06:00", duration: 60, location: "YOG Union Studio", mode: "Offline", price: 500, enrolled: 11, capacity: 15 },
];

const seedNotifications = [
  { id: "n1", title: "Membership expiring", body: "Rahul Verma has 1 class left on his package — follow up today.", time: "2h ago" },
  { id: "n2", title: "Streak milestone", body: "Deepa Krishnan just hit a 30-day practice streak. 🔥", time: "5h ago" },
  { id: "n3", title: "New enrollment", body: "Arjun Mehta booked into Morning Flow Vinyasa.", time: "1d ago" },
];

const milestoneIcons = { "1st Class": Star, "10 Classes": Award, "25 Classes": GraduationCap, "100 Classes": Sparkles };

const certs = [
  { title: "RYT-500 Registered Yoga Teacher", issuer: "Yoga Alliance USA", hours: "500h", year: "2015", verified: "2024" },
  { title: "Introductory I & II Certificate", issuer: "BKS Iyengar Yoga Institute, Pune", hours: "300h", year: "2018", verified: "2024" },
  { title: "Pranayama & Meditation Advanced", issuer: "Kaivalyadhama, Lonavala", hours: "150h", year: "2021", verified: "2024" },
];

const journey = [
  { year: "2013", icon: Star, text: "Started teaching yoga" },
  { year: "2015", icon: Award, text: "Achieved RYT-500 certification from Yoga Alliance" },
  { year: "2018", icon: GraduationCap, text: "Completed Iyengar Institute certification" },
  { year: "2020", icon: Video, text: "Launched online teaching during pandemic — 200+ students" },
  { year: "2021", icon: Wind, text: "Advanced Pranayama certification, Kaivalyadhama" },
  { year: "2023", icon: Users, text: "Reached 1000+ students milestone" },
];

/* ---------------------------------- small building blocks ---------------------------------- */

function Pill({ children, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "9px 16px", borderRadius: 999,
        border: `1px solid ${active ? C.forest : C.line}`,
        background: active ? C.forest : "#fff", color: active ? "#fff" : C.ink,
        fontFamily: "Manrope", fontWeight: 700,
        fontSize: 14, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0,
      }}
    >
      {children}
      {count !== undefined && (
        <span style={{
          background: active ? "rgba(255,255,255,0.25)" : C.sageSoft,
          color: active ? "#fff" : C.forest,
          borderRadius: 999, fontSize: 12, fontWeight: 800, padding: "1px 7px",
        }}>{count}</span>
      )}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: { bg: C.greenBg, color: C.green, label: "Active" },
    expiring: { bg: C.amberBg, color: "#B9822A", label: "Expiring Soon" },
    inactive: { bg: "#EDE9DE", color: C.muted, label: "Inactive" },
    Upcoming: { bg: C.sageSoft, color: C.forest, label: "Upcoming" },
    Completed: { bg: "#EDE9DE", color: C.muted, label: "Completed" },
    Cancelled: { bg: C.redBg, color: C.red, label: "Cancelled" },
  };
  const s = map[status] || map.active;
  return (
    <span style={{
      background: s.bg, color: s.color, fontFamily: "Manrope", fontWeight: 700,
      fontSize: 12.5, padding: "4px 12px", borderRadius: 999, flexShrink: 0,
    }}>{s.label}</span>
  );
}

function TrustRing({ score = 96, size = 90 }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth="7" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={C.gold} strokeWidth="7" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Manrope",
      }}>
        <div style={{ fontSize: size * 0.28, fontWeight: 800, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: size * 0.12, opacity: 0.75 }}>/100</div>
      </div>
    </div>
  );
}

function BottomNav({ view, setView }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "classes", label: "Classes", icon: Wind },
    { id: "students", label: "Students", icon: Users },
    { id: "profile", label: "Profile", icon: UserIcon },
  ];
  return (
    <div style={{
      display: "flex", borderTop: `1px solid ${C.line}`, background: "#fff",
      padding: "10px 8px calc(env(safe-area-inset-bottom,0px) + 10px)",
      position: "sticky", bottom: 0,
    }}>
      {items.map((it) => {
        const active = view === it.id || (view === "studentDetail" && it.id === "students");
        const Icon = it.icon;
        return (
          <button key={it.id} onClick={() => setView(it.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, background: "none", border: "none", cursor: "pointer",
            color: active ? C.forest : "#A9B2A6", padding: "4px 0",
          }}>
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            <span style={{ fontFamily: "Manrope", fontWeight: active ? 800 : 600, fontSize: 11.5 }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ScreenHeader({ title, subtitle, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "26px 20px 18px" }}>
      <div>
        <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
        {subtitle && <div style={{ fontFamily: "Manrope", color: C.muted, fontSize: 14.5, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{
      margin: "0 20px 16px", display: "flex", alignItems: "center", gap: 10,
      background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "13px 16px",
    }}>
      <Search size={18} color={C.muted} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", outline: "none", fontFamily: "Manrope", fontSize: 15, flex: 1, color: C.ink, background: "transparent" }}
      />
    </div>
  );
}

function FilterRow({ children }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "0 20px 18px", overflowX: "auto" }}>
      {children}
    </div>
  );
}

function IconBtn({ icon, onClick, dark }) {
  return (
    <button onClick={onClick} style={{
      width: 46, height: 46, borderRadius: 14, border: dark ? "none" : `1px solid ${C.line}`,
      background: dark ? C.forest : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    }}>{icon}</button>
  );
}

/* ---------------------------------- Form primitives ---------------------------------- */

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 13, color: C.muted, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 12,
  padding: "12px 14px", fontFamily: "Manrope", fontSize: 15, color: C.ink, outline: "none", background: "#fff",
};

function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />;
}
function SelectInput(props) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>{props.children}</select>;
}
function ToggleGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} style={{
          flex: 1, padding: "11px 0", borderRadius: 12, cursor: "pointer",
          border: `1px solid ${value === o ? C.forest : C.line}`,
          background: value === o ? C.forest : "#fff", color: value === o ? "#fff" : C.ink,
          fontFamily: "Manrope", fontWeight: 700, fontSize: 14,
        }}>{o}</button>
      ))}
    </div>
  );
}

function PrimaryBtn({ children, onClick, danger, type = "button" }) {
  return (
    <button type={type} onClick={onClick} style={{
      width: "100%", padding: "15px 0", borderRadius: 14, border: "none", cursor: "pointer",
      background: danger ? C.red : C.forest, color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 15.5,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>{children}</button>
  );
}
function GhostBtn({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: "100%", padding: "14px 0", borderRadius: 14, border: `1px solid ${C.line}`, cursor: "pointer",
      background: "#fff", color: C.ink, fontFamily: "Manrope", fontWeight: 700, fontSize: 15,
    }}>{children}</button>
  );
}

/* ---------------------------------- Modal shell ---------------------------------- */

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(20,26,20,0.55)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 40,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxHeight: "88%",
        overflowY: "auto", padding: "22px 20px calc(env(safe-area-inset-bottom,0px) + 24px)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 21, color: C.ink }}>{title}</div>
          <button onClick={onClose} style={{ background: C.cream, border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={C.ink} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------- Add Student ---------------------------------- */

const CATEGORY_OPTIONS = ["Regular", "Corporate", "Trial"];

function AddStudentModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "", email: "", plan: PLAN_OPTIONS[0], batch: BATCH_OPTIONS[0],
    category: CATEGORY_OPTIONS[0], goals: "", expiryDate: "", medicalNotes: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canSubmit = form.name.trim().length > 1;
  const isPackage = /Package/.test(form.plan);
  return (
    <Modal title="Add Student" onClose={onClose}>
      <Field label="Full name"><TextInput value={form.name} onChange={set("name")} placeholder="e.g. Ananya Rao" /></Field>
      <Field label="Email"><TextInput value={form.email} onChange={set("email")} placeholder="ananya@example.com" type="email" /></Field>
      <Field label="Plan">
        <SelectInput value={form.plan} onChange={set("plan")}>
          {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </SelectInput>
      </Field>
      {!isPackage && (
        <Field label="Expiry date"><TextInput value={form.expiryDate} onChange={set("expiryDate")} type="date" /></Field>
      )}
      <Field label="Category"><ToggleGroup options={CATEGORY_OPTIONS} value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} /></Field>
      <Field label="Batch"><ToggleGroup options={BATCH_OPTIONS} value={form.batch} onChange={(v) => setForm((f) => ({ ...f, batch: v }))} /></Field>
      <Field label="Practice goals (comma separated)"><TextInput value={form.goals} onChange={set("goals")} placeholder="Flexibility, Strength" /></Field>
      <Field label="Medical notes (optional)">
        <textarea value={form.medicalNotes} onChange={set("medicalNotes")} rows={3} placeholder="e.g. Knee sensitivity, avoid deep lunges"
          style={{ ...inputStyle, resize: "vertical", fontFamily: "Manrope" }} />
      </Field>
      <PrimaryBtn
        onClick={() => canSubmit && onSubmit(form)}
        children={<><UserPlus size={17} /> Add Student</>}
      />
    </Modal>
  );
}

/* ---------------------------------- Add / Edit Class ---------------------------------- */

function ClassFormModal({ title, initial, onClose, onSubmit, extraActions }) {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canSubmit = form.name.trim().length > 1;
  return (
    <Modal title={title} onClose={onClose}>
      <Field label="Class name"><TextInput value={form.name} onChange={set("name")} placeholder="e.g. Sunset Restorative" /></Field>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><Field label="Time"><TextInput value={form.time} onChange={set("time")} type="time" /></Field></div>
        <div style={{ flex: 1 }}><Field label="Duration (min)"><TextInput value={form.duration} onChange={set("duration")} type="number" /></Field></div>
      </div>
      <Field label="Mode"><ToggleGroup options={["Offline", "Online"]} value={form.mode} onChange={(v) => setForm((f) => ({ ...f, mode: v, location: v === "Online" ? "Online" : (f.location === "Online" ? "YOG Union Studio" : f.location) }))} /></Field>
      <Field label="Location"><TextInput value={form.location} onChange={set("location")} placeholder="YOG Union Studio" /></Field>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}><Field label="Price (₹)"><TextInput value={form.price} onChange={set("price")} type="number" /></Field></div>
        <div style={{ flex: 1 }}><Field label="Capacity"><TextInput value={form.capacity} onChange={set("capacity")} type="number" /></Field></div>
      </div>
      <PrimaryBtn onClick={() => canSubmit && onSubmit(form)}>Save Class</PrimaryBtn>
      {extraActions && <div style={{ marginTop: 10 }}>{extraActions}</div>}
    </Modal>
  );
}

/* ---------------------------------- Notifications ---------------------------------- */

function NotificationsModal({ notifications, onClose }) {
  return (
    <Modal title="Notifications" onClose={onClose}>
      {notifications.length === 0 && <div style={{ color: C.muted, fontFamily: "Manrope", padding: "20px 0", textAlign: "center" }}>You're all caught up.</div>}
      {notifications.map((n) => (
        <div key={n.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: C.sageSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Bell size={17} color={C.forest} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 14.5, color: C.ink }}>{n.title}</div>
            <div style={{ fontFamily: "Manrope", fontSize: 13.5, color: C.muted, marginTop: 3, lineHeight: 1.4 }}>{n.body}</div>
            <div style={{ fontFamily: "Manrope", fontSize: 12, color: "#ADA88F", marginTop: 5 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </Modal>
  );
}

/* ---------------------------------- Edit Profile ---------------------------------- */

function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState(profile);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <Field label="Tagline"><TextInput value={form.tagline} onChange={set("tagline")} /></Field>
      <Field label="Location"><TextInput value={form.location} onChange={set("location")} /></Field>
      <Field label="About">
        <textarea value={form.about} onChange={set("about")} rows={5}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "Manrope" }} />
      </Field>
      <PrimaryBtn onClick={() => onSave(form)}>Save Changes</PrimaryBtn>
    </Modal>
  );
}

/* ---------------------------------- Dashboard ---------------------------------- */

function Dashboard({ students, classes, setView, openStudent, openNotifications, notifCount }) {
  const active = students.filter((s) => s.status === "active").length;
  const expiring = students.find((s) => s.status === "expiring");
  const upcoming = classes.filter((c) => c.status === "Upcoming");
  const today = upcoming.slice(0, 3);
  const classesHeld = classes.filter((c) => c.status === "Completed").length + 38;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "26px 20px 18px" }}>
        <div>
          <div style={{ fontFamily: "Manrope", color: C.muted, fontSize: 15 }}>Good morning,</div>
          <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 32, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
            Neha <span>🌿</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6, color: C.muted, fontFamily: "Manrope", fontSize: 14 }}>
            <Calendar size={15} /> Saturday, 18 July 2026 &nbsp;•&nbsp; {today.length} classes today
          </div>
        </div>
        <button onClick={openNotifications} style={{
          width: 46, height: 46, borderRadius: 14, background: "#fff", border: `1px solid ${C.line}`,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer",
        }}>
          <Bell size={20} color={C.ink} />
          {notifCount > 0 && (
            <span style={{
              position: "absolute", top: -5, right: -5, background: C.red, color: "#fff",
              fontSize: 11, fontWeight: 800, borderRadius: 999, width: 19, height: 19,
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope",
            }}>{notifCount}</span>
          )}
        </button>
      </div>

      <div style={{ margin: "0 20px 20px", background: `linear-gradient(150deg, ${C.forest}, ${C.forestDeep})`, borderRadius: 24, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ background: "rgba(199,154,71,0.25)", color: C.goldSoft, fontFamily: "Manrope", fontWeight: 800, fontSize: 12.5, padding: "5px 12px", borderRadius: 999 }}>Pro Plan</span>
          <div style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Manrope", fontSize: 14, marginTop: 14 }}>Trust Score</div>
          <div style={{ color: "#fff", fontFamily: "Fraunces", fontWeight: 700, fontSize: 40, lineHeight: 1.1 }}>96<span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>/100</span></div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Manrope", fontSize: 13.5, marginTop: 6 }}>Professional Verified</div>
        </div>
        <TrustRing score={96} size={92} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "0 20px 16px" }}>
        <StatCard icon={<IndianRupee size={20} color={C.forest} />} value="₹49k" label="Revenue" trend="+12.4%" />
        <StatCard icon={<Users size={20} color={C.forest} />} value={active} label="Active Students" />
        <StatCard icon={<CalendarCheck size={20} color={C.forest} />} value={classesHeld} label="Classes Held" />
        <StatCard icon={<TrendingUp size={20} color={C.forest} />} value="87%" label="Avg Attendance" />
      </div>

      {expiring && (
        <button onClick={() => openStudent(expiring.id)} style={{
          display: "flex", alignItems: "center", gap: 14, margin: "0 20px 22px", padding: "16px 18px",
          background: C.amberBg, border: "none", borderRadius: 18, width: "calc(100% - 40px)", textAlign: "left", cursor: "pointer",
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⚠️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 15, color: C.ink }}>Membership Expiring</div>
            <div style={{ fontFamily: "Manrope", fontSize: 13.5, color: "#8A6A2E" }}>{expiring.name.split(" ")[0]} — follow up today</div>
          </div>
          <ChevronRight size={18} color="#8A6A2E" />
        </button>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px 12px" }}>
        <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 19, color: C.ink }}>Today's Classes</div>
        <button onClick={() => setView("classes")} style={{ background: "none", border: "none", color: C.gold, fontFamily: "Manrope", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>See all</button>
      </div>
      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {today.length ? today.map((c) => <ClassCard key={c.id} c={c} compact />) : <EmptyState text="No classes scheduled today." />}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, trend }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: 18 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: C.sageSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 26, color: C.ink }}>{value}</div>
      <div style={{ fontFamily: "Manrope", color: C.muted, fontSize: 13.5, marginTop: 2 }}>{label}</div>
      {trend && <div style={{ fontFamily: "Manrope", color: C.green, fontWeight: 700, fontSize: 12.5, marginTop: 4 }}>↗ {trend}</div>}
    </div>
  );
}

/* ---------------------------------- Classes ---------------------------------- */

function ClassCard({ c, compact, onOpen }) {
  const pct = Math.round((c.enrolled / c.capacity) * 100);
  return (
    <button onClick={() => onOpen && onOpen(c)} style={{
      background: "#fff", border: `1px solid ${C.line}`, borderRadius: 20, padding: 20,
      width: "100%", textAlign: "left", cursor: onOpen ? "pointer" : "default", display: "block",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 18, color: C.ink }}>{c.name}</div>
        <StatusBadge status={c.status} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, flexWrap: "wrap", color: C.muted, fontFamily: "Manrope", fontSize: 13.5 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} /> {c.time} · {c.duration}min</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={14} /> {c.location}</span>
      </div>
      {!compact && (
        <>
          <div style={{ height: 6, background: C.sageSoft, borderRadius: 999, marginTop: 16, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: C.forest, borderRadius: 999 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "Manrope", fontSize: 13, color: C.muted }}>
            <span>{c.enrolled}/{c.capacity} enrolled</span>
            <span style={{ color: C.ink, fontWeight: 800, fontSize: 15 }}>₹{c.price}</span>
          </div>
        </>
      )}
      {compact && <div style={{ textAlign: "right", marginTop: -34, fontFamily: "Manrope", fontWeight: 800, color: C.ink }}>₹{c.price}</div>}
    </button>
  );
}

function ClassesScreen({ classes, onAdd, onOpenClass }) {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = classes.filter((c) => {
    const matchesFilter = filter === "All" || c.status === filter || c.mode === filter;
    const matchesQ = c.name.toLowerCase().includes(q.toLowerCase());
    return matchesFilter && matchesQ;
  });

  return (
    <div>
      <ScreenHeader
        title="Classes"
        subtitle={`${classes.filter(c => c.status === "Upcoming").length} upcoming · ${classes.filter(c => c.status === "Completed").length} completed`}
        right={<IconBtn dark icon={<Plus size={20} color="#fff" />} onClick={() => setAddOpen(true)} />}
      />
      <SearchBar value={q} onChange={setQ} placeholder="Search classes..." />
      <FilterRow>
        {["All", "Upcoming", "Completed", "Online", "Offline"].map((f) => (
          <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>
        ))}
      </FilterRow>
      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length ? filtered.map((c) => <ClassCard key={c.id} c={c} onOpen={onOpenClass} />) : (
          <EmptyState text="No classes match. Try a different filter or search." />
        )}
      </div>

      {addOpen && (
        <ClassFormModal
          title="Add Class"
          initial={{ name: "", time: "07:00", duration: 60, location: "YOG Union Studio", mode: "Offline", price: 500, capacity: 15 }}
          onClose={() => setAddOpen(false)}
          onSubmit={(form) => { onAdd(form); setAddOpen(false); }}
        />
      )}
    </div>
  );
}

/* ---------------------------------- Students ---------------------------------- */

function StudentCard({ s, onOpen }) {
  return (
    <button onClick={() => onOpen(s.id)} style={{
      display: "flex", alignItems: "center", gap: 14, background: "#fff", border: `1px solid ${C.line}`,
      borderRadius: 20, padding: 18, width: "100%", textAlign: "left", cursor: "pointer",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 999, background: C.sageSoft, color: C.forest,
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope",
        fontWeight: 800, fontSize: 16, flexShrink: 0,
      }}>{s.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 17, color: C.ink }}>{s.name}</span>
          <StatusBadge status={s.status} />
        </div>
        <div style={{ fontFamily: "Manrope", color: C.muted, fontSize: 13.5, marginTop: 3 }}>{s.plan}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 6, fontFamily: "Manrope", fontSize: 12.5, color: C.muted, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={13} /> {s.classes} classes</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Flame size={13} color={s.streak ? C.amber : C.muted} /> {s.streak} day streak</span>
          {s.ticketsLeft !== null && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: s.ticketsLeft <= 1 ? C.red : C.muted }}>
              <Ticket size={13} /> {s.ticketsLeft} left
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={18} color={C.muted} />
    </button>
  );
}

function exportCSV(students) {
  const header = ["Name", "Email", "Status", "Plan", "Classes", "Streak", "Tickets Left"];
  const rows = students.map((s) => [s.name, s.email, s.status, s.plan, s.classes, s.streak, s.ticketsLeft ?? ""]);
  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "yog-union-students.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function StudentsScreen({ students, onOpen, onAdd }) {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const counts = {
    All: students.length,
    Active: students.filter((s) => s.status === "active").length,
    Expiring: students.filter((s) => s.status === "expiring").length,
    Inactive: students.filter((s) => s.status === "inactive").length,
  };
  const filtered = students.filter((s) => {
    const matchesFilter = filter === "All" || s.status === filter.toLowerCase();
    const matchesQ = s.name.toLowerCase().includes(q.toLowerCase());
    return matchesFilter && matchesQ;
  });

  return (
    <div>
      <ScreenHeader
        title="Students"
        subtitle={`${students.length} in your studio`}
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <IconBtn icon={<Download size={19} color={C.ink} />} onClick={() => exportCSV(students)} />
            <IconBtn dark icon={<UserPlus size={19} color="#fff" />} onClick={() => setAddOpen(true)} />
          </div>
        }
      />
      <SearchBar value={q} onChange={setQ} placeholder="Search students..." />
      <FilterRow>
        {["All", "Active", "Expiring", "Inactive"].map((f) => (
          <Pill key={f} active={filter === f} onClick={() => setFilter(f)} count={counts[f]}>{f}</Pill>
        ))}
      </FilterRow>
      <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length ? filtered.map((s) => <StudentCard key={s.id} s={s} onOpen={onOpen} />) : (
          <EmptyState text="No students match. Try a different filter or search." />
        )}
      </div>

      {addOpen && (
        <AddStudentModal
          onClose={() => setAddOpen(false)}
          onSubmit={(form) => { onAdd(form); setAddOpen(false); }}
        />
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontFamily: "Manrope", fontSize: 14.5 }}>
      {text}
    </div>
  );
}

/* ---------------------------------- Student detail ---------------------------------- */

function StudentDetail({ student, onBack, onArchive }) {
  const [tab, setTab] = useState("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ background: `linear-gradient(160deg, ${C.forest}, ${C.forestDeep})`, padding: "20px 20px 26px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer" }}><ArrowLeft size={22} color="#fff" /></button>
          <div style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 16 }}>Student Profile</div>
          <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer" }}><MoreVertical size={22} color="#fff" /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 18 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 999, background: C.sageSoft, color: C.forest,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope",
            fontWeight: 800, fontSize: 26, border: `3px solid ${C.gold}`,
          }}>{student.initials}</div>
          <div style={{ color: "#fff", fontFamily: "Fraunces", fontWeight: 700, fontSize: 24, marginTop: 14 }}>{student.name}</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Manrope", fontSize: 13.5, marginTop: 3 }}>{student.email}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <StatusBadge status={student.status} />
            {student.tags.map((t) => (
              <span key={t} style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontFamily: "Manrope", fontWeight: 700, fontSize: 12.5, padding: "4px 12px", borderRadius: 999 }}>{t}</span>
            ))}
          </div>
          {student.ticketsLeft !== null && (
            <div style={{ marginTop: 16, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px" }}>
              <span style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Ticket size={16} color={C.gold} /> {student.plan}
              </span>
              <span style={{ background: student.ticketsLeft <= 1 ? C.redBg : "rgba(255,255,255,0.15)", color: student.ticketsLeft <= 1 ? C.red : "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 13, padding: "5px 12px", borderRadius: 999 }}>
                {student.ticketsLeft} classes left
              </span>
            </div>
          )}
          {student.ticketsLeft === null && student.expiryDate && (
            <div style={{ marginTop: 16, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px" }}>
              <span style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <Ticket size={16} color={C.gold} /> {student.plan}
              </span>
              <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 13, padding: "5px 12px", borderRadius: 999 }}>
                Expires {student.expiryDate}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${C.line}`, background: "#fff" }}>
        {["Overview", "Journey", "Payments"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "16px 0", background: "none", border: "none", cursor: "pointer",
            fontFamily: "Manrope", fontWeight: 800, fontSize: 14.5, color: tab === t ? C.forest : C.muted,
            borderBottom: tab === t ? `2.5px solid ${C.forest}` : "2.5px solid transparent",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px 30px" }}>
        {tab === "Overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              <MiniStat icon={<Calendar size={18} color={C.forest} />} value={student.classes} label="Classes" />
              <MiniStat icon={<Clock size={18} color={C.forest} />} value={student.hours} label="Hours" />
              <MiniStat icon={<Flame size={18} color={C.amber} />} value={student.streak} label="Streak" />
            </div>
            <SectionCard title="Practice Goals">
              {student.goals.length ? student.goals.map((g) => (
                <div key={g} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontFamily: "Manrope", fontSize: 15, color: C.ink }}>
                  <CheckCircle2 size={19} color={C.green} /> {g}
                </div>
              )) : <div style={{ color: C.muted, fontFamily: "Manrope", fontSize: 14 }}>No goals set yet.</div>}
            </SectionCard>
            <SectionCard title="Contact">
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Manrope", fontSize: 14.5, color: C.muted }}>
                <Mail size={15} /> {student.email}
              </div>
            </SectionCard>
            {student.medicalNotes && (
              <div style={{ background: C.amberBg, border: `1px solid #EAD6A8`, borderRadius: 18, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Fraunces", fontWeight: 700, fontSize: 16, color: "#8A6A2E", marginBottom: 6 }}>
                  <Briefcase size={17} color="#B9822A" /> Medical Notes
                </div>
                <div style={{ fontFamily: "Manrope", fontSize: 14.5, color: "#8A6A2E" }}>{student.medicalNotes}</div>
              </div>
            )}
          </>
        )}

        {tab === "Journey" && (
          <>
            <div style={{ background: `linear-gradient(150deg, ${C.forest}, ${C.forestDeep})`, borderRadius: 20, padding: 22, marginBottom: 20 }}>
              <div style={{ color: "#fff", fontFamily: "Fraunces", fontWeight: 700, fontSize: 19, marginBottom: 16 }}>Practice Journey</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <JourneyStat value={student.streak} label={<>Day Streak 🔥</>} />
                <JourneyStat value={student.hours} label="Hours Practiced" />
                <JourneyStat value={student.classes} label="Classes Done" />
              </div>
            </div>
            <SectionCard title="Milestones Reached">
              {student.milestones.map((m, i) => {
                const Icon = milestoneIcons[m] || Star;
                const done = i < student.reached;
                return (
                  <div key={m} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: done ? "#F1E4C4" : "#F0EEE5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={17} color={done ? C.gold : "#C6C2B4"} />
                    </div>
                    <span style={{ flex: 1, fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: done ? C.ink : "#B7B3A5" }}>{m}</span>
                    {done && <CheckCircle2 size={19} color={C.green} />}
                  </div>
                );
              })}
            </SectionCard>
          </>
        )}

        {tab === "Payments" && (
          <SectionCard title="Payment History">
            {student.payments.length ? student.payments.map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < student.payments.length - 1 ? `1px solid ${C.line}` : "none" }}>
                <div>
                  <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 15, color: C.ink }}>{p.label}</div>
                  <div style={{ fontFamily: "Manrope", fontSize: 13, color: C.muted, marginTop: 3 }}>{p.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 18, color: C.ink }}>₹{p.amount.toLocaleString("en-IN")}</div>
                  <span style={{ background: C.greenBg, color: C.green, fontFamily: "Manrope", fontWeight: 700, fontSize: 11.5, padding: "2px 10px", borderRadius: 999 }}>Paid</span>
                </div>
              </div>
            )) : <div style={{ color: C.muted, fontFamily: "Manrope", fontSize: 14 }}>No payments recorded yet.</div>}
          </SectionCard>
        )}
      </div>

      {menuOpen && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(20,26,20,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 10 }}>
          <div style={{ background: "#2B2B2B", borderRadius: 18, width: "100%", maxWidth: 320, overflow: "hidden" }}>
            <div style={{ padding: "22px 22px 18px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ color: "#fff", fontFamily: "Manrope", fontWeight: 800, fontSize: 17 }}>Student Options</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Manrope", fontSize: 13.5, marginTop: 6 }}>Manage student profile, send message, or archive.</div>
            </div>
            <button onClick={() => { setMenuOpen(false); showToast(`Message sent to ${student.name.split(" ")[0]}`); }} style={{ width: "100%", padding: 16, background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.12)", color: "#6FA8DC", fontFamily: "Manrope", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Send Message</button>
            <button onClick={() => { setMenuOpen(false); onArchive(student.id); }} style={{ width: "100%", padding: 16, background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.12)", color: "#E07A63", fontFamily: "Manrope", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Archive Student</button>
            <button onClick={() => setMenuOpen(false)} style={{ width: "100%", padding: 16, background: "none", border: "none", color: "#6FA8DC", fontFamily: "Manrope", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, background: C.ink, color: "#fff", padding: "13px 18px", borderRadius: 14, fontFamily: "Manrope", fontWeight: 700, fontSize: 14, textAlign: "center", zIndex: 20 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

function MiniStat({ icon, value, label }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 8px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 20, color: C.ink }}>{value}</div>
      <div style={{ fontFamily: "Manrope", fontSize: 12, color: C.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function JourneyStat({ value, label }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ color: C.goldSoft, fontFamily: "Fraunces", fontWeight: 700, fontSize: 26 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontFamily: "Manrope", fontSize: 12.5, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "18px 20px", marginBottom: 16 }}>
      {title && <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 17, color: C.ink, marginBottom: 6 }}>{title}</div>}
      {children}
    </div>
  );
}

/* ---------------------------------- Profile ---------------------------------- */

function ProfileScreen({ profile, onEdit }) {
  const [tab, setTab] = useState("Overview");
  return (
    <div>
      <div style={{ background: `linear-gradient(160deg, ${C.forest}, ${C.forestDeep})`, padding: "20px 20px 26px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Manrope", fontSize: 13.5 }}>yogunion.com/neha-totla</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onEdit} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Pencil size={16} color="#fff" />
            </button>
            <button style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Share2 size={17} color="#fff" />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: 999, background: C.sageSoft, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope", fontWeight: 800, fontSize: 24, border: `3px solid ${C.gold}` }}>NT</div>
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: 999, background: C.gold, border: "3px solid " + C.forestDeep, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={14} color="#fff" />
            </div>
          </div>
          <TrustRing score={96} size={78} />
        </div>
        <div style={{ color: "#fff", fontFamily: "Fraunces", fontWeight: 700, fontSize: 26, marginTop: 16 }}>Neha Totla</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Manrope", fontSize: 14, marginTop: 4 }}>{profile.tagline}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(199,154,71,0.2)", color: C.goldSoft, fontFamily: "Manrope", fontWeight: 700, fontSize: 12.5, padding: "5px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 5 }}>
            <CheckCircle2 size={13} /> Professionally Verified
          </span>
          <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", fontFamily: "Manrope", fontWeight: 700, fontSize: 12.5, padding: "5px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 5 }}>
            <MapPin size={13} /> {profile.location}
          </span>
        </div>
        <span style={{ display: "inline-block", marginTop: 8, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontFamily: "Manrope", fontWeight: 700, fontSize: 12.5, padding: "5px 12px", borderRadius: 999 }}>
          Since 2013
        </span>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 6px" }}>
          {[["1,247", "Students"], ["512", "Classes"], ["87%", "Avg Attend."], ["11yr", "Experience"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center", flex: 1 }}>
              <div style={{ color: "#fff", fontFamily: "Fraunces", fontWeight: 700, fontSize: 19 }}>{v}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Manrope", fontSize: 11 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${C.line}`, background: "#fff" }}>
        {["Overview", "Certs", "Experience"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "16px 0", background: "none", border: "none", cursor: "pointer",
            fontFamily: "Manrope", fontWeight: 800, fontSize: 14.5, color: tab === t ? C.forest : C.muted,
            borderBottom: tab === t ? `2.5px solid ${C.forest}` : "2.5px solid transparent",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "20px 20px 30px" }}>
        {tab === "Overview" && (
          <SectionCard title="About">
            <p style={{ fontFamily: "Manrope", fontSize: 15, lineHeight: 1.7, color: C.muted, margin: 0 }}>
              {profile.about}
            </p>
          </SectionCard>
        )}

        {tab === "Certs" && certs.map((c) => (
          <SectionCard key={c.title}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F1E4C4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Award size={20} color={C.gold} />
                </div>
                <div>
                  <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 16.5, color: C.ink }}>{c.title}</div>
                  <div style={{ fontFamily: "Manrope", fontSize: 13.5, color: C.muted, marginTop: 3 }}>{c.issuer}</div>
                </div>
              </div>
              <CheckCircle2 size={20} color={C.green} style={{ flexShrink: 0 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", background: C.cream, borderRadius: 12, padding: "14px 16px", marginTop: 14 }}>
              {[["Hours", c.hours], ["Year", c.year], ["Verified", c.verified]].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Manrope", fontSize: 12, color: C.muted }}>{l}</div>
                  <div style={{ fontFamily: "Fraunces", fontWeight: 700, fontSize: 17, color: l === "Verified" ? C.green : C.ink, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}

        {tab === "Experience" && (
          <SectionCard title="Teaching Journey">
            <div style={{ marginTop: 8 }}>
              {journey.map((j, i) => {
                const Icon = j.icon;
                return (
                  <div key={j.year} style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 60, flexShrink: 0 }}>
                      <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 13, color: C.muted, marginBottom: 8 }}>{j.year}</div>
                      <div style={{ width: 34, height: 34, borderRadius: 999, background: "#F1E4C4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={16} color={C.gold} />
                      </div>
                      {i < journey.length - 1 && <div style={{ width: 2, flex: 1, background: C.line, marginTop: 4, minHeight: 30 }} />}
                    </div>
                    <div style={{ fontFamily: "Manrope", fontSize: 15, color: C.ink, paddingTop: 6, paddingBottom: 24, lineHeight: 1.5 }}>{j.text}</div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- App ---------------------------------- */

export default function App() {
  const [view, setView] = useState("dashboard");
  const [students, setStudents] = useState(seedStudents);
  const [classes, setClasses] = useState(seedClasses);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [selectedId, setSelectedId] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [classDetail, setClassDetail] = useState(null);
  const [profile, setProfile] = useState({
    tagline: "Transforming lives through mindful movement",
    location: "Mumbai, India",
    about: "With over a decade of dedicated practice and teaching, I guide students on a transformative journey through the ancient wisdom of yoga. My approach blends traditional alignment principles with a calm, modern studio practice — built for real bodies, real schedules, real life.",
  });

  const openStudent = (id) => { setSelectedId(id); setView("studentDetail"); };
  const archiveStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setView("students");
  };

  const addStudent = (form) => {
    const ticketsLeft = ticketsFromPlan(form.plan);
    const newStudent = {
      id: "s" + Date.now(),
      initials: initialsOf(form.name),
      name: form.name.trim(),
      status: "active",
      plan: form.plan,
      classes: 0,
      streak: 0,
      ticketsLeft,
      expiryDate: ticketsLeft === null ? (form.expiryDate || null) : null,
      medicalNotes: form.medicalNotes.trim(),
      email: form.email.trim() || "no-email@example.com",
      hours: 0,
      batch: form.batch,
      tags: [form.category, form.batch],
      goals: form.goals.split(",").map((g) => g.trim()).filter(Boolean),
      payments: [],
      milestones: ["1st Class", "10 Classes", "25 Classes", "100 Classes"],
      reached: 0,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const addClass = (form) => {
    const newClass = {
      id: "c" + Date.now(),
      name: form.name.trim(),
      status: "Upcoming",
      time: form.time,
      duration: Number(form.duration) || 60,
      location: form.location.trim() || (form.mode === "Online" ? "Online" : "YOG Union Studio"),
      mode: form.mode,
      price: Number(form.price) || 0,
      enrolled: 0,
      capacity: Number(form.capacity) || 10,
    };
    setClasses((prev) => [newClass, ...prev]);
  };

  const updateClass = (id, form) => {
    setClasses((prev) => prev.map((c) => c.id === id ? {
      ...c, name: form.name.trim(), time: form.time, duration: Number(form.duration),
      location: form.location, mode: form.mode, price: Number(form.price), capacity: Number(form.capacity),
    } : c));
  };
  const cancelClass = (id) => {
    setClasses((prev) => prev.map((c) => c.id === id ? { ...c, status: "Cancelled" } : c));
  };
  const deleteClass = (id) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const selectedStudent = useMemo(() => students.find((s) => s.id === selectedId), [students, selectedId]);

  return (
    <div style={{ background: "#EFE9DC", minHeight: "100vh", display: "flex", justifyContent: "center", fontFamily: "Manrope" }}>
      <style>{fonts}</style>
      <div style={{ width: "100%", maxWidth: 460, background: C.cream, minHeight: "100vh", display: "flex", flexDirection: "column", boxShadow: "0 0 60px rgba(0,0,0,0.08)", position: "relative" }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {view === "dashboard" && (
            <Dashboard
              students={students} classes={classes} setView={setView} openStudent={openStudent}
              openNotifications={() => setNotifOpen(true)} notifCount={notifications.length}
            />
          )}
          {view === "classes" && <ClassesScreen classes={classes} onAdd={addClass} onOpenClass={setClassDetail} />}
          {view === "students" && <StudentsScreen students={students} onOpen={openStudent} onAdd={addStudent} />}
          {view === "studentDetail" && selectedStudent && (
            <StudentDetail student={selectedStudent} onBack={() => setView("students")} onArchive={archiveStudent} />
          )}
          {view === "profile" && <ProfileScreen profile={profile} onEdit={() => setEditProfileOpen(true)} />}
        </div>
        <BottomNav view={view} setView={setView} />

        {notifOpen && <NotificationsModal notifications={notifications} onClose={() => setNotifOpen(false)} />}
        {editProfileOpen && (
          <EditProfileModal profile={profile} onClose={() => setEditProfileOpen(false)}
            onSave={(form) => { setProfile(form); setEditProfileOpen(false); }} />
        )}
        {classDetail && (
          <ClassFormModal
            title="Edit Class"
            initial={classDetail}
            onClose={() => setClassDetail(null)}
            onSubmit={(form) => { updateClass(classDetail.id, form); setClassDetail(null); }}
            extraActions={
              <>
                <div style={{ height: 10 }} />
                <GhostBtn onClick={() => { cancelClass(classDetail.id); setClassDetail(null); }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><XCircle size={16} /> Cancel Class</span>
                </GhostBtn>
                <div style={{ height: 10 }} />
                <PrimaryBtn danger onClick={() => { deleteClass(classDetail.id); setClassDetail(null); }}>
                  <Trash2 size={16} /> Delete Class
                </PrimaryBtn>
              </>
            }
          />
        )}
      </div>
    </div>
  );
}

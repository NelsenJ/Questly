import React, { useState, useEffect, useMemo } from "react";
import {
  Home, Repeat, CalendarCheck, Dumbbell, ListTodo, Map, TrendingUp,
  Award, Gift, User, Settings as SettingsIcon, Flame, Coins, Zap,
  Plus, Search, ChevronRight, Check, X, Star, Menu, MoreHorizontal,
  Clock, Calendar as CalendarIcon, Filter, Link2, Trash2, Pencil,
  Lock, ChevronDown, Sun, Moon, ShieldCheck, Bell, Database, Sliders
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const C = {
  bg: "#F8F7F3",
  card: "#FFFFFF",
  surface: "#F1F0EB",
  border: "#E5E3DC",
  text: "#1C2430",
  textSoft: "#6B7280",
  navy: "#26364A",
  coral: "#F26B5E",
  coralSoft: "#FCE4E1",
  sage: "#7BAE8A",
  sageSoft: "#E7F0E9",
  amber: "#E5A93D",
  amberSoft: "#FBF0DA",
  blue: "#6E9FC2",
  blueSoft: "#E7EFF5",
};

const FONT = "'Nunito Sans', -apple-system, sans-serif";

/* ============================================================
   MOCK DATA
   ============================================================ */
const NAV_MAIN = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "habits", label: "Habits", icon: Repeat },
  { id: "daily", label: "Daily", icon: CalendarCheck },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "todos", label: "To-Dos", icon: ListTodo },
];
const NAV_PROGRESSION = [
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "quests", label: "Quests", icon: Map },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "rewards", label: "Rewards", icon: Gift },
];
const NAV_BOTTOM = [
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

const initialHabits = [
  { id: "h1", name: "Drink water", desc: "8 glasses a day", positive: true, streak: 12, best: 21, xp: 10, stat: "Health", history: [1,1,1,0,1,1,1] },
  { id: "h2", name: "Read", desc: "Any book, any amount", positive: true, streak: 6, best: 14, xp: 10, stat: "Knowledge", history: [1,1,0,1,1,1,1] },
  { id: "h3", name: "Study Japanese", desc: "Vocabulary + grammar", positive: true, streak: 30, best: 30, xp: 10, stat: "Knowledge", history: [1,1,1,1,1,1,1] },
  { id: "h4", name: "Excessive social media", desc: "Keep under 30 min/day", positive: false, streak: 3, best: 9, xp: 10, stat: "Discipline", history: [1,0,1,1,1,0,1] },
];

const initialDailies = [
  { id: "d1", name: "Morning routine", desc: "Wake, stretch, hydrate", time: "7:00 AM", freq: "Every day", difficulty: "Easy", xp: 15, streak: 18, done: true, link: null },
  { id: "d2", name: "Morning Training", desc: "Linked to today's session", time: "7:30 AM", freq: "Weekdays", difficulty: "Medium", xp: 15, streak: 9, done: false, link: { type: "Training", name: "Zone 2 Run" } },
  { id: "d3", name: "Deep Work", desc: "Focused block, no distractions", time: "10:00 AM", freq: "Weekdays", difficulty: "Hard", xp: 15, streak: 9, done: false, link: null },
  { id: "d4", name: "Evening reflection", desc: "Linked to Meditation habit", time: "9:00 PM", freq: "Every day", difficulty: "Easy", xp: 15, streak: 18, done: false, link: { type: "Habit", name: "Meditation" } },
];

const initialTrainings = [
  { id: "t1", day: "Monday", name: "Push Day", type: "Strength", duration: "50 min", difficulty: "Hard", status: "done", time: "6:30 AM" },
  { id: "t2", day: "Tuesday", name: "Zone 2 Run", type: "Running", duration: "35 min", difficulty: "Medium", status: "done", time: "7:30 AM" },
  { id: "t3", day: "Wednesday", name: "Pull Day", type: "Strength", duration: "50 min", difficulty: "Hard", status: "planned", time: "6:30 AM" },
  { id: "t4", day: "Thursday", name: "Mobility", type: "Mobility", duration: "20 min", difficulty: "Easy", status: "planned", time: "7:00 AM" },
  { id: "t5", day: "Friday", name: "Leg Day", type: "Strength", duration: "55 min", difficulty: "Hard", status: "planned", time: "6:30 AM" },
  { id: "t6", day: "Saturday", name: "Long Ride", type: "Cycling", duration: "70 min", difficulty: "Medium", status: "planned", time: "9:00 AM" },
  { id: "t7", day: "Sunday", name: "Yoga", type: "Yoga", duration: "30 min", difficulty: "Easy", status: "planned", time: "8:30 AM" },
];

const initialTodos = [
  { id: "td1", title: "Learn React fundamentals", desc: "Finish the component basics module", due: "Today", priority: "High", difficulty: "Medium", xp: 25, quest: "Build My First Full-Stack App", done: false, bucket: "Today" },
  { id: "td2", title: "Book dentist appointment", desc: "", due: "Today", priority: "Low", difficulty: "Easy", xp: 10, quest: null, done: false, bucket: "Today" },
  { id: "td3", title: "Set up FastAPI project", desc: "Initialize backend structure", due: "Tomorrow", priority: "Medium", difficulty: "Medium", xp: 25, quest: "Build My First Full-Stack App", done: false, bucket: "Upcoming" },
  { id: "td4", title: "Renew gym membership", desc: "", due: "Sep 8", priority: "Medium", difficulty: "Easy", xp: 10, quest: null, done: false, bucket: "Overdue" },
  { id: "td5", title: "Plan weekly meals", desc: "", due: "Sep 9", priority: "Low", difficulty: "Easy", xp: 10, quest: null, done: true, bucket: "Completed" },
];

const initialQuests = [
  { id: "q1", title: "Build My First Full-Stack App", desc: "Build and deploy a complete application, end to end.", xp: 500, coins: 300, deadline: "Oct 30", status: "In Progress", objectives: [
    { name: "Learn React fundamentals", done: true },
    { name: "Build frontend", done: true },
    { name: "Learn FastAPI", done: false },
    { name: "Build API", done: false },
    { name: "Connect database", done: false },
    { name: "Add authentication", done: false },
    { name: "Deploy application", done: false },
  ]},
  { id: "q2", title: "Run a 10K", desc: "Build endurance from zero to a full 10K run.", xp: 350, coins: 200, deadline: "Nov 15", status: "In Progress", objectives: [
    { name: "Run 3 times a week for 2 weeks", done: true },
    { name: "Complete a 5K", done: true },
    { name: "Complete a 7K", done: false },
    { name: "Complete a 10K", done: false },
  ]},
];

const achievementsData = [
  { id: "a1", name: "First Quest", desc: "Complete your first Quest.", unlocked: false, progress: 0.28, color: C.coral },
  { id: "a2", name: "Consistent", desc: "Maintain a 7-day streak.", unlocked: true, date: "Aug 12", color: C.sage },
  { id: "a3", name: "Level Up", desc: "Reach Level 10.", unlocked: true, date: "Jul 30", color: C.amber },
  { id: "a4", name: "Centurion", desc: "Complete 100 tasks.", unlocked: false, progress: 0.61, color: C.blue },
  { id: "a5", name: "Dedicated", desc: "Complete 50 Training sessions.", unlocked: false, progress: 0.44, color: C.navy },
  { id: "a6", name: "Deep Focus", desc: "Complete 20 Deep Work sessions.", unlocked: true, date: "Sep 2", color: C.coral },
];

const rewardsData = {
  available: [
    { id: "r1", name: "1 Hour Gaming", desc: "A guilt-free hour on anything you want to play.", cost: 150 },
    { id: "r2", name: "Movie Night", desc: "Pick the film, order the snacks.", cost: 200 },
    { id: "r3", name: "Favorite Meal", desc: "Order from the place you've been craving.", cost: 250 },
  ],
  purchased: [
    { id: "r4", name: "New Book", cost: 300, date: "Sep 3" },
  ],
};

const statsData = [
  { name: "Discipline", value: 68, weekChange: 4, color: C.coral },
  { name: "Focus", value: 74, weekChange: 2, color: C.blue },
  { name: "Knowledge", value: 55, weekChange: 6, color: C.navy },
  { name: "Health", value: 61, weekChange: -1, color: C.sage },
  { name: "Consistency", value: 82, weekChange: 3, color: C.amber },
];

const weeklyCompletion = [62, 74, 58, 90, 81, 45, 70];

/* ============================================================
   PRIMITIVES
   ============================================================ */
function Card({ children, style, ...rest }) {
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 20,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, color = C.coral, track = C.surface, height = 8 }) {
  return (
    <div style={{ width: "100%", height, borderRadius: height, background: track, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: "100%",
          borderRadius: height,
          background: color,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

function Chip({ children, active, onClick, color = C.navy }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? color : C.border}`,
        background: active ? color : "transparent",
        color: active ? "#fff" : C.textSoft,
        borderRadius: 999,
        padding: "6px 14px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONT,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function Tag({ children, bg, color }) {
  return (
    <span
      style={{
        background: bg,
        color: color,
        fontSize: 12,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 8,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function difficultyTag(d) {
  const map = {
    Easy: { bg: C.sageSoft, color: "#4C7A5C" },
    Medium: { bg: C.amberSoft, color: "#8A6414" },
    Hard: { bg: C.coralSoft, color: "#B5473A" },
  };
  const m = map[d] || map.Easy;
  return <Tag bg={m.bg} color={m.color}>{d}</Tag>;
}

function Button({ children, variant = "primary", onClick, style, icon: Icon, size = "md" }) {
  const base = {
    fontFamily: FONT,
    fontWeight: 800,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: size === "sm" ? "8px 14px" : "11px 18px",
    fontSize: size === "sm" ? 13 : 14.5,
    transition: "transform 0.12s ease, opacity 0.12s ease",
  };
  const variants = {
    primary: { background: C.coral, color: "#fff" },
    secondary: { background: C.navy, color: "#fff" },
    ghost: { background: C.surface, color: C.text },
    danger: { background: C.coralSoft, color: "#B5473A" },
  };
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function CheckControl({ checked, onClick, color = C.coral }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 26,
        height: 26,
        minWidth: 26,
        borderRadius: 8,
        border: `2px solid ${checked ? color : C.border}`,
        background: checked ? color : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      aria-label="toggle complete"
    >
      {checked && <Check size={15} color="#fff" strokeWidth={3} />}
    </button>
  );
}

function EmptyState({ title, cta, onClick, icon: Icon }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "56px 20px",
        border: `1.5px dashed ${C.border}`,
        borderRadius: 16,
        background: C.surface,
      }}
    >
      <div
        style={{
          width: 52, height: 52, borderRadius: 14, background: C.card, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
        }}
      >
        <Icon size={22} color={C.coral} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>{title}</div>
      <Button onClick={onClick} icon={Plus}>{cta}</Button>
    </div>
  );
}

function SectionHeader({ title, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: 0 }}>{title}</h3>
      {action}
    </div>
  );
}

/* ============================================================
   TOAST (XP feedback)
   ============================================================ */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        background: C.navy,
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 999,
        fontWeight: 800,
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 8px 24px rgba(28,36,48,0.25)",
        zIndex: 999,
        animation: "toastIn 0.25s ease",
      }}
    >
      <Zap size={16} color={C.amber} fill={C.amber} />
      {message}
    </div>
  );
}

/* ============================================================
   TASK ROW (shared across Habits/Daily/Training/Todos summaries)
   ============================================================ */
function TaskRow({ name, meta, difficulty, xp, done, onToggle, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 14px",
        borderRadius: 12,
        background: done ? C.surface : C.card,
        border: `1px solid ${C.border}`,
      }}
    >
      <CheckControl checked={done} onClick={onToggle} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: done ? C.textSoft : C.text, textDecoration: done ? "line-through" : "none" }}>
          {name}
        </div>
        {meta && <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 2 }}>{meta}</div>}
      </div>
      {difficulty && difficultyTag(difficulty)}
      <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.amber, fontWeight: 800, fontSize: 13, minWidth: 46, justifyContent: "flex-end" }}>
        <Zap size={13} fill={C.amber} strokeWidth={0} /> {xp}
      </div>
      {right}
    </div>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "10px 14px",
        borderRadius: 12,
        border: "none",
        background: active ? C.coralSoft : "transparent",
        color: active ? C.coral : C.textSoft,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 14.5,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Icon size={18} color={active ? C.coral : C.textSoft} />
      {item.label}
    </button>
  );
}

function Sidebar({ page, setPage }) {
  return (
    <aside
      className="ql-sidebar"
      style={{
        width: 252,
        minWidth: 252,
        background: C.card,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "22px 16px",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={17} color="#fff" fill="#fff" strokeWidth={0} />
        </div>
        <span style={{ fontWeight: 900, fontSize: 19, color: C.navy }}>Questly</span>
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 800, color: C.textSoft, letterSpacing: 0.4, padding: "0 14px", marginBottom: 6 }}>Main</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 20 }}>
        {NAV_MAIN.map((item) => (
          <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
        ))}
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 800, color: C.textSoft, letterSpacing: 0.4, padding: "0 14px", marginBottom: 6 }}>Progression</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV_PROGRESSION.map((item) => (
          <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 3, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
        {NAV_BOTTOM.map((item) => (
          <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
        ))}
      </div>
    </aside>
  );
}

function MobileNav({ page, setPage, onMore }) {
  const items = [...NAV_MAIN.slice(0, 4), { id: "more", label: "More", icon: MoreHorizontal }];
  return (
    <nav
      className="ql-mobilenav"
      style={{
        display: "none",
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        padding: "8px 4px",
        justifyContent: "space-around",
        zIndex: 40,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => (item.id === "more" ? onMore() : setPage(item.id))}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", color: active ? C.coral : C.textSoft,
              fontFamily: FONT, fontSize: 10.5, fontWeight: 700, padding: "4px 8px",
            }}
          >
            <Icon size={19} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function MoreSheet({ onClose, page, setPage }) {
  const items = [...NAV_PROGRESSION, ...NAV_BOTTOM];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,36,48,0.4)", zIndex: 60, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div style={{ background: C.card, width: "100%", borderRadius: "20px 20px 0 0", padding: 20 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: C.border, borderRadius: 4, margin: "0 auto 16px" }} />
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "13px 10px",
                background: page === item.id ? C.coralSoft : "transparent", border: "none", borderRadius: 12,
                color: page === item.id ? C.coral : C.text, fontFamily: FONT, fontWeight: 700, fontSize: 15,
              }}
            >
              <Icon size={18} /> {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   OVERVIEW PAGE
   ============================================================ */
function ProgressionCard({ level, xp, xpNeeded, streak, coins }) {
  const pct = (xp / xpNeeded) * 100;
  return (
    <Card style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #30435c 100%)`, border: "none", color: "#fff", padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>CURRENT LEVEL</div>
          <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1 }}>Level {level}</div>
          <div style={{ marginTop: 14, width: 260, maxWidth: "60vw" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
              <span>{xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <ProgressBar value={pct} color={C.amber} track="rgba(255,255,255,0.18)" height={9} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.amber, fontWeight: 800, fontSize: 20 }}>
              <Flame size={19} fill={C.amber} strokeWidth={0} /> {streak}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>DAY STREAK</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#F2C572", fontWeight: 800, fontSize: 20 }}>
              <Coins size={19} /> {coins.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>COINS</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MiniBarChart({ data, color = C.coral, labels }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: "100%", height: 70, display: "flex", alignItems: "flex-end", background: C.surface, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ width: "100%", height: `${(v / max) * 100}%`, background: color, borderRadius: "4px 4px 0 0" }} />
          </div>
          {labels && <span style={{ fontSize: 10.5, color: C.textSoft, fontWeight: 700 }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

function Overview({ state, actions, showXp }) {
  const { habits, dailies, trainings, todos, quests } = state;
  const todayTraining = trainings.find((t) => t.day === "Wednesday");
  const activeQuest = quests[0];
  const questPct = Math.round((activeQuest.objectives.filter((o) => o.done).length / activeQuest.objectives.length) * 100);
  const unlockedAch = achievementsData.filter((a) => a.unlocked).slice(-2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text, margin: 0 }}>Good morning, Alex</h1>
        <div style={{ color: C.textSoft, fontWeight: 600, marginTop: 4, fontSize: 14.5 }}>
          Wednesday, September 9 &nbsp;·&nbsp; You have 6 things planned today. Focus on Deep Work first — it moves the needle most.
        </div>
      </div>

      <ProgressionCard level={12} xp={2340} xpNeeded={3000} streak={12} coins={1250} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="ql-grid-2">
        <Card>
          <SectionHeader title="Today's Daily routines" action={<Tag bg={C.blueSoft} color="#3E6E90">{dailies.filter(d=>!d.done).length} left</Tag>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {dailies.map((d) => (
              <TaskRow
                key={d.id}
                name={d.name}
                meta={d.time + (d.link ? ` · linked to ${d.link.type}: ${d.link.name}` : "")}
                difficulty={d.difficulty}
                xp={d.xp}
                done={d.done}
                onToggle={() => actions.toggleDaily(d.id)}
              />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Today's Habits" action={<Tag bg={C.sageSoft} color="#4C7A5C">{habits.length} tracked</Tag>} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {habits.slice(0, 4).map((h) => (
              <TaskRow
                key={h.id}
                name={h.name}
                meta={`${h.positive ? "Positive" : "Reduce"} · ${h.streak} day streak`}
                xp={h.xp}
                done={false}
                onToggle={() => actions.bumpHabit(h.id)}
              />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Today's Training" />
          {todayTraining ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15.5 }}>{todayTraining.name}</div>
                  <div style={{ fontSize: 12.5, color: C.textSoft }}>{todayTraining.type} · {todayTraining.duration} · {todayTraining.time}</div>
                </div>
                {difficultyTag(todayTraining.difficulty)}
              </div>
              <Button size="sm" variant={todayTraining.status === "done" ? "ghost" : "primary"} icon={Check} onClick={() => actions.toggleTraining(todayTraining.id)}>
                {todayTraining.status === "done" ? "Completed" : "Mark complete"}
              </Button>
            </div>
          ) : <EmptyState title="Plan your next session." cta="Add Training" icon={Dumbbell} />}
        </Card>

        <Card>
          <SectionHeader title="Today's To-Dos" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todos.filter((t) => t.bucket === "Today").map((t) => (
              <TaskRow key={t.id} name={t.title} meta={t.priority + " priority"} difficulty={t.difficulty} xp={t.xp} done={t.done} onToggle={() => actions.toggleTodo(t.id)} />
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18 }} className="ql-grid-2">
        <Card>
          <SectionHeader title="Weekly completion" />
          <MiniBarChart data={weeklyCompletion} color={C.coral} labels={["M","T","W","T","F","S","S"]} />
        </Card>
        <Card>
          <SectionHeader title="Active Quest" />
          <div style={{ fontWeight: 800, fontSize: 15 }}>{activeQuest.title}</div>
          <div style={{ fontSize: 12.5, color: C.textSoft, margin: "4px 0 10px" }}>
            {activeQuest.objectives.filter((o) => o.done).length} of {activeQuest.objectives.length} objectives complete
          </div>
          <ProgressBar value={questPct} color={C.coral} />
          <div style={{ marginTop: 10, display: "flex", gap: 12, fontSize: 12.5, color: C.textSoft, fontWeight: 700 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Zap size={13} color={C.amber} fill={C.amber} strokeWidth={0} />{activeQuest.xp} XP</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Coins size={13} color={C.amber} />{activeQuest.coins}</span>
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Recent achievements" />
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {unlockedAch.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Award size={17} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 13.5 }}>{a.name}</div>
                <div style={{ fontSize: 11.5, color: C.textSoft }}>Unlocked {a.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   HABITS PAGE
   ============================================================ */
function HistoryDots({ history }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {history.map((v, i) => (
        <div key={i} style={{ width: 9, height: 9, borderRadius: 3, background: v ? C.sage : C.surface, border: v ? "none" : `1px solid ${C.border}` }} />
      ))}
    </div>
  );
}

function HabitCard({ habit, onBump }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontWeight: 800, fontSize: 15.5 }}>{habit.name}</span>
            <Tag bg={habit.positive ? C.sageSoft : C.coralSoft} color={habit.positive ? "#4C7A5C" : "#B5473A"}>
              {habit.positive ? "Positive" : "Reduce"}
            </Tag>
          </div>
          <div style={{ fontSize: 13, color: C.textSoft }}>{habit.desc}</div>
        </div>
        <button onClick={() => onBump(habit.id)} style={{ background: C.coral, border: "none", width: 34, height: 34, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={17} color="#fff" strokeWidth={3} />
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <div style={{ display: "flex", gap: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 800, color: C.coral, fontSize: 15 }}><Flame size={14} fill={C.coral} strokeWidth={0}/>{habit.streak}</div>
            <div style={{ fontSize: 11, color: C.textSoft, fontWeight: 700 }}>CURRENT</div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{habit.best}</div>
            <div style={{ fontSize: 11, color: C.textSoft, fontWeight: 700 }}>BEST</div>
          </div>
        </div>
        <HistoryDots history={habit.history} />
      </div>
    </Card>
  );
}

function HabitsPage({ habits, onBump }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const filtered = habits.filter((h) => {
    if (filter === "positive" && !h.positive) return false;
    if (filter === "negative" && h.positive) return false;
    return h.name.toLowerCase().includes(q.toLowerCase());
  });
  return (
    <div>
      <PageHeader title="Habits" subtitle="What behaviors are you reinforcing?" cta="New Habit" />
      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
        <Chip active={filter === "positive"} onClick={() => setFilter("positive")} color={C.sage}>Positive</Chip>
        <Chip active={filter === "negative"} onClick={() => setFilter("negative")} color={C.coral}>Negative</Chip>
        <div style={{ flex: 1, minWidth: 160, display: "flex", alignItems: "center", gap: 8, background: C.surface, borderRadius: 10, padding: "7px 12px" }}>
          <Search size={15} color={C.textSoft} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search habits" style={{ border: "none", background: "transparent", outline: "none", fontFamily: FONT, fontSize: 13.5, width: "100%" }} />
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="Build a habit worth keeping." cta="Create Habit" icon={Repeat} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="ql-grid-2">
          {filtered.map((h) => <HabitCard key={h.id} habit={h} onBump={onBump} />)}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   DAILY PAGE
   ============================================================ */
function DailyPage({ dailies, onToggle }) {
  return (
    <div>
      <PageHeader title="Daily" subtitle="What routines should you complete?" cta="New Daily" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dailies.map((d) => (
          <Card key={d.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CheckControl checked={d.done} onClick={() => onToggle(d.id)} />
              <div style={{ width: 64, textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: C.blue }}>{d.time}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, textDecoration: d.done ? "line-through" : "none", color: d.done ? C.textSoft : C.text }}>{d.name}</div>
                <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 2 }}>{d.desc} · {d.freq}</div>
                {d.link && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, background: C.blueSoft, color: "#3E6E90", fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 8 }}>
                    <Link2 size={12} /> {d.link.type}: {d.link.name}
                  </div>
                )}
              </div>
              {difficultyTag(d.difficulty)}
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.coral, fontWeight: 800, fontSize: 14 }}>
                <Flame size={14} fill={C.coral} strokeWidth={0} />{d.streak}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.amber, fontWeight: 800, fontSize: 13, width: 44, justifyContent: "flex-end" }}>
                <Zap size={13} fill={C.amber} strokeWidth={0} />{d.xp}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TRAINING PAGE
   ============================================================ */
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function TrainingPage({ trainings, onToggle }) {
  const templates = ["Monday Push", "Tuesday Pull", "Sunday Yoga"];
  return (
    <div>
      <PageHeader title="Training" subtitle="How are you training?" cta="New Session" />
      <Card style={{ marginBottom: 20 }}>
        <SectionHeader title="This week" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }} className="ql-week-grid">
          {DAYS.map((day) => {
            const session = trainings.find((t) => t.day === day);
            return (
              <div key={day} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 10, minHeight: 130, display: "flex", flexDirection: "column", background: session?.status === "done" ? C.sageSoft : C.surface }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.textSoft, marginBottom: 8 }}>{day.slice(0,3).toUpperCase()}</div>
                {session ? (
                  <>
                    <div style={{ fontWeight: 800, fontSize: 12.5, marginBottom: 4 }}>{session.name}</div>
                    <div style={{ fontSize: 11, color: C.textSoft, marginBottom: 6 }}>{session.type}</div>
                    <div style={{ fontSize: 11, color: C.textSoft, marginBottom: 8 }}>{session.duration} · {session.time}</div>
                    <div style={{ marginTop: "auto" }}>{difficultyTag(session.difficulty)}</div>
                    <button
                      onClick={() => onToggle(session.id)}
                      style={{
                        marginTop: 8, border: "none", borderRadius: 8, padding: "5px 0", fontSize: 11, fontWeight: 800, cursor: "pointer",
                        background: session.status === "done" ? C.sage : C.coral, color: "#fff",
                      }}
                    >
                      {session.status === "done" ? "Done" : "Complete"}
                    </button>
                  </>
                ) : <div style={{ fontSize: 11, color: C.textSoft, marginTop: "auto" }}>Rest day</div>}
              </div>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="ql-grid-2">
        <Card>
          <SectionHeader title="Templates" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {templates.map((t) => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: C.surface, borderRadius: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{t}</span>
                <ChevronRight size={16} color={C.textSoft} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Consistency" />
          <MiniBarChart data={[3,4,2,5,4,3,4]} color={C.blue} labels={["W1","W2","W3","W4","W5","W6","W7"]} />
          <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 10 }}>Sessions completed per week, last 7 weeks</div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   TO-DOS PAGE
   ============================================================ */
function TodosPage({ todos, onToggle }) {
  const [tab, setTab] = useState("Today");
  const buckets = ["Today","Upcoming","Overdue","Completed"];
  const filtered = todos.filter((t) => t.bucket === tab);
  const priorityColor = { High: { bg: C.coralSoft, c: "#B5473A" }, Medium: { bg: C.amberSoft, c: "#8A6414" }, Low: { bg: C.blueSoft, c: "#3E6E90" } };
  return (
    <div>
      <PageHeader title="To-Dos" subtitle="What needs to get done?" cta="New To-Do" />
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {buckets.map((b) => <Chip key={b} active={tab === b} onClick={() => setTab(b)}>{b}</Chip>)}
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="Your path is clear." cta="Add To-Do" icon={ListTodo} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((t) => {
            const p = priorityColor[t.priority];
            return (
              <Card key={t.id} style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <CheckControl checked={t.done} onClick={() => onToggle(t.id)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, textDecoration: t.done ? "line-through" : "none", color: t.done ? C.textSoft : C.text }}>{t.title}</div>
                    {t.desc && <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 2 }}>{t.desc}</div>}
                    {t.quest && (
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, background: C.coralSoft, color: "#B5473A", fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 8 }}>
                        <Map size={12} /> {t.quest}
                      </div>
                    )}
                  </div>
                  <Tag bg={p.bg} color={p.c}>{t.priority}</Tag>
                  {difficultyTag(t.difficulty)}
                  <div style={{ fontSize: 12.5, color: C.textSoft, fontWeight: 700, width: 60, textAlign: "right" }}>{t.due}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.amber, fontWeight: 800, fontSize: 13, width: 44, justifyContent: "flex-end" }}>
                    <Zap size={13} fill={C.amber} strokeWidth={0} />{t.xp}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   QUESTS PAGE
   ============================================================ */
function QuestCard({ quest }) {
  const done = quest.objectives.filter((o) => o.done).length;
  const pct = Math.round((done / quest.objectives.length) * 100);
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17 }}>{quest.title}</div>
          <div style={{ fontSize: 13, color: C.textSoft, marginTop: 3, maxWidth: 460 }}>{quest.desc}</div>
        </div>
        <Tag bg={C.blueSoft} color="#3E6E90">{quest.status}</Tag>
      </div>
      <div style={{ margin: "14px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.textSoft, fontWeight: 700, marginBottom: 6 }}>
          <span>{done} of {quest.objectives.length} objectives</span>
          <span>{pct}%</span>
        </div>
        <ProgressBar value={pct} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {quest.objectives.map((o, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5 }}>
            <div style={{ width: 18, height: 18, borderRadius: 6, background: o.done ? C.sage : C.surface, border: o.done ? "none" : `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {o.done && <Check size={12} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ color: o.done ? C.textSoft : C.text, textDecoration: o.done ? "line-through" : "none" }}>{o.name}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 13, fontWeight: 700, color: C.textSoft }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Zap size={14} color={C.amber} fill={C.amber} strokeWidth={0} />{quest.xp} XP</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Coins size={14} color={C.amber} />{quest.coins} coins</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><CalendarIcon size={14} />Due {quest.deadline}</span>
      </div>
    </Card>
  );
}

function QuestsPage({ quests }) {
  return (
    <div>
      <PageHeader title="Quests" subtitle="What larger goals are you pursuing?" cta="New Quest" />
      {quests.length === 0 ? (
        <EmptyState title="Every big goal starts with a quest." cta="Create Quest" icon={Map} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {quests.map((q) => <QuestCard key={q.id} quest={q} />)}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PROGRESS PAGE
   ============================================================ */
function StatBar({ stat }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{stat.name}</span>
        <span style={{ fontSize: 12.5, color: stat.weekChange >= 0 ? "#4C7A5C" : "#B5473A", fontWeight: 700 }}>
          {stat.weekChange >= 0 ? "+" : ""}{stat.weekChange}% this week
        </span>
      </div>
      <ProgressBar value={stat.value} color={stat.color} />
    </div>
  );
}

function ProgressPage() {
  const [range, setRange] = useState("30d");
  return (
    <div>
      <PageHeader title="Progress" subtitle="How are you improving?" />
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[["7d","7 days"],["30d","30 days"],["3m","3 months"],["all","All time"]].map(([k,l]) => (
          <Chip key={k} active={range === k} onClick={() => setRange(k)}>{l}</Chip>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }} className="ql-grid-4">
        {[
          { label: "Level", value: "12" },
          { label: "Total XP", value: "28,340" },
          { label: "Current Streak", value: "12 days" },
          { label: "Best Streak", value: "30 days" },
        ].map((s) => (
          <Card key={s.label} style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: C.textSoft, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="ql-grid-2">
        <Card>
          <SectionHeader title="Stats" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {statsData.map((s) => <StatBar key={s.name} stat={s} />)}
          </div>
        </Card>
        <Card>
          <SectionHeader title="Weekly completion" />
          <MiniBarChart data={weeklyCompletion} labels={["M","T","W","T","F","S","S"]} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Training frequency</span>
          </div>
          <MiniBarChart data={[3,4,2,5,4,3,4]} color={C.blue} labels={["W1","W2","W3","W4","W5","W6","W7"]} />
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   ACHIEVEMENTS PAGE
   ============================================================ */
function AchievementCard({ a }) {
  return (
    <Card style={{ opacity: a.unlocked ? 1 : 0.6, textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: a.unlocked ? a.color : C.surface, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        {a.unlocked ? <Award size={24} color="#fff" /> : <Lock size={20} color={C.textSoft} />}
      </div>
      <div style={{ fontWeight: 800, fontSize: 15 }}>{a.name}</div>
      <div style={{ fontSize: 12.5, color: C.textSoft, margin: "4px 0 10px" }}>{a.desc}</div>
      {a.unlocked ? (
        <Tag bg={C.sageSoft} color="#4C7A5C">Unlocked {a.date}</Tag>
      ) : (
        <div>
          <ProgressBar value={a.progress * 100} color={C.textSoft} />
          <div style={{ fontSize: 11.5, color: C.textSoft, marginTop: 6, fontWeight: 700 }}>{Math.round(a.progress * 100)}% complete</div>
        </div>
      )}
    </Card>
  );
}

function AchievementsPage() {
  return (
    <div>
      <PageHeader title="Achievements" subtitle="What milestones have you reached?" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="ql-grid-3">
        {achievementsData.map((a) => <AchievementCard key={a.id} a={a} />)}
      </div>
    </div>
  );
}

/* ============================================================
   REWARDS PAGE
   ============================================================ */
function RewardsPage({ coins, onPurchase }) {
  return (
    <div>
      <PageHeader title="Rewards" subtitle="What have you earned?" cta="New Reward" />
      <Card style={{ background: C.amberSoft, border: "none", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#8A6414" }}>YOUR BALANCE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 26, fontWeight: 900, color: "#8A6414" }}>
            <Coins size={22} /> {coins.toLocaleString()}
          </div>
        </div>
      </Card>

      <SectionHeader title="Available Rewards" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }} className="ql-grid-3">
        {rewardsData.available.map((r) => (
          <Card key={r.id}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{r.name}</div>
            <div style={{ fontSize: 12.5, color: C.textSoft, margin: "6px 0 14px" }}>{r.desc}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 800, color: C.amber === "#E5A93D" ? "#8A6414" : C.amber }}>
                <Coins size={15} /> {r.cost}
              </span>
              <Button size="sm" disabled={coins < r.cost} onClick={() => onPurchase(r)}>Redeem</Button>
            </div>
          </Card>
        ))}
      </div>

      <SectionHeader title="Purchased Rewards" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rewardsData.purchased.map((r) => (
          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: C.surface, borderRadius: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
            <span style={{ fontSize: 12.5, color: C.textSoft }}>Redeemed {r.date} · {r.cost} coins</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE PAGE
   ============================================================ */
function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile" subtitle="Your progression identity" />
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }} className="ql-grid-profile">
        <Card style={{ textAlign: "center" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: C.coral, color: "#fff", fontSize: 30, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            AR
          </div>
          <div style={{ fontWeight: 900, fontSize: 19 }}>Alex Rivera</div>
          <div style={{ fontSize: 13, color: C.textSoft, marginBottom: 16 }}>Level 12 · Questly Member since Mar 2026</div>
          <div style={{ display: "flex", justifyContent: "space-around", borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>28,340</div>
              <div style={{ fontSize: 11, color: C.textSoft, fontWeight: 700 }}>TOTAL XP</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>1,250</div>
              <div style={{ fontSize: 11, color: C.textSoft, fontWeight: 700 }}>COINS</div>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>12</div>
              <div style={{ fontSize: 11, color: C.textSoft, fontWeight: 700 }}>STREAK</div>
            </div>
          </div>
        </Card>
        <Card>
          <SectionHeader title="Stats overview" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {statsData.map((s) => <StatBar key={s.name} stat={s} />)}
          </div>
          <div style={{ marginTop: 22 }}>
            <SectionHeader title="Achievements" />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {achievementsData.filter((a) => a.unlocked).map((a) => (
                <div key={a.id} style={{ width: 44, height: 44, borderRadius: 12, background: a.color, display: "flex", alignItems: "center", justifyContent: "center" }} title={a.name}>
                  <Award size={20} color="#fff" />
                </div>
              ))}
              {achievementsData.filter((a) => !a.unlocked).map((a) => (
                <div key={a.id} style={{ width: 44, height: 44, borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }} title={a.name}>
                  <Lock size={16} color={C.textSoft} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS PAGE
   ============================================================ */
function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 999, border: "none", cursor: "pointer", background: on ? C.coral : C.border, position: "relative" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 21 : 3, transition: "left 0.15s ease" }} />
    </button>
  );
}

function SettingsRow({ label, desc, control }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{label}</div>
        {desc && <div style={{ fontSize: 12.5, color: C.textSoft, marginTop: 2 }}>{desc}</div>}
      </div>
      {control}
    </div>
  );
}

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [notif, setNotif] = useState(true);
  const [celebration, setCelebration] = useState(true);
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 720 }}>
        <Card>
          <SectionHeader title="Appearance" action={<Sliders size={16} color={C.textSoft} />} />
          <SettingsRow label="Theme" desc="Light or dark interface" control={
            <div style={{ display: "flex", gap: 6 }}>
              <Button size="sm" variant={!dark ? "primary" : "ghost"} icon={Sun} onClick={() => setDark(false)}>Light</Button>
              <Button size="sm" variant={dark ? "primary" : "ghost"} icon={Moon} onClick={() => setDark(true)}>Dark</Button>
            </div>
          } />
        </Card>
        <Card>
          <SectionHeader title="Notifications" action={<Bell size={16} color={C.textSoft} />} />
          <SettingsRow label="Task reminders" desc="Get notified before scheduled items" control={<Toggle on={notif} onClick={() => setNotif(!notif)} />} />
        </Card>
        <Card>
          <SectionHeader title="Gamification" action={<Zap size={16} color={C.textSoft} />} />
          <SettingsRow label="Celebration intensity" desc="Level-up and quest completion animations" control={<Toggle on={celebration} onClick={() => setCelebration(!celebration)} />} />
        </Card>
        <Card>
          <SectionHeader title="Data & Privacy" action={<Database size={16} color={C.textSoft} />} />
          <SettingsRow label="Export data" desc="Download all your Questly data" control={<Button size="sm" variant="ghost">Export</Button>} />
          <SettingsRow label="Privacy" desc="Manage what's shared and stored" control={<ShieldCheck size={16} color={C.textSoft} />} />
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE HEADER
   ============================================================ */
function PageHeader({ title, subtitle, cta }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: C.text, margin: 0 }}>{title}</h1>
        <div style={{ color: C.textSoft, fontWeight: 600, fontSize: 14, marginTop: 3 }}>{subtitle}</div>
      </div>
      {cta && <Button icon={Plus}>{cta}</Button>}
    </div>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
export default function Questly() {
  const [page, setPage] = useState("overview");
  const [moreOpen, setMoreOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [coins, setCoins] = useState(1250);

  const [habits, setHabits] = useState(initialHabits);
  const [dailies, setDailies] = useState(initialDailies);
  const [trainings, setTrainings] = useState(initialTrainings);
  const [todos, setTodos] = useState(initialTodos);
  const [quests] = useState(initialQuests);

  function fireToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  const actions = {
    toggleDaily: (id) => {
      setDailies((prev) => prev.map((d) => {
        if (d.id !== id) return d;
        if (!d.done) { fireToast(`+${d.xp} XP · Streak continued`); setCoins((c) => c + 5); }
        return { ...d, done: !d.done };
      }));
    },
    bumpHabit: (id) => {
      const h = habits.find((x) => x.id === id);
      if (h) { fireToast(`+${h.xp} XP · ${h.stat} improved`); setCoins((c) => c + 5); }
    },
    toggleTraining: (id) => {
      setTrainings((prev) => prev.map((t) => {
        if (t.id !== id) return t;
        const nowDone = t.status !== "done";
        if (nowDone) fireToast("+35 XP · Training logged");
        return { ...t, status: nowDone ? "done" : "planned" };
      }));
    },
    toggleTodo: (id) => {
      setTodos((prev) => prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.done) fireToast(`+${t.xp} XP · Task complete`);
        return { ...t, done: !t.done };
      }));
    },
    purchaseReward: (r) => {
      if (coins < r.cost) return;
      setCoins((c) => c - r.cost);
      fireToast(`Redeemed: ${r.name}`);
    },
  };

  const pages = {
    overview: <Overview state={{ habits, dailies, trainings, todos, quests }} actions={actions} />,
    habits: <HabitsPage habits={habits} onBump={actions.bumpHabit} />,
    daily: <DailyPage dailies={dailies} onToggle={actions.toggleDaily} />,
    training: <TrainingPage trainings={trainings} onToggle={actions.toggleTraining} />,
    todos: <TodosPage todos={todos} onToggle={actions.toggleTodo} />,
    quests: <QuestsPage quests={quests} />,
    progress: <ProgressPage />,
    achievements: <AchievementsPage />,
    rewards: <RewardsPage coins={coins} onPurchase={actions.purchaseReward} />,
    profile: <ProfilePage />,
    settings: <SettingsPage />,
  };

  return (
    <div style={{ fontFamily: FONT, background: C.bg, color: C.text, height: "100vh", display: "flex", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }
        button { transition: opacity 0.15s ease; }
        button:hover { opacity: 0.9; }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }

        @media (max-width: 860px) {
          .ql-sidebar { display: none !important; }
          .ql-mobilenav { display: flex !important; }
          .ql-main { padding: 16px !important; padding-bottom: 90px !important; }
          .ql-grid-2, .ql-grid-3, .ql-grid-4, .ql-grid-profile { grid-template-columns: 1fr !important; }
          .ql-week-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <Sidebar page={page} setPage={setPage} />

      <main className="ql-main" style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {pages[page]}
        </div>
      </main>

      <MobileNav page={page} setPage={setPage} onMore={() => setMoreOpen(true)} />
      {moreOpen && <MoreSheet onClose={() => setMoreOpen(false)} page={page} setPage={setPage} />}
      <Toast message={toast} />
    </div>
  );
}

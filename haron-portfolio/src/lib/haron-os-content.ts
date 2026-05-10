import {
  Activity,
  BadgeCheck,
  BookOpenText,
  Bot,
  BrainCircuit,
  Braces,
  Code2,
  Cpu,
  DatabaseZap,
  FileCode2,
  FileSearch,
  FileText,
  FlaskConical,
  Gauge,
  Home,
  Globe2,
  GraduationCap,
  ImageUp,
  Layers3,
  LayoutDashboard,
  Mail,
  MessageSquareCode,
  PenLine,
  Presentation,
  Regex,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Settings,
  UserRound,
  WandSparkles,
  Zap,
} from "lucide-react";

export const rotatingCommands = [
  "Summarize PDF",
  "Fix Flutter Error",
  "Generate Portfolio",
  "Analyze Screenshot",
  "Create Presentation",
];

export const osMetrics = [
  { label: "AI modules", value: "18", detail: "workspace actions" },
  { label: "Response mode", value: "Live", detail: "streaming ready" },
  { label: "Tools online", value: "24/7", detail: "developer + student" },
  { label: "System feel", value: "Elite", detail: "cinematic UI" },
];

export const workspaceModules = [
  {
    title: "AI Workspace",
    text: "Command, write, analyze, generate, and reason through one immersive control surface.",
    icon: LayoutDashboard,
    status: "Core OS",
  },
  {
    title: "Smart Utilities",
    text: "Writing, resume, PDF, screenshot, and presentation helpers with AI-optimized prompts.",
    icon: WandSparkles,
    status: "Creative AI",
  },
  {
    title: "Developer Tools",
    text: "JSON, regex, SQL, API testing, code explanation, and debugging workflows.",
    icon: MessageSquareCode,
    status: "Engineering",
  },
  {
    title: "Student Hub",
    text: "Study notes, quizzes, flashcards, simplified explanations, and learning plans.",
    icon: GraduationCap,
    status: "Learning",
  },
];

export const aiTools = [
  {
    id: "chat",
    title: "AI Chat Assistant",
    text: "Streaming conversations, markdown, code blocks, copy-ready answers, and local history.",
    icon: Bot,
    accent: "#22d3ee",
  },
  {
    id: "pdf",
    title: "PDF AI Summarizer",
    text: "Upload a PDF and generate summaries, key points, simple explanations, and quizzes.",
    icon: FileSearch,
    accent: "#8b5cf6",
  },
  {
    id: "screenshot",
    title: "Screenshot Analyzer",
    text: "Analyze UI, errors, layout issues, debugging clues, and improvement opportunities.",
    icon: ImageUp,
    accent: "#06b6d4",
  },
  {
    id: "resume",
    title: "Resume Builder",
    text: "Generate a polished CV draft with premium sections and role-focused language.",
    icon: FileText,
    accent: "#f59e0b",
  },
  {
    id: "writing",
    title: "Smart Writing Assistant",
    text: "Rewrite emails, captions, professional text, translations, and polished messages.",
    icon: PenLine,
    accent: "#ec4899",
  },
];

export const developerTools = [
  { id: "json", title: "JSON Formatter", icon: Braces, action: "Format, minify, validate" },
  { id: "regex", title: "Regex Tester", icon: Regex, action: "Match text instantly" },
  { id: "sql", title: "SQL Generator", icon: DatabaseZap, action: "Generate query logic" },
  { id: "api", title: "API Tester", icon: Globe2, action: "Inspect endpoint responses" },
  { id: "code", title: "Code Explainer", icon: FileCode2, action: "Explain complex snippets" },
  { id: "debug", title: "Error Debugger", icon: TerminalSquare, action: "Diagnose stack traces" },
];

export const studentTools = [
  { title: "PDF Notes", text: "Convert dense material into structured study notes.", icon: BookOpenText },
  { title: "Quiz Generator", text: "Turn any topic into practice questions with answers.", icon: FlaskConical },
  { title: "Study Assistant", text: "Create learning plans and simplified explanations.", icon: BrainCircuit },
  { title: "Presentation Generator", text: "Draft slide outlines, speaker notes, and flow.", icon: Presentation },
  { title: "Smart Flashcards", text: "Build active-recall cards from notes or topics.", icon: Layers3 },
];

export const terminalCommands = [
  {
    command: "summarize pdf --mode=exam-ready",
    output: "Generated executive summary, 9 key points, 6 quiz questions, and a simplified explanation.",
  },
  {
    command: "fix firebase auth error --stack=flutter",
    output: "Detected auth state timing issue. Suggested listener guard, emulator check, and token refresh path.",
  },
  {
    command: "generate portfolio --style=ai-startup",
    output: "Composed hero, dashboard modules, project cards, analytics layer, and contact signal system.",
  },
  {
    command: "explain sql join --level=student",
    output: "Explained INNER, LEFT, RIGHT, and FULL joins with simple tables and practical examples.",
  },
];

export const commandPaletteItems = [
  { label: "Home", target: "/", icon: Home },
  { label: "AI Assistant", target: "/ai", icon: Bot },
  { label: "AI Tools", target: "/tools", icon: WandSparkles },
  { label: "Workspace", target: "/workspace", icon: LayoutDashboard },
  { label: "Student Hub", target: "/student", icon: GraduationCap },
  { label: "Developer Mode", target: "/developer", icon: Code2 },
  { label: "Dashboard", target: "/dashboard", icon: Gauge },
  { label: "Terminal", target: "/terminal", icon: TerminalSquare },
  { label: "Settings", target: "/settings", icon: Settings },
  { label: "About Haron", target: "/about", icon: UserRound },
  { label: "Projects", target: "/projects", icon: Rocket },
  { label: "Contact", target: "/contact", icon: Mail },
  { label: "Summarize PDF Action", target: "/tools#pdf", icon: FileSearch },
  { label: "Analyze Screenshot Action", target: "/tools#screenshot", icon: ImageUp },
];

export const systemSignals = [
  { label: "Secure API routes", icon: ShieldCheck },
  { label: "Gemini streaming", icon: Zap },
  { label: "Supabase-ready", icon: DatabaseZap },
  { label: "Vercel deployable", icon: Rocket },
  { label: "Usage limits", icon: Gauge },
  { label: "AI memory hooks", icon: Cpu },
  { label: "Live dashboards", icon: Activity },
  { label: "Production architecture", icon: BadgeCheck },
];

export const platformPages = [
  { title: "AI", href: "/ai", icon: Bot, text: "Chat, PDF intelligence, screenshot analysis, writing, and resume generation." },
  { title: "Tools", href: "/tools", icon: WandSparkles, text: "Unified smart utilities for documents, screenshots, writing, and generation." },
  { title: "Workspace", href: "/workspace", icon: LayoutDashboard, text: "The central operating surface for HARON OS modules and live systems." },
  { title: "Student", href: "/student", icon: GraduationCap, text: "Study plans, flashcards, notes, quiz flows, and presentation support." },
  { title: "Developer", href: "/developer", icon: Code2, text: "JSON, SQL, regex, APIs, code explanation, and debugging." },
  { title: "Dashboard", href: "/dashboard", icon: Gauge, text: "AI statistics, activity, usage signals, and system monitoring widgets." },
  { title: "Terminal", href: "/terminal", icon: TerminalSquare, text: "Command-first AI mode for fast futuristic workflows." },
  { title: "Settings", href: "/settings", icon: Settings, text: "Environment, Supabase, Gemini, storage, and deployment readiness." },
  { title: "About", href: "/about", icon: UserRound, text: "Haron Mohammed, software engineering, analytics, and platform vision." },
  { title: "Projects", href: "/projects", icon: Rocket, text: "AI platform, analytics, healthcare, e-commerce, and visual systems." },
  { title: "Contact", href: "/contact", icon: Mail, text: "Professional contact signal and social links." },
];

export const dashboardSeries = [
  { name: "Mon", ai: 42, tools: 28, study: 18 },
  { name: "Tue", ai: 58, tools: 36, study: 24 },
  { name: "Wed", ai: 71, tools: 45, study: 39 },
  { name: "Thu", ai: 66, tools: 52, study: 44 },
  { name: "Fri", ai: 84, tools: 64, study: 57 },
  { name: "Sat", ai: 96, tools: 72, study: 63 },
];

export const projectSystems = [
  {
    title: "HARON OS AI Platform",
    text: "A cinematic digital operating system with AI tools, dashboard, terminal, and command palette.",
    stack: ["Next.js", "Gemini", "Supabase", "Framer Motion"],
  },
  {
    title: "Healthcare Intelligence System",
    text: "Real-time care workflows, patient signals, operational views, and secure dashboards.",
    stack: ["Flutter", "Firebase", "Python", "Analytics"],
  },
  {
    title: "Power BI Analytics Command Center",
    text: "Business intelligence interface for raw data, KPIs, charts, and executive summaries.",
    stack: ["Power BI", "SQL", "Python", "DAX"],
  },
  {
    title: "Forex Data Experience",
    text: "Trading companion with market signals, risk panels, and financial visualizations.",
    stack: ["Flutter", "REST APIs", "Charts", "Firebase"],
  },
  {
    title: "E-Commerce Operations Platform",
    text: "Premium storefront, admin workflows, product flows, and conversion-focused interface.",
    stack: ["Next.js", "APIs", "UI/UX", "SQL"],
  },
  {
    title: "AI Visualization Lab",
    text: "Interactive visual systems for predictive analytics, AI explainability, and data stories.",
    stack: ["Three.js", "ML", "Data Viz", "TypeScript"],
  },
];

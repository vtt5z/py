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
  { label: "Launch AI Chat", target: "#ai-assistant", icon: Bot },
  { label: "Summarize PDF", target: "#ai-tools", icon: FileSearch },
  { label: "Analyze Screenshot", target: "#ai-tools", icon: ImageUp },
  { label: "Open Developer Tools", target: "#developer-tools", icon: Code2 },
  { label: "Open Student Hub", target: "#student-hub", icon: GraduationCap },
  { label: "Enter Terminal Mode", target: "#terminal", icon: TerminalSquare },
  { label: "Contact Haron", target: "#contact", icon: Mail },
];

export const systemSignals = [
  { label: "Secure API routes", icon: ShieldCheck },
  { label: "OpenAI streaming", icon: Zap },
  { label: "Supabase-ready", icon: DatabaseZap },
  { label: "Vercel deployable", icon: Rocket },
  { label: "Usage limits", icon: Gauge },
  { label: "AI memory hooks", icon: Cpu },
  { label: "Live dashboards", icon: Activity },
  { label: "Production architecture", icon: BadgeCheck },
];

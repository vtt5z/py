import {
  Activity,
  BarChart3,
  BrainCircuit,
  Code2,
  Database,
  Flame,
  GitBranch,
  Globe2,
  HeartPulse,
  Layers3,
  LineChart,
  Mail,
  MapPin,
  Phone,
  PenTool,
  PieChart,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Workflow,
} from "lucide-react";

export type Language = "en" | "ar";

export const personal = {
  phone: "+91 8699164650",
  email: "mhamad2129@gmail.com",
  instagram: "https://www.instagram.com/vtt5z",
  linkedin: "https://www.linkedin.com/in/haron-mohammad-39006021a",
  github: "https://github.com/",
};

export const copy = {
  en: {
    nav: ["Home", "About", "Skills", "Experience", "Projects", "Analytics", "Contact"],
    hero: {
      name: "HARON MOHAMMED",
      arabicName: "هارون محمد",
      title: "Software Engineer • Data Analyst • Full Stack Developer",
      subtitle:
        "Building intelligent digital experiences through engineering, analytics, and human-centered design.",
      primary: "Enter Portfolio",
      secondary: "View Projects",
      status: "Software Engineer • Data Analyst • Full Stack Developer",
    },
    about: {
      eyebrow: "System Profile",
      title: "Engineering intelligence into elegant digital systems.",
      paragraphs: [
        "I'm a Software Engineer and Full Stack Developer focused on building intelligent digital systems that combine engineering precision, modern UI design, and real-world impact.",
        "Specializing in Flutter, Firebase, Python, Power BI, and Data Analytics, I create scalable applications ranging from real-time healthcare platforms and financial systems to advanced analytics dashboards that transform raw data into meaningful insights.",
        "My work lives at the intersection of technology and human-centered design — crafting experiences that are not only technically powerful, but also intuitive, elegant, and future-focused.",
      ],
    },
    sections: {
      skills: "Core Capabilities",
      experience: "Experience Timeline",
      projects: "Cinematic Projects",
      analytics: "Analytics Command Center",
      contact: "Signal Contact",
    },
    footer: "Haron Mohammed — Software Engineer & Data Analyst",
    contact: {
      nationality: "Yemeni nationality",
      location: "Current location: India",
      phone: "Phone",
      email: "Email",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
  },
  ar: {
    nav: ["الرئيسية", "نبذة", "المهارات", "الخبرة", "المشاريع", "التحليلات", "التواصل"],
    hero: {
      name: "هارون محمد",
      arabicName: "HARON MOHAMMED",
      title: "مهندس برمجيات • محلل بيانات • مطور أنظمة",
      subtitle:
        "أبني تجارب رقمية ذكية تجمع بين الهندسة الحديثة وتحليل البيانات والتصميم الإبداعي.",
      primary: "ابدأ الرحلة",
      secondary: "عرض المشاريع",
      status: "مهندس برمجيات • محلل بيانات • مطور أنظمة",
    },
    about: {
      eyebrow: "الملف التقني",
      title: "بناء أنظمة رقمية ذكية بلمسة مستقبلية.",
      paragraphs: [
        "أنا مهندس برمجيات ومطور أنظمة متكاملة أركز على بناء حلول رقمية ذكية تجمع بين الدقة الهندسية والتصميم الحديث والتأثير الواقعي.",
        "أتخصص في Flutter وFirebase وPython وPower BI وتحليل البيانات، حيث أقوم ببناء تطبيقات وأنظمة متطورة تشمل المنصات الصحية الفورية والأنظمة المالية ولوحات تحليل البيانات الذكية التي تحول البيانات الخام إلى رؤى استراتيجية.",
        "أؤمن بأن التقنية ليست مجرد برمجة، بل تجربة متكاملة تجمع بين القوة التقنية والتصميم الإبداعي والسهولة في الاستخدام.",
      ],
    },
    sections: {
      skills: "القدرات الأساسية",
      experience: "مسار الخبرة",
      projects: "مشاريع سينمائية",
      analytics: "مركز قيادة التحليلات",
      contact: "قنوات التواصل",
    },
    footer: "هارون محمد — مهندس برمجيات ومحلل بيانات",
    contact: {
      nationality: "الجنسية اليمنية",
      location: "الموقع الحالي: الهند",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      instagram: "إنستغرام",
      linkedin: "لينكدإن",
      github: "GitHub",
    },
  },
} as const;

export const skills = [
  { label: "Python", value: 94, icon: Code2 },
  { label: "Power BI", value: 91, icon: BarChart3 },
  { label: "Flutter", value: 90, icon: Smartphone },
  { label: "Firebase", value: 88, icon: Flame },
  { label: "SQL", value: 89, icon: Database },
  { label: "Machine Learning", value: 84, icon: BrainCircuit },
  { label: "Data Analytics", value: 95, icon: PieChart },
  { label: "UI/UX Design", value: 86, icon: Layers3 },
  { label: "REST APIs", value: 87, icon: Workflow },
  { label: "GitHub", value: 88, icon: GitBranch },
  { label: "Full Stack Development", value: 92, icon: Globe2 },
  { label: "Figma", value: 82, icon: PenTool },
];

export const timeline = [
  {
    year: "2026",
    title: { en: "AI-ready engineering systems", ar: "أنظمة هندسية جاهزة للذكاء الاصطناعي" },
    text: {
      en: "Designing fast, bilingual, analytics-led product interfaces with cinematic polish.",
      ar: "تصميم واجهات منتجات سريعة وثنائية اللغة تقودها التحليلات بلمسة سينمائية.",
    },
    icon: Sparkles,
  },
  {
    year: "2025",
    title: { en: "Healthcare and finance platforms", ar: "منصات صحية ومالية" },
    text: {
      en: "Built real-time systems with Flutter, Firebase, Python automations, and secure dashboards.",
      ar: "بناء أنظمة فورية باستخدام Flutter وFirebase وأتمتة Python ولوحات آمنة.",
    },
    icon: HeartPulse,
  },
  {
    year: "2024",
    title: { en: "Data intelligence dashboards", ar: "لوحات ذكاء البيانات" },
    text: {
      en: "Transformed raw operational data into Power BI style metrics, insights, and executive views.",
      ar: "تحويل البيانات الخام إلى مؤشرات ورؤى ولوحات تنفيذية بأسلوب Power BI.",
    },
    icon: LineChart,
  },
  {
    year: "2023",
    title: { en: "Full stack foundations", ar: "أساسيات التطوير المتكامل" },
    text: {
      en: "Shipped scalable apps, APIs, and human-centered interfaces across multiple domains.",
      ar: "إطلاق تطبيقات وواجهات وأنظمة API قابلة للتوسع عبر مجالات متعددة.",
    },
    icon: ShieldCheck,
  },
];

export const projects = [
  {
    title: { en: "Forex App", ar: "تطبيق فوركس" },
    description: {
      en: "A luminous trading companion with live-style market widgets, portfolio insight, and risk surfaces.",
      ar: "تطبيق تداول متطور يعرض مؤشرات السوق والمحفظة ومناطق المخاطر بوضوح.",
    },
    stack: ["Flutter", "Firebase", "Charts", "REST"],
    accent: "#00d9ff",
  },
  {
    title: { en: "Healthcare System", ar: "نظام صحي" },
    description: {
      en: "Real-time healthcare operations for appointments, patient signals, triage, and staff workflow.",
      ar: "منصة صحية فورية لإدارة المواعيد والمؤشرات الطبية وسير العمل.",
    },
    stack: ["Flutter", "Firebase", "Python", "Security"],
    accent: "#8b5cf6",
  },
  {
    title: { en: "E-Commerce Platform", ar: "منصة تجارة إلكترونية" },
    description: {
      en: "A premium storefront architecture with smooth checkout, admin control, and responsive product flows.",
      ar: "منصة بيع رقمية بواجهة فاخرة وتجربة شراء سلسة ولوحة تحكم مرنة.",
    },
    stack: ["Next.js", "APIs", "UI/UX", "SQL"],
    accent: "#22c55e",
  },
  {
    title: { en: "Analytics Dashboard", ar: "لوحة تحليلات" },
    description: {
      en: "Power BI inspired analytics surface that converts noisy raw data into decisive business stories.",
      ar: "لوحة تحليل مستوحاة من Power BI تحول البيانات الخام إلى رؤى عملية.",
    },
    stack: ["Power BI", "Python", "DAX", "SQL"],
    accent: "#f59e0b",
  },
  {
    title: { en: "AI Visualization Projects", ar: "مشاريع تصور الذكاء الاصطناعي" },
    description: {
      en: "Interactive AI-inspired data scenes, predictive visuals, and exploratory intelligence interfaces.",
      ar: "مشاهد بيانات تفاعلية وتصورات تنبؤية وواجهات استكشاف ذكية.",
    },
    stack: ["Three.js", "ML", "Python", "Data Viz"],
    accent: "#ec4899",
  },
];

export const metrics = [
  { label: "Signal Accuracy", value: 96 },
  { label: "Data Velocity", value: 88 },
  { label: "Automation Index", value: 91 },
  { label: "UX Precision", value: 94 },
];

export const analyticsSeries = [
  { name: "Jan", insight: 34, systems: 22, growth: 18 },
  { name: "Feb", insight: 46, systems: 28, growth: 31 },
  { name: "Mar", insight: 42, systems: 38, growth: 40 },
  { name: "Apr", insight: 58, systems: 45, growth: 51 },
  { name: "May", insight: 72, systems: 56, growth: 63 },
  { name: "Jun", insight: 86, systems: 68, growth: 79 },
];

export const contactCards = [
  { key: "nationality", value: "Yemeni 🇾🇪", href: "#", icon: MapPin },
  { key: "location", value: "India", href: "#", icon: Globe2 },
  { key: "phone", value: personal.phone, href: `tel:${personal.phone.replaceAll(" ", "")}`, icon: Phone },
  { key: "email", value: personal.email, href: `mailto:${personal.email}`, icon: Mail },
  { key: "instagram", value: "@vtt5z", href: personal.instagram, icon: Activity },
  { key: "linkedin", value: "Haron Mohammad", href: personal.linkedin, icon: ShieldCheck },
  { key: "github", value: "GitHub placeholder", href: personal.github, icon: GitBranch },
];

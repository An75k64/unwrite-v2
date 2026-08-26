// Central data store for the admin panel
// Uses localStorage to persist data between sessions

// ── Seed Data ──────────────────────────────────────────────────────────────
export const SEED_ARTICLES = [
  {
    id: 1,
    title: "The Art of Restraint: Why Less Is More in Modern Brand Design",
    excerpt: "In a world saturated with visual noise, the most powerful brands speak in silence. We explore how strategic minimalism defines today's most iconic identities.",
    category: "Design",
    readTime: "8 min read",
    date: "Jul 10, 2026",
    author: "Unwrite Team",
    featured: true,
    status: "published",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=90&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Building Brand Equity in the Age of Scroll",
    excerpt: "Attention is the new currency. How to architect brand moments that stop the scroll and convert passive viewers into loyal advocates.",
    category: "Branding",
    readTime: "7 min read",
    date: "Jul 7, 2026",
    author: "Adeity",
    featured: false,
    status: "published",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "AI-Augmented Creativity: Friend or Replacement?",
    excerpt: "The creative industry is shifting. We examine how smart studios are wielding AI as a strategic amplifier - not a substitute for craft.",
    category: "AI",
    readTime: "6 min read",
    date: "Jul 4, 2026",
    author: "Adeity",
    featured: false,
    status: "published",
    src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=90&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "The Motion Manifesto: Animation as Language",
    excerpt: "Motion is not decoration — it is communication. A deep dive into how the world's best studios use timing, easing, and choreography to tell stories.",
    category: "Design",
    readTime: "5 min read",
    date: "Jun 28, 2026",
    author: "Unwrite Team",
    featured: false,
    status: "published",
    src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=90&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Photography Direction: Curating the Visual Language of Your Brand",
    excerpt: "Your brand's photos say more than your copy ever will. A guide to building a cohesive, instantly recognisable visual identity through photography.",
    category: "Photography",
    readTime: "9 min read",
    date: "Jun 21, 2026",
    author: "Unwrite Team",
    featured: false,
    status: "published",
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=90&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "From Pixels to Products: Bridging the Gap Between Design and Development",
    excerpt: "The best design in the world means nothing if it breaks in production. How we've built a workflow that keeps design intent alive through every line of code.",
    category: "Development",
    readTime: "11 min read",
    date: "Jun 14, 2026",
    author: "Unwrite Team",
    featured: false,
    status: "published",
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=90&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "The Creative Brief: Unwritten Rules",
    excerpt: "Most creative briefs fail before a single pixel is placed. Here's how we rewrite the discovery process to unlock better outcomes.",
    category: "Creative",
    readTime: "6 min read",
    date: "Jun 7, 2026",
    author: "Adeity",
    featured: false,
    status: "published",
    src: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&q=90&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Typography as Architecture",
    excerpt: "Type is not decoration — it is structure. How the world's most admired brands use typographic systems to build trust at scale.",
    category: "Design",
    readTime: "5 min read",
    date: "May 30, 2026",
    author: "Unwrite Team",
    featured: false,
    status: "published",
    src: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=90&auto=format&fit=crop",
  },
];

export const SEED_GALLERY = [
  { id: 1, title: "Brand Identity", category: "Branding", src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 2, title: "Digital Interface", category: "UI Design", src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 3, title: "Motion Identity", category: "Motion", src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 4, title: "Visual System", category: "Design", src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 5, title: "Editorial Layout", category: "Print", src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 6, title: "Product Campaign", category: "Photography", src: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 7, title: "Campaign Strategy", category: "Branding", src: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 8, title: "Typography Study", category: "Design", src: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=90&auto=format&fit=crop", status: "published" },
  { id: 9, title: "Tech Experience", category: "Development", src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=90&auto=format&fit=crop", status: "published" },
];

export const SEED_MESSAGES = [
  { id: 1, name: "Riya Sharma", email: "riya@example.com", userType: "client", message: "Hi, I loved your work on the branding portfolio. We're looking for a full brand identity refresh for our startup. Can we connect?", date: "2026-07-19T10:22:00Z", read: false },
  { id: 2, name: "Arjun Mehta", email: "arjun.mehta@agency.in", userType: "collaborator", message: "Hey Unwrite team! We're an animation studio based in Mumbai. Would love to explore a collaboration on a campaign for a mutual client.", date: "2026-07-17T14:05:00Z", read: true },
  { id: 3, name: "Zara Bhatia", email: "zara@techsolutions.io", userType: "client", message: "I'm looking for a complete redesign of our SaaS product's UI. Your work speaks for itself. What's your timeline looking like?", date: "2026-07-15T09:40:00Z", read: false },
  { id: 4, name: "Vikram Nair", email: "vikram.nair@gmail.com", userType: "other", message: "Just wanted to say the gallery page is absolutely stunning. The scroll animation is next level. Brilliant work!", date: "2026-07-12T19:30:00Z", read: true },
];

// ── localStorage Helpers ────────────────────────────────────────────────────
const KEYS = {
  articles: "uw_articles",
  gallery: "uw_gallery",
  messages: "uw_messages",
};

function load(key, seed) {
  if (typeof window === "undefined") return seed;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : seed;
  } catch {
    return seed;
  }
}

function save(key, data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Article Store ────────────────────────────────────────────────────────────
export function getArticles() { return load(KEYS.articles, SEED_ARTICLES); }
export function saveArticles(data) { save(KEYS.articles, data); }

// ── Gallery Store ────────────────────────────────────────────────────────────
export function getGallery() { return load(KEYS.gallery, SEED_GALLERY); }
export function saveGallery(data) { save(KEYS.gallery, data); }

// ── Messages Store ───────────────────────────────────────────────────────────
export function getMessages() { return load(KEYS.messages, SEED_MESSAGES); }
export function saveMessages(data) { save(KEYS.messages, data); }

export function nextId(items) {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

// ── Page Content Seed ────────────────────────────────────────────────────────
export const SEED_PAGE_CONTENT = {
  home: {
    heroHeading: "We Craft Brands That Outlast Trends.",
    heroSubheading: "Unwrite is a creative studio specialising in brand identity, digital experiences, and visual storytelling.",
    heroCTA: "View Our Work",
    heroLabel: "Creative Studio · Est. 2022",
    statsClients: "40+",
    statsProjects: "120+",
    statsYears: "4",
    statsAwards: "12",
  },
  about: {
    heroHeading: "We Are Unwrite.",
    heroSubheading: "A collective of designers, strategists, and storytellers building brands that matter.",
    missionTitle: "Our Mission",
    missionText: "To help brands unwrite outdated narratives and replace them with ones that are purposeful, precise, and powerful.",
    founderName: "Adeity",
    founderTitle: "Founder & Creative Director",
    founderBio: "With over a decade of experience in brand strategy and visual design, Adeity founded Unwrite to challenge the way brands communicate with the world.",
    teamSize: "12",
    founded: "2022",
    location: "Mumbai, India",
  },
  services: {
    heroHeading: "What We Do Best.",
    heroSubheading: "From brand identity to digital experiences, we offer a full spectrum of creative services.",
    service1Title: "Brand Identity",
    service1Desc: "Logos, visual systems, typography, color — everything that makes your brand instantly recognisable.",
    service2Title: "Digital Design",
    service2Desc: "Websites, apps, and digital touchpoints that convert visitors into loyal customers.",
    service3Title: "Motion & Video",
    service3Desc: "Cinematic brand films, animated explainers, and social content that stops the scroll.",
    service4Title: "Strategy",
    service4Desc: "Positioning, naming, messaging frameworks, and competitive audits that sharpen your brand.",
  },
  contact: {
    heroHeading: "Let's Create Something Extraordinary.",
    heroSubheading: "Whether you're a brand looking for a refresh or a startup building from scratch — we'd love to hear from you.",
    email: "unwritestudios@gmail.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra, India",
    responseTime: "24-48 hours",
  },
};

const PAGE_KEY = "uw_page_content";
export function getPageContent() { return load(PAGE_KEY, SEED_PAGE_CONTENT); }
export function savePageContent(data) { save(PAGE_KEY, data); }

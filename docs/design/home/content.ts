/**
 * Home page content as shown in the prototype.
 * Suggested home: src/content/home.ts — a static stand-in until Stage 3 (DB).
 * Shapes mirror docs/architecture/Data Model.md so the move to Drizzle is a swap of the source,
 * not of the components. Localized text lives here in English only; other locales fall back to en.
 *
 * TODO(owner): values marked TODO are placeholders from the design, not facts.
 */

export type SkillCategory = "core" | "frameworks" | "frontend" | "tools";

export type Skill = {
  name: string;
  category: SkillCategory;
  /** 1–10 */
  level: number;
  /** lower = shown first among equal levels */
  sort: number;
  /** shown in "My top skills" on the home page (1–20 skills are marked) */
  featured: boolean;
};

export type Experience = {
  company: string;
  /** ISO month, e.g. "2024-11" */
  start: string;
  end: string | null;
  /** up to 3 sentences */
  description: string;
  /** 3–5 names, each must exist in `skills` */
  tags: string[];
  /** /public path; null renders the striped placeholder */
  image: string | null;
  href: string;
};

export type PostPreview = {
  slug: string;
  /** ISO date */
  publishedAt: string;
  title: string;
  /** 2–3 sentences */
  excerpt: string;
  tags: string[];
  cover: string | null;
};

export const profile = {
  name: "Mikhail Aleksandrov",
  headline: "Senior Frontend Software Engineer, 8+ years",
  heroTags: ["React.js", "Redux", "Next.js", "NestJS", "TypeScript", "Express"],
  photo: "/images/mikhail-aleksandrov.jpg", // TODO(owner): add the photo to /public/images
  cv: "/cv/Mikhail_Aleksandrov_CV.pdf", // TODO(owner): add the PDF to /public/cv
  contacts: {
    whatsapp: { href: "https://wa.me/37493310039", display: "+374 93 310 039" },
    email: { href: "mailto:mikhail.aleksandrov.job@gmail.com", display: "mikhail.aleksandrov.job@gmail.com" },
    linkedin: { href: "https://www.linkedin.com/in/mikhail-aleksandrov-job", display: "linkedin.com/in/mikhail-aleksandrov-job" },
  },
  about: {
    lead: "I'm a Senior Frontend Engineer with 8+ years of commercial experience in React and Next.js, most recently at Glovo, Sony PlayStation and EPAM.",
    resultsTitle: "A few results I'm proud of:",
    results: [
      "At EPAM, I helped migrate an e-commerce store from PHP to Next.js, which raised conversion by 12.4% and made pages load 37% faster.",
      "At Glovo, I introduced unit testing that cut production defects by 23%, and shipped an offline mode that increased average session time by 17%.",
      "At Sony PlayStation, I helped build an in-game notification system from scratch, hired and onboarded 3 developers, and brought test coverage to 95%.",
    ],
    /** desktop only; mobile shows lead + results + "Read more" */
    more: "Beyond writing code, I have 2 years of team leadership experience, managing the full development cycle: from gathering requirements with the product owner to setting up a fully automated release process with high test coverage, detailed analytics and CI/CD. I've worked in small teams of 2–10 people and on large products with 1M+ users and teams of up to 60 engineers, so I'm comfortable with both startup speed and enterprise process.",
  },
};

export const experience: Experience[] = [
  {
    company: "Glovo",
    start: "2024-11",
    end: "2026-10",
    description:
      "Built an AI-powered chat for user support and set up frontend monitoring. Introduced unit testing that cut production defects by 23%. Shipped an offline mode that increased average session time by 17%.",
    tags: ["Next.js", "TypeScript", "Mantine", "React Hook Form", "Jest"], // TODO(owner): confirm
    image: null,
    href: "/projects#glovo",
  },
  {
    company: "Sony PlayStation",
    start: "2023-08",
    end: "2024-11",
    description:
      "Helped build the in-game notification system from scratch. Hired and onboarded 3 developers to the team. Brought test coverage to 95%.",
    tags: ["React", "TypeScript", "Redux Toolkit", "WebSocket", "Jest"], // TODO(owner): confirm
    image: null,
    href: "/projects#sony",
  },
  {
    company: "EPAM",
    start: "2021-07",
    end: "2023-08",
    description:
      "Migrated an e-commerce store from PHP to Next.js without losing SEO. The migration raised conversion by 12.4%. Pages started loading 37% faster.",
    tags: ["Next.js", "React", "Redux", "GraphQL"], // TODO(owner): confirm
    image: null,
    href: "/projects#epam",
  },
  {
    company: "Omega-R",
    start: "2019-05",
    end: "2021-06",
    description: "TODO(owner): up to three sentences about the role: product, what you built and the result.",
    tags: ["React", "React Native", "Redux", "Material UI"], // TODO(owner): confirm
    image: null,
    href: "/projects#omega-r",
  },
];

/** Demo posts from the design. TODO(owner): replace with real posts (Stage 4 moves them to the DB). */
export const latestPosts: PostPreview[] = [
  {
    slug: "php-to-nextjs-without-losing-seo",
    publishedAt: "2026-10-12",
    title: "Moving an e-commerce store from PHP to Next.js without losing SEO",
    excerpt:
      "How we migrated page by page behind a proxy, kept every URL and sitemap entry intact, and measured each step. The result was a 12.4% lift in conversion and pages 37% faster. Plus the three mistakes I would avoid next time.",
    tags: ["Next.js", "SEO", "Migration"],
    cover: null,
  },
  {
    slug: "offline-mode-in-react",
    publishedAt: "2026-09-28",
    title: "Offline mode in a React app: what actually matters",
    excerpt:
      "A service worker is only half the story. Here is how we queued actions made offline, resolved conflicts when the connection came back, and told users what was happening without alarming them.",
    tags: ["React", "PWA", "Offline"],
    cover: null,
  },
  {
    slug: "unit-tests-a-team-keeps-writing",
    publishedAt: "2026-09-09",
    title: "Unit tests a team keeps writing",
    excerpt:
      "Coverage targets alone don't change habits. This is the policy that took a team to 95% coverage: what we test first, what we skip on purpose, and how code review keeps it honest.",
    tags: ["Testing", "Jest", "Team process"],
    cover: null,
  },
];

const byCategory: Record<SkillCategory, string[]> = {
  core: ["JavaScript", "TypeScript", "HTML5", "CSS3", "SASS"],
  frameworks: ["React", "React Native", "Next.js", "Nest.js"],
  frontend: [
    "Redux", "Redux Toolkit", "RTK Query", "GraphQL", "React Testing Library", "Formik", "React Hook Form",
    "Yup", "Zod", "WebSocket", "Socket.io", "Material UI", "Mantine", "Tailwind", "Lodash", "Cypress", "Jest",
    "styled-components", "CSS-in-JS",
  ],
  tools: [
    "Docker", "Docker Compose", "Kubernetes", "OpenLens", "WebStorm", "Postman", "Git", "Jira", "Figma",
    "Chrome DevTools", "Swagger", "Xcode", "Claude Code",
  ],
};

/** Known levels from the design. Every other skill is 6 — TODO(owner): set real levels. */
const levels: Record<string, number> = {
  React: 9,
  "Next.js": 9,
  TypeScript: 8,
  "Redux Toolkit": 8,
  "Nest.js": 7,
};
const pinned = Object.keys(levels);

/** Marked for the home page. TODO(owner): pick your own set (1–20). */
const featured = ["React", "Next.js", "TypeScript", "Redux Toolkit", "Nest.js", "GraphQL", "Jest", "Tailwind"];

export const skills: Skill[] = (Object.keys(byCategory) as SkillCategory[]).flatMap((category) =>
  byCategory[category].map((name) => ({
    name,
    category,
    level: levels[name] ?? 6,
    sort: pinned.includes(name) ? pinned.indexOf(name) : 100,
    featured: featured.includes(name),
  })),
);
// 41 skills: core 5 · frameworks 4 · frontend 19 · tools 13

export const topSkills = skills
  .filter((s) => s.featured)
  .sort((a, b) => b.level - a.level || a.sort - b.sort || a.name.localeCompare(b.name));

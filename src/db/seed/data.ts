/**
 * Initial content, taken from docs/design/home/content.ts (English only; other locales fall back).
 * Values marked TODO(owner) are design placeholders, not facts. Edit them later in the admin.
 */
import { boldParagraph, bulletList, doc, paragraph } from "../../shared/lib/rich-text";

export const domains = [
  { key: "core", label: "Core" },
  { key: "frameworks", label: "Frameworks" },
  { key: "frontend", label: "Frontend" },
  { key: "tools", label: "Tools" },
] as const;

type DomainKey = (typeof domains)[number]["key"];

const byDomain: Record<DomainKey, string[]> = {
  core: ["JavaScript", "TypeScript", "HTML5", "CSS3", "SASS"],
  frameworks: ["React", "React Native", "Next.js", "Nest.js", "Express"],
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

/** Hero chips, in display order. Their position here becomes their `sort`. */
const mainSkills = ["React", "Redux", "Next.js", "Nest.js", "TypeScript", "Express"];

/** Known levels from the design. Every other skill is 6. TODO(owner): set real levels. */
const levels: Record<string, number> = {
  React: 9,
  "Next.js": 9,
  TypeScript: 8,
  "Redux Toolkit": 8,
  "Nest.js": 7,
};

/** Explicit order: hero chips first, then the skills with known levels, then the rest. */
const pinned = [...mainSkills, ...Object.keys(levels).filter((name) => !mainSkills.includes(name))];

export const skills = (Object.keys(byDomain) as DomainKey[]).flatMap((domain) =>
  byDomain[domain].map((name) => ({
    name,
    domain,
    level: levels[name] ?? 6,
    main: mainSkills.includes(name),
    sort: pinned.includes(name) ? pinned.indexOf(name) : 100,
  })),
);

export const profile = {
  photoUrl: null, // TODO(owner): upload the photo to Vercel Blob
  whatsappPhone: "+37493310039",
  email: "mikhail.aleksandrov.job@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/mikhail-aleksandrov-job",
  en: {
    name: "Mikhail Aleksandrov",
    headline: "Senior Frontend Software Engineer, 8+ years",
    aboutShort: doc(
      paragraph(
        "I'm a Senior Frontend Engineer with 8+ years of commercial experience in React and Next.js, most recently at Glovo, Sony PlayStation and EPAM.",
      ),
      boldParagraph("A few results I'm proud of:"),
      bulletList([
        "At EPAM, I helped migrate an e-commerce store from PHP to Next.js, which raised conversion by 12.4% and made pages load 37% faster.",
        "At Glovo, I introduced unit testing that cut production defects by 23%, and shipped an offline mode that increased average session time by 17%.",
        "At Sony PlayStation, I helped build an in-game notification system from scratch, hired and onboarded 3 developers, and brought test coverage to 95%.",
      ]),
    ),
    cvUrl: null, // TODO(owner): upload the CV PDF to Vercel Blob
  },
};

export const experience = [
  {
    slug: "glovo",
    company: "Glovo",
    startDate: "2024-11-01",
    endDate: "2026-10-01",
    skills: ["Next.js", "TypeScript", "Mantine", "React Hook Form", "Jest"], // TODO(owner): confirm
    descriptionShort:
      "Built an AI-powered chat for user support and set up frontend monitoring. Introduced unit testing that cut production defects by 23%. Shipped an offline mode that increased average session time by 17%.",
  },
  {
    slug: "sony",
    company: "Sony PlayStation",
    startDate: "2023-08-01",
    endDate: "2024-11-01",
    skills: ["React", "TypeScript", "Redux Toolkit", "WebSocket", "Jest"], // TODO(owner): confirm
    descriptionShort:
      "Helped build the in-game notification system from scratch. Hired and onboarded 3 developers to the team. Brought test coverage to 95%.",
  },
  {
    slug: "epam",
    company: "EPAM",
    startDate: "2021-07-01",
    endDate: "2023-08-01",
    skills: ["Next.js", "React", "Redux", "GraphQL"], // TODO(owner): confirm
    descriptionShort:
      "Migrated an e-commerce store from PHP to Next.js without losing SEO. The migration raised conversion by 12.4%. Pages started loading 37% faster.",
  },
  {
    slug: "omega-r",
    company: "Omega-R",
    startDate: "2019-05-01",
    endDate: "2021-06-01",
    skills: ["React", "React Native", "Redux", "Material UI"], // TODO(owner): confirm
    descriptionShort: "TODO(owner): up to three sentences about the role: product, what you built and the result.",
  },
];

/** Demo posts from the design. TODO(owner): replace with real posts. */
export const posts = [
  {
    slug: "php-to-nextjs-without-losing-seo",
    publishedAt: "2026-10-12",
    title: "Moving an e-commerce store from PHP to Next.js without losing SEO",
    excerpt:
      "How we migrated page by page behind a proxy, kept every URL and sitemap entry intact, and measured each step. The result was a 12.4% lift in conversion and pages 37% faster. Plus the three mistakes I would avoid next time.",
    tags: ["Next.js", "SEO", "Migration"],
  },
  {
    slug: "offline-mode-in-react",
    publishedAt: "2026-09-28",
    title: "Offline mode in a React app: what actually matters",
    excerpt:
      "A service worker is only half the story. Here is how we queued actions made offline, resolved conflicts when the connection came back, and told users what was happening without alarming them.",
    tags: ["React", "PWA", "Offline"],
  },
  {
    slug: "unit-tests-a-team-keeps-writing",
    publishedAt: "2026-09-09",
    title: "Unit tests a team keeps writing",
    excerpt:
      "Coverage targets alone don't change habits. This is the policy that took a team to 95% coverage: what we test first, what we skip on purpose, and how code review keeps it honest.",
    tags: ["Testing", "Jest", "Team process"],
  },
];

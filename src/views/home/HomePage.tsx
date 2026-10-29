// The home page is being built block by block: the first-screen grid is real, the rest below it is still the
// TEMPORARY plain dump of the database layer, replaced section by section (see docs/specs/2026-10-29-home-page-design.md).
import { getLocale } from "next-intl/server";
import type { FC } from "react";

import { getExperience, getLatestPosts, getProfile, getSkills } from "@/db/queries/home";
import { toPlainText } from "@/shared/lib/rich-text";
import { Hero } from "@/widgets/hero/Hero";

export const HomePage: FC = async () => {
  // The locale of the current [locale] segment; the queries fall back to English for untranslated rows.
  const locale = await getLocale();

  // Four independent cached reads, started together instead of one after another.
  const [profile, experience, skills, posts] = await Promise.all([
    getProfile(locale),
    getExperience(locale),
    getSkills(locale),
    getLatestPosts(locale),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-4 pt-4 pb-8 lg:max-w-[1200px] lg:px-10 lg:pt-6 lg:pb-12">
      {/*
        First screen: one DOM order (the mobile one: hero, photo, contacts, About), placed by named grid areas.
        Mobile, 2 columns:      Desktop (lg), 4 columns:
          hero     hero           photo     hero  hero  hero
          photo    photo          photo     about about about
          contacts contacts       contacts  about about about
          about    about
        The photo stretches over two rows, so both desktop columns end at the same line.
      */}
      <div className="grid grid-cols-2 gap-3 [grid-template-areas:'hero_hero'_'photo_photo'_'contacts_contacts'_'about_about'] lg:grid-cols-4 lg:gap-4 lg:[grid-template-areas:'photo_hero_hero_hero'_'photo_about_about_about'_'contacts_about_about_about']">
        <Hero className="[grid-area:hero]" />
      </div>

      <section className="flex flex-col gap-2">
        <p className="whitespace-pre-line">{toPlainText(profile.aboutShort)}</p>
        <ul className="font-mono text-sm">
          <li>
            WhatsApp: <a href={profile.contacts.whatsapp.href}>{profile.contacts.whatsapp.display}</a>
          </li>
          <li>
            Mail: <a href={profile.contacts.email.href}>{profile.contacts.email.mailbox}</a>
          </li>
          <li>
            LinkedIn: <a href={profile.contacts.linkedin.href}>{profile.contacts.linkedin.display}</a>
          </li>
          <li>CV: {profile.cvUrl ?? "not uploaded"}</li>
          <li>Photo: {profile.photoUrl ?? "not uploaded"}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Experience ({experience.length})</h2>
        {experience.map((job) => (
          <article key={job.slug}>
            <h3 className="font-semibold">{job.company}</h3>
            <p className="font-mono text-sm">
              {job.startDate} – {job.endDate ?? "present"}
            </p>
            <p>{toPlainText(job.descriptionShort)}</p>
            <p className="font-mono text-sm">{job.skills.join(" · ")}</p>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Skills ({skills.skills.length})</h2>
        <p className="font-mono text-sm">
          {skills.domains.map((d) => `${d.label} ${d.count}`).join(" · ")}
        </p>
        <ol className="columns-2 text-sm">
          {skills.skills.map((skill) => (
            <li key={skill.name}>
              {skill.name} — {skill.level}/10 ({skill.domain})
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Latest posts ({posts.length})</h2>
        {posts.map((post) => (
          <article key={post.slug}>
            <p className="font-mono text-sm">{post.publishedAt.slice(0, 10)}</p>
            <h3 className="font-semibold">{post.title}</h3>
            <p>{toPlainText(post.excerpt)}</p>
            <p className="font-mono text-sm">{post.tags.join(" · ")}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

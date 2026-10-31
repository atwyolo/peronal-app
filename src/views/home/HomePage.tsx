// The home page is being built block by block: the first screen, Experience and My top skills are real, the rest is still the
// TEMPORARY plain dump of the database layer, replaced section by section (see docs/specs/2026-10-29-home-page-design.md).
import { getLocale } from "next-intl/server";
import type { FC } from "react";

import { getLatestPosts } from "@/db/queries/home";
import { toPlainText } from "@/shared/lib/rich-text";
import { About } from "@/widgets/about/About";
import { Contacts } from "@/widgets/contacts/Contacts";
import { Experience } from "@/widgets/experience/Experience";
import { Hero } from "@/widgets/hero/Hero";
import { ProfilePhoto } from "@/widgets/profile-photo/ProfilePhoto";
import { TopSkills } from "@/widgets/top-skills/TopSkills";

export const HomePage: FC = async () => {
  // The locale of the current [locale] segment; the queries fall back to English for untranslated rows.
  const locale = await getLocale();

  const posts = await getLatestPosts(locale);

  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-3 px-4 pt-4 pb-8 lg:max-w-none lg:gap-4 lg:pr-15 lg:pl-5 lg:pt-6 lg:pb-12">
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
        <ProfilePhoto className="[grid-area:photo]" />
        <Contacts className="[grid-area:contacts]" />
        <About className="[grid-area:about]" />
      </div>

      <Experience />

      <TopSkills />

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

/**
 * Fills an empty database with the initial content. Run with `npm run db:seed`.
 *
 * There is one database for every environment (ADR-0002), so this script never deletes
 * or overwrites anything: if content already exists, it stops.
 */
import "../load-env"; // must stay first: the db client reads DATABASE_URL on import
import { db } from "..";
import {
  experience,
  experienceSkills,
  experienceTranslations,
  postTranslations,
  posts,
  profile,
  profileTranslations,
  skillDomainTranslations,
  skillDomains,
  skills,
} from "../schema";
import { doc, paragraph } from "../../shared/lib/rich-text";
import * as data from "./data";

async function main() {
  const [hasDomains, hasProfile] = await db.batch([
    db.select({ id: skillDomains.id }).from(skillDomains).limit(1),
    db.select({ id: profile.id }).from(profile).limit(1),
  ]);
  if (hasDomains.length > 0 || hasProfile.length > 0) {
    console.log("The database already has content. Seed skipped: it never overwrites data.");
    return;
  }

  // Round trip 1: domains, because skills need their ids.
  const domainRows = await db
    .insert(skillDomains)
    .values(data.domains.map((d, index) => ({ key: d.key, sort: index })))
    .returning({ id: skillDomains.id, key: skillDomains.key });
  const domainId = new Map(domainRows.map((row) => [row.key, row.id]));

  // Round trip 2: base rows that do not depend on each other, in one batch.
  const [skillRows, experienceRows, postRows] = await db.batch([
    db
      .insert(skills)
      .values(
        data.skills.map((s) => ({
          name: s.name,
          level: s.level,
          domainId: domainId.get(s.domain)!,
          main: s.main,
          sort: s.sort,
        })),
      )
      .returning({ id: skills.id, name: skills.name }),
    db
      .insert(experience)
      .values(
        data.experience.map((e, index) => ({
          slug: e.slug,
          company: e.company,
          startDate: e.startDate,
          endDate: e.endDate,
          sort: index,
        })),
      )
      .returning({ id: experience.id, slug: experience.slug }),
    db
      .insert(posts)
      .values(
        data.posts.map((p) => ({ slug: p.slug, status: "published" as const, publishedAt: new Date(p.publishedAt) })),
      )
      .returning({ id: posts.id, slug: posts.slug }),
  ]);
  const skillId = new Map(skillRows.map((row) => [row.name, row.id]));
  const experienceId = new Map(experienceRows.map((row) => [row.slug, row.id]));
  const postId = new Map(postRows.map((row) => [row.slug, row.id]));

  // Round trip 3: everything that references those ids. A batch runs as one transaction.
  await db.batch([
    db.insert(skillDomainTranslations).values(
      data.domains.map((d) => ({ domainId: domainId.get(d.key)!, locale: "en" as const, label: d.label })),
    ),
    db.insert(profile).values({
      photoUrl: data.profile.photoUrl,
      whatsappPhone: data.profile.whatsappPhone,
      email: data.profile.email,
      linkedinUrl: data.profile.linkedinUrl,
    }),
    db.insert(profileTranslations).values({ profileId: 1, locale: "en", ...data.profile.en }),
    db.insert(experienceTranslations).values(
      data.experience.map((e) => ({
        experienceId: experienceId.get(e.slug)!,
        locale: "en" as const,
        descriptionShort: doc(paragraph(e.descriptionShort)),
      })),
    ),
    db.insert(experienceSkills).values(
      data.experience.flatMap((e) =>
        e.skills.map((name, index) => {
          const id = skillId.get(name);
          if (!id) throw new Error(`Experience "${e.slug}" references unknown skill "${name}".`);
          return { experienceId: experienceId.get(e.slug)!, skillId: id, sort: index };
        }),
      ),
    ),
    db.insert(postTranslations).values(
      data.posts.map((p) => ({
        postId: postId.get(p.slug)!,
        locale: "en" as const,
        title: p.title,
        excerpt: doc(paragraph(p.excerpt)),
        tags: p.tags,
      })),
    ),
  ]);

  console.log(
    `Seeded: ${domainRows.length} domains, ${skillRows.length} skills, ${experienceRows.length} jobs, ${postRows.length} posts, 1 profile.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// Rendering: static. Every read is a "use cache" function, so the whole page joins the static shell at build time.
// TEMPORARY: a plain dump of the home page data to verify the database layer. The real UI follows the design handoff.
import { getExperience, getLatestPosts, getProfile, getSkills } from "@/db/queries/home";
import { defaultLocale } from "@/lib/locales";
import { toPlainText } from "@/lib/rich-text";

export default async function Home() {
  const locale = defaultLocale; // replaced by the [locale] segment in Stage 2

  // Four independent cached reads, started together instead of one after another.
  const [profile, experience, skills, posts] = await Promise.all([
    getProfile(locale),
    getExperience(locale),
    getSkills(locale),
    getLatestPosts(locale),
  ]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 p-8 font-sans">
      <section className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">{profile.name}</h1>
        <p>{profile.headline}</p>
        <p className="font-mono text-sm">Hero skills: {profile.heroSkills.join(" · ")}</p>
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
}

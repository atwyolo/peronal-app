import { getLocale, getTranslations } from "next-intl/server";
import type { FC } from "react";

import { getExperience } from "@/db/queries/home";
import { ExperienceCard } from "@/features/experience-card/ExperienceCard";
import { ButtonLink } from "@/shared/ui/ButtonLink";
import { SectionHeader } from "@/shared/ui/SectionHeader";

/** Experience block: the jobs in the database's order, then the way to the full list. */
export const Experience: FC = async () => {
  const locale = await getLocale();
  const [jobs, t] = await Promise.all([getExperience(locale), getTranslations("Home.experience")]);

  return (
    <section aria-labelledby="experience-title" className="flex flex-col gap-3 lg:gap-4">
      <SectionHeader id="experience-title">{t("label")}</SectionHeader>
      <div className="grid gap-3 lg:grid-cols-4 lg:gap-4">
        {jobs.map((job) => (
          <ExperienceCard key={job.slug} job={job} />
        ))}
      </div>
      <ButtonLink href="/projects" tone="primary" className="lg:self-end">
        {t("all")}
      </ButtonLink>
    </section>
  );
};

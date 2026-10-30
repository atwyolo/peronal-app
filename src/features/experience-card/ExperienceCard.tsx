import { useTranslations } from "next-intl";
import type { FC } from "react";

import type { HomeExperience } from "@/db/queries/home";
import { toPlainText } from "@/shared/lib/rich-text";
import { Chip } from "@/shared/ui/Chip";
import { Link } from "@/shared/ui/Link";
import { Tile } from "@/shared/ui/Tile";

import { formatMonthYear, getDurationYears } from "./lib/period";

interface ExperienceCardProps {
  job: HomeExperience;
}

/** One job: company, period with its duration, description, skills. Synchronous, so Vitest can render it. */
export const ExperienceCard: FC<ExperienceCardProps> = (props) => {
  const { job } = props;
  const { company, startDate, endDate, today, descriptionShort, skills } = job;
  const t = useTranslations("Home.experience");

  const end = endDate ? formatMonthYear(endDate) : t("present");
  const duration = t("duration", { years: getDurationYears(startDate, endDate, today) });

  return (
    <Tile as="article" className="p-3 lg:p-3.5">
      <div className="flex grow flex-col gap-2 px-1 pt-1 pb-0.5 lg:px-1.5 lg:pt-1.5 lg:pb-1">
        <h3 className="text-lg font-semibold lg:text-xl">{company}</h3>
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase lg:text-xs">
          {formatMonthYear(startDate)} – {end} · <span className="whitespace-nowrap">{duration}</span>
        </p>
        <p className="text-sm leading-normal whitespace-pre-line text-foreground-soft">
          {toPlainText(descriptionShort)}
        </p>
        {skills.length > 0 && (
          <ul className="mt-0.5 flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <li key={skill}>
                <Chip>{skill}</Chip>
              </li>
            ))}
          </ul>
        )}
        <Link href="/projects" showArrowIcon className="mt-auto self-start py-1 text-[15px]">
          {t("learnMore")}
        </Link>
      </div>
    </Tile>
  );
};

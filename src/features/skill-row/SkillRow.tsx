import { useTranslations } from "next-intl";
import type { FC } from "react";

import { cn } from "@/shared/lib/utils";

const SEGMENTS = 10;

interface SkillRowProps {
  skill: { name: string; level: number };
}

/**
 * A skill and its level on a ten-segment bar. The bar and the value always share a line: the name takes its own line
 * below `lg`, a column from `lg`. A meter's content is presentational, so the label carries the name and the level.
 */
export const SkillRow: FC<SkillRowProps> = (props) => {
  const { skill } = props;
  const { name, level } = skill;
  const t = useTranslations("Home.skills");

  return (
    <div
      role="meter"
      aria-label={t("levelAria", { name, level })}
      aria-valuenow={level}
      aria-valuemin={1}
      aria-valuemax={SEGMENTS}
      aria-valuetext={t("level", { level })}
      className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-x-3.5 gap-y-1.5 lg:grid-cols-[150px_minmax(0,1fr)_44px]"
    >
      <span className="col-span-2 text-[15px] font-medium lg:col-span-1 lg:text-base">{name}</span>
      <div className="grid grid-cols-10 gap-[3px] lg:gap-1">
        {Array.from({ length: SEGMENTS }, (_, segment) => (
          <i key={segment} className={cn("h-2 rounded-[2px] lg:h-2.5", segment < level ? "bg-brand" : "bg-placeholder")} />
        ))}
      </div>
      <span className="text-right font-mono text-xs whitespace-nowrap text-muted-foreground lg:text-left">{t("level", { level })}</span>
    </div>
  );
};

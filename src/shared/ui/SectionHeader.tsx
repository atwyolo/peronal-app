import type { FC, ReactNode } from "react";

interface SectionHeaderProps {
  /** Target of the section's `aria-labelledby`. */
  id: string;
  children: ReactNode;
}

/** The mono label above a home page block. The top padding is what separates the blocks. */
export const SectionHeader: FC<SectionHeaderProps> = (props) => {
  const { id, children } = props;

  return (
    <div className="px-1 pt-3 lg:pt-8 lg:pb-1">
      <h2 id={id} className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase lg:text-xs">
        {children}
      </h2>
    </div>
  );
};

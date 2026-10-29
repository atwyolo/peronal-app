import { XIcon } from "lucide-react";
import type { FC, ReactElement, ReactNode } from "react";

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/shared/shadcn/ui/sheet";

import { Button } from "./Button";

interface DrawerProps {
  /** Element that opens the drawer, usually our Button with an aria-label. Receives the trigger props and ref. */
  trigger: ReactElement;
  /** Accessible name of the panel (visually hidden). */
  title: string;
  /** Label of the close button; the shadcn one is hard-coded English. */
  closeLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

/**
 * Side panel sliding in from the right (mobile navigation). Adapter over shadcn Sheet (Base UI Dialog): focus is
 * trapped inside, Escape and the backdrop close it, focus returns to the trigger. Controlled, so the consumer can
 * close it, e.g. after navigation.
 */
export const Drawer: FC<DrawerProps> = (props) => {
  const { trigger, title, closeLabel, open, onOpenChange, children } = props;

  return (
    <Sheet open={open} onOpenChange={(next: boolean) => onOpenChange(next)}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" showCloseButton={false} className="gap-0 border-card-border bg-card px-4 pt-[72px] pb-6">
        <SheetTitle className="sr-only">{title}</SheetTitle>
        {/* Same spot as the header controls (64px header, 12px right padding). */}
        <SheetClose
          render={<Button shape="circle" aria-label={closeLabel} className="absolute top-2.5 right-3" />}
        >
          <XIcon aria-hidden />
        </SheetClose>
        {children}
      </SheetContent>
    </Sheet>
  );
};

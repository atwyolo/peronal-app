import { getLocale } from "next-intl/server";
import type { FC } from "react";

import { getProfile } from "@/db/queries/home";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/Image";
import { Tile } from "@/shared/ui/Tile";

interface ProfilePhotoProps {
  /** Grid placement from the page. */
  className?: string;
}

/**
 * Photo tile, the LCP element of the home page: square on mobile, fills its grid area on desktop.
 * `sizes` is the rendered image width, not the tile width: in the tall desktop tile `object-cover` scales the photo
 * by its height, so the 268px column needs a wider file.
 */
export const ProfilePhoto: FC<ProfilePhotoProps> = async (props) => {
  const { className } = props;
  const locale = await getLocale();
  const { name, photoUrl } = await getProfile(locale);

  return (
    <Tile className={cn("relative aspect-square overflow-hidden p-0 lg:aspect-auto lg:min-h-[380px] lg:p-0", className)}>
      <Image
        src={photoUrl}
        alt={name}
        sizes="(min-width: 1024px) 400px, (min-width: 720px) 688px, calc(100vw - 32px)"
        preload
        className="object-cover object-[50%_0]"
      />
    </Tile>
  );
};

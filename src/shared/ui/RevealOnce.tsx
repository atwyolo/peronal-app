"use client";

import { type FC, useLayoutEffect } from "react";

/** Survives a language switch, which remounts the root layout and clears the attributes of `<html>`. A reload resets it. */
let played = false;

const markRevealed = () => {
  document.documentElement.dataset.revealed = "";
};

/**
 * Plays the accent wipe once per page load: marks `<html>` when the wipe has ended, and `globals.css` drops the shutter.
 * Without the mark a return to a page plays it again, because `cacheComponents` hides a left route with `display: none`.
 * A layout effect, so a cleared `<html>` gets the mark back before the paint. The wipe itself runs without JavaScript.
 */
export const RevealOnce: FC = () => {
  useLayoutEffect(() => {
    if (played) {
      markRevealed();
      return;
    }

    const wipes = document.getAnimations().filter((animation) => (animation as CSSAnimation).animationName === "wipe");

    // `allSettled`: leaving the page cancels a running wipe, and a cancelled wipe counts as played.
    void Promise.allSettled(wipes.map((animation) => animation.finished)).then(() => {
      played = true;
      markRevealed();
    });
  }, []);

  return null;
};

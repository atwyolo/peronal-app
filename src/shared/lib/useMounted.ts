import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` during the server render and hydration, `true` afterwards. For UI that depends on browser-only state
 * (the resolved theme): the first client render must match the server HTML, then it may change.
 * useSyncExternalStore with a server snapshot does this without a setState-in-effect re-render.
 */
export const useMounted = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

import type { Ref } from "react";

import { cx } from "@/ui/cx";

export type MountPointProps = {
  elementRef: Ref<HTMLDivElement>;
  /** Announced in place of the element, which has no accessible content of its own. */
  ariaLabel: string;
  className?: string;
};

/**
 * An empty element for a non-React library to take over.
 *
 * This is the case AGENTS.md names when it says escapes exist for "a ref target for a
 * map to mount into": Leaflet writes its own DOM into a container and React must not
 * touch it afterwards, so there is nothing to express as a primitive. Keeping it here
 * rather than letting the map component reach for a bare element is what stops rule 3
 * developing exceptions.
 */
export function MountPoint({ elementRef, ariaLabel, className }: MountPointProps) {
  return <div ref={elementRef} role="application" aria-label={ariaLabel} className={cx(className)} />;
}

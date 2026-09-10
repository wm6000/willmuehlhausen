import { useEffect, useState } from "react";

export type Resource<T> =
  | { status: "loading" }
  | { status: "ready"; value: T }
  | { status: "error"; message: string };

/**
 * Loads one of the model's JSON files on mount.
 *
 * The loaders in @/lib/disaster/load memoise, so this deliberately does no caching of
 * its own. What it does own is the failure state: these files are fetched at runtime
 * and a demo that quietly renders nothing when the network drops is worse than one
 * that says it couldn't load, so "error" is a first-class result here rather than a
 * console warning.
 */
export function useResource<T>(load: () => Promise<T>): Resource<T> {
  const [resource, setResource] = useState<Resource<T>>({ status: "loading" });

  useEffect(() => {
    let live = true;
    load()
      .then((value) => {
        if (live) setResource({ status: "ready", value });
      })
      .catch((error: unknown) => {
        if (!live) return;
        setResource({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      });
    return () => {
      live = false;
    };
  }, [load]);

  return resource;
}

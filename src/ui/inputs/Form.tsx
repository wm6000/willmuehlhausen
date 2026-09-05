import type { ReactNode } from "react";

import { cx } from "@/ui/cx";

export type FormProps = {
  children: ReactNode;
  onSubmit: () => void;
  /** Named so browsers and password managers can tell one form from another. */
  name?: string;
  ariaLabelledBy?: string;
  className?: string;
};

/**
 * A form that submits on Enter and never navigates. The default action is always
 * prevented — submission is handled in React, so a bare <form action> would only
 * ever be a full-page reload that loses the state.
 */
export function Form({ children, onSubmit, name, ariaLabelledBy, className }: FormProps) {
  return (
    <form
      name={name}
      aria-labelledby={ariaLabelledBy}
      className={cx("ui-form", className)}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
}

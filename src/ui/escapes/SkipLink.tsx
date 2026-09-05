export type SkipLinkProps = {
  to: string;
  children: string;
};

/** First tab stop on every page. Hidden until focused. */
export function SkipLink({ to, children }: SkipLinkProps) {
  return (
    <a href={to} className="ui-skip-link">
      {children}
    </a>
  );
}

import { cx } from "@/ui/cx";

/**
 * A flow diagram, drawn from data.
 *
 * This is an escape rather than a display primitive because it is the one place the app
 * emits raw <svg>. Keeping it generic — nodes and edges in, picture out — is what stops
 * it becoming a licence for any post to inline markup: the shape of a particular
 * diagram lives in that post as data, and the drawing lives here.
 *
 * Colour comes from CSS custom properties rather than attributes so the picture follows
 * the theme toggle like everything else.
 */

export type DiagramNode = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  detail?: string;
  /** Emphasised nodes carry the accent fill; use it for the step that matters. */
  emphasis?: boolean;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

export type DiagramProps = {
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  width: number;
  height: number;
  /** Read out in place of the picture, so the diagram is not information-only-in-pixels. */
  title: string;
  description: string;
  className?: string;
};

const ARROW = "diagram-arrow";

export function Diagram({
  nodes,
  edges,
  width,
  height,
  title,
  description,
  className,
}: DiagramProps) {
  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className={cx("ui-diagram", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="ui-diagram__svg"
        role="img"
        aria-label={`${title}. ${description}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id={ARROW}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="ui-diagram__arrowhead" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (from === undefined || to === undefined) return null;

          // Side-by-side nodes connect edge-to-edge; stacked ones connect top-to-bottom.
          const horizontal = to.x >= from.x + from.width;
          const x1 = horizontal ? from.x + from.width : from.x + from.width / 2;
          const y1 = horizontal ? from.y + from.height / 2 : from.y + from.height;
          const x2 = horizontal ? to.x : to.x + to.width / 2;
          const y2 = horizontal ? to.y + to.height / 2 : to.y;

          return (
            <g key={`${edge.from}-${edge.to}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="ui-diagram__edge"
                markerEnd={`url(#${ARROW})`}
              />
              {edge.label === undefined ? null : (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  className="ui-diagram__edge-label"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              rx="8"
              className={cx("ui-diagram__box", node.emphasis && "ui-diagram__box--accent")}
            />
            <text
              x={node.x + node.width / 2}
              y={node.y + (node.detail === undefined ? node.height / 2 + 4 : node.height / 2 - 4)}
              className="ui-diagram__label"
              textAnchor="middle"
            >
              {node.label}
            </text>
            {node.detail === undefined ? null : (
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2 + 13}
                className="ui-diagram__detail"
                textAnchor="middle"
              >
                {node.detail}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

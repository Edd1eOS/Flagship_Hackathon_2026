import type { CSSProperties, ReactNode } from "react";

// Renders real art when a manifest entry has a src; locations without
// dedicated art (a location still locked, or Quiet Garden) fall back to a
// tinted block so a missing asset never collapses or shifts the layout.
export type AssetTileProps = {
  src: string | null;
  alt: string;
  tint: string;
  label?: ReactNode;
  className?: string;
  style?: CSSProperties;
  sprite?: { columns: number; rows: number; column: number; row: number };
};

export function AssetTile({
  src,
  alt,
  tint,
  label,
  className,
  style,
  sprite,
}: AssetTileProps) {
  if (src && sprite) {
    return (
      <div
        role={alt ? "img" : "presentation"}
        aria-label={alt || undefined}
        className={className}
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${sprite.columns * 100}% ${sprite.rows * 100}%`,
          backgroundPosition: `${(sprite.column / (sprite.columns - 1)) * 100}% ${(sprite.row / (sprite.rows - 1)) * 100}%`,
          ...style,
        }}
      />
    );
  }
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- static files under public/art, rendered at whatever size the caller's className/style dictates; next/image's fill-container sizing isn't worth the config for a fixed local art set.
    return <img src={src} alt={alt} className={className} style={style} />;
  }

  return (
    <div
      role={alt ? "img" : "presentation"}
      aria-label={alt || undefined}
      className={`flex items-center justify-center border border-[var(--color-line)] ${className ?? ""}`}
      style={{ backgroundColor: tint, ...style }}
    >
      {label ? (
        <span className="px-2 text-center text-xs font-semibold text-[var(--color-ink)] sm:text-sm">
          {label}
        </span>
      ) : null}
    </div>
  );
}

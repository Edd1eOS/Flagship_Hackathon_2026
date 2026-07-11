import type { CSSProperties, ReactNode } from "react";

// Every world/product image is optional until Stage 13 art lands. This tile
// renders the real image when a src exists and otherwise falls back to a
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
    // eslint-disable-next-line @next/next/no-img-element -- fallback-first tile predates real art (Stage 13); a plain <img> keeps the component decoupled from next/image config until real files exist.
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

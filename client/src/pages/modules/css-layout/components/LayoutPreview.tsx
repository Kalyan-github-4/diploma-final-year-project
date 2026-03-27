import { PREVIEW_BASE_STYLES } from "../data/challenges.data"

interface LayoutPreviewProps {
  html: string
  css: string
  label?: string
  /** Scale factor for the goal mini-preview (e.g. 0.5). Uses iframe transform — no CSS injection needed. */
  scale?: number
}

export default function LayoutPreview({ html, css, label, scale }: LayoutPreviewProps) {
  const srcDoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
${PREVIEW_BASE_STYLES}
${css}
</style>
</head>
<body>${html}</body>
</html>`

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {label && (
        <div className="flex items-center gap-2 border-b border-border bg-(--bg-elevated) px-4 py-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-(--text-tertiary)">
            {label}
          </span>
        </div>
      )}

      {scale ? (
        /* Scaled mini-preview: render iframe larger than container, then scale it down */
        <div className="relative flex-1 overflow-hidden">
          <iframe
            title={label ?? "preview"}
            srcDoc={srcDoc}
            sandbox="allow-same-origin"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
              width: `${100 / scale}%`,
              height: `${100 / scale}%`,
              border: "none",
              background: "#f8fafc",
            }}
          />
        </div>
      ) : (
        <iframe
          title={label ?? "preview"}
          srcDoc={srcDoc}
          sandbox="allow-same-origin"
          className="h-full w-full flex-1 border-none"
          style={{ background: "#f8fafc" }}
        />
      )}
    </div>
  )
}

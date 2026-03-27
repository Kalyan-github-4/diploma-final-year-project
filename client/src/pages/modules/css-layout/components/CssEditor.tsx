import { useRef, useCallback, useMemo } from "react"
import { RotateCcw } from "lucide-react"

interface CssEditorProps {
  value: string
  onChange: (value: string) => void
  onReset: () => void
}

// ── Syntax highlighter ──────────────────────────────────────────────────────

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Tokenise a CSS value string into colored segments. */
function highlightValue(val: string): string {
  type Seg = { text: string; color?: string }
  const segs: Seg[] = []
  let rem = val

  while (rem.length > 0) {
    // rgba / rgb / hsl / hsla function
    const fnM = rem.match(/^(rgba?|hsla?)\s*\([^)]*\)/)
    if (fnM) {
      segs.push({ text: fnM[0], color: "#fcd34d" })
      rem = rem.slice(fnM[0].length)
      continue
    }

    // hex colour
    const hexM = rem.match(/^#[0-9a-fA-F]{3,8}(?=[^0-9a-zA-Z]|$)/)
    if (hexM) {
      segs.push({ text: hexM[0], color: "#fcd34d" })
      rem = rem.slice(hexM[0].length)
      continue
    }

    // number + optional CSS unit
    const numM = rem.match(/^\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|vmin|vmax|fr|ch|ex|deg|turn|s|ms)?\b/)
    if (numM) {
      segs.push({ text: numM[0], color: "#fb923c" })
      rem = rem.slice(numM[0].length)
      continue
    }

    // CSS keyword values
    const kwM = rem.match(
      /^(flex|grid|none|auto|inherit|initial|unset|revert|center|space-between|space-around|space-evenly|flex-start|flex-end|start|end|stretch|wrap|nowrap|row|column|row-reverse|column-reverse|block|inline|inline-flex|inline-grid|relative|absolute|fixed|sticky|hidden|visible|scroll|clip|solid|dashed|dotted|repeat|no-repeat|cover|contain|bold|normal|italic|uppercase|lowercase|capitalize|minmax|auto-fit|auto-fill|span|max-content|min-content|fit-content|transparent|currentColor|round|space)\b/,
    )
    if (kwM) {
      segs.push({ text: kwM[0], color: "#c084fc" })
      rem = rem.slice(kwM[0].length)
      continue
    }

    // plain character — merge into last plain segment
    const last = segs[segs.length - 1]
    if (last && !last.color) {
      last.text += rem[0]
    } else {
      segs.push({ text: rem[0] })
    }
    rem = rem.slice(1)
  }

  return segs
    .map((s) =>
      s.color
        ? `<span style="color:${s.color}">${esc(s.text)}</span>`
        : `<span style="color:#fde68a">${esc(s.text)}</span>`,
    )
    .join("")
}

/**
 * Highlight one line of CSS.
 * Returns [html, stillInComment].
 */
function highlightLine(line: string, inComment: boolean): [string, boolean] {
  // ── still inside a block comment ──
  if (inComment) {
    const end = line.indexOf("*/")
    if (end !== -1) {
      const commentPart = line.slice(0, end + 2)
      const rest = line.slice(end + 2)
      const [restHtml, nextState] = highlightLine(rest, false)
      return [
        `<span style="color:#64748b;font-style:italic">${esc(commentPart)}</span>` + restHtml,
        nextState,
      ]
    }
    return [`<span style="color:#64748b;font-style:italic">${esc(line)}</span>`, true]
  }

  if (!line.trim()) return [esc(line), false]

  // ── comment opening on this line ──
  const cStart = line.indexOf("/*")
  if (cStart !== -1) {
    const cEnd = line.indexOf("*/", cStart + 2)
    if (cEnd !== -1) {
      // inline comment — process before & after
      const [beforeHtml] = highlightLine(line.slice(0, cStart), false)
      const [afterHtml, afterState] = highlightLine(line.slice(cEnd + 2), false)
      return [
        beforeHtml +
          `<span style="color:#64748b;font-style:italic">${esc(line.slice(cStart, cEnd + 2))}</span>` +
          afterHtml,
        afterState,
      ]
    }
    // comment starts but doesn't close — rest of line is a comment
    const [beforeHtml] = highlightLine(line.slice(0, cStart), false)
    return [
      beforeHtml +
        `<span style="color:#64748b;font-style:italic">${esc(line.slice(cStart))}</span>`,
      true,
    ]
  }

  // ── selector line:  .foo, div {  ──
  const selM = line.match(/^(\s*)([^{};]+?)(\s*\{)\s*$/)
  if (selM) {
    const [, ws, sel, brace] = selM
    return [
      `${esc(ws)}<span style="color:#f472b6">${esc(sel.trimEnd())}</span>` +
        `<span style="color:#94a3b8">${esc(brace)}</span>`,
      false,
    ]
  }

  // ── closing brace  } ──
  if (line.trim() === "}") {
    return [line.replace("}", `<span style="color:#94a3b8">}</span>`), false]
  }

  // ── property: value; ──
  const propM = line.match(/^(\s*)([\w-]+)(\s*:\s*)(.*?)(;?)(\s*)$/)
  if (propM && !line.includes("{") && !line.includes("}")) {
    const [, ws, prop, colon, val, semi, trail] = propM
    return [
      `${esc(ws)}<span style="color:#a5f3fc">${esc(prop)}</span>` +
        `<span style="color:#94a3b8">${esc(colon)}</span>` +
        highlightValue(val) +
        `<span style="color:#94a3b8">${esc(semi)}</span>` +
        esc(trail),
      false,
    ]
  }

  return [esc(line), false]
}

function highlightCss(code: string): string {
  let inComment = false
  return code
    .split("\n")
    .map((line) => {
      const [html, next] = highlightLine(line, inComment)
      inComment = next
      return html
    })
    .join("\n")
}

// ── Component ───────────────────────────────────────────────────────────────

export default function CssEditor({ value, onChange, onReset }: CssEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget
    if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollTop
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop
      highlightRef.current.scrollLeft = scrollLeft
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Tab") return
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = value.substring(0, start) + "  " + value.substring(end)
      onChange(next)
      requestAnimationFrame(() => {
        el.selectionStart = start + 2
        el.selectionEnd = start + 2
      })
    },
    [value, onChange],
  )

  const highlighted = useMemo(() => highlightCss(value), [value])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-(--bg-elevated) px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-(--text-tertiary)">
            CSS Editor
          </span>
          <span className="rounded bg-(--bg-surface) px-1.5 py-0.5 font-mono text-[9px] text-(--text-tertiary)">
            styles.css
          </span>
        </div>
        <button
          onClick={onReset}
          title="Reset to starter code"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-(--text-tertiary) transition-colors hover:bg-(--bg-surface) hover:text-(--text-secondary)"
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>

      {/* Editor body */}
      <div className="relative flex-1 overflow-hidden bg-(--terminal-bg)">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-full select-none overflow-y-hidden pt-3 pb-3 pl-3 pr-2 font-mono text-xs leading-[1.65rem] text-(--text-disabled)"
          style={{ minWidth: "2.8rem", userSelect: "none" }}
        >
          {value.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Syntax-highlight overlay */}
        <div
          ref={highlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden py-3 pr-4 font-mono text-xs leading-[1.65rem]"
          style={{
            paddingLeft: "3.2rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />

        {/* Transparent textarea — captures input, shows caret only */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="absolute inset-0 h-full w-full resize-none bg-transparent py-3 pr-4 font-mono text-xs leading-[1.65rem] outline-none"
          style={{
            paddingLeft: "3.2rem",
            caretColor: "var(--accent)",
            color: "transparent",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        />
      </div>
    </div>
  )
}

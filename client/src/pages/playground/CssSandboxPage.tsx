import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import LayoutPreview from "@/pages/modules/css-layout/components/LayoutPreview"
import CssEditor from "@/pages/modules/css-layout/components/CssEditor"

const DEFAULT_HTML = `<div class="container">
  <header class="header">Header</header>
  <nav class="sidebar">Sidebar</nav>
  <main class="content">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </main>
  <footer class="footer">Footer</footer>
</div>`

const DEFAULT_CSS = `.container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  min-height: 400px;
}

.header {
  grid-column: 1 / -1;
  background: #6C47FF;
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  font-weight: 600;
}

.sidebar {
  background: #1a1a2e;
  color: #9394A1;
  padding: 16px;
  border-radius: 8px;
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-content: flex-start;
}

.card {
  flex: 1 1 140px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  font-weight: 500;
}

.footer {
  grid-column: 1 / -1;
  background: #f1f5f9;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13px;
  color: #64748b;
}`

export default function CssSandboxPage() {
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [css, setCss] = useState(DEFAULT_CSS)

  return (
    <div className="-m-6 flex h-[calc(100%+48px)] flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border bg-(--bg-elevated) px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            to="/playground"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-(--bg-surface) text-(--text-secondary) transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} />
          </Link>
          <h1 className="text-[14px] font-semibold text-foreground font-grotesk">
            CSS Layout Sandbox
          </h1>
        </div>
        <span className="rounded-md bg-(--bg-surface) px-2 py-0.5 text-[10px] font-medium text-(--text-tertiary)">
          Flexbox &amp; Grid
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: editors */}
        <div className="flex w-1/2 flex-col overflow-hidden border-r border-border">
          {/* HTML editor */}
          <div className="flex flex-col border-b border-border" style={{ flex: "0 0 40%" }}>
            <div className="flex items-center gap-2 border-b border-border bg-(--bg-elevated) px-4 py-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-(--text-tertiary)">
                HTML
              </span>
              <span className="rounded bg-(--bg-surface) px-1.5 py-0.5 font-mono text-[9px] text-(--text-tertiary)">
                index.html
              </span>
            </div>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
              className="flex-1 resize-none bg-(--terminal-bg) px-4 py-3 font-mono text-xs leading-relaxed text-foreground outline-none"
            />
          </div>

          {/* CSS editor */}
          <div className="flex-1 overflow-hidden">
            <CssEditor
              value={css}
              onChange={setCss}
              onReset={() => setCss(DEFAULT_CSS)}
            />
          </div>
        </div>

        {/* Right: live preview */}
        <div className="flex-1 overflow-hidden">
          <LayoutPreview html={html} css={css} label="Live Preview" />
        </div>
      </div>
    </div>
  )
}

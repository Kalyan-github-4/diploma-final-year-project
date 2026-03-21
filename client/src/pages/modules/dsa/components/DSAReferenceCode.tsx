import { basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import type { PlaybackState } from "@/types/dsa.types"

interface DSAReferenceCodeProps {
  referenceCode: string[]
  activeCodeLine: number
  mode: PlaybackState["mode"]
  editorCode: string
  onEditorCodeChange: (nextValue: string) => void
  onRunCode: () => void
  runDisabled: boolean
}

export function DSAReferenceCode({
  referenceCode,
  activeCodeLine,
  mode,
  editorCode,
  onEditorCodeChange,
  onRunCode,
  runDisabled,
}: DSAReferenceCodeProps) {
  const isBuildMode = mode === "build"
  const hostRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onEditorCodeChange)
  const initialValueRef = useRef(editorCode)

  useEffect(() => {
    onChangeRef.current = onEditorCodeChange
  }, [onEditorCodeChange])

  useEffect(() => {
    if (!isBuildMode || !hostRef.current) {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = null
      }
      return
    }

    const theme = EditorView.theme(
      {
        "&": {
          height: "100%",
          backgroundColor: "var(--terminal-bg)",
          color: "var(--terminal-text)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "12px",
        },
        ".cm-scroller": {
          fontFamily: "JetBrains Mono, monospace",
          lineHeight: "1.55",
        },
        ".cm-content": {
          padding: "10px 0",
          caretColor: "var(--accent)",
        },
        ".cm-line": {
          padding: "0 10px",
        },
        ".cm-gutters": {
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          color: "var(--text-tertiary)",
          borderRight: "1px solid var(--border-subtle)",
        },
        ".cm-activeLine": {
          backgroundColor: "color-mix(in oklab, var(--accent) 14%, transparent)",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "color-mix(in oklab, var(--accent) 16%, transparent)",
        },
        ".cm-selectionBackground, .cm-content ::selection": {
          backgroundColor: "color-mix(in oklab, var(--accent) 24%, transparent)",
        },
        ".cm-cursor": {
          borderLeftColor: "var(--accent)",
        },
      },
      { dark: true }
    )

    const view = new EditorView({
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          basicSetup,
          theme,
          EditorView.editable.of(true),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString())
            }
          }),
        ],
      }),
      parent: hostRef.current,
    })

    editorRef.current = view

    return () => {
      view.destroy()
      editorRef.current = null
    }
  }, [isBuildMode])

  useEffect(() => {
    const view = editorRef.current
    if (!view) return

    const current = view.state.doc.toString()
    if (current === editorCode) return

    view.dispatch({
      changes: { from: 0, to: current.length, insert: editorCode },
    })
  }, [editorCode])

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-(--card-border) bg-(--terminal-bg,#0A0A0A) p-0">
      <div className="flex items-center gap-2 border-b border-border bg-white/2 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-(--danger)" />
          <span className="size-2.5 rounded-full bg-(--warning)" />
          <span className="size-2.5 rounded-full bg-(--success)" />
        </div>
        <h3 className="ml-2 m-0 font-mono text-xs font-medium text-(--text-tertiary)">{isBuildMode ? "Pseudo Code Runner" : "Reference Code"}</h3>
        {isBuildMode && (
          <Button className="ml-auto h-7.5 rounded-lg px-2.5" onClick={onRunCode} disabled={runDisabled}>
            Run Code
          </Button>
        )}
      </div>

      <div
        ref={isBuildMode ? hostRef : undefined}
        className={`flex-1 min-h-0 overflow-auto px-3 py-3.5 ${isBuildMode ? "min-h-55 p-0" : ""}`}
      >
        {!isBuildMode && (
          <div className="flex min-h-full flex-col gap-1">
            {referenceCode.map((line, index) => {
              const lineNumber = index + 1
              const active = lineNumber === activeCodeLine
              return (
                <div
                  key={`${line}-${index}`}
                  className={`grid grid-cols-[30px_1fr] gap-2.5 rounded-lg px-2 py-1.25 font-mono text-xs leading-[1.55] text-foreground ${active ? "bg-[color-mix(in_oklab,var(--accent)_16%,var(--terminal-bg,#0A0A0A))] shadow-[inset_2px_0_0_0_var(--accent)]" : ""}`}
                >
                  <span className="select-none text-right text-(--text-secondary)">{lineNumber}</span>
                  <span>{line}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
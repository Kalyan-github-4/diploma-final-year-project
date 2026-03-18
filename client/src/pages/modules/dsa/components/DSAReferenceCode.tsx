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
    <div className="dsa-card dsa-card--code">
      <div className="dsa-code-shell__header">
        <div className="dsa-code-shell__dots" aria-hidden>
          <span className="dsa-code-shell__dot dsa-code-shell__dot--red" />
          <span className="dsa-code-shell__dot dsa-code-shell__dot--yellow" />
          <span className="dsa-code-shell__dot dsa-code-shell__dot--green" />
        </div>
        <h3 className="dsa-code-shell__title">{isBuildMode ? "Pseudo Code Runner" : "Reference Code"}</h3>
        {isBuildMode && (
          <Button className="dsa-code-shell__run-btn" onClick={onRunCode} disabled={runDisabled}>
            Run Code
          </Button>
        )}
      </div>

      <div
        ref={isBuildMode ? hostRef : undefined}
        className={`dsa-code-shell__body ${isBuildMode ? "dsa-code-shell__body--editor" : ""}`}
      >
        {!isBuildMode && (
          <div className="dsa-code">
            {referenceCode.map((line, index) => {
              const lineNumber = index + 1
              const active = lineNumber === activeCodeLine
              return (
                <div key={`${line}-${index}`} className={`dsa-code__line ${active ? "dsa-code__line--active" : ""}`}>
                  <span className="dsa-code__line-number">{lineNumber}</span>
                  <span className="dsa-code__line-text">{line}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
import { motion, AnimatePresence } from "framer-motion"
import type { StackSnapshot } from "@/types/dsa.types"

interface StackVisualizerProps {
  snapshot: StackSnapshot
}

export function StackVisualizer({ snapshot }: StackVisualizerProps) {
  const { items, topIndex, lastOp, lastValue } = snapshot
  const isEmpty = items.length === 0

  const opBadge =
    lastOp === "push" && lastValue !== null
      ? { label: `push(${lastValue})`, color: "var(--success)" }
      : lastOp === "pop" && lastValue !== null
        ? { label: `pop() → ${lastValue}`, color: "var(--warning)" }
        : null

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Operation badge */}
      <div className="flex h-7 items-center">
        <AnimatePresence mode="wait">
          {opBadge && (
            <motion.span
              key={`${lastOp}-${lastValue}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold font-grotesk"
              style={{
                background: `color-mix(in oklab, ${opBadge.color} 16%, var(--bg-surface))`,
                border: `1px solid color-mix(in oklab, ${opBadge.color} 45%, var(--border-subtle))`,
                color: opBadge.color,
              }}
            >
              {opBadge.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Stack column */}
      <div className="flex flex-col-reverse items-center gap-0" style={{ minHeight: 220 }}>
        {/* TOP indicator slot (dashed when empty) */}
        <div className="flex flex-col-reverse items-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-14 w-36 items-center justify-center rounded-xl border-2 border-dashed text-[12px] text-(--text-tertiary)"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                Stack is empty
              </motion.div>
            ) : (
              [...items].reverse().map((val, reversedIdx) => {
                const actualIdx = items.length - 1 - reversedIdx
                const isTop = actualIdx === topIndex
                const isNew = lastOp === "push" && lastValue === val && isTop

                return (
                  <motion.div
                    key={`${actualIdx}-${val}`}
                    layout
                    initial={isNew ? { opacity: 0, y: -24, scale: 0.92 } : { opacity: 1 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.88 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="relative flex h-12 w-36 items-center justify-between rounded-xl border-2 px-4 transition-colors duration-200"
                    style={{
                      background: isTop
                        ? "color-mix(in oklab, var(--warning) 22%, var(--bg-surface))"
                        : "var(--bg-surface)",
                      borderColor: isTop
                        ? "var(--warning)"
                        : "color-mix(in oklab, var(--border-subtle) 80%, transparent)",
                      boxShadow: isTop
                        ? "0 0 12px color-mix(in oklab, var(--warning) 28%, transparent)"
                        : "none",
                    }}
                  >
                    <span
                      className="text-[18px] font-bold font-grotesk"
                      style={{ color: isTop ? "var(--warning)" : "var(--text-primary)" }}
                    >
                      {val}
                    </span>
                    {isTop && (
                      <motion.span
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-semibold uppercase tracking-widest font-grotesk"
                        style={{ color: "var(--warning)" }}
                      >
                        TOP
                      </motion.span>
                    )}
                    {!isTop && (
                      <span className="text-[10px] text-(--text-tertiary) font-grotesk">
                        [{actualIdx}]
                      </span>
                    )}
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom label */}
      <div className="flex w-36 items-center justify-center gap-2">
        <div className="h-px flex-1 bg-(--border-subtle)" />
        <span className="text-[10px] uppercase tracking-widest text-(--text-tertiary) font-grotesk">bottom</span>
        <div className="h-px flex-1 bg-(--border-subtle)" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
          style={{
            background: "color-mix(in oklab, var(--warning) 22%, var(--bg-surface))",
            border: "1px solid var(--warning)",
            color: "var(--text-secondary)",
          }}
        >
          Top (active)
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          In stack
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
          style={{
            background: "color-mix(in oklab, var(--success) 16%, var(--bg-surface))",
            border: "1px solid color-mix(in oklab, var(--success) 45%, var(--border-subtle))",
            color: "var(--text-secondary)",
          }}
        >
          push(x)
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
          style={{
            background: "color-mix(in oklab, var(--warning) 16%, var(--bg-surface))",
            border: "1px solid color-mix(in oklab, var(--warning) 45%, var(--border-subtle))",
            color: "var(--text-secondary)",
          }}
        >
          pop()
        </span>
      </div>
    </div>
  )
}

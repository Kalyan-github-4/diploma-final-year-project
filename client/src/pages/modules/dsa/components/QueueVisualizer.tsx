import { motion, AnimatePresence } from "framer-motion"
import type { QueueSnapshot } from "@/types/dsa.types"

interface QueueVisualizerProps {
  snapshot: QueueSnapshot
}

export function QueueVisualizer({ snapshot }: QueueVisualizerProps) {
  const { items, lastOp, lastValue } = snapshot
  const isEmpty = items.length === 0

  const opBadge =
    lastOp === "enqueue" && lastValue !== null
      ? { label: `enqueue(${lastValue})`, color: "var(--success)" }
      : lastOp === "dequeue" && lastValue !== null
        ? { label: `dequeue() → ${lastValue}`, color: "var(--warning)" }
        : null

  return (
    <div className="flex w-full flex-col items-center gap-4">
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

      {/* Flow direction labels */}
      <div className="flex w-full max-w-[480px] items-center justify-between px-2 text-[10px] uppercase tracking-widest text-(--text-tertiary) font-grotesk">
        <span style={{ color: "var(--warning)" }}>← dequeue</span>
        <span style={{ color: "var(--accent)" }}>enqueue →</span>
      </div>

      {/* Queue row */}
      <div className="flex min-h-[72px] w-full max-w-[480px] items-center justify-center overflow-x-auto px-2">
        <AnimatePresence mode="popLayout">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-14 w-48 items-center justify-center rounded-xl border-2 border-dashed text-[12px] text-(--text-tertiary)"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              Queue is empty
            </motion.div>
          ) : (
            <div className="flex items-center gap-0">
              {items.map((val, idx) => {
                const isFront = idx === 0
                const isRear = idx === items.length - 1
                const isNew = lastOp === "enqueue" && lastValue === val && isRear

                const borderColor = isFront
                  ? "var(--warning)"
                  : isRear
                    ? "var(--accent)"
                    : "color-mix(in oklab, var(--border-subtle) 80%, transparent)"

                const bg = isFront
                  ? "color-mix(in oklab, var(--warning) 22%, var(--bg-surface))"
                  : isRear && items.length > 1
                    ? "color-mix(in oklab, var(--accent) 16%, var(--bg-surface))"
                    : "var(--bg-surface)"

                const textColor = isFront
                  ? "var(--warning)"
                  : isRear && items.length > 1
                    ? "var(--accent)"
                    : "var(--text-primary)"

                return (
                  <div key={`${idx}-${val}`} className="flex items-center">
                    <motion.div
                      layout
                      initial={isNew ? { opacity: 0, x: 28, scale: 0.88 } : { opacity: 1 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -28, scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border-2 transition-colors duration-200"
                        style={{
                          background: bg,
                          borderColor,
                          boxShadow: isFront
                            ? "0 0 12px color-mix(in oklab, var(--warning) 28%, transparent)"
                            : isRear && items.length > 1
                              ? "0 0 12px color-mix(in oklab, var(--accent) 22%, transparent)"
                              : "none",
                        }}
                      >
                        <span
                          className="text-[18px] font-bold font-grotesk"
                          style={{ color: textColor }}
                        >
                          {val}
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wider font-grotesk"
                        style={{
                          color: isFront
                            ? "var(--warning)"
                            : isRear && items.length > 1
                              ? "var(--accent)"
                              : "var(--text-tertiary)",
                        }}
                      >
                        {isFront ? "front" : isRear ? "rear" : `[${idx}]`}
                      </span>
                    </motion.div>

                    {/* Arrow connector between items */}
                    {idx < items.length - 1 && (
                      <span className="mx-1 text-[12px] text-(--text-tertiary)">→</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
          style={{
            background: "color-mix(in oklab, var(--warning) 22%, var(--bg-surface))",
            border: "1px solid var(--warning)",
            color: "var(--text-secondary)",
          }}
        >
          Front (exits here)
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
          style={{
            background: "color-mix(in oklab, var(--accent) 16%, var(--bg-surface))",
            border: "1px solid var(--accent)",
            color: "var(--text-secondary)",
          }}
        >
          Rear (enters here)
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] leading-none"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-secondary)",
          }}
        >
          In queue
        </span>
      </div>
    </div>
  )
}

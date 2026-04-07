import type { QueueStep, QueueSnapshot, ComplexityMeta, StepQuestion } from "@/types/dsa.types"

export const QUEUE_DEFAULT_OPS: Array<{ op: "enqueue" | "dequeue"; value?: number }> = [
  { op: "enqueue", value: 5 },
  { op: "enqueue", value: 3 },
  { op: "enqueue", value: 8 },
  { op: "enqueue", value: 1 },
  { op: "dequeue" },
  { op: "dequeue" },
  { op: "enqueue", value: 6 },
  { op: "dequeue" },
]

export const QUEUE_COMPLEXITY: ComplexityMeta = {
  timeBest: "O(1)",
  timeAverage: "O(1)",
  timeWorst: "O(1)",
  space: "O(n)",
  note: "Enqueue at rear and dequeue at front are both O(1).",
}

export const QUEUE_REFERENCE_CODE = [
  "class Queue {",
  "  constructor() { this.items = [] }",
  "  enqueue(value) {",
  "    this.items.push(value)",
  "  }",
  "  dequeue() {",
  "    return this.items.shift()",
  "  }",
  "  peek() {",
  "    return this.items[0]",
  "  }",
  "  isEmpty() { return this.items.length === 0 }",
  "}",
]

export function getQueueOpLabel(op: { op: "enqueue" | "dequeue"; value?: number }, index: number): string {
  return op.op === "enqueue" ? `[${index + 1}] enqueue(${op.value})` : `[${index + 1}] dequeue()`
}

function createSnapshot(
  items: number[],
  lastOp: QueueSnapshot["lastOp"],
  lastValue: number | null
): QueueSnapshot {
  return {
    items: [...items],
    frontIndex: items.length > 0 ? 0 : null,
    rearIndex: items.length > 0 ? items.length - 1 : null,
    lastOp,
    lastValue,
  }
}

interface GenerateQueueStepsResult {
  steps: QueueStep[]
  finalItems: number[]
}

export type QueueOp = { op: "enqueue" | "dequeue"; value?: number }

export function parseQueueOps(input: string): QueueOp[] | null {
  const raw = input.split(",").map((s) => s.trim()).filter(Boolean)
  if (!raw.length) return null
  const ops: QueueOp[] = []
  for (const token of raw) {
    const enqueueMatch = token.match(/^enqueue\s+(\d+)$/i)
    if (enqueueMatch) {
      ops.push({ op: "enqueue", value: Number(enqueueMatch[1]) })
      continue
    }
    if (/^dequeue$/i.test(token)) {
      ops.push({ op: "dequeue" })
      continue
    }
    return null // invalid token
  }
  return ops
}

export function generateQueueSteps(customOps?: QueueOp[]): GenerateQueueStepsResult {
  const ops = customOps ?? QUEUE_DEFAULT_OPS
  const steps: QueueStep[] = []
  const items: number[] = []

  const pushStep = (
    type: QueueStep["type"],
    description: string,
    codeLine: number,
    lastOp: QueueSnapshot["lastOp"],
    lastValue: number | null,
    question?: StepQuestion
  ) => {
    steps.push({
      id: `queue-step-${steps.length + 1}`,
      algorithm: "queue",
      type,
      description,
      codeLine,
      snapshot: createSnapshot(items, lastOp, lastValue),
      question,
    })
  }

  pushStep("init", "Queue initialized. It is empty — ready for operations.", 1, null, null)

  for (const operation of ops) {
    if (operation.op === "enqueue" && operation.value !== undefined) {
      const val = operation.value
      items.push(val)

      const enqueueQuestion: StepQuestion = {
        text: `enqueue(${val}) is called. Where does ${val} go in the queue?`,
        options: [
          "At the rear (back)",
          "At the front",
          "In the middle",
          "Replaces the front",
        ],
        correct: 0,
        explanation: `enqueue always adds to the rear. FIFO — first in, first out means new items wait at the back.`,
      }

      pushStep(
        "enqueue",
        `enqueue(${val}) — add ${val} to the rear. Queue size: ${items.length}.`,
        3,
        "enqueue",
        val,
        enqueueQuestion
      )
    } else if (operation.op === "dequeue") {
      if (items.length === 0) {
        pushStep("dequeue", "dequeue() called on empty queue — nothing to remove.", 6, "dequeue", null)
        continue
      }

      const removed = items[0]
      const nextFront = items.length >= 2 ? items[1] : null

      const dequeueQuestion: StepQuestion = {
        text: `dequeue() is called. Which value is removed?`,
        options: [
          String(removed),
          String(items[items.length - 1]),
          nextFront !== null ? String(nextFront) : "nothing",
          "A random element",
        ],
        correct: 0,
        explanation: `dequeue() removes the front element (${removed}). FIFO — the first item in is always the first out.`,
      }

      items.shift()

      pushStep(
        "dequeue",
        `dequeue() — remove ${removed} from the front. Queue size: ${items.length}.`,
        6,
        "dequeue",
        removed,
        dequeueQuestion
      )
    }
  }

  pushStep(
    "complete",
    `Operations complete. Final queue (front→rear): [${items.join(", ") || "empty"}]`,
    12,
    null,
    null
  )

  return { steps, finalItems: items }
}

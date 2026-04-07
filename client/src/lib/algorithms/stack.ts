import type { StackStep, StackSnapshot, ComplexityMeta, StepQuestion } from "@/types/dsa.types"

export const STACK_DEFAULT_OPS: Array<{ op: "push" | "pop"; value?: number }> = [
  { op: "push", value: 5 },
  { op: "push", value: 3 },
  { op: "push", value: 8 },
  { op: "push", value: 1 },
  { op: "pop" },
  { op: "pop" },
  { op: "push", value: 6 },
  { op: "pop" },
]

export const STACK_COMPLEXITY: ComplexityMeta = {
  timeBest: "O(1)",
  timeAverage: "O(1)",
  timeWorst: "O(1)",
  space: "O(n)",
  note: "Push and pop are always O(1) — only the top is ever touched.",
}

export const STACK_REFERENCE_CODE = [
  "class Stack {",
  "  constructor() { this.items = [] }",
  "  push(value) {",
  "    this.items.push(value)",
  "  }",
  "  pop() {",
  "    return this.items.pop()",
  "  }",
  "  peek() {",
  "    return this.items[this.items.length - 1]",
  "  }",
  "  isEmpty() { return this.items.length === 0 }",
  "}",
]

export function getStackOpLabel(op: { op: "push" | "pop"; value?: number }, index: number): string {
  return op.op === "push" ? `[${index + 1}] push(${op.value})` : `[${index + 1}] pop()`
}

function createSnapshot(
  items: number[],
  lastOp: StackSnapshot["lastOp"],
  lastValue: number | null
): StackSnapshot {
  return {
    items: [...items],
    topIndex: items.length > 0 ? items.length - 1 : null,
    lastOp,
    lastValue,
  }
}

interface GenerateStackStepsResult {
  steps: StackStep[]
  finalItems: number[]
}

export type StackOp = { op: "push" | "pop"; value?: number }

export function parseStackOps(input: string): StackOp[] | null {
  const raw = input.split(",").map((s) => s.trim()).filter(Boolean)
  if (!raw.length) return null
  const ops: StackOp[] = []
  for (const token of raw) {
    const pushMatch = token.match(/^push\s+(\d+)$/i)
    if (pushMatch) {
      ops.push({ op: "push", value: Number(pushMatch[1]) })
      continue
    }
    if (/^pop$/i.test(token)) {
      ops.push({ op: "pop" })
      continue
    }
    return null // invalid token
  }
  return ops
}

export function generateStackSteps(customOps?: StackOp[]): GenerateStackStepsResult {
  const ops = customOps ?? STACK_DEFAULT_OPS
  const steps: StackStep[] = []
  const items: number[] = []

  const pushStep = (
    type: StackStep["type"],
    description: string,
    codeLine: number,
    lastOp: StackSnapshot["lastOp"],
    lastValue: number | null,
    question?: StepQuestion
  ) => {
    steps.push({
      id: `stack-step-${steps.length + 1}`,
      algorithm: "stack",
      type,
      description,
      codeLine,
      snapshot: createSnapshot(items, lastOp, lastValue),
      question,
    })
  }

  pushStep("init", "Stack initialized. It is empty — ready for operations.", 1, null, null)

  for (const operation of ops) {
    if (operation.op === "push" && operation.value !== undefined) {
      const val = operation.value
      const stackBefore = [...items]
      items.push(val)

      const pushQuestion: StepQuestion = {
        text: `push(${val}) is called. What is now on top of the stack?`,
        options: [
          String(val),
          stackBefore.length > 0 ? String(stackBefore[stackBefore.length - 1]) : "nothing",
          "The bottom element",
          "undefined",
        ],
        correct: 0,
        explanation: `push(${val}) adds ${val} to the top. The stack is LIFO — the last item pushed is always on top.`,
      }

      pushStep(
        "push",
        `push(${val}) — add ${val} to the top. Stack size: ${items.length}.`,
        3,
        "push",
        val,
        pushQuestion
      )
    } else if (operation.op === "pop") {
      if (items.length === 0) {
        pushStep("pop", "pop() called on empty stack — nothing to remove.", 6, "pop", null)
        continue
      }

      const popped = items[items.length - 1]
      const nextTop = items.length >= 2 ? items[items.length - 2] : null

      const popQuestion: StepQuestion = {
        text: `pop() is called. Which value is removed?`,
        options: [
          String(popped),
          String(items[0]),
          nextTop !== null ? String(nextTop) : "nothing",
          "A random element",
        ],
        correct: 0,
        explanation: `pop() removes the top element (${popped}). LIFO — last in, first out.`,
      }

      items.pop()

      pushStep(
        "pop",
        `pop() — remove ${popped} from the top. Stack size: ${items.length}.`,
        6,
        "pop",
        popped,
        popQuestion
      )
    }
  }

  pushStep(
    "complete",
    `Operations complete. Final stack (bottom→top): [${items.join(", ") || "empty"}]`,
    12,
    null,
    null
  )

  return { steps, finalItems: items }
}

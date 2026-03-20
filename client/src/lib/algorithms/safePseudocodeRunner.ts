import type { BinarySearchStep, BinarySearchSnapshot, DSAAlgorithm, DSAStep } from "@/types/dsa.types"

const MAX_EXECUTION_STEPS = 200
const MAX_EXECUTION_MS = 1500

interface RunBinarySearchInput {
  source: string
  array: number[]
  target: number
}

interface RunBinarySearchOutput {
  ok: boolean
  steps: DSAStep[]
  resultIndex: number
  error?: string
  safetyStopped?: boolean
}

type BinaryStatementType =
  | "ASSIGN_LOW_ZERO"
  | "ASSIGN_HIGH_LAST"
  | "WHILE_LE"
  | "ENDWHILE"
  | "ASSIGN_MID"
  | "IF_EQ"
  | "IF_LT"
  | "ELSE"
  | "ENDIF"
  | "ASSIGN_LOW_MID_PLUS"
  | "ASSIGN_HIGH_MID_MINUS"
  | "RETURN_MID"
  | "RETURN_MINUS_ONE"

interface BinaryStatement {
  type: BinaryStatementType
  line: number
  text: string
}

interface IfMeta {
  elseIndex: number | null
  endIfIndex: number
}

function createBinarySnapshot(
  array: number[],
  target: number,
  low: number,
  high: number,
  mid: number | null,
  foundIndex: number | null
): BinarySearchSnapshot {
  const focusIndices = [low, high, mid]
    .filter((value): value is number => value !== null)
    .filter((value, index, items) => value >= 0 && value < array.length && items.indexOf(value) === index)

  return {
    array: [...array],
    target,
    low,
    high,
    mid,
    focusIndices,
    foundIndex,
  }
}

function hasUnsafeToken(source: string): string | null {
  const blockedTokens = [
    /\b(eval|Function|import|require|fetch|XMLHttpRequest|axios|document|window|localStorage|sessionStorage)\b/i,
    /\b(delete|drop|truncate|alter|insert|update)\b/i,
    /<\s*script/i,
    /while\s*\(\s*true\s*\)/i,
  ]

  for (const pattern of blockedTokens) {
    if (pattern.test(source)) {
      return "Unsafe token detected. Only constrained pseudocode commands are allowed."
    }
  }

  return null
}

function normalizeLines(source: string): { text: string; line: number }[] {
  return source
    .split(/\r?\n/)
    .map((text, index) => ({ text: text.replace(/\/\/.*$/, "").trim(), line: index + 1 }))
    .filter((entry) => entry.text.length > 0)
}

function parseBinaryStatement(text: string, line: number): BinaryStatement | null {
  const normalized = text.replace(/;+$/, "").trim().toLowerCase()

  if (/^(let|const|var)?\s*low\s*=\s*0$/.test(normalized)) return { type: "ASSIGN_LOW_ZERO", line, text }
  if (/^(let|const|var)?\s*high\s*=\s*arr\.length\s*-\s*1$/.test(normalized)) return { type: "ASSIGN_HIGH_LAST", line, text }
  if (/^while\s*\(?\s*low\s*<=\s*high\s*\)?\s*(do)?\s*\{?$/.test(normalized)) return { type: "WHILE_LE", line, text }
  if (/^(endwhile|end\s+while|done)$/.test(normalized)) return { type: "ENDWHILE", line, text }
  if (/^(let|const|var)?\s*mid\s*=\s*(math\.)?floor\s*\(\s*\(\s*low\s*\+\s*high\s*\)\s*\/\s*2\s*\)$/.test(normalized)) {
    return { type: "ASSIGN_MID", line, text }
  }
  if (/^if\s*\(?\s*arr\s*\[\s*mid\s*\]\s*(==|===)\s*target\s*\)?\s*(then)?\s*\{?$/.test(normalized)) return { type: "IF_EQ", line, text }
  if (/^if\s*\(?\s*arr\s*\[\s*mid\s*\]\s*<\s*target\s*\)?\s*(then)?\s*\{?$/.test(normalized)) return { type: "IF_LT", line, text }
  if (/^else\s*\{?$/.test(normalized)) return { type: "ELSE", line, text }
  if (/^(endif|end\s+if)$/.test(normalized)) return { type: "ENDIF", line, text }
  if (/^(let|const|var)?\s*low\s*=\s*mid\s*\+\s*1$/.test(normalized)) return { type: "ASSIGN_LOW_MID_PLUS", line, text }
  if (/^(let|const|var)?\s*high\s*=\s*mid\s*-\s*1$/.test(normalized)) return { type: "ASSIGN_HIGH_MID_MINUS", line, text }
  if (/^return\s+mid$/.test(normalized)) return { type: "RETURN_MID", line, text }
  if (/^return\s*\(?\s*-1\s*\)?$/.test(normalized)) return { type: "RETURN_MINUS_ONE", line, text }

  return null
}

function compileBinaryStatements(source: string): { ok: true; statements: BinaryStatement[] } | { ok: false; error: string } {
  const normalizedLines = normalizeLines(source)
  const statements: BinaryStatement[] = []
  const blockStack: Array<"WHILE" | "IF"> = []

  for (const entry of normalizedLines) {
    const raw = entry.text.replace(/;+$/, "").trim()
    const lowered = raw.toLowerCase()

    if (lowered === "{") {
      continue
    }

    if (/^}\s*else\b/i.test(raw)) {
      if (blockStack[blockStack.length - 1] !== "IF") {
        return {
          ok: false,
          error: `Line ${entry.line} has '} else' without an open IF block.`,
        }
      }

      statements.push({ type: "ELSE", line: entry.line, text: entry.text })
      continue
    }

    if (lowered === "}") {
      const top = blockStack.pop()
      if (!top) {
        return {
          ok: false,
          error: `Line ${entry.line} has an unmatched closing brace '}'.`,
        }
      }

      statements.push({
        type: top === "IF" ? "ENDIF" : "ENDWHILE",
        line: entry.line,
        text: entry.text,
      })
      continue
    }

    if (/^else\s+if\b/i.test(raw)) {
      return {
        ok: false,
        error: `Line ${entry.line}: 'else if' is not supported yet. Use ELSE then IF on next line.`,
      }
    }

    const statement = parseBinaryStatement(entry.text, entry.line)
    if (!statement) {
      return {
        ok: false,
        error: `Line ${entry.line} is not valid pseudocode for this runner. Supported forms include while(low <= high), if(arr[mid] === target), Math.floor(...), and brace or ENDIF/ENDWHILE blocks.`,
      }
    }

    if (statement.type === "WHILE_LE") {
      blockStack.push("WHILE")
    }

    if (statement.type === "IF_EQ" || statement.type === "IF_LT") {
      blockStack.push("IF")
    }

    if (statement.type === "ELSE" && blockStack[blockStack.length - 1] !== "IF") {
      return {
        ok: false,
        error: `Line ${entry.line}: ELSE must be inside an IF block.`,
      }
    }

    if (statement.type === "ENDIF") {
      const top = blockStack.pop()
      if (top !== "IF") {
        return {
          ok: false,
          error: `Line ${entry.line}: ENDIF has no matching IF.`,
        }
      }
    }

    if (statement.type === "ENDWHILE") {
      const top = blockStack.pop()
      if (top !== "WHILE") {
        return {
          ok: false,
          error: `Line ${entry.line}: ENDWHILE has no matching WHILE.`,
        }
      }
    }

    statements.push(statement)
  }

  if (blockStack.length > 0) {
    const pending = blockStack[blockStack.length - 1]
    return {
      ok: false,
      error: pending === "IF" ? "Missing ENDIF or closing '}' for IF block." : "Missing ENDWHILE or closing '}' for WHILE block.",
    }
  }

  if (!statements.length) {
    return { ok: false, error: "Code editor is empty." }
  }

  return { ok: true, statements }
}

function buildControlFlowMaps(statements: BinaryStatement[]): {
  ok: true
  whileToEnd: Map<number, number>
  endToWhile: Map<number, number>
  ifMeta: Map<number, IfMeta>
} | { ok: false; error: string } {
  const whileStack: number[] = []
  const ifStack: number[] = []
  const whileToEnd = new Map<number, number>()
  const endToWhile = new Map<number, number>()
  const ifMeta = new Map<number, IfMeta>()

  for (let index = 0; index < statements.length; index += 1) {
    const statement = statements[index]

    if (statement.type === "WHILE_LE") {
      whileStack.push(index)
      continue
    }

    if (statement.type === "ENDWHILE") {
      const whileIndex = whileStack.pop()
      if (whileIndex === undefined) {
        return { ok: false, error: `Line ${statement.line}: ENDWHILE has no matching WHILE.` }
      }
      whileToEnd.set(whileIndex, index)
      endToWhile.set(index, whileIndex)
      continue
    }

    if (statement.type === "IF_EQ" || statement.type === "IF_LT") {
      ifStack.push(index)
      ifMeta.set(index, { elseIndex: null, endIfIndex: -1 })
      continue
    }

    if (statement.type === "ELSE") {
      const currentIfIndex = ifStack[ifStack.length - 1]
      if (currentIfIndex === undefined) {
        return { ok: false, error: `Line ${statement.line}: ELSE has no matching IF.` }
      }
      const existing = ifMeta.get(currentIfIndex)
      if (!existing) {
        return { ok: false, error: `Line ${statement.line}: Invalid IF/ELSE structure.` }
      }
      ifMeta.set(currentIfIndex, { ...existing, elseIndex: index })
      continue
    }

    if (statement.type === "ENDIF") {
      const ifIndex = ifStack.pop()
      if (ifIndex === undefined) {
        return { ok: false, error: `Line ${statement.line}: ENDIF has no matching IF.` }
      }
      const existing = ifMeta.get(ifIndex)
      if (!existing) {
        return { ok: false, error: `Line ${statement.line}: Invalid IF/ENDIF structure.` }
      }
      ifMeta.set(ifIndex, { ...existing, endIfIndex: index })
    }
  }

  if (whileStack.length) {
    const index = whileStack[whileStack.length - 1]
    return { ok: false, error: `Line ${statements[index].line}: WHILE is missing ENDWHILE.` }
  }

  if (ifStack.length) {
    const index = ifStack[ifStack.length - 1]
    return { ok: false, error: `Line ${statements[index].line}: IF is missing ENDIF.` }
  }

  return {
    ok: true,
    whileToEnd,
    endToWhile,
    ifMeta,
  }
}

export function getDefaultPseudocode(algorithm: DSAAlgorithm): string {
  if (algorithm === "binary-search") {
    return [
      "low = 0",
      "high = arr.length - 1",
      "while low <= high",
      "  mid = floor((low + high) / 2)",
      "  if arr[mid] == target",
      "    return mid",
      "  endif",
      "  if arr[mid] < target",
      "    low = mid + 1",
      "  else",
      "    high = mid - 1",
      "  endif",
      "endwhile",
      "return -1",
    ].join("\n")
  }

  return [
    "// Bubble Sort code mode is coming next.",
    "// For now, switch to Binary Search to run custom pseudocode.",
  ].join("\n")
}

export function runSafeBinarySearchPseudocode({ source, array, target }: RunBinarySearchInput): RunBinarySearchOutput {
  const unsafeReason = hasUnsafeToken(source)
  if (unsafeReason) {
    return {
      ok: false,
      steps: [],
      resultIndex: -1,
      error: unsafeReason,
      safetyStopped: true,
    }
  }

  const compiled = compileBinaryStatements(source)
  if (!compiled.ok) {
    return {
      ok: false,
      steps: [],
      resultIndex: -1,
      error: compiled.error,
    }
  }

  const controlFlow = buildControlFlowMaps(compiled.statements)
  if (!controlFlow.ok) {
    return {
      ok: false,
      steps: [],
      resultIndex: -1,
      error: controlFlow.error,
    }
  }

  let low = 0
  let high = array.length - 1
  let mid: number | null = null
  let foundIndex: number | null = null

  const steps: BinarySearchStep[] = []
  let pc = 0
  let executionSteps = 0
  const startTime = Date.now()

  const pushStep = (
    type: BinarySearchStep["type"],
    description: string,
    codeLine: number,
    currentMid: number | null,
    currentFoundIndex: number | null
  ) => {
    steps.push({
      id: `binary-custom-step-${steps.length + 1}`,
      algorithm: "binary-search",
      type,
      description,
      codeLine,
      snapshot: createBinarySnapshot(array, target, low, high, currentMid, currentFoundIndex),
    })
  }

  while (pc < compiled.statements.length) {
    executionSteps += 1

    if (executionSteps > MAX_EXECUTION_STEPS || Date.now() - startTime > MAX_EXECUTION_MS) {
      return {
        ok: false,
        steps,
        resultIndex: -1,
        error: "Execution stopped for safety: possible infinite loop or too many operations.",
        safetyStopped: true,
      }
    }

    const statement = compiled.statements[pc]

    switch (statement.type) {
      case "ASSIGN_LOW_ZERO":
        low = 0
        pushStep("init", "Set low = 0", statement.line, mid, foundIndex)
        pc += 1
        break

      case "ASSIGN_HIGH_LAST":
        high = array.length - 1
        pushStep("init", "Set high = arr.length - 1", statement.line, mid, foundIndex)
        pc += 1
        break

      case "WHILE_LE": {
        const condition = low <= high
        pushStep("compare", `Check while condition: ${low} <= ${high} is ${condition ? "true" : "false"}`, statement.line, mid, foundIndex)
        if (condition) {
          pc += 1
        } else {
          const endIndex = controlFlow.whileToEnd.get(pc)
          if (endIndex === undefined) {
            return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: WHILE mapping failed.` }
          }
          pc = endIndex + 1
        }
        break
      }

      case "ENDWHILE": {
        const whileIndex = controlFlow.endToWhile.get(pc)
        if (whileIndex === undefined) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: ENDWHILE mapping failed.` }
        }
        pc = whileIndex
        break
      }

      case "ASSIGN_MID":
        mid = Math.floor((low + high) / 2)
        pushStep("compare", `Compute mid = floor((${low} + ${high}) / 2) = ${mid}`, statement.line, mid, foundIndex)
        pc += 1
        break

      case "IF_EQ": {
        if (mid === null || mid < 0 || mid >= array.length) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: mid is invalid before equality check.` }
        }
        const isEqual = array[mid] === target
        pushStep("compare", `Check arr[mid] == target: ${array[mid]} == ${target} is ${isEqual ? "true" : "false"}`, statement.line, mid, foundIndex)
        if (isEqual) {
          pc += 1
        } else {
          const meta = controlFlow.ifMeta.get(pc)
          if (!meta) {
            return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: IF mapping failed.` }
          }
          pc = meta.endIfIndex + 1
        }
        break
      }

      case "IF_LT": {
        if (mid === null || mid < 0 || mid >= array.length) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: mid is invalid before comparison.` }
        }
        const isLess = array[mid] < target
        pushStep("compare", `Check arr[mid] < target: ${array[mid]} < ${target} is ${isLess ? "true" : "false"}`, statement.line, mid, foundIndex)
        const meta = controlFlow.ifMeta.get(pc)
        if (!meta) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: IF mapping failed.` }
        }

        if (isLess) {
          pc += 1
        } else if (meta.elseIndex !== null) {
          pc = meta.elseIndex + 1
        } else {
          pc = meta.endIfIndex + 1
        }
        break
      }

      case "ELSE": {
        const owner = [...controlFlow.ifMeta.entries()].find(([, meta]) => meta.elseIndex === pc)
        if (!owner) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: ELSE mapping failed.` }
        }
        pc = owner[1].endIfIndex + 1
        break
      }

      case "ENDIF":
        pc += 1
        break

      case "ASSIGN_LOW_MID_PLUS":
        if (mid === null) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: mid is not initialized.` }
        }
        low = mid + 1
        pushStep("move-right", `Move low to mid + 1 => ${low}`, statement.line, mid, foundIndex)
        pc += 1
        break

      case "ASSIGN_HIGH_MID_MINUS":
        if (mid === null) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: mid is not initialized.` }
        }
        high = mid - 1
        pushStep("move-left", `Move high to mid - 1 => ${high}`, statement.line, mid, foundIndex)
        pc += 1
        break

      case "RETURN_MID":
        if (mid === null) {
          return { ok: false, steps, resultIndex: -1, error: `Line ${statement.line}: mid is not initialized before return.` }
        }
        foundIndex = mid
        pushStep("found", `Return mid => ${mid}`, statement.line, mid, foundIndex)
        return {
          ok: true,
          steps,
          resultIndex: mid,
        }

      case "RETURN_MINUS_ONE":
        pushStep("not-found", "Return -1 (target not found)", statement.line, mid, foundIndex)
        return {
          ok: true,
          steps,
          resultIndex: -1,
        }

      default:
        return {
          ok: false,
          steps,
          resultIndex: -1,
          error: `Unsupported statement at line ${statement.line}.`,
        }
    }
  }

  return {
    ok: false,
    steps,
    resultIndex: -1,
    error: "Program terminated without a return statement.",
  }
}

import type { RequiredProperty } from "../types"

/** Parse a raw CSS string into Map<selector, Map<property, value>> */
function parseCss(css: string): Map<string, Map<string, string>> {
  const rules = new Map<string, Map<string, string>>()

  // Remove comments
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, "")

  // Match selector { declarations }
  const blockRegex = /([^{@]+)\{([^}]*)\}/g
  let block: RegExpExecArray | null

  while ((block = blockRegex.exec(cleaned)) !== null) {
    const selector = block[1].trim().toLowerCase()
    const body = block[2]

    if (!rules.has(selector)) {
      rules.set(selector, new Map())
    }
    const props = rules.get(selector)!

    const declRegex = /([\w-]+)\s*:\s*([^;]+)/g
    let decl: RegExpExecArray | null
    while ((decl = declRegex.exec(body)) !== null) {
      const prop = decl[1].trim().toLowerCase()
      const val = decl[2].trim().toLowerCase().replace(/\s+/g, " ")
      props.set(prop, val)
    }
  }

  return rules
}

/** Normalize a CSS value for loose comparison */
function norm(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, " ")
}

/**
 * Returns a 0-100 match percentage between userCss and the required properties.
 * Each required property counts equally toward the score.
 */
export function validateCss(userCss: string, required: RequiredProperty[]): number {
  if (required.length === 0) return 100

  const rules = parseCss(userCss)
  let matched = 0

  for (const req of required) {
    const selectorKey = req.selector.trim().toLowerCase()
    const propKey = req.property.trim().toLowerCase()

    const props = rules.get(selectorKey)
    if (!props) continue

    const userVal = props.get(propKey)
    if (userVal === undefined) continue

    const accepted = Array.isArray(req.value) ? req.value : [req.value]
    const match = accepted.some((v) => norm(v) === norm(userVal))
    if (match) matched++
  }

  return Math.round((matched / required.length) * 100)
}

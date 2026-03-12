"use client"

import React, { useRef, useEffect,  } from "react"
import type { CSSProperties } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { PokemonLevel } from "../levels/pokemonLevels"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── Helpers ─────────────────────────────────────────────

/** camelCase → kebab-case */
function toKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

/** Check whether an element's computed flex styles match every target entry */
function stylesMatch(
  element: HTMLElement,
  targets: PokemonLevel["targetStyles"],
): boolean {
  const computed = getComputedStyle(element)
  return Object.entries(targets).every(([key, value]) => {
    return computed.getPropertyValue(toKebab(key)).trim() === value
  })
}

// ─── Props ───────────────────────────────────────────────

interface BattleArenaProps {
  cssInput: string
  level: PokemonLevel
  isComplete: boolean
  onVictory: () => void
}

// ─── Sub-components ──────────────────────────────────────

/** Target overlay — shows where Pokémon are positioned (the goal) */
function PokemonOverlay({ level }: Readonly<{ level: PokemonLevel }>) {
  return (
    <div
      className="absolute inset-0 flex pointer-events-none z-10"
      style={level.targetStyles as CSSProperties}
    >
      <TooltipProvider>
        {level.pokemonNames.map((pokemon, i) => (
          <Tooltip key={`${pokemon.name}-${i}`}>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, type: "spring" }}
                className="relative pointer-events-auto"
              >
                <div className="relative w-12 h-12 md:w-18 md:h-18">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="object-contain"
                    draggable={false}
                  />
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{pokemon.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}

/** A single animated Pokéball inside the flex arena */
function PokeballItem({
  pokeball,
  index,
  isComplete,
}: Readonly<{
  pokeball: { name: string; image: string }
  index: number
  isComplete: boolean
}>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            delay: index * 0.15,
            type: "spring",
            y: {
              delay: index * 0.15 + 0.5,
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            },
          }}
          className="relative"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            {/* Glow */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl ${
                isComplete
                  ? "bg-green-500/40"
                  : "bg-blue-500/40 animate-pulse"
              }`}
            />
            <div className="relative w-7 h-7 md:w-12 md:h-12 z-10">
              <img
                src={pokeball.image}
                alt={pokeball.name}
                className="object-contain"
                draggable={false}
              />
            </div>
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">{pokeball.name}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/** Full-screen victory animation */
function VictoryOverlay({ level }: Readonly<{ level: PokemonLevel }>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 10 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="">
          <img src={"/double sword.png"} width={100} height={100} alt="Victory Sword" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold font-game text-green-400">
          Victory!
        </h3>
        <p className="text-sm text-green-300/70 mt-2">
          {level.pokemonNames.map((p) => p.name).join(", ")}{" "}
          {level.pokemonNames.length === 1 ? "has" : "have"} been caught!
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <img src="/Star.gif" alt="star" className="w-6 h-6" />
          <span className="text-yellow-400 font-bold">
            +{level.rewardXP} XP
          </span>
         
          <img src="/Star.gif" alt="star" className="w-6 h-6" />
        </div>
      </motion.div>
    </motion.div>
  )
}

/** Live computed-style inspector — highlights matching properties in green */
function ComputedStyleDisplay({
  arenaRef,
  cssInput,
  targetStyles,
}: Readonly<{
  arenaRef: React.RefObject<HTMLDivElement | null>
  cssInput: string
  targetStyles: PokemonLevel["targetStyles"]
}>) {
  const [styles, setStyles] = React.useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!arenaRef.current) return

      const computed = getComputedStyle(arenaRef.current)
      const result: Record<string, string> = {}

      for (const key of Object.keys(targetStyles)) {
        const val = computed[key as keyof CSSStyleDeclaration]
        result[key] =
          typeof val === "string" ? val : val != null ? String(val) : "normal"
      }

      setStyles(result)
    }, 200)

    return () => clearTimeout(timer)
  }, [cssInput, arenaRef, targetStyles])

  return (
    <div className="flex gap-4 text-xs font-mono flex-wrap">
      {Object.entries(styles).map(([key, value]) => {
        const target = targetStyles[key as keyof typeof targetStyles]
        const isMatch = target === value
        return (
          <span key={key}>
            <span className="text-muted-foreground">{toKebab(key)}: </span>
            <span className={isMatch ? "text-green-400" : "text-purple-400"}>
              {value}
            </span>
          </span>
        )
      })}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────

export default function BattleArena({
  cssInput,
  level,
  isComplete,
  onVictory,
}: Readonly<BattleArenaProps>) {
  const arenaRef = useRef<HTMLDivElement>(null)

  // Validate user CSS against target after each input change
  useEffect(() => {
    if (isComplete) return

    const timer = setTimeout(() => {
      if (arenaRef.current && stylesMatch(arenaRef.current, level.targetStyles)) {
        onVictory()
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [cssInput, level, isComplete, onVictory])

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Arena Header */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isComplete
                ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                : "bg-red-400 animate-pulse"
            }`}
          />
          <span className="text-xs uppercase text-(--text-primary)">
            Battle Arena
          </span>
        </div>
        <span className="text-xs font-grotesk text-(--text-secondary)">
          Match the Pokéball positions to the Pokémon
        </span>
      </div>

      {/* Arena Container */}
      <div className="relative flex-1 rounded-xl border border-white/10 overflow-hidden bg-linear-to-br from-gray-900 via-slate-900 to-gray-950">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Pokémon target overlay */}
        <PokemonOverlay level={level} />

        {/* Injected user CSS */}
        <style>{`
          .battle-arena {
            display: flex;
            height: 100%;
            width: 100%;
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
            ${cssInput}
          }
        `}</style>

        {/* The flex arena (Pokéballs) */}
        <div ref={arenaRef} className="battle-arena">
          <TooltipProvider>
            {level.pokeballNames.map((pokeball, i) => (
              <PokeballItem
                key={`${pokeball.name}-${i}`}
                pokeball={pokeball}
                index={i}
                isComplete={isComplete}
              />
            ))}
          </TooltipProvider>
        </div>

        {/* Victory overlay */}
        <AnimatePresence>
          {isComplete && <VictoryOverlay level={level} />}
        </AnimatePresence>
      </div>

      {/* Computed Styles Inspector */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Computed Styles
        </p>
        <ComputedStyleDisplay
          arenaRef={arenaRef}
          cssInput={cssInput}
          targetStyles={level.targetStyles}
        />
      </div>
    </div>
  )
}

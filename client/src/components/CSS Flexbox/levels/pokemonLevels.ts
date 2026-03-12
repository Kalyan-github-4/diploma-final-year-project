import type { CSSProperties } from "react"

// ─── Types ───────────────────────────────────────────────

export interface PokemonLevel {
  id: number
  title: string
  description: string
  hint: string
  category: string
  pokeballNames: {
    name: string
    image: string
  }[]
  pokemonNames: {
    name: string
    image: string
  }[]
  targetStyles: {
    justifyContent?: CSSProperties["justifyContent"]
    alignItems?: CSSProperties["alignItems"]
    flexDirection?: CSSProperties["flexDirection"]
    flexWrap?: CSSProperties["flexWrap"]
    alignContent?: CSSProperties["alignContent"]
  }
  rewardXP: number
}

// ─── Dataset ─────────────────────────────────────────────
// 20 levels teaching container-level flexbox, beginner → intermediate.
//
// Phase 1 (1–5)  : justify-content — main-axis alignment
// Phase 2 (6–7)  : align-items — cross-axis alignment
// Phase 3 (8–11) : combining justify-content + align-items
// Phase 4 (12–14): flex-direction — changing the axes
// Phase 5 (15–16): flex-wrap — multi-line layouts
// Phase 6 (17–18): align-content — multi-line row spacing
// Phase 7 (19–20): column-reverse & grand finale
// ──────────────────────────────────────────────────────────

export const pokemonLevels: PokemonLevel[] = [
  // ════════════════════════════════════════
  // Phase 1 — justify-content
  // ════════════════════════════════════════
  {
    id: 1,
    title: "Push to the Right",
    description:
      "A wild Gengar lurks on the far right! Move your Pokéball to the end of the row.",
    hint: "justify-content: flex-end pushes items to the end of the main axis.",
    category: "justify-content",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
    ],
    targetStyles: {
      justifyContent: "flex-end",
    },
    rewardXP: 10,
  },
  {
    id: 2,
    title: "Center Stage",
    description:
      "Pikachu and Eevee wait at the center. Slide your Pokéballs to meet them!",
    hint: "justify-content: center places items at the center of the main axis.",
    category: "justify-content",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
    ],
    pokemonNames: [
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
    ],
    targetStyles: {
      justifyContent: "center",
    },
    rewardXP: 10,
  },
  {
    id: 3,
    title: "Maximum Spread",
    description:
      "Three Pokémon scattered with maximum distance between them. Mirror their formation!",
    hint: "justify-content: space-between places the first and last items at the edges, with equal gaps in between.",
    category: "justify-content",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
    ],
    targetStyles: {
      justifyContent: "space-between",
    },
    rewardXP: 15,
  },
  {
    id: 4,
    title: "Cushioned Spacing",
    description:
      "Each Pokémon has equal padding on both sides. Replicate the cushioned layout!",
    hint: "justify-content: space-around gives each item equal space on both sides — edges get half-space.",
    category: "justify-content",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
    ],
    targetStyles: {
      justifyContent: "space-around",
    },
    rewardXP: 15,
  },
  {
    id: 5,
    title: "Perfect Balance",
    description:
      "All gaps — including the edges — must be identical. Achieve perfect distribution!",
    hint: "justify-content: space-evenly makes every gap exactly the same size.",
    category: "justify-content",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
    ],
    pokemonNames: [
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
    ],
    targetStyles: {
      justifyContent: "space-evenly",
    },
    rewardXP: 15,
  },

  // ════════════════════════════════════════
  // Phase 2 — align-items
  // ════════════════════════════════════════
  {
    id: 6,
    title: "Vertical Center",
    description:
      "The Pokémon hover at the vertical center of the arena. Align your Pokéballs!",
    hint: "align-items: center places items at the middle of the cross axis (vertical in a row layout).",
    category: "align-items",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
    ],
    targetStyles: {
      alignItems: "center",
    },
    rewardXP: 15,
  },
  {
    id: 7,
    title: "Drop to the Floor",
    description:
      "Snorlax and Lapras are resting at the very bottom. Bring your Pokéballs down!",
    hint: "align-items: flex-end pushes items to the end of the cross axis.",
    category: "align-items",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Lure Ball", image: "/lure ball.png" },
    ],
    pokemonNames: [
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Lapras", image: "/laprus.gif" },
    ],
    targetStyles: {
      alignItems: "flex-end",
    },
    rewardXP: 15,
  },

  // ════════════════════════════════════════
  // Phase 3 — combining properties
  // ════════════════════════════════════════
  {
    id: 8,
    title: "Dead Center",
    description:
      "The classic Flexbox centering challenge! Place items at the exact center of the arena.",
    hint: "Combine justify-content: center and align-items: center to center on both axes.",
    category: "combining",
    pokeballNames: [
      { name: "Master Ball", image: "/master ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
    ],
    pokemonNames: [
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
    ],
    targetStyles: {
      justifyContent: "center",
      alignItems: "center",
    },
    rewardXP: 20,
  },
  {
    id: 9,
    title: "Bottom-Right Corner",
    description:
      "A sneaky Gengar hides in the bottom-right corner. Corner it!",
    hint: "Push items to the end on both axes: justify-content: flex-end and align-items: flex-end.",
    category: "combining",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
    ],
    targetStyles: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    rewardXP: 20,
  },
  {
    id: 10,
    title: "Bottom Center",
    description:
      "Snorlax is napping at the bottom center. Position your Pokéballs precisely!",
    hint: "Center horizontally with justify-content, push to the bottom with align-items.",
    category: "combining",
    pokeballNames: [
      { name: "Lure Ball", image: "/lure ball.png" },
      { name: "Dive Ball", image: "/dive ball.png" },
    ],
    pokemonNames: [
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Gengar", image: "/gengar.gif" },
    ],
    targetStyles: {
      justifyContent: "center",
      alignItems: "flex-end",
    },
    rewardXP: 20,
  },
  {
    id: 11,
    title: "Spread & Center",
    description:
      "Pokémon stand vertically centered with max horizontal spread. Combine spacing and alignment!",
    hint: "justify-content: space-between for horizontal spacing, align-items: center for vertical centering.",
    category: "combining",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
    ],
    targetStyles: {
      justifyContent: "space-between",
      alignItems: "center",
    },
    rewardXP: 20,
  },

  // ════════════════════════════════════════
  // Phase 4 — flex-direction
  // ════════════════════════════════════════
  {
    id: 12,
    title: "Stack Vertically",
    description:
      "The Pokémon lined up in a column! Change the flow direction to stack your Pokéballs.",
    hint: "flex-direction: column switches the main axis from horizontal to vertical.",
    category: "flex-direction",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
    ],
    targetStyles: {
      flexDirection: "column",
    },
    rewardXP: 25,
  },
  {
    id: 13,
    title: "Column & Centered",
    description:
      "Stack the Pokémon vertically AND center them on both axes!",
    hint: "With flex-direction: column, justify-content controls the vertical axis and align-items controls the horizontal axis.",
    category: "flex-direction",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
    ],
    pokemonNames: [
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
    ],
    targetStyles: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    rewardXP: 25,
  },
  {
    id: 14,
    title: "Reverse the Row",
    description:
      "The Pokémon line up in reverse order — right to left! Mirror them!",
    hint: "flex-direction: row-reverse lays items out right-to-left instead of left-to-right.",
    category: "flex-direction",
    pokeballNames: [
      { name: "Level Ball", image: "/level ball.png" },
      { name: "Lure Ball", image: "/lure ball.png" },
      { name: "Dive Ball", image: "/dive ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Ice Ponyta", image: "/Ice Ponyta.gif" },
    ],
    targetStyles: {
      flexDirection: "row-reverse",
    },
    rewardXP: 25,
  },

  // ════════════════════════════════════════
  // Phase 5 — flex-wrap
  // ════════════════════════════════════════
  {
    id: 15,
    title: "Overflow Wrap",
    description:
      "Too many Pokémon for one row! Allow them to wrap onto new lines.",
    hint: "flex-wrap: wrap allows items to flow onto the next line when there's not enough room.",
    category: "flex-wrap",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
      { name: "Level Ball", image: "/level ball.png" },
      { name: "Lure Ball", image: "/lure ball.png" },
      { name: "Dive Ball", image: "/dive ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Ice Ponyta", image: "/Ice Ponyta.gif" },
    ],
    targetStyles: {
      flexWrap: "wrap",
      justifyContent: "center",
    },
    rewardXP: 30,
  },
  {
    id: 16,
    title: "Wrap & Center",
    description:
      "Wrap the Pokémon AND center each row vertically. Full control!",
    hint: "Combine flex-wrap: wrap with justify-content: center and align-items: center.",
    category: "flex-wrap",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
      { name: "Level Ball", image: "/level ball.png" },
      { name: "Lure Ball", image: "/lure ball.png" },
      { name: "Dive Ball", image: "/dive ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Ice Ponyta", image: "/Ice Ponyta.gif" },
    ],
    targetStyles: {
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
    },
    rewardXP: 30,
  },

  // ════════════════════════════════════════
  // Phase 6 — align-content
  // ════════════════════════════════════════
  {
    id: 17,
    title: "Cluster the Rows",
    description:
      "Multiple rows formed — pull them together into the center of the arena!",
    hint: "align-content: center clusters all wrapped rows together in the middle. Don't forget flex-wrap: wrap!",
    category: "align-content",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
      { name: "Level Ball", image: "/level ball.png" },
      { name: "Lure Ball", image: "/lure ball.png" },
      { name: "Dive Ball", image: "/dive ball.png" },
      { name: "Master Ball", image: "/master ball.png" },
      { name: "Safari Ball", image: "/safari ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Ice Ponyta", image: "/Ice Ponyta.gif" },
      { name: "Ghost", image: "/selvion.gif" },
      { name: "Gengar II", image: "/mew two.gif" },
    ],
    targetStyles: {
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "center",
    },
    rewardXP: 35,
  },
  {
    id: 18,
    title: "Spread the Rows",
    description:
      "Push the wrapped rows apart — first row at the top, last row at the bottom!",
    hint: "align-content: space-between distributes rows with maximum space between them.",
    category: "align-content",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
      { name: "Level Ball", image: "/level ball.png" },
      { name: "Lure Ball", image: "/lure ball.png" },
      { name: "Dive Ball", image: "/dive ball.png" },
      { name: "Master Ball", image: "/master ball.png" },
      { name: "Safari Ball", image: "/safari ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Ice Ponyta", image: "/Ice Ponyta.gif" },
      { name: "Ghost", image: "/selvion.gif" },
      { name: "Gengar II", image: "/mew two.gif" },
    ],
    targetStyles: {
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "space-between",
    },
    rewardXP: 35,
  },

  // ════════════════════════════════════════
  // Phase 7 — column-reverse & grand finale
  // ════════════════════════════════════════
  {
    id: 19,
    title: "Reverse Column",
    description:
      "The Pokémon stacked bottom-to-top! Flip your column to match them.",
    hint: "flex-direction: column-reverse stacks items from bottom to top.",
    category: "flex-direction",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
      { name: "Level Ball", image: "/level ball.png" },
    ],
    pokemonNames: [
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Gengar", image: "/gengar.gif" },
    ],
    targetStyles: {
      flexDirection: "column-reverse",
      justifyContent: "center",
      alignItems: "center",
    },
    rewardXP: 40,
  },
  {
    id: 20,
    title: "Flexbox Grandmaster",
    description:
      "The final trial! Combine column direction, wrapping, and centering to achieve perfect formation. Only a true Flexbox master can restore order!",
    hint: "You'll need: flex-direction, flex-wrap, justify-content, align-content, and align-items — all working together.",
    category: "finale",
    pokeballNames: [
      { name: "Pokéball", image: "/pokeball.png" },
      { name: "Great Ball", image: "/great ball.png" },
      { name: "Ultra Ball", image: "/ultra ball.png" },
      { name: "Level Ball", image: "/level ball.png" },
      { name: "Lure Ball", image: "/lure ball.png" },
      { name: "Dive Ball", image: "/dive ball.png" },
    ],
    pokemonNames: [
      { name: "Gengar", image: "/gengar.gif" },
      { name: "Lapras", image: "/laprus.gif" },
      { name: "Snorlax", image: "/snorlax.gif" },
      { name: "Pikachu", image: "/pikachu.gif" },
      { name: "Eevee", image: "/evee.gif" },
      { name: "Ice Ponyta", image: "/Ice Ponyta.gif" },
    ],
    targetStyles: {
      flexDirection: "column",
      flexWrap: "wrap",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    rewardXP: 100,
  },
]
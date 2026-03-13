/**
 * Grid Path - 6 Challenges (5 Levels + 1 Boss Mission)
 * Real-world contexts: dashboard, card grid, gallery
 * Learn: display: grid, grid-template-columns, grid-template-rows, gap, auto-fit, minmax, grid-areas
 *
 * Note: This is a starting template. Challenges can be expanded with more complexity.
 */

import type { LayoutChallenge } from '@/types/layout-engineering.types'
import { getContextTemplate } from '@/lib/real-world-contexts'

/**
 * Grid Level 1: Basic Grid Layout
 */
const grid1: LayoutChallenge = {
  id: 'grid-1',
  path: 'grid',
  level: 1,
  isBossMission: false,
  title: 'Create a Basic Grid',
  description:
    'Learn the fundamentals of CSS Grid. Create a simple 3-column grid layout for displaying items.',
  mode: 'build',
  realWorldContext: 'card-grid',
  targetHtml: getContextTemplate('card-grid').htmlTemplate,
  targetCss: {
    '.card-grid': 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px;',
  },
  learningFocus: ['display: grid', 'grid-template-columns', 'repeat()'],
  hints: {
    conceptual:
      'CSS Grid is a two-dimensional layout system. Specify columns with grid-template-columns. Use repeat(3, 1fr) to create 3 equal columns.',
    specific:
      'For a card grid, divide the space into equal columns. Use repeat(3, 1fr) to create 3 columns of equal width that share the available space.',
    codeTip:
      'Add display: grid to .card-grid, then grid-template-columns: repeat(3, 1fr) to create 3 equal-width columns.',
  },
  baseXP: 50,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Grid Level 2: Responsive Grid with auto-fit
 */
const grid2: LayoutChallenge = {
  id: 'grid-2',
  path: 'grid',
  level: 2,
  isBossMission: false,
  title: 'Responsive Grid with auto-fit',
  description:
    'Create a responsive grid that adapts the number of columns based on available space using auto-fit and minmax.',
  mode: 'build',
  realWorldContext: 'card-grid',
  targetHtml: getContextTemplate('card-grid').htmlTemplate,
  targetCss: {
    '.card-grid':
      'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px;',
  },
  learningFocus: ['auto-fit', 'minmax()', 'responsive grid'],
  hints: {
    conceptual:
      'auto-fit automatically adjusts the number of columns based on container width. minmax(min, max) ensures columns never get smaller than the minimum or larger than the maximum.',
    specific:
      'Use repeat(auto-fit, minmax(250px, 1fr)) to create a responsive grid where each column is at least 250px wide but can grow to take equal space.',
    codeTip:
      'Replace repeat(3, 1fr) with repeat(auto-fit, minmax(250px, 1fr)) for a responsive layout.',
  },
  baseXP: 60,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Grid Level 3: Dashboard with Grid Areas
 */
const grid3: LayoutChallenge = {
  id: 'grid-3',
  path: 'grid',
  level: 3,
  isBossMission: false,
  title: 'Dashboard Layout with Grid Areas',
  description:
    'Build a dashboard using CSS Grid with named areas. Header, sidebar, main content, and footer in proper positions.',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: getContextTemplate('dashboard').htmlTemplate,
  targetCss: {
    '.dashboard':
      'display: grid; grid-template-columns: 200px 1fr; grid-template-rows: auto 1fr auto; gap: 20px; min-height: 100vh;',
    'header': 'grid-column: 1 / -1;',
    '.sidebar': 'grid-row: 2 / -1;',
    '.main-content': 'grid-column: 2;',
  },
  learningFocus: ['grid-column', 'grid-row', 'grid placement'],
  hints: {
    conceptual:
      'Grid tracks (rows and columns) can be numbered. Use grid-column and grid-row to position items across multiple tracks.',
    specific:
      'Define grid-template-columns and grid-template-rows for your layout structure, then use grid-column and grid-row to place children.',
    codeTip:
      'Use grid-column: 1 / -1 to span from first column to last. Use grid-row: 2 / -1 to span from row 2 to the end.',
  },
  baseXP: 70,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Grid Level 4: Grid Template Areas (symbolic layout)
 */
const grid4: LayoutChallenge = {
  id: 'grid-4',
  path: 'grid',
  level: 4,
  isBossMission: false,
  title: 'Grid Template Areas for Semantic Layouts',
  description:
    'Use CSS Grid template areas for a more readable and maintainable layout definition. Shape your layout symbolically.',
  mode: 'debug',
  realWorldContext: 'dashboard',
  targetHtml: `
    <div class="page">
      <header class="header">Header</header>
      <aside class="sidebar">Sidebar</aside>
      <main class="main">Main Content</main>
      <footer class="footer">Footer</footer>
    </div>
  `,
  brokenCss: {
    '.page':
      'display: grid; grid-template-columns: 200px 1fr; grid-template-rows: auto 1fr auto; gap: 20px;',
  },
  targetCss: {
    '.page': `
      display: grid;
      grid-template-columns: 200px 1fr;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
      gap: 20px;
    `,
    'header': 'grid-area: header;',
    '.sidebar': 'grid-area: sidebar;',
    '.main': 'grid-area: main;',
    '.footer': 'grid-area: footer;',
  },
  learningFocus: ['grid-template-areas', 'grid-area', 'semantic layout'],
  hints: {
    conceptual:
      'grid-template-areas allows you to define a grid layout visually using named areas. This is more readable than numeric positioning.',
    specific:
      'Define areas with grid-template-areas, then assign child elements to areas with grid-area. The string visualization matches the actual layout.',
    codeTip:
      'Add grid-template-areas property with string values. Assign each child a grid-area matching one of the named areas.',
  },
  baseXP: 75,
  efficiency: {
    targetEdits: 4,
    maxEdits: 8,
  },
}

/**
 * Grid Level 5: Complex Multi-Area Dashboard
 */
const grid5: LayoutChallenge = {
  id: 'grid-5',
  path: 'grid',
  level: 5,
  isBossMission: false,
  title: 'Advanced Dashboard with Multiple Areas',
  description:
    'Create a sophisticated dashboard with header, multiple sidebars, content areas, and footer using grid-template-areas.',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: `
    <div class="app-layout">
      <header class="app-header">Header</header>
      <nav class="left-sidebar">Left Nav</nav>
      <main class="content">Content</main>
      <aside class="right-panel">Right Panel</aside>
      <footer class="app-footer">Footer</footer>
    </div>
  `,
  targetCss: {
    '.app-layout': `
      display: grid;
      grid-template-columns: 200px 1fr 250px;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        "header header header"
        "left content right"
        "footer footer footer";
      gap: 20px;
      min-height: 100vh;
    `,
    '.app-header': 'grid-area: header;',
    '.left-sidebar': 'grid-area: left;',
    '.content': 'grid-area: content;',
    '.right-panel': 'grid-area: right;',
    '.app-footer': 'grid-area: footer;',
  },
  learningFocus: [
    'complex grid-template-areas',
    'multi-column layouts',
    'flexible content areas',
  ],
  hints: {
    conceptual:
      'You can create sophisticated layouts with grid-template-areas by repeating area names across multiple cells in your string grid representation.',
    specific:
      'The header and footer span 3 columns (all columns), while the middle row has left nav, content, and right panel in separate columns.',
    codeTip:
      'Each row in grid-template-areas is a string. Repeat "header" 3 times to make it span 3 columns. Use different names for left, content, right.',
  },
  baseXP: 85,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Grid Boss Mission
 */
const gridBoss: LayoutChallenge = {
  id: 'grid-boss',
  path: 'grid',
  level: 6,
  isBossMission: true,
  title: 'Grid Master: Complex Responsive Dashboard',
  description:
    'Boss Mission! Create a professional dashboard with responsive grid that adapts from desktop (3+ columns) to tablet (2 columns) to mobile (1 column).',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: `
    <div class="dashboard-grid">
      <header class="dash-header">Header</header>
      <aside class="dash-sidebar">Sidebar</aside>
      <main class="dash-main">Main</main>
      <div class="dash-card">Card 1</div>
      <div class="dash-card">Card 2</div>
      <div class="dash-card">Card 3</div>
    </div>
  `,
  targetCss: {
    '.dashboard-grid': `
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr;
      gap: 20px;
      min-height: 100vh;
    `,
    '@media (min-width: 768px)': `
      .dashboard-grid {
        grid-template-columns: 200px 1fr;
      }
    `,
    '@media (min-width: 1024px)': `
      .dashboard-grid {
        grid-template-columns: 200px repeat(3, 1fr);
      }
    `,
  },
  learningFocus: [
    'responsive grid',
    'media queries with grid',
    'mobile-first design',
  ],
  hints: {
    conceptual:
      'Responsive grids change their grid-template-columns at different breakpoints. Start with 1 column (mobile), then add more columns for larger screens.',
    specific:
      'Use mobile-first CSS: start with simple 1-column layout, then use @media queries to add columns for tablet and desktop sizes.',
    codeTip:
      'Define base grid-template-columns as 1fr (1 column). Use @media (min-width: 768px) to change to 200px 1fr. Use @media (min-width: 1024px) for 200px repeat(3, 1fr).',
  },
  baseXP: 200,
  accuracy: {
    perfectMatch: 90,
    partialMatch: 65,
  },
}

/**
 * Export all Grid challenges
 */
export const gridChallenges: LayoutChallenge[] = [
  grid1,
  grid2,
  grid3,
  grid4,
  grid5,
  gridBoss,
]

/**
 * Get challenge by level index
 */
export function getGridChallenge(levelIndex: number): LayoutChallenge | null {
  return gridChallenges[levelIndex] || null
}

/**
 * Get total possible XP for Grid path
 */
export function getGridTotalXP(): number {
  return gridChallenges.reduce((sum, challenge) => sum + challenge.baseXP, 0)
}

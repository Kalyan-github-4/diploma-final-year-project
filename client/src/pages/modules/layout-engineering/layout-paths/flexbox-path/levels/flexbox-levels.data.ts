/**
 * Flexbox Path - 6 Challenges (5 Levels + 1 Boss Mission)
 * Real-world contexts: navbar, sidebar, card layouts, forms
 * Learn: display, justify-content, align-items, flex-wrap, flex-direction, gap, align-content
 */

import type { LayoutChallenge } from '@/types/layout-engineering.types'
import { getContextTemplate } from '@/lib/real-world-contexts'

/**
 * Flexbox Level 1: Center the Navigation
 * Introduction to display: flex and centering
 */
const flexbox1: LayoutChallenge = {
  id: 'flexbox-1',
  path: 'flexbox',
  level: 1,
  isBossMission: false,
  title: 'Center the Navigation',
  description:
    'Build a navbar with centered menu items. Every website needs good navigation. Your mission: center the navigation horizontally and vertically.',
  mode: 'build',
  realWorldContext: 'navbar',
  targetHtml: getContextTemplate('navbar').htmlTemplate,
  targetCss: {
    '.navbar': 'display: flex; justify-content: center; align-items: center;',
    '.nav-links': 'display: flex; gap: 20px; list-style: none;',
    '.nav-toggle': 'display: none;',
  },
  learningFocus: ['display: flex', 'justify-content: center', 'align-items: center'],
  hints: {
    conceptual:
      'Flexbox is a one-dimensional layout tool that aligns items along a main axis (horizontal) and cross axis (vertical). Use display: flex on the container.',
    specific:
      'For a navbar, you want all menu items centered. Use justify-content: center for horizontal centering and align-items: center for vertical centering.',
    codeTip:
      'Set display: flex on .navbar, then add justify-content: center and align-items: center to center all children.',
  },
  baseXP: 50,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Flexbox Level 2: Spread the Navigation
 * Learn justify-content variants
 */
const flexbox2: LayoutChallenge = {
  id: 'flexbox-2',
  path: 'flexbox',
  level: 2,
  isBossMission: false,
  title: 'Spread Navigation Items',
  description:
    'Professional navbars have the logo on the left, menu items in the center, and action button on the right. No gap between them. Use space-between to create balanced spacing.',
  mode: 'build',
  realWorldContext: 'navbar',
  targetHtml: getContextTemplate('navbar').htmlTemplate,
  targetCss: {
    '.navbar':
      'display: flex; justify-content: space-between; align-items: center; padding: 0 20px;',
    '.nav-links': 'display: flex; gap: 20px; list-style: none;',
  },
  learningFocus: [
    'justify-content: space-between',
    'align-items: center',
    'padding',
  ],
  hints: {
    conceptual:
      'justify-content has multiple values to distribute space: flex-start, center, flex-end, space-between, space-around, space-evenly. Each creates different spacing patterns.',
    specific:
      'For this navbar, use space-between to push the logo left and button right with space between all items. The nav links stay together with their own flexbox.',
    codeTip:
      'Use justify-content: space-between on .navbar. This creates maximum space separation while keeping alignment clean.',
  },
  baseXP: 60,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Flexbox Level 3: Responsive Sidebar
 * Learn flex-wrap and multi-line wrapping
 */
const flexbox3: LayoutChallenge = {
  id: 'flexbox-3',
  path: 'flexbox',
  level: 3,
  isBossMission: false,
  title: 'Responsive Sidebar Layout',
  description:
    'Build a dashboard with a sidebar and content area. When space is limited, the sidebar should wrap below the content. Use flex-wrap to enable responsive layouts.',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: `
    <div class="dashboard">
      <aside class="sidebar">Sidebar Navigation</aside>
      <main class="main-content">
        <header class="dashboard-header">Header</header>
        <section class="dashboard-content">Main Content Area</section>
      </main>
    </div>
  `,
  targetCss: {
    '.dashboard': 'display: flex; flex-wrap: wrap; gap: 20px;',
    '.sidebar': 'flex: 0 0 20%; min-width: 200px;',
    '.main-content': 'flex: 1; min-width: 300px;',
  },
  learningFocus: ['flex-wrap', 'flex', 'flex-basis', 'gap'],
  hints: {
    conceptual:
      'flex-wrap allows items to wrap to new lines when there is not enough space. By default, flex items shrink to fit (flex-wrap: nowrap). Set flex-wrap: wrap to enable responsive layouts.',
    specific:
      'The dashboard has a sidebar and main area. Use flex-wrap: wrap so they stay side-by-side on desktop but stack on mobile. The flex shorthand controls item sizing.',
    codeTip:
      'Add flex-wrap: wrap to .dashboard. Use flex: 0 0 20% on sidebar (20% width, no shrink) and flex: 1 on main (takes remaining space).',
  },
  baseXP: 70,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Flexbox Level 4: Column Layout
 * Learn flex-direction
 */
const flexbox4: LayoutChallenge = {
  id: 'flexbox-4',
  path: 'flexbox',
  level: 4,
  isBossMission: false,
  title: 'Vertical Stack Layout',
  description:
    'Create a form layout where labels and inputs stack vertically. Use flex-direction: column to change the layout direction from horizontal to vertical.',
  mode: 'debug',
  realWorldContext: 'form',
  targetHtml: getContextTemplate('form').htmlTemplate,
  brokenCss: {
    '.form-container': 'display: flex; gap: 10px; padding: 20px;',
    '.form-group': 'display: flex; gap: 10px;',
    'label': 'width: 100px;',
  },
  targetCss: {
    '.form-container':
      'display: flex; flex-direction: column; gap: 15px; padding: 20px;',
    '.form-group': 'display: flex; flex-direction: column; gap: 5px;',
    'label': 'font-weight: bold;',
  },
  learningFocus: ['flex-direction: column', 'nested flex containers'],
  hints: {
    conceptual:
      'flex-direction controls the main axis: row (default), column (vertical), row-reverse, or column-reverse. Changing direction swaps which axis justify-content and align-items affect.',
    specific:
      'Forms need vertical stacking. The form container and each form group need flex-direction: column. This flips the main axis from horizontal to vertical.',
    codeTip:
      'Add flex-direction: column to both .form-container and .form-group. This stacks all form elements vertically.',
  },
  baseXP: 75,
  efficiency: {
    targetEdits: 3,
    maxEdits: 6,
  },
}

/**
 * Flexbox Level 5: Complex Card Layout
 * Combine multiple concepts
 */
const flexbox5: LayoutChallenge = {
  id: 'flexbox-5',
  path: 'flexbox',
  level: 5,
  isBossMission: false,
  title: 'Card Grid with Flexbox',
  description:
    'Create a responsive card grid that displays 2-4 cards per row. Cards should be equal height and wrap responsively. Combine flexbox properties you have learned.',
  mode: 'build',
  realWorldContext: 'card-grid',
  targetHtml: getContextTemplate('card-grid').htmlTemplate,
  targetCss: {
    '.card-grid': 'display: flex; flex-wrap: wrap; gap: 20px; padding: 20px;',
    '.card': 'flex: 1 1 calc(25% - 16px); min-width: 200px; display: flex; flex-direction: column;',
    '.card-image':
      'height: 200px; background: #ddd; flex: 0 0 auto;',
    '.card-content': 'flex: 1; padding: 15px;',
    '.card-footer':
      'display: flex; justify-content: space-between; align-items: center; padding: 15px; border-top: 1px solid #eee;',
  },
  learningFocus: [
    'flex-wrap',
    'flex shorthand',
    'nested flexbox',
    'calc() in flex-basis',
  ],
  hints: {
    conceptual:
      'You can nest flexbox containers. A card grid is flexbox wrapping cards, and each card is also a flex column. This creates complex, responsive layouts.',
    specific:
      'The card grid wraps cards. Each card uses flex: 1 1 calc(25% - 16px) to take up 25% width with gap accounting. Cards use flex-direction: column to stack image, content, and footer vertically.',
    codeTip:
      'Use flex-wrap: wrap on the grid and flex: 1 1 calc(25% - 16px) on cards. Nest flex-direction: column inside cards to organize their internal layout.',
  },
  baseXP: 85,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Flexbox Boss Mission: Complex Professional Layout
 * User choice between Build and Debug mode
 */
const flexboxBoss: LayoutChallenge = {
  id: 'flexbox-boss',
  path: 'flexbox',
  level: 6,
  isBossMission: true,
  title: 'Flexbox Master: Complete Web Layout',
  description:
    'Boss Mission! Build a complete webpage layout with header, sidebar navigation, main content, and footer. All sections must be flexible and responsive. Choose your challenge: Build from scratch (Build mode) or fix the broken layout (Debug mode).',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: `
    <div class="page-layout">
      <header class="header">
        <div class="logo">Logo</div>
        <nav class="header-nav">
          <a href="#">Home</a>
          <a href="#">Services</a>
          <a href="#">About</a>
        </nav>
      </header>
      <div class="body-layout">
        <aside class="sidebar">
          <div class="sidebar-item">Dashboard</div>
          <div class="sidebar-item">Settings</div>
          <div class="sidebar-item">Help</div>
        </aside>
        <main class="main">
          <h1>Welcome</h1>
          <p>Content area</p>
        </main>
      </div>
      <footer class="footer">© 2024 Your Company</footer>
    </div>
  `,
  targetCss: {
    '.page-layout': 'display: flex; flex-direction: column; min-height: 100vh;',
    '.header':
      'display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #333; color: white;',
    '.header-nav': 'display: flex; gap: 20px;',
    '.body-layout': 'display: flex; flex: 1;',
    '.sidebar': 'flex: 0 0 200px; padding: 20px; background: #f5f5f5;',
    '.main': 'flex: 1; padding: 20px;',
    '.footer':
      'padding: 20px; background: #333; color: white; text-align: center;',
  },
  learningFocus: [
    'flex-direction: column',
    'min-height for full-height layouts',
    'nested flexbox',
    'flex-wrap',
    'all previous concepts combined',
  ],
  hints: {
    conceptual:
      'Complete layouts use nested flexbox containers. The page is a column (header, body, footer stacked). The body is a row (sidebar and main side-by-side). This nesting creates flexible, responsive designs.',
    specific:
      'Use flex-direction: column on .page-layout for vertical stacking. Set min-height: 100vh and flex: 1 on .body-layout to make it expand and fill space. .sidebar uses flex: 0 0 200px for fixed width.',
    codeTip:
      'Build top-level layout first, then fill in nested layouts. Type the CSS carefully — you need proper parent-child flex relationships for everything to work.',
  },
  baseXP: 200,
  accuracy: {
    perfectMatch: 90,
    partialMatch: 65,
  },
}

/**
 * Export all Flexbox challenges
 */
export const flexboxChallenges: LayoutChallenge[] = [
  flexbox1,
  flexbox2,
  flexbox3,
  flexbox4,
  flexbox5,
  flexboxBoss,
]

/**
 * Get challenge by level (0-indexed)
 */
export function getFlexboxChallenge(levelIndex: number): LayoutChallenge | null {
  return flexboxChallenges[levelIndex] || null
}

/**
 * Get total possible XP for Flexbox path
 */
export function getFlexboxTotalXP(): number {
  return flexboxChallenges.reduce((sum, challenge) => sum + challenge.baseXP, 0)
}

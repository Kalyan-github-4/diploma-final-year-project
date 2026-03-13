/**
 * Layout Pro Path - 6 Challenges (5 Levels + 1 Boss Mission)
 * Real-world contexts: complex professional layouts combining Flexbox and Grid
 * Learn: Using Flexbox and Grid together, nested layouts, complex responsive patterns
 *
 * This is the combined/advanced path. Unlocked after Level 3 on either Flexbox or Grid.
 */

import type { LayoutChallenge } from '@/types/layout-engineering.types'
import { getContextTemplate } from '@/lib/real-world-contexts'

/**
 * Layout Pro Level 1: Flexbox Header with Grid Content
 */
const layoutPro1: LayoutChallenge = {
  id: 'layout-pro-1',
  path: 'layout-pro',
  level: 1,
  isBossMission: false,
  title: 'Flex Header + Grid Body',
  description:
    'Combine Flexbox for the navbar and Grid for the main content area. Use the right tool for each job.',
  mode: 'build',
  realWorldContext: 'navbar',
  targetHtml: `
    <div class="app">
      <header class="navbar">
        <div class="logo">Logo</div>
        <nav class="nav-items">
          <a href="#">Home</a>
          <a href="#">About</a>
        </nav>
        <button>Sign In</button>
      </header>
      <main class="content-grid">
        <aside class="sidebar">Sidebar</aside>
        <section class="posts">
          <article class="post">Post 1</article>
          <article class="post">Post 2</article>
          <article class="post">Post 3</article>
        </section>
      </main>
    </div>
  `,
  targetCss: {
    '.navbar': 'display: flex; justify-content: space-between; align-items: center; padding: 20px;',
    '.nav-items': 'display: flex; gap: 20px;',
    '.content-grid': 'display: grid; grid-template-columns: 200px 1fr; gap: 20px;',
    '.posts': 'display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;',
  },
  learningFocus: ['combining flexbox and grid', 'nested layouts'],
  hints: {
    conceptual:
      'Different layout components need different tools. Use Flexbox for simple linear layouts (navbar), Grid for multi-dimensional layouts (content grid).',
    specific:
      'The navbar uses Flexbox to distribute logo, nav items, and button. The content area uses Grid for sidebar + posts. Posts use auto-fit Grid for responsiveness.',
    codeTip:
      'Navbar: display flex with justify-content space-between. Content: grid with 200px sidebar and 1fr main. Posts: grid with auto-fit minmax.',
  },
  baseXP: 60,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Layout Pro Level 2: Nested Flexbox and Grid
 */
const layoutPro2: LayoutChallenge = {
  id: 'layout-pro-2',
  path: 'layout-pro',
  level: 2,
  isBossMission: false,
  title: 'Nested Flex and Grid Components',
  description:
    'Each grid cell contains a Flexbox component. Master deeply nested responsive layouts.',
  mode: 'build',
  realWorldContext: 'card-grid',
  targetHtml: getContextTemplate('card-grid').htmlTemplate,
  targetCss: {
    '.card-grid': 'display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;',
    '.card': 'display: flex; flex-direction: column;',
    '.card-image': 'height: 200px; flex: 0 0 auto;',
    '.card-content': 'flex: 1; padding: 15px;',
    '.card-footer': 'display: flex; justify-content: space-between; align-items: center; padding: 15px;',
  },
  learningFocus: ['nested layouts', 'grid + flex combinations'],
  hints: {
    conceptual:
      'You can nest Flex and Grid. A grid layout can contain flex items. Each flex item can contain its own grid. Mix tools as needed.',
    specific:
      'Grid creates 3-4 columns of cards. Each card is a flex column. Image is flex 0 0 (fixed), content is flex 1 (grows), footer is flex row.',
    codeTip:
      'Grid for cards, flex-column for each card, flex-row for footer. Use flex-basis and flex-grow to control sizing.',
  },
  baseXP: 70,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Layout Pro Level 3: Complex Responsive Landing Page
 */
const layoutPro3: LayoutChallenge = {
  id: 'layout-pro-3',
  path: 'layout-pro',
  level: 3,
  isBossMission: false,
  title: 'Responsive Landing Page Section',
  description:
    'Build a section with text on one side and image grid on the other. Stacks responsively: side-by-side on desktop, stacked on mobile.',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: `
    <section class="hero">
      <div class="hero-text">
        <h1>Heading</h1>
        <p>Content text</p>
        <button>CTA</button>
      </div>
      <div class="hero-images">
        <img src="#" alt="Image 1" />
        <img src="#" alt="Image 2" />
        <img src="#" alt="Image 3" />
        <img src="#" alt="Image 4" />
      </div>
    </section>
  `,
  targetCss: {
    '.hero': 'display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; padding: 60px 20px;',
    '.hero-text': 'display: flex; flex-direction: column; gap: 20px;',
    '.hero-images': 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;',
    '@media (max-width: 768px)': `
      .hero {
        grid-template-columns: 1fr;
      }
    `,
  },
  learningFocus: ['responsive grid', 'media queries', 'flex column layouts'],
  hints: {
    conceptual:
      'Responsive layouts change structure at breakpoints. Hero uses grid (2 columns → 1 column), text uses flex column, images use grid again.',
    specific:
      'Hero: 2 columns on desktop, 1 on mobile. Text section is flex column. Image section is 2x2 grid.',
    codeTip:
      'Hero: grid with 1fr 1fr, media query to 1fr. Text: flex-direction column. Images: grid 2 columns.',
  },
  baseXP: 80,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Layout Pro Level 4: E-commerce Product Page
 */
const layoutPro4: LayoutChallenge = {
  id: 'layout-pro-4',
  path: 'layout-pro',
  level: 4,
  isBossMission: false,
  title: 'E-commerce Product Gallery Layout',
  description:
    'Build a product page with thumbnail gallery (flex column) and main image with description (grid rows).',
  mode: 'debug',
  realWorldContext: 'card-grid',
  targetHtml: getContextTemplate('card-grid').htmlTemplate,
  brokenCss: {
    '.product-layout': 'display: grid; grid-template-columns: 100px 1fr;',
  },
  targetCss: {
    '.product-layout':
      'display: grid; grid-template-columns: 100px 1fr; gap: 30px; padding: 40px;',
    '.thumbnails': 'display: flex; flex-direction: column; gap: 10px;',
    '.main-image': 'height: 500px; background: #ddd;',
    '.product-info': 'display: flex; flex-direction: column; gap: 15px;',
  },
  learningFocus: [
    'e-commerce layout',
    'gallery patterns',
    'flex + grid combination',
  ],
  hints: {
    conceptual:
      'E-commerce pages combine multiple layout patterns. Thumbnails are a flex column (vertical stack). Main content uses grid rows.',
    specific:
      'Use grid for overall layout (thumbnails + main). Thumbnails are flex column. Product info is flex column with gaps for spacing.',
    codeTip:
      'Grid 2 columns: 100px for thumbs, 1fr for main. Flex-column for thumbnails. Flex-column for product info.',
  },
  baseXP: 85,
  efficiency: {
    targetEdits: 5,
    maxEdits: 10,
  },
}

/**
 * Layout Pro Level 5: Full-Feature Dashboard
 */
const layoutPro5: LayoutChallenge = {
  id: 'layout-pro-5',
  path: 'layout-pro',
  level: 5,
  isBossMission: false,
  title: 'Advanced SaaS Dashboard',
  description:
    'Build a complete dashboard with header (flex), sidebar + main (grid), and card grid (auto-fit). Everything responsive.',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: getContextTemplate('dashboard').htmlTemplate,
  targetCss: {
    '.dashboard':
      'display: grid; grid-template-rows: auto 1fr; min-height: 100vh; gap: 20px;',
    '.dashboard-header': 'display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #333; color: white;',
    '.dashboard-cards':
      'display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;',
  },
  learningFocus: [
    'complex responsive layouts',
    'nested flex and grid',
    'production-ready patterns',
  ],
  hints: {
    conceptual:
      'Professional dashboards layer multiple layout systems. Top-level grid for rows, flex headers for navigation,  grid cards for responsive content.',
    specific:
      'Use grid for main layout. Header uses flex for horizontal nav. Cards use auto-fit grid for responsive columns.',
    codeTip:
      'Dashboard grid with rows. Header flex row. Cards grid with auto-fit minmax. All with proper gap spacing.',
  },
  baseXP: 95,
  accuracy: {
    perfectMatch: 95,
    partialMatch: 70,
  },
}

/**
 * Layout Pro Boss Mission: Ultimate Web Application Layout
 */
const layoutProBoss: LayoutChallenge = {
  id: 'layout-pro-boss',
  path: 'layout-pro',
  level: 6,
  isBossMission: true,
  title: 'Layout Architect: Enterprise Application',
  description:
    'Boss Mission! Design a complete enterprise application with responsive layout. Header (flex), sidebar (flex column), content (grid), cards, and footer. Must work on mobile, tablet, and desktop.',
  mode: 'build',
  realWorldContext: 'dashboard',
  targetHtml: `
    <div class="app-container">
      <header class="app-bar">
        <div class="logo">App</div>
        <nav class="nav">Home | Services | Contact</nav>
        <button>Profile</button>
      </header>
      <div class="app-body">
        <aside class="sidebar">
          <div class="menu-item">Dashboard</div>
          <div class="menu-item">Analytics</div>
          <div class="menu-item">Settings</div>
        </aside>
        <main class="main">
          <div class="stats-grid">
            <div class="stat-card">Stat 1</div>
            <div class="stat-card">Stat 2</div>
            <div class="stat-card">Stat 3</div>
            <div class="stat-card">Stat 4</div>
          </div>
          <div class="content-section">Content</div>
        </main>
      </div>
      <footer class="app-footer">© 2024</footer>
    </div>
  `,
  targetCss: {
    '.app-container':
      'display: grid; grid-template-rows: auto 1fr auto; min-height: 100vh;',
    '.app-bar': 'display: flex; justify-content: space-between; align-items: center; padding: 20px;',
    '.nav': 'display: flex; gap: 20px;',
    '.app-body': 'display: grid; grid-template-columns: 200px 1fr; gap: 20px;',
    '.sidebar': 'display: flex; flex-direction: column; gap: 15px; padding: 20px;',
    '.stats-grid':
      'display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px;',
    '@media (max-width: 768px)': `
      .app-body {
        grid-template-columns: 1fr;
      }
      .app-bar {
        flex-wrap: wrap;
      }
    `,
  },
  learningFocus: [
    'enterprise layouts',
    'responsive mobile-first',
    'complete frontend architecture',
  ],
  hints: {
    conceptual:
      'Enterprise apps layer multiple responsibilities. Top-level grid manages page rows. Sections use flex or grid as appropriate. Always think mobile-first.',
    specific:
      'Main grid has 3 rows (header, body, footer). Body is 2 columns (sidebar, main) that collapse to 1 on mobile. Flex for navigation, grid for cards.',
    codeTip:
      'Use grid-template-rows for page structure. Grid sidebar + main that collapses via media query. Flex for navbars and menus.',
  },
  baseXP: 200,
  accuracy: {
    perfectMatch: 90,
    partialMatch: 65,
  },
}

/**
 * Export all Layout Pro challenges
 */
export const layoutProChallenges: LayoutChallenge[] = [
  layoutPro1,
  layoutPro2,
  layoutPro3,
  layoutPro4,
  layoutPro5,
  layoutProBoss,
]

/**
 * Get challenge by level index
 */
export function getLayoutProChallenge(levelIndex: number): LayoutChallenge | null {
  return layoutProChallenges[levelIndex] || null
}

/**
 * Get total possible XP for Layout Pro path
 */
export function getLayoutProTotalXP(): number {
  return layoutProChallenges.reduce((sum, challenge) => sum + challenge.baseXP, 0)
}

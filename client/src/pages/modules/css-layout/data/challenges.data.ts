import type { CssChallenge } from "../types"

/* ─────────────────────────────────────────────────────────────────────────────
   Base styles injected into every preview iframe.
   Keeps things looking clean regardless of user CSS.
───────────────────────────────────────────────────────────────────────────── */
export const PREVIEW_BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Segoe UI', sans-serif; background: #f8fafc; padding: 20px; min-height: 100vh; }
  a { text-decoration: none; color: inherit; }
`

/* ─────────────────────────────────────────────────────────────────────────────
   FLEXBOX CHALLENGES  (F1 – F6)
───────────────────────────────────────────────────────────────────────────── */

const f1: CssChallenge = {
  id: "f1",
  title: "Center the Box",
  topic: "flexbox",
  difficulty: "beginner",
  xp: 50,
  description:
    "The box is stuck in the top-left corner. Use Flexbox to center it both horizontally and vertically inside the container.",
  hint: "Set `display: flex` on `.container`, then use `justify-content` and `align-items` both set to `center`.",
  htmlTemplate: `
<div class="container">
  <div class="box">Centered!</div>
</div>`,
  startingCss: `.container {
  width: 100%;
  height: 240px;
  background: #e2e8f0;
  border-radius: 12px;
  /* your flexbox here */
}

.box {
  width: 100px;
  height: 100px;
  background: #6366f1;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
  goalCss: `.container {
  width: 100%;
  height: 240px;
  background: #e2e8f0;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  width: 100px;
  height: 100px;
  background: #6366f1;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
  requiredProperties: [
    { selector: ".container", property: "display", value: "flex" },
    { selector: ".container", property: "justify-content", value: "center" },
    { selector: ".container", property: "align-items", value: "center" },
  ],
}

const f2: CssChallenge = {
  id: "f2",
  title: "Spread the Navbar",
  topic: "flexbox",
  difficulty: "beginner",
  xp: 60,
  description:
    "The nav items are all bunched together. Spread the logo to the left and the links to the right, vertically centered.",
  hint: "Use `justify-content: space-between` on `.navbar` to push items to opposite ends.",
  htmlTemplate: `
<nav class="navbar">
  <span class="logo">CodeKing</span>
  <div class="links">
    <a href="#">Modules</a>
    <a href="#">Profile</a>
    <a href="#">Leaderboard</a>
  </div>
</nav>`,
  startingCss: `.navbar {
  background: #1e293b;
  padding: 0 24px;
  height: 56px;
  border-radius: 10px;
  /* make this a flex row */
}

.logo {
  font-weight: 800;
  font-size: 18px;
  color: #6366f1;
  letter-spacing: -0.5px;
}

.links {
  display: flex;
  gap: 24px;
}

.links a {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}`,
  goalCss: `.navbar {
  background: #1e293b;
  padding: 0 24px;
  height: 56px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-weight: 800;
  font-size: 18px;
  color: #6366f1;
  letter-spacing: -0.5px;
}
.links {
  display: flex;
  gap: 24px;
}
.links a {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
}`,
  requiredProperties: [
    { selector: ".navbar", property: "display", value: "flex" },
    { selector: ".navbar", property: "justify-content", value: "space-between" },
    { selector: ".navbar", property: "align-items", value: "center" },
  ],
}

const f3: CssChallenge = {
  id: "f3",
  title: "Stack the Cards",
  topic: "flexbox",
  difficulty: "beginner",
  xp: 70,
  description:
    "These profile cards are laying side by side. Stack them vertically with a gap between each card.",
  hint: "Set `flex-direction: column` on `.card-list` to stack children vertically, then add `gap`.",
  htmlTemplate: `
<div class="card-list">
  <div class="card">
    <div class="avatar" style="background:#6366f1"></div>
    <div><p class="name">Alex Kim</p><p class="role">Frontend Dev</p></div>
  </div>
  <div class="card">
    <div class="avatar" style="background:#22c55e"></div>
    <div><p class="name">Sam Lee</p><p class="role">Designer</p></div>
  </div>
  <div class="card">
    <div class="avatar" style="background:#f59e0b"></div>
    <div><p class="name">Jordan M</p><p class="role">Backend Dev</p></div>
  </div>
</div>`,
  startingCss: `.card-list {
  display: flex;
  /* stack vertically here */
  /* add gap between cards */
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.name { font-weight: 600; font-size: 14px; color: #1e293b; }
.role { font-size: 12px; color: #94a3b8; margin-top: 2px; }`,
  goalCss: `.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.avatar { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; }
.name { font-weight: 600; font-size: 14px; color: #1e293b; }
.role { font-size: 12px; color: #94a3b8; margin-top: 2px; }`,
  requiredProperties: [
    { selector: ".card-list", property: "display", value: "flex" },
    { selector: ".card-list", property: "flex-direction", value: "column" },
    { selector: ".card-list", property: "gap", value: ["12px", "16px", "1rem", "0.75rem"] },
  ],
}

const f4: CssChallenge = {
  id: "f4",
  title: "Wrap the Tags",
  topic: "flexbox",
  difficulty: "intermediate",
  xp: 100,
  description:
    "These skill tags overflow off the right edge. Make them wrap onto the next line when there's no room.",
  hint: "Add `flex-wrap: wrap` to the `.tag-list` container so tags flow to the next line.",
  htmlTemplate: `
<div class="tag-list">
  <span class="tag">JavaScript</span>
  <span class="tag">TypeScript</span>
  <span class="tag">React</span>
  <span class="tag">Node.js</span>
  <span class="tag">CSS</span>
  <span class="tag">GraphQL</span>
  <span class="tag">PostgreSQL</span>
  <span class="tag">Docker</span>
  <span class="tag">AWS</span>
</div>`,
  startingCss: `.tag-list {
  display: flex;
  /* prevent overflow here */
  gap: 8px;
}

.tag {
  background: rgba(99,102,241,0.1);
  color: #6366f1;
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}`,
  goalCss: `.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  background: rgba(99,102,241,0.1);
  color: #6366f1;
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}`,
  requiredProperties: [
    { selector: ".tag-list", property: "display", value: "flex" },
    { selector: ".tag-list", property: "flex-wrap", value: "wrap" },
  ],
}

const f5: CssChallenge = {
  id: "f5",
  title: "Sidebar + Content",
  topic: "flexbox",
  difficulty: "intermediate",
  xp: 120,
  description:
    "The sidebar and content are stacked. Place them side by side, with the sidebar at a fixed 220px width and the main content filling all remaining space.",
  hint: "Add `display: flex` to `.layout`, keep `.sidebar` at 220px, then give `.main` a `flex: 1` so it grows to fill the rest.",
  htmlTemplate: `
<div class="layout">
  <aside class="sidebar">
    <p class="sidebar-title">Navigation</p>
    <ul>
      <li>Dashboard</li>
      <li>Modules</li>
      <li>Missions</li>
      <li>Settings</li>
    </ul>
  </aside>
  <main class="main">
    <h2>Welcome back!</h2>
    <p>This is the main content area. It should expand to fill all remaining space beside the sidebar.</p>
  </main>
</div>`,
  startingCss: `.layout {
  /* make this a flex row */
  height: 260px;
  gap: 0;
}

.sidebar {
  width: 220px;
  background: #1e293b;
  padding: 20px 16px;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 600;
}

.sidebar ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.sidebar li { color: #94a3b8; font-size: 14px; padding: 6px 10px; border-radius: 6px; cursor: pointer; }

.main {
  /* fill remaining space */
  background: #fff;
  padding: 24px;
  overflow: auto;
}

.main h2 { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.main p { font-size: 14px; color: #64748b; line-height: 1.6; }`,
  goalCss: `.layout {
  display: flex;
  height: 260px;
  gap: 0;
}
.sidebar {
  width: 220px;
  background: #1e293b;
  padding: 20px 16px;
  flex-shrink: 0;
}
.sidebar-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 12px; font-weight: 600; }
.sidebar ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.sidebar li { color: #94a3b8; font-size: 14px; padding: 6px 10px; border-radius: 6px; }
.main {
  flex: 1;
  background: #fff;
  padding: 24px;
  overflow: auto;
}
.main h2 { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.main p { font-size: 14px; color: #64748b; line-height: 1.6; }`,
  requiredProperties: [
    { selector: ".layout", property: "display", value: "flex" },
    { selector: ".main", property: "flex", value: ["1", "1 1 0%", "1 1 auto", "1 1 0"] },
  ],
}

const f6: CssChallenge = {
  id: "f6",
  title: "App Shell Layout",
  topic: "flexbox",
  difficulty: "advanced",
  xp: 160,
  description:
    "Build a classic app shell: a fixed top header, a middle row with sidebar + scrollable content, and a footer pinned to the bottom. The whole shell should fill the viewport height.",
  hint: "Use `flex-direction: column` on `.shell` with `height: 100vh`. Give `.body-row` `flex: 1` and `overflow: hidden`. Inside `.body-row` use `display: flex` so sidebar and content sit side by side.",
  htmlTemplate: `
<div class="shell">
  <header class="header">
    <span class="brand">CodeKing</span>
    <span class="user">Kalyan ▾</span>
  </header>
  <div class="body-row">
    <aside class="sidebar">
      <p>Dashboard</p>
      <p>Modules</p>
      <p>Profile</p>
    </aside>
    <main class="content">
      <h2>Dashboard</h2>
      <p>Welcome to CodeKing. Start a module to begin your journey.</p>
    </main>
  </div>
  <footer class="footer">© 2025 CodeKing</footer>
</div>`,
  startingCss: `.shell {
  /* fill viewport height, stack vertically */
}

.header {
  height: 52px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}
.brand { color: #6366f1; font-weight: 800; font-size: 16px; }
.user { color: #94a3b8; font-size: 13px; }

.body-row {
  /* fill remaining space, lay sidebar + content side by side */
  overflow: hidden;
}

.sidebar {
  width: 180px;
  background: #1e293b;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}
.sidebar p { color: #94a3b8; font-size: 13px; cursor: pointer; }

.content {
  /* fill remaining width, allow scroll */
  background: #f8fafc;
  padding: 24px;
  overflow-y: auto;
}
.content h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.content p { color: #64748b; font-size: 14px; }

.footer {
  height: 40px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  font-size: 12px;
  flex-shrink: 0;
}`,
  goalCss: `.shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header { height: 52px; background: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0; }
.brand { color: #6366f1; font-weight: 800; font-size: 16px; }
.user { color: #94a3b8; font-size: 13px; }
.body-row { display: flex; flex: 1; overflow: hidden; }
.sidebar { width: 180px; background: #1e293b; padding: 20px 14px; display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; }
.sidebar p { color: #94a3b8; font-size: 13px; }
.content { flex: 1; background: #f8fafc; padding: 24px; overflow-y: auto; }
.content h2 { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
.content p { color: #64748b; font-size: 14px; }
.footer { height: 40px; background: #0f172a; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 12px; flex-shrink: 0; }`,
  requiredProperties: [
    { selector: ".shell", property: "display", value: "flex" },
    { selector: ".shell", property: "flex-direction", value: "column" },
    { selector: ".body-row", property: "display", value: "flex" },
    { selector: ".body-row", property: "flex", value: ["1", "1 1 0%", "1 1 auto", "1 1 0"] },
    { selector: ".content", property: "flex", value: ["1", "1 1 0%", "1 1 auto", "1 1 0"] },
  ],
}

/* ─────────────────────────────────────────────────────────────────────────────
   GRID CHALLENGES  (G1 – G6)
───────────────────────────────────────────────────────────────────────────── */

const g1: CssChallenge = {
  id: "g1",
  title: "Three Equal Columns",
  topic: "grid",
  difficulty: "beginner",
  xp: 60,
  description:
    "These six cards are stacking vertically. Use CSS Grid to arrange them into exactly 3 equal-width columns.",
  hint: "Set `display: grid` on `.grid`, then use `grid-template-columns: repeat(3, 1fr)` to create 3 equal columns.",
  htmlTemplate: `
<div class="grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>`,
  startingCss: `.grid {
  /* your grid here */
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}`,
  goalCss: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px;
  text-align: center;
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}`,
  requiredProperties: [
    { selector: ".grid", property: "display", value: "grid" },
    {
      selector: ".grid",
      property: "grid-template-columns",
      value: ["repeat(3, 1fr)", "1fr 1fr 1fr", "repeat(3, minmax(0, 1fr))"],
    },
  ],
}

const g2: CssChallenge = {
  id: "g2",
  title: "Responsive Auto-Fit",
  topic: "grid",
  difficulty: "beginner",
  xp: 80,
  description:
    "Make this card grid automatically fit as many columns as possible, with each card being at least 160px wide. Cards should stretch to fill available space.",
  hint: "Use `grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))` to create a responsive grid that adapts to the container width.",
  htmlTemplate: `
<div class="grid">
  <div class="card" style="background:#6366f1">Design</div>
  <div class="card" style="background:#22c55e">Frontend</div>
  <div class="card" style="background:#f59e0b">Backend</div>
  <div class="card" style="background:#ef4444">DevOps</div>
  <div class="card" style="background:#3b82f6">Mobile</div>
  <div class="card" style="background:#8b5cf6">Data</div>
</div>`,
  startingCss: `.grid {
  /* responsive grid here */
  gap: 16px;
}

.card {
  border-radius: 10px;
  padding: 28px 16px;
  text-align: center;
  font-weight: 700;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.02em;
}`,
  goalCss: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
.card {
  border-radius: 10px;
  padding: 28px 16px;
  text-align: center;
  font-weight: 700;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.02em;
}`,
  requiredProperties: [
    { selector: ".grid", property: "display", value: "grid" },
    {
      selector: ".grid",
      property: "grid-template-columns",
      value: [
        "repeat(auto-fit, minmax(160px, 1fr))",
        "repeat(auto-fit, minmax(160px,1fr))",
        "repeat(auto-fill, minmax(160px, 1fr))",
      ],
    },
  ],
}

const g3: CssChallenge = {
  id: "g3",
  title: "Featured Card Span",
  topic: "grid",
  difficulty: "intermediate",
  xp: 100,
  description:
    "Make the featured article card span across 2 columns while the rest stay in a single column each.",
  hint: "Use `grid-column: span 2` on `.featured` to make it stretch across 2 grid columns.",
  htmlTemplate: `
<div class="grid">
  <article class="card featured">
    <span class="badge">Featured</span>
    <h3>Mastering CSS Grid in 2025</h3>
    <p>A deep dive into modern grid techniques used by top frontend engineers.</p>
  </article>
  <article class="card">
    <h3>Flexbox Tips</h3>
    <p>Quick wins for everyday layouts.</p>
  </article>
  <article class="card">
    <h3>CSS Variables</h3>
    <p>Dynamic theming made easy.</p>
  </article>
  <article class="card">
    <h3>Container Queries</h3>
    <p>The future of responsive design.</p>
  </article>
</div>`,
  startingCss: `.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.featured {
  /* make this span 2 columns */
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
}

.badge {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.04em;
}

.card h3 { font-size: 15px; font-weight: 700; margin-bottom: 8px; color: inherit; }
.card p { font-size: 13px; color: #94a3b8; line-height: 1.5; }
.featured p { color: rgba(255,255,255,0.75); }`,
  goalCss: `.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.featured {
  grid-column: span 2;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  border: none;
}
.badge { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-bottom: 10px; }
.card h3 { font-size: 15px; font-weight: 700; margin-bottom: 8px; color: inherit; }
.card p { font-size: 13px; color: #94a3b8; line-height: 1.5; }
.featured p { color: rgba(255,255,255,0.75); }`,
  requiredProperties: [
    { selector: ".grid", property: "display", value: "grid" },
    {
      selector: ".featured",
      property: "grid-column",
      value: ["span 2", "1 / 3", "1 / span 2", "1/3", "1/span 2"],
    },
  ],
}

const g4: CssChallenge = {
  id: "g4",
  title: "Named Grid Areas",
  topic: "grid",
  difficulty: "intermediate",
  xp: 130,
  description:
    "Arrange this page into header, sidebar, content, and footer using `grid-template-areas`. The header and footer should each span the full width.",
  hint: 'Define `grid-template-areas` with rows like `"header header"`, `"sidebar content"`, `"footer footer"`. Then assign each element its area with `grid-area`.',
  htmlTemplate: `
<div class="page">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="content">Main Content</main>
  <footer class="footer">Footer</footer>
</div>`,
  startingCss: `.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 52px 1fr 40px;
  height: 320px;
  gap: 8px;
  /* define grid-template-areas */
}

.header {
  /* grid-area: ? */
  background: #1e293b;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-weight: 700;
  border-radius: 8px;
}

.sidebar {
  /* grid-area: ? */
  background: #f1f5f9;
  border-radius: 8px;
  padding: 16px;
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.content {
  /* grid-area: ? */
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  font-weight: 600;
  color: #1e293b;
}

.footer {
  /* grid-area: ? */
  background: #1e293b;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 8px;
}`,
  goalCss: `.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 52px 1fr 40px;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  height: 320px;
  gap: 8px;
}
.header { grid-area: header; background: #1e293b; color: #f1f5f9; display: flex; align-items: center; padding: 0 20px; font-weight: 700; border-radius: 8px; }
.sidebar { grid-area: sidebar; background: #f1f5f9; border-radius: 8px; padding: 16px; font-size: 13px; color: #64748b; font-weight: 600; }
.content { grid-area: content; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; font-weight: 600; color: #1e293b; }
.footer { grid-area: footer; background: #1e293b; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 12px; border-radius: 8px; }`,
  requiredProperties: [
    { selector: ".page", property: "display", value: "grid" },
    { selector: ".header", property: "grid-area", value: "header" },
    { selector: ".sidebar", property: "grid-area", value: "sidebar" },
    { selector: ".content", property: "grid-area", value: "content" },
    { selector: ".footer", property: "grid-area", value: "footer" },
  ],
}

const g5: CssChallenge = {
  id: "g5",
  title: "Stats Dashboard",
  topic: "grid",
  difficulty: "intermediate",
  xp: 140,
  description:
    "Build a metrics dashboard where the chart card spans 2 columns and 2 rows, while the stat cards fill the remaining spaces.",
  hint: "Use `grid-column: span 2` and `grid-row: span 2` together on `.chart` to make it dominate the grid.",
  htmlTemplate: `
<div class="dashboard">
  <div class="card chart">
    <p class="label">Revenue Chart</p>
    <div class="bar-chart">
      <div class="bar" style="height:60%;background:#6366f1"></div>
      <div class="bar" style="height:80%;background:#6366f1"></div>
      <div class="bar" style="height:45%;background:#6366f1"></div>
      <div class="bar" style="height:90%;background:#6366f1"></div>
      <div class="bar" style="height:70%;background:#6366f1"></div>
    </div>
  </div>
  <div class="card stat"><p class="label">Users</p><p class="value">12,400</p></div>
  <div class="card stat"><p class="label">Revenue</p><p class="value">$84k</p></div>
  <div class="card stat"><p class="label">Sessions</p><p class="value">98,200</p></div>
  <div class="card stat"><p class="label">Bounce</p><p class="value">32%</p></div>
</div>`,
  startingCss: `.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.chart {
  /* span 2 cols and 2 rows */
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 100px;
  margin-top: 12px;
}

.bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
}

.label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
.value { font-size: 26px; font-weight: 800; color: #1e293b; margin-top: 6px; }`,
  goalCss: `.dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.chart {
  grid-column: span 2;
  grid-row: span 2;
}
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; margin-top: 12px; }
.bar { flex: 1; border-radius: 4px 4px 0 0; }
.label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
.value { font-size: 26px; font-weight: 800; color: #1e293b; margin-top: 6px; }`,
  requiredProperties: [
    { selector: ".dashboard", property: "display", value: "grid" },
    { selector: ".chart", property: "grid-column", value: ["span 2", "1 / 3", "1 / span 2"] },
    { selector: ".chart", property: "grid-row", value: ["span 2", "1 / 3", "1 / span 2"] },
  ],
}

const g6: CssChallenge = {
  id: "g6",
  title: "Full Page Dashboard",
  topic: "grid",
  difficulty: "advanced",
  xp: 200,
  description:
    "Build a complete SaaS dashboard using `grid-template-areas`. The topbar spans the full width, followed by a 3-column body with nav, main content, and a widget panel.",
  hint: 'Define named areas: `"topbar topbar topbar"`, `"nav main widgets"`. Assign `grid-area` to each element, and set column widths with `grid-template-columns: 180px 1fr 220px`.',
  htmlTemplate: `
<div class="app">
  <header class="topbar">
    <span class="brand">CodeKing</span>
    <div class="topbar-right">
      <span class="notif">🔔</span>
      <span class="avatar">KA</span>
    </div>
  </header>
  <nav class="nav">
    <div class="nav-item active">Dashboard</div>
    <div class="nav-item">Modules</div>
    <div class="nav-item">Missions</div>
    <div class="nav-item">Profile</div>
  </nav>
  <main class="main">
    <h2>Dashboard</h2>
    <p>Your learning journey at a glance.</p>
    <div class="cards">
      <div class="mini-card" style="background:#6366f1">XP: 18,420</div>
      <div class="mini-card" style="background:#22c55e">Level: 24</div>
      <div class="mini-card" style="background:#f59e0b">Streak: 14</div>
    </div>
  </main>
  <aside class="widgets">
    <div class="widget">Next Mission</div>
    <div class="widget">Top Scores</div>
  </aside>
</div>`,
  startingCss: `.app {
  display: grid;
  height: 360px;
  grid-template-columns: 180px 1fr 220px;
  grid-template-rows: 52px 1fr;
  /* define grid-template-areas */
}

.topbar {
  /* grid-area: ? */
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.brand { color: #6366f1; font-weight: 800; font-size: 15px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.notif { font-size: 16px; }
.avatar { width: 28px; height: 28px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }

.nav {
  /* grid-area: ? */
  background: #1e293b;
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  gap: 4px;
  overflow: hidden;
}
.nav-item { color: #94a3b8; font-size: 13px; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
.nav-item.active { background: rgba(99,102,241,0.15); color: #6366f1; font-weight: 600; }

.main {
  /* grid-area: ? */
  background: #f8fafc;
  padding: 20px;
  overflow-y: auto;
}
.main h2 { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.main p { font-size: 13px; color: #64748b; margin-bottom: 14px; }
.cards { display: flex; gap: 10px; }
.mini-card { flex: 1; color: #fff; border-radius: 8px; padding: 12px; font-size: 13px; font-weight: 600; }

.widgets {
  /* grid-area: ? */
  background: #fff;
  border-left: 1px solid #e2e8f0;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}
.widget { background: #f1f5f9; border-radius: 8px; padding: 14px; font-size: 13px; font-weight: 600; color: #475569; }`,
  goalCss: `.app {
  display: grid;
  height: 360px;
  grid-template-columns: 180px 1fr 220px;
  grid-template-rows: 52px 1fr;
  grid-template-areas:
    "topbar topbar topbar"
    "nav main widgets";
}
.topbar { grid-area: topbar; background: #0f172a; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
.brand { color: #6366f1; font-weight: 800; font-size: 15px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.notif { font-size: 16px; }
.avatar { width: 28px; height: 28px; border-radius: 50%; background: #6366f1; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
.nav { grid-area: nav; background: #1e293b; display: flex; flex-direction: column; padding: 12px 8px; gap: 4px; overflow: hidden; }
.nav-item { color: #94a3b8; font-size: 13px; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
.nav-item.active { background: rgba(99,102,241,0.15); color: #6366f1; font-weight: 600; }
.main { grid-area: main; background: #f8fafc; padding: 20px; overflow-y: auto; }
.main h2 { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.main p { font-size: 13px; color: #64748b; margin-bottom: 14px; }
.cards { display: flex; gap: 10px; }
.mini-card { flex: 1; color: #fff; border-radius: 8px; padding: 12px; font-size: 13px; font-weight: 600; }
.widgets { grid-area: widgets; background: #fff; border-left: 1px solid #e2e8f0; padding: 16px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
.widget { background: #f1f5f9; border-radius: 8px; padding: 14px; font-size: 13px; font-weight: 600; color: #475569; }`,
  requiredProperties: [
    { selector: ".app", property: "display", value: "grid" },
    { selector: ".topbar", property: "grid-area", value: "topbar" },
    { selector: ".nav", property: "grid-area", value: "nav" },
    { selector: ".main", property: "grid-area", value: "main" },
    { selector: ".widgets", property: "grid-area", value: "widgets" },
  ],
}

export const CSS_CHALLENGES: CssChallenge[] = [f1, f2, f3, f4, f5, f6, g1, g2, g3, g4, g5, g6]

export const FLEXBOX_CHALLENGES = CSS_CHALLENGES.filter((c) => c.topic === "flexbox")
export const GRID_CHALLENGES = CSS_CHALLENGES.filter((c) => c.topic === "grid")

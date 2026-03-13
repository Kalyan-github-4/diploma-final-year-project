/**
 * Real-World Context Templates
 * Defines practical HTML structures and use cases for layout engineering challenges
 */

import type { RealWorldContextMap } from '@/types/layout-engineering.types'

/**
 * Real-world learning contexts - each shapes a category of challenges
 * Users see the practical relevance of each layout concept
 */
export const realWorldContexts: RealWorldContextMap = {
  navbar: {
    name: 'Navigation Bar',
    description:
      'Create a responsive header navigation component used on almost every website.',
    htmlTemplate: `
      <nav class="navbar">
        <div class="navbar-brand">Logo</div>
        <ul class="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <button class="nav-toggle">Menu</button>
      </nav>
    `,
    realWorldUse:
      'Navigation bars are fundamental to every website. Learn to position a logo on the left, menu items in the center, and action buttons on the right using Flexbox row layout.',
    commonCSSSelectors: ['.navbar', '.navbar-brand', '.nav-links', '.nav-toggle'],
  },

  dashboard: {
    name: 'Admin Dashboard',
    description:
      'Build a multi-panel dashboard layout with sidebar, header, and content areas.',
    htmlTemplate: `
      <div class="dashboard">
        <aside class="sidebar">
          <div class="sidebar-header">Dashboard</div>
          <nav class="sidebar-nav">
            <a href="#" class="nav-item">Overview</a>
            <a href="#" class="nav-item">Analytics</a>
            <a href="#" class="nav-item">Settings</a>
          </nav>
        </aside>
        <main class="main-content">
          <header class="dashboard-header">
            <h1>Welcome</h1>
            <div class="user-menu">Profile</div>
          </header>
          <section class="dashboard-cards">
            <div class="card">Card 1</div>
            <div class="card">Card 2</div>
            <div class="card">Card 3</div>
            <div class="card">Card 4</div>
          </section>
        </main>
      </div>
    `,
    realWorldUse:
      'Admin dashboards and SaaS applications use sidebar + main content layouts. Master multi-level layouts with nested flexbox and grid structures.',
    commonCSSSelectors: [
      '.dashboard',
      '.sidebar',
      '.main-content',
      '.dashboard-header',
      '.dashboard-cards',
      '.card',
    ],
  },

  'card-grid': {
    name: 'Responsive Card Grid',
    description: 'Build a responsive grid of cards for products, portfolio, or blog posts.',
    htmlTemplate: `
      <section class="card-grid">
        <article class="card">
          <div class="card-image">Image</div>
          <div class="card-content">
            <h3>Product Title</h3>
            <p>Description</p>
          </div>
          <div class="card-footer">
            <span class="price">$49</span>
            <button>Add to Cart</button>
          </div>
        </article>
        <article class="card">
          <div class="card-image">Image</div>
          <div class="card-content">
            <h3>Product Title</h3>
            <p>Description</p>
          </div>
          <div class="card-footer">
            <span class="price">$49</span>
            <button>Add to Cart</button>
          </div>
        </article>
        <article class="card">
          <div class="card-image">Image</div>
          <div class="card-content">
            <h3>Product Title</h3>
            <p>Description</p>
          </div>
          <div class="card-footer">
            <span class="price">$49</span>
            <button>Add to Cart</button>
          </div>
        </article>
        <article class="card">
          <div class="card-image">Image</div>
          <div class="card-content">
            <h3>Product Title</h3>
            <p>Description</p>
          </div>
          <div class="card-footer">
            <span class="price">$49</span>
            <button>Add to Cart</button>
          </div>
        </article>
      </section>
    `,
    realWorldUse:
      'E-commerce, portfolio, and gallery sites use card grids for displaying products, projects, and content. Learn responsive grid layouts with auto-fit and minmax.',
    commonCSSSelectors: [
      '.card-grid',
      '.card',
      '.card-image',
      '.card-content',
      '.card-footer',
    ],
  },

  form: {
    name: 'Form Layout',
    description: 'Create a well-structured contact or registration form.',
    htmlTemplate: `
      <form class="form-container">
        <h2>Contact Us</h2>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" placeholder="Your name" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" placeholder="Your message" rows="4"></textarea>
        </div>
        <div class="form-actions">
          <button type="reset">Clear</button>
          <button type="submit">Send</button>
        </div>
      </form>
    `,
    realWorldUse:
      'Forms are critical for user input on websites. Learn to align labels, inputs, and buttons properly with Flexbox column layout and responsive wrapping.',
    commonCSSSelectors: [
      '.form-container',
      '.form-group',
      'label',
      'input',
      'textarea',
      '.form-actions',
      'button',
    ],
  },

  sidebar: {
    name: 'Sidebar Navigation',
    description: 'Build a collapsible sidebar with expandable menu items.',
    htmlTemplate: `
      <div class="sidebar-layout">
        <aside class="sidebar">
          <div class="sidebar-toggle">☰</div>
          <div class="sidebar-content">
            <div class="sidebar-section">
              <h3>Main</h3>
              <ul>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Profile</a></li>
              </ul>
            </div>
            <div class="sidebar-section">
              <h3>Settings</h3>
              <ul>
                <li><a href="#">Preferences</a></li>
                <li><a href="#">Account</a></li>
              </ul>
            </div>
          </div>
        </aside>
        <main class="sidebar-content-area">
          <h1>Content Area</h1>
          <p>Main content goes here</p>
        </main>
      </div>
    `,
    realWorldUse:
      'Sidebars are common in apps and dashboards. Learn to create flexible layouts where the sidebar collapses and content expands accordingly.',
    commonCSSSelectors: [
      '.sidebar-layout',
      '.sidebar',
      '.sidebar-toggle',
      '.sidebar-content',
      '.sidebar-section',
      '.sidebar-content-area',
    ],
  },
}

/**
 * Get a specific context by name
 */
export function getContextTemplate(contextName: string) {
  const context = realWorldContexts[contextName as keyof typeof realWorldContexts]
  if (!context) {
    throw new Error(`Unknown real-world context: ${contextName}`)
  }
  return context
}

/**
 * Get all available context names
 */
export function getAllContextNames(): string[] {
  return Object.keys(realWorldContexts)
}

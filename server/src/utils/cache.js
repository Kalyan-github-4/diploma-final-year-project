/**
 * Simple in-memory TTL cache.
 * Stores values with a configurable time-to-live (default 5 minutes).
 * Stale entries are lazily evicted on the next get().
 */

class MemoryCache {
  constructor(defaultTtlMs = 5 * 60 * 1000) {
    this._store = new Map()
    this._defaultTtl = defaultTtlMs
  }

  get(key) {
    const entry = this._store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key)
      return null
    }
    return entry.value
  }

  set(key, value, ttlMs) {
    this._store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this._defaultTtl),
    })
  }

  invalidate(key) {
    this._store.delete(key)
  }

  clear() {
    this._store.clear()
  }
}

// Singleton — shared across routes
const cache = new MemoryCache()

module.exports = { cache, MemoryCache }

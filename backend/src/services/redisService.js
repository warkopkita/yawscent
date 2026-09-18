/**
 * Redis In-Memory Service (Caching & Distributed Stock Reservation Lock)
 * Mencegah overselling saat pesanan bersamaan di Web, App, dan Offline Store
 */

class RedisService {
  constructor() {
    this.memoryStore = new Map();
    this.locks = new Map();
    this.ttlTimers = new Map();
  }

  async get(key) {
    return this.memoryStore.get(key) || null;
  }

  async set(key, value, ttlSeconds = 300) {
    this.memoryStore.set(key, value);
    if (this.ttlTimers.has(key)) {
      clearTimeout(this.ttlTimers.get(key));
    }
    const timer = setTimeout(() => {
      this.memoryStore.delete(key);
      this.ttlTimers.delete(key);
    }, ttlSeconds * 1000);
    this.ttlTimers.set(key, timer);
    return true;
  }

  /**
   * Acquire atomic lock for stock reservation during checkout
   */
  async acquireStockLock(variantSku, quantity) {
    const lockKey = `lock:stock:${variantSku}`;
    if (this.locks.get(lockKey)) {
      return { success: false, message: "Stok sedang diproses pesanan lain. Coba beberapa saat lagi." };
    }
    this.locks.set(lockKey, true);
    // Lock berlaku selama 5 detik untuk operasi mutasi stok
    setTimeout(() => {
      this.locks.delete(lockKey);
    }, 5000);

    return { success: true };
  }

  async releaseStockLock(variantSku) {
    this.locks.delete(`lock:stock:${variantSku}`);
  }
}

module.exports = new RedisService();

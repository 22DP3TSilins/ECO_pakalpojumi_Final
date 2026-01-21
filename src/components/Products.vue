<template>
  <div class="products-page">
    <!-- Hero Section -->
    <div class="products-hero">
      <div class="hero-content">
        <h1>{{ t('products.title') }}</h1>
        <p>{{ t('products.subtitle') }}</p>
        <div class="hero-search">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="t('products.searchPlaceholder')"
          />
        </div>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-number">{{ products.length }}</span>
          <span class="stat-label">{{ t('products.productsCount') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="hero-stat">
          <span class="stat-number">{{ categories.length }}</span>
          <span class="stat-label">{{ t('products.categoriesCount') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="hero-stat">
          <span class="stat-number">100%</span>
          <span class="stat-label">{{ t('products.ecoFriendly') }}</span>
        </div>
      </div>
    </div>

    <div class="products-container">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar">
        <div class="filter-card">
          <h3>{{ t('products.categories') }}</h3>
          <div class="category-list">
            <button 
              :class="['category-btn', { active: selectedCategory === '' }]"
              @click="selectedCategory = ''"
            >
              <span>{{ t('products.allProducts') }}</span>
              <span class="cat-count">{{ products.length }}</span>
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat"
              :class="['category-btn', { active: selectedCategory === cat }]"
              @click="selectedCategory = cat"
            >
              <span>{{ cat }}</span>
              <span class="cat-count">{{ getCategoryCount(cat) }}</span>
            </button>
          </div>
        </div>

        <div class="filter-card">
          <h3>{{ t('products.priceRange') }}</h3>
          <div class="price-range">
            <input type="range" v-model="maxPrice" min="0" :max="priceLimit" :step="priceLimit > 1000 ? 100 : 5" />
            <div class="price-labels">
              <span>€0</span>
              <span class="price-value">{{ t('products.upTo') }} €{{ formatPrice(maxPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="filter-card">
          <h3>{{ t('products.availability') }}</h3>
          <label class="checkbox-option">
            <input type="checkbox" v-model="showAvailableOnly" />
            <span class="checkbox-mark"></span>
            <span>{{ t('products.inStockOnly') }}</span>
          </label>
        </div>

        <div class="filter-card">
          <h3>{{ t('products.sortBy') }}</h3>
          <select v-model="sortBy" class="sort-select">
            <option value="default">{{ t('products.sortDefault') }}</option>
            <option value="price-low">{{ t('products.sortPriceLow') }}</option>
            <option value="price-high">{{ t('products.sortPriceHigh') }}</option>
            <option value="name">{{ t('products.sortName') }}</option>
          </select>
        </div>

        <button class="reset-filters" @click="resetFilters">
          {{ t('products.resetFilters') }}
        </button>
      </aside>

      <!-- Products Grid -->
      <div class="products-main">
        <div class="products-header-bar">
          <p class="results-count">
            {{ t('products.showing') }} <strong>{{ displayProducts.length }}</strong> {{ t('products.productsCount') }}
          </p>
          <div class="view-toggle">
            <button :class="['view-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button :class="['view-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading eco products...</p>
        </div>

        <div v-else-if="displayProducts.length === 0" class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search query</p>
          <button class="reset-btn" @click="resetFilters">{{ t('products.resetFilters') }}</button>
        </div>

        <div v-else :class="['products-grid', viewMode]">
          <div 
            v-for="product in displayProducts" 
            :key="product.id" 
            :class="['product-card', viewMode]"
          >
            <div class="product-badges">
              <span v-if="product.stock < 5 && product.stock > 0" class="badge low-stock">
                Only {{ product.stock }} left!
              </span>
              <span v-if="product.isNew" class="badge new">NEW</span>
              <span v-if="product.isFeatured" class="badge featured">Featured</span>
            </div>
            
            <div class="product-image">
              <img 
                v-if="product.image_url" 
                :src="product.image_url" 
                :alt="product.name"
                @error="handleImageError"
              />
              <div v-else class="no-image">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="product-overlay">
                <button class="quick-view-btn" @click="quickView(product)">
                  Quick View
                </button>
              </div>
            </div>
            
            <div class="product-content">
              <div class="product-category">{{ product.category }}</div>
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ truncateText(product.description, 80) }}</p>
              
              <div class="product-footer">
                <div class="price-section">
                  <span class="current-price">€{{ product.price.toFixed(2) }}</span>
                </div>
                <div class="stock-status" :class="{ 'out-of-stock': product.stock === 0 }">
                  {{ product.stock > 0 ? `${product.stock} ${t('products.inStock')}` : t('products.outOfStock') }}
                </div>
              </div>

              <div v-if="product.lifecycle_info" class="eco-badge">
                <span class="eco-icon">🌱</span>
                {{ truncateText(product.lifecycle_info, 50) }}
              </div>
              
              <button 
                class="add-to-cart-btn"
                @click="addToCart(product)"
                :disabled="product.stock === 0"
              >
                <span v-if="product.stock === 0">Out of Stock</span>
                <span v-else-if="addingToCart === product.id">Adding...</span>
                <span v-else>🛒 Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <div v-if="showQuickView" class="modal-overlay" @click.self="showQuickView = false">
      <div class="quick-view-modal">
        <button class="close-modal" @click="showQuickView = false">✕</button>
        <div class="modal-content">
          <div class="modal-image">
            <img 
              v-if="selectedProduct.image_url" 
              :src="selectedProduct.image_url" 
              :alt="selectedProduct.name"
            />
            <div v-else class="no-image large">🌱</div>
          </div>
          <div class="modal-info">
            <span class="modal-category">{{ selectedProduct.category }}</span>
            <h2>{{ selectedProduct.name }}</h2>
            <p class="modal-description">{{ selectedProduct.description }}</p>
            
            <div v-if="selectedProduct.lifecycle_info" class="modal-lifecycle">
              <h4>🌱 {{ t('products.lifecycle') }}</h4>
              <p>{{ selectedProduct.lifecycle_info }}</p>
            </div>
            
            <div class="modal-price">€{{ selectedProduct.price?.toFixed(2) }}</div>
            
            <div class="modal-stock" :class="{ 'out': selectedProduct.stock === 0 }">
              {{ selectedProduct.stock > 0 ? `${selectedProduct.stock} ${t('products.inStock')}` : t('products.outOfStock') }}
            </div>
            
            <div class="modal-actions">
              <div class="quantity-selector">
                <button @click="modalQuantity > 1 && modalQuantity--">−</button>
                <span>{{ modalQuantity }}</span>
                <button @click="modalQuantity < selectedProduct.stock && modalQuantity++">+</button>
              </div>
              <button 
                class="modal-add-btn"
                @click="addToCartFromModal"
                :disabled="selectedProduct.stock === 0"
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'ProductsPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      products: [],
      categories: [],
      selectedCategory: '',
      showAvailableOnly: false,
      searchQuery: '',
      maxPrice: 100000,
      priceLimit: 100000,
      sortBy: 'default',
      viewMode: 'grid',
      loading: true,
      addingToCart: null,
      showQuickView: false,
      selectedProduct: {},
      modalQuantity: 1
    }
  },
  computed: {
    displayProducts() {
      let result = [...this.products];
      
      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
        );
      }
      
      // Category filter
      if (this.selectedCategory) {
        result = result.filter(p => p.category === this.selectedCategory);
      }
      
      // Availability filter
      if (this.showAvailableOnly) {
        result = result.filter(p => p.stock > 0);
      }
      
      // Price filter
      result = result.filter(p => p.price <= this.maxPrice);
      
      // Sorting
      if (this.sortBy === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return result;
    }
  },
  mounted() {
    this.loadProducts();
    // Check for search query in URL
    if (this.$route.query.search) {
      this.searchQuery = this.$route.query.search;
    }
  },
  watch: {
    '$route.query.search'(newSearch) {
      this.searchQuery = newSearch || '';
    }
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/api/products');
        if (response.ok) {
          const data = await response.json();
          this.products = Array.isArray(data) ? data : (data.products || []);
          this.categories = [...new Set(this.products.map(p => p.category).filter(Boolean))];
          // Set price limit based on actual product prices
          if (this.products.length > 0) {
            const highestPrice = Math.max(...this.products.map(p => p.price || 0));
            this.priceLimit = Math.ceil(highestPrice / 100) * 100; // Round up to nearest 100
            this.maxPrice = this.priceLimit;
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        this.loading = false;
      }
    },
    handleImageError(e) {
      e.target.style.display = 'none';
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    },
    getCategoryIcon(category) {
      const icons = {
        'Home': '🏠',
        'Kitchen': '🍳',
        'Garden': '🌱',
        'Beauty': '✨',
        'Fashion': '👕',
        'Electronics': '📱',
        'Office': '📎',
        'Food': '🥗'
      };
      return icons[category] || '📦';
    },
    getCategoryCount(category) {
      return this.products.filter(p => p.category === category).length;
    },
    resetFilters() {
      this.selectedCategory = '';
      this.showAvailableOnly = false;
      this.searchQuery = '';
      this.maxPrice = this.priceLimit;
      this.sortBy = 'default';
    },
    formatPrice(price) {
      if (price >= 1000) {
        return (price / 1000).toFixed(1) + 'K';
      }
      return price;
    },
    quickView(product) {
      this.selectedProduct = product;
      this.modalQuantity = 1;
      this.showQuickView = true;
    },
    async addToCart(product) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      this.addingToCart = product.id;
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: product.id, quantity: 1 })
        });

        if (response.ok) {
          // Success feedback could be added here
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        setTimeout(() => {
          this.addingToCart = null;
        }, 500);
      }
    },
    async addToCartFromModal() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      try {
        await fetch('http://localhost:3000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            product_id: this.selectedProduct.id, 
            quantity: this.modalQuantity 
          })
        });
        this.showQuickView = false;
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  }
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 60px;
}

/* Hero Section */
.products-hero {
  padding: 100px 24px 60px;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  text-align: center;
}

.hero-content h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -0.02em;
}

.hero-content p {
  margin: 0 0 24px;
  color: var(--text-secondary);
  font-size: 1rem;
}

.hero-search {
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 0 auto 32px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.hero-search .search-icon {
  margin-left: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.hero-search input {
  flex: 1;
  padding: 14px 16px;
  border: none;
  font-size: 0.95rem;
  color: var(--text-color);
  background: transparent;
}

.hero-search input::placeholder {
  color: var(--text-muted);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* Container */
.products-container {
  max-width: 1200px;
  margin: 32px auto 0;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

/* Filters Sidebar */
.filters-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 1px solid var(--border-color);
}

.filter-card h3 {
  margin: 0 0 14px;
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 600;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.875rem;
  transition: all 0.2s;
  text-align: left;
}

.category-btn:hover {
  background: var(--primary-subtle);
  color: var(--primary);
}

.category-btn.active {
  background: var(--primary);
  color: white;
}

.cat-count {
  margin-left: auto;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 100px;
  font-size: 0.75rem;
}

.dark .cat-count {
  background: rgba(255, 255, 255, 0.1);
}

.category-btn.active .cat-count {
  background: rgba(255, 255, 255, 0.2);
}

/* Price Range */
.price-range input[type="range"] {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  margin: 8px 0;
}

.price-range input[type="range"]::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 4px;
  background: var(--border-color);
}

.price-range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 4px var(--primary), 0 2px 6px rgba(0, 0, 0, 0.15);
  border: none;
  margin-top: -5px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.price-range input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 5px var(--primary), 0 3px 8px rgba(0, 0, 0, 0.2);
}

.price-range input[type="range"]::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: var(--border-color);
}

.price-range input[type="range"]::-moz-range-progress {
  background: var(--primary);
  height: 8px;
  border-radius: 4px;
}

.price-range input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 0 4px var(--primary), 0 2px 6px rgba(0, 0, 0, 0.15);
  border: none;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.price-value {
  color: var(--primary);
  font-weight: 500;
}

/* Checkbox */
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.875rem;
}

.checkbox-option input {
  display: none;
}

.checkbox-mark {
  width: 18px;
  height: 18px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-option input:checked + .checkbox-mark {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-option input:checked + .checkbox-mark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.7rem;
}

/* Sort Select */
.sort-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
}

.reset-filters {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.reset-filters:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Products Main */
.products-main {
  min-height: 400px;
}

.products-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 14px 16px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.results-count {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

.view-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn.active {
  background: var(--primary);
  color: white;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  color: var(--text-muted);
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1rem;
}

.empty-state p {
  margin: 0 0 20px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.reset-btn {
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}

.reset-btn:hover {
  background: var(--primary-dark);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.products-grid.list {
  grid-template-columns: 1fr;
}

/* Product Card */
.product-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
  position: relative;
}

.product-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow);
}

.product-card.list {
  display: grid;
  grid-template-columns: 180px 1fr;
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 5;
}

.badge {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 600;
}

.badge.low-stock {
  background: #ef4444;
  color: white;
}

.badge.new {
  background: #3b82f6;
  color: white;
}

.badge.featured {
  background: var(--primary);
  color: white;
}

.product-image {
  position: relative;
  height: 180px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-card.list .product-image {
  height: auto;
  min-height: 160px;
}

.product-image img {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.no-image {
  color: var(--text-muted);
}

.no-image.large svg {
  width: 48px;
  height: 48px;
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view-btn {
  padding: 10px 18px;
  background: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transform: translateY(10px);
  transition: all 0.2s;
}

.product-card:hover .quick-view-btn {
  transform: translateY(0);
}

.product-content {
  padding: 16px;
}

.product-category {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 6px;
}

.product-content h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

.product-description {
  margin: 0 0 12px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.stock-status {
  font-size: 0.75rem;
  color: var(--primary);
  padding: 4px 10px;
  background: var(--primary-subtle);
  border-radius: 100px;
}

.stock-status.out-of-stock {
  color: #ef4444;
  background: #fef2f2;
}

.dark .stock-status.out-of-stock {
  background: rgba(239, 68, 68, 0.1);
}

.eco-badge {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: var(--primary-subtle);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--text-color);
  margin-bottom: 12px;
}

.eco-icon {
  flex-shrink: 0;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  box-shadow: var(--shadow);
}

.add-to-cart-btn:disabled {
  background: var(--text-muted);
  cursor: not-allowed;
}

/* Quick View Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.quick-view-modal {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  animation: modalIn 0.2s ease;
  border: 1px solid var(--border-color);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-modal {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.1rem;
  z-index: 10;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.close-modal:hover {
  background: var(--border-color);
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.modal-image {
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  min-height: 360px;
}

.modal-image img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.modal-info {
  padding: 28px;
}

.modal-category {
  display: inline-block;
  padding: 4px 12px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 12px;
}

.modal-info h2 {
  margin: 0 0 12px;
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.modal-lifecycle {
  background: var(--primary-subtle);
  padding: 14px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

.modal-lifecycle h4 {
  margin: 0 0 6px;
  color: var(--primary);
  font-size: 0.85rem;
}

.modal-lifecycle p {
  margin: 0;
  color: var(--text-color);
  font-size: 0.85rem;
}

.modal-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.modal-stock {
  color: var(--primary);
  margin-bottom: 16px;
  font-size: 0.875rem;
}

.modal-stock.out {
  color: #ef4444;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 4px 10px;
}

.quantity-selector button {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-color);
}

.quantity-selector span {
  min-width: 28px;
  text-align: center;
  font-weight: 600;
  color: var(--text-color);
}

.modal-add-btn {
  flex: 1;
  padding: 12px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-add-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  box-shadow: var(--shadow);
}

.modal-add-btn:disabled {
  background: var(--text-muted);
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 900px) {
  .products-container {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    display: none;
  }

  .modal-content {
    grid-template-columns: 1fr;
  }

  .modal-image {
    min-height: 220px;
  }
}

@media (max-width: 600px) {
  .products-hero {
    padding: 80px 16px 40px;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .stat-divider {
    display: none;
  }

  .hero-stats {
    gap: 20px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>

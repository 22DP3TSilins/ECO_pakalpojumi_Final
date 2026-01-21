<template>
  <div class="cart-page">
    <!-- Hero Section -->
    <div class="cart-hero">
      <div class="hero-content">
        <h1>{{ t('cart.title') }}</h1>
        <p v-if="cart.length > 0">{{ cart.length }} {{ t('cart.itemsReady') }}</p>
        <p v-else>{{ t('cart.shoppingAwaits') }}</p>
      </div>
      <div class="hero-stats" v-if="cart.length > 0">
        <div class="hero-stat">
          <span class="stat-value">€{{ subtotal.toFixed(2) }}</span>
          <span class="stat-label">{{ t('cart.total') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-value">{{ Math.ceil(subtotal / 10) }}</span>
          <span class="stat-label">{{ t('cart.treesToPlant') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-value">0</span>
          <span class="stat-label">{{ t('cart.carbonCost') }}</span>
        </div>
      </div>
    </div>

    <div class="cart-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('cart.loading') }}</p>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cart.length === 0" class="empty-cart">
        <div class="empty-content">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <h3>{{ t('cart.empty') }}</h3>
          <p>{{ t('cart.discoverProducts') }}</p>
          <router-link to="/products" class="shop-btn">
            {{ t('cart.browseProducts') }}
          </router-link>
        </div>
        <div class="empty-suggestions">
          <h4>{{ t('cart.whyShopEco') }}</h4>
          <div class="suggestion-cards">
            <div class="suggestion-card">
              <span class="suggestion-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </span>
              <span>{{ t('cart.planetFriendly') }}</span>
            </div>
            <div class="suggestion-card">
              <span class="suggestion-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/></svg>
              </span>
              <span>{{ t('cart.sustainableMaterials') }}</span>
            </div>
            <div class="suggestion-card">
              <span class="suggestion-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.52 0 10-2.24 10-5v-4"/><path d="M2 17v-4"/><path d="M12 12c5.52 0 10-2.24 10-5S17.52 2 12 2 2 4.24 2 7s4.48 5 10 5Z"/><path d="M2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7"/></svg>
              </span>
              <span>{{ t('cart.carbonOffset') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-content">
        <!-- Cart Items Section -->
        <div class="cart-items-section">
          <div class="section-header">
            <h2>{{ t('cart.cartItems') }}</h2>
            <button class="clear-all-btn" @click="clearCart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 6 20 18 20 19 6 21 6"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              {{ t('cart.clearAll') }}
            </button>
          </div>

          <div class="cart-items">
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <div class="item-checkbox">
                <input type="checkbox" :id="'item-' + item.id" checked disabled />
              </div>
              
              <div class="item-image">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" @error="handleImageError" />
                <div v-else class="no-image">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.52 0 10-2.24 10-5v-4"/><path d="M12 12c5.52 0 10-2.24 10-5S17.52 2 12 2 2 4.24 2 7"/></svg>
                </div>
                <span v-if="item.stock < 5" class="stock-badge">Only {{ item.stock }} left</span>
              </div>
              
              <div class="item-details">
                <div class="item-category">{{ t('cart.ecoProduct') }}</div>
                <h3>{{ item.name }}</h3>
                <div class="item-meta">
                  <span class="eco-tag">Eco-Friendly</span>
                  <span class="carbon-tag">Carbon Neutral</span>
                </div>
                <p v-if="item.stock < item.quantity" class="stock-warning">
                  Only {{ item.stock }} available in stock
                </p>
              </div>
              
              <div class="item-actions">
                <div class="quantity-control">
                  <button 
                    class="qty-btn minus" 
                    @click="updateQuantity(item.id, item.quantity - 1)" 
                    :disabled="item.quantity <= 1"
                  >−</button>
                  <input 
                    type="number" 
                    :value="item.quantity" 
                    @change="updateQuantity(item.id, parseInt($event.target.value) || 1)"
                    min="1"
                    :max="item.stock"
                    class="qty-input"
                  />
                  <button 
                    class="qty-btn plus" 
                    @click="updateQuantity(item.id, item.quantity + 1)" 
                    :disabled="item.quantity >= item.stock"
                  >+</button>
                </div>
                <div class="price-section">
                  <span class="unit-price">€{{ item.price.toFixed(2) }} each</span>
                  <span class="total-price">€{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              
              <button class="remove-btn" @click="removeItem(item.id)" title="Remove item">
                <span class="remove-icon">✕</span>
              </button>
            </div>
          </div>

          <!-- Continue Shopping -->
          <router-link to="/products" class="continue-shopping">
            ← {{ t('cart.continueShopping') }}
          </router-link>
        </div>

        <!-- Order Summary Section -->
        <div class="order-summary-section">
          <div class="summary-card">
            <h3>{{ t('cart.orderSummary') }}</h3>
            
            <div class="promo-code">
              <input type="text" placeholder="Enter promo code" v-model="promoCode" />
              <button @click="applyPromo" :disabled="!promoCode">Apply</button>
            </div>

            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal ({{ cart.length }} items)</span>
                <span>€{{ subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row discount" v-if="discount > 0">
                <span>Discount</span>
                <span class="discount-value">-€{{ discount.toFixed(2) }}</span>
              </div>
              
              <div class="summary-row">
                <span>{{ t('cart.ecoShipping') }}</span>
                <span class="free-badge">{{ t('cart.free').toUpperCase() }}</span>
              </div>
              
              <div class="summary-row">
                <span>{{ t('cart.carbonOffset') }}</span>
                <span class="included-badge">{{ t('common.included') }}</span>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-row total">
                <span>Total</span>
                <span>€{{ (subtotal - discount).toFixed(2) }}</span>
              </div>
            </div>

            <div class="eco-impact-card">
              <div class="impact-header">
                <span class="impact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </span>
                <span>Your Eco Impact</span>
              </div>
              <div class="impact-stats">
                <div class="impact-item">
                  <span class="impact-value">{{ Math.ceil(subtotal / 10) }}</span>
                  <span class="impact-label">Trees Planted</span>
                </div>
                <div class="impact-item">
                  <span class="impact-value">{{ (subtotal * 0.5).toFixed(1) }}kg</span>
                  <span class="impact-label">CO₂ Offset</span>
                </div>
              </div>
            </div>
            
            <button class="checkout-btn" @click="showCheckoutModal = true" :disabled="processing">
              <span>Proceed to Checkout</span>
              <span class="btn-arrow">→</span>
            </button>

            <div class="trust-badges">
              <div class="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure Checkout
              </div>
              <div class="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Fast Delivery
              </div>
              <div class="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>
                Easy Returns
              </div>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="payment-methods">
            <span>{{ t('cart.weAccept') }}</span>
            <div class="payment-icons">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="22"/><line x1="10" y1="18" x2="10" y2="22"/><line x1="14" y1="18" x2="14" y2="22"/><line x1="18" y1="18" x2="18" y2="22"/><path d="M4 18V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M2 6h20"/></svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div v-if="showCheckoutModal" class="modal-overlay" @click.self="showCheckoutModal = false">
      <div class="checkout-modal">
        <button class="close-modal" @click="showCheckoutModal = false">✕</button>
        
        <div class="modal-header">
          <div class="modal-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.52 0 10-2.24 10-5v-4"/><path d="M2 17v-4"/><path d="M12 12c5.52 0 10-2.24 10-5S17.52 2 12 2 2 4.24 2 7s4.48 5 10 5Z"/></svg>
          </div>
          <h3>Complete Your Purchase</h3>
          <p>Review your eco-friendly order</p>
        </div>
        
        <div class="modal-body">
          <div class="order-items">
            <div v-for="item in cart" :key="item.id" class="order-item">
              <div class="order-item-image">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" />
                <span v-else class="placeholder-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.52 0 10-2.24 10-5v-4"/></svg>
                </span>
              </div>
              <div class="order-item-details">
                <span class="order-item-name">{{ item.name }}</span>
                <span class="order-item-qty">Qty: {{ item.quantity }}</span>
              </div>
              <span class="order-item-price">€{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-totals">
            <div class="order-total-row">
              <span>Subtotal</span>
              <span>€{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="order-total-row" v-if="discount > 0">
              <span>Discount</span>
              <span>-€{{ discount.toFixed(2) }}</span>
            </div>
            <div class="order-total-row">
              <span>Shipping</span>
              <span class="free-text">FREE</span>
            </div>
            <div class="order-total-row final">
              <span>Total</span>
              <span>€{{ (subtotal - discount).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="eco-commitment">
            <div class="commitment-icon">🌱</div>
            <p>By completing this purchase, you're supporting sustainable practices and helping plant <strong>{{ Math.ceil(subtotal / 10) }} trees</strong>!</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="confirm-btn" @click="checkout" :disabled="processing">
            <span v-if="processing">Processing...</span>
            <span v-else>✓ Confirm Order • €{{ (subtotal - discount).toFixed(2) }}</span>
          </button>
          <button class="back-btn" @click="showCheckoutModal = false" :disabled="processing">
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="success-modal">
        <div class="success-animation">
          <div class="success-circle">
            <span class="success-check">✓</span>
          </div>
        </div>
        <h3>Order Placed Successfully!</h3>
        <p class="success-subtitle">Thank you for your eco-friendly purchase!</p>
        
        <div class="order-confirmation">
          <div class="confirmation-row">
            <span>Order Number</span>
            <span class="order-number">#{{ lastOrderId }}</span>
          </div>
          <div class="confirmation-row">
            <span>Estimated Delivery</span>
            <span>3-5 Business Days</span>
          </div>
        </div>
        
        <div class="impact-summary">
          <h4>🌍 Your Impact</h4>
          <div class="impact-grid">
            <div class="impact-box">
              <span class="impact-num">{{ treesPlanted }}</span>
              <span class="impact-text">Trees Planted</span>
            </div>
            <div class="impact-box">
              <span class="impact-num">{{ (treesPlanted * 21).toFixed(0) }}kg</span>
              <span class="impact-text">CO₂ Offset/Year</span>
            </div>
          </div>
        </div>
        
        <div class="success-actions">
          <router-link to="/products" class="primary-action" @click="showSuccessModal = false">
            🛍️ Continue Shopping
          </router-link>
          <router-link to="/profile" class="secondary-action" @click="showSuccessModal = false">
            📦 View Orders
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'CartPage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      cart: [],
      loading: true,
      processing: false,
      showCheckoutModal: false,
      showSuccessModal: false,
      lastOrderId: null,
      treesPlanted: 0,
      promoCode: '',
      discount: 0
    }
  },
  computed: {
    subtotal() {
      return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
  },
  mounted() {
    this.fetchCart();
  },
  methods: {
    async fetchCart() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          this.cart = data.cart || [];
        } else if (response.status === 401 || response.status === 403) {
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async updateQuantity(id, newQuantity) {
      if (newQuantity < 1) return;
      
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (response.ok) {
          const item = this.cart.find(i => i.id === id);
          if (item) {
            if (newQuantity <= 0) {
              this.cart = this.cart.filter(i => i.id !== id);
            } else {
              item.quantity = newQuantity;
            }
          }
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    
    async removeItem(id) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.cart = this.cart.filter(item => item.id !== id);
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    },
    
    async clearCart() {
      if (!confirm('Are you sure you want to clear your cart?')) return;
      
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:3000/api/cart', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          this.cart = [];
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    },
    
    applyPromo() {
      // Demo promo codes
      const codes = {
        'ECO10': 0.1,
        'GREEN20': 0.2,
        'PLANET15': 0.15
      };
      
      const discountRate = codes[this.promoCode.toUpperCase()];
      if (discountRate) {
        this.discount = this.subtotal * discountRate;
      } else {
        alert('Invalid promo code');
      }
    },
    
    async checkout() {
      const token = localStorage.getItem('token');
      this.processing = true;
      
      try {
        const response = await fetch('http://localhost:3000/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.lastOrderId = data.orderId;
          this.treesPlanted = Math.ceil(data.total / 10);
          this.showCheckoutModal = false;
          this.showSuccessModal = true;
          this.cart = [];
          this.discount = 0;
          this.promoCode = '';
        } else {
          alert(data.error || 'Checkout failed');
        }
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('Checkout failed. Please try again.');
      } finally {
        this.processing = false;
      }
    },
    
    handleImageError(e) {
      e.target.style.display = 'none';
    }
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 60px;
}

/* Hero Section */
.cart-hero {
  padding: 100px 20px 50px;
  background: var(--primary);
  color: white;
  text-align: center;
}

.hero-content h1 {
  margin: 0 0 8px;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.hero-content p {
  margin: 0;
  opacity: 0.85;
  font-size: 1rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.hero-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 600;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.85;
}

/* Container */
.cart-container {
  max-width: 1100px;
  margin: -24px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary);
  margin: 0;
}

/* Empty Cart */
.empty-cart {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.empty-content {
  text-align: center;
  padding: 50px 24px;
}

.empty-icon {
  margin-bottom: 16px;
  color: var(--text-secondary);
  opacity: 0.5;
}

.empty-content h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-content p {
  margin: 0 0 20px;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.shop-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.95rem;
  transition: var(--transition);
}

.shop-btn:hover {
  background: var(--primary-dark);
}

.empty-suggestions {
  background: var(--bg-color);
  padding: 24px;
  border-top: 1px solid var(--border-color);
}

.empty-suggestions h4 {
  margin: 0 0 16px;
  color: var(--text-color);
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
}

.suggestion-cards {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.suggestion-icon {
  color: var(--primary);
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
  align-items: start;
}

/* Cart Items Section */
.cart-items-section {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.section-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.clear-all-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
}

.clear-all-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  display: grid;
  grid-template-columns: 28px 90px 1fr auto 36px;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.dark .cart-item {
  background: rgba(255, 255, 255, 0.02);
}

.cart-item:hover {
  border-color: var(--primary);
}

.item-checkbox input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.item-image {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.item-image img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.no-image {
  color: var(--text-secondary);
  opacity: 0.5;
}

.stock-badge {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 6px;
  background: #dc2626;
  color: white;
  font-size: 0.65rem;
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

.item-details {
  min-width: 0;
}

.item-category {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.item-details h3 {
  margin: 0 0 6px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.eco-tag, .carbon-tag {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: var(--primary-subtle);
  color: var(--primary);
}

.stock-warning {
  color: #dc2626;
  font-size: 0.8rem;
  margin: 6px 0 0;
}

/* Item Actions */
.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-color);
  transition: var(--transition);
}

.qty-btn:hover:not(:disabled) {
  background: var(--primary-subtle);
  color: var(--primary);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 45px;
  height: 32px;
  border: none;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  background: transparent;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.price-section {
  text-align: right;
}

.unit-price {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.total-price {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary);
}

/* Remove Button */
.remove-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #fee2e2;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-icon {
  color: #dc2626;
}

.remove-btn:hover {
  background: #dc2626;
}

.remove-btn:hover .remove-icon {
  color: white;
}

/* Continue Shopping */
.continue-shopping {
  display: inline-block;
  margin-top: 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}

.continue-shopping:hover {
  color: var(--primary);
}

/* Order Summary Section */
.order-summary-section {
  position: sticky;
  top: 100px;
}

.summary-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.summary-card h3 {
  margin: 0 0 16px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

/* Promo Code */
.promo-code {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.promo-code input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-color);
  font-size: 0.9rem;
}

.promo-code button {
  padding: 10px 16px;
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.promo-code button:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.promo-code button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Summary Details */
.summary-details {
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.summary-row.discount .discount-value {
  color: var(--primary);
  font-weight: 500;
}

.free-badge {
  color: var(--primary);
  font-weight: 500;
}

.included-badge {
  color: var(--primary);
}

.summary-divider {
  height: 1px;
  background: var(--border-color);
  margin: 12px 0;
}

.summary-row.total {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 12px;
}

/* Eco Impact Card */
.eco-impact-card {
  background: var(--primary-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 16px;
}

.impact-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
}

.impact-icon {
  color: var(--primary);
}

.impact-stats {
  display: flex;
  gap: 10px;
}

.impact-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  background: var(--card-bg);
  border-radius: var(--radius-md);
}

.impact-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary);
}

.impact-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

/* Checkout Button */
.checkout-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.checkout-btn:hover:not(:disabled) {
  background: var(--primary-dark);
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-arrow {
  transition: transform 0.2s;
}

.checkout-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* Trust Badges */
.trust-badges {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.trust-badge {
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Payment Methods */
.payment-methods {
  margin-top: 16px;
  text-align: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.payment-methods span {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.payment-icons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
  color: var(--text-secondary);
}

/* Modal Styles */
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

.checkout-modal {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  max-width: 480px;
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
    transform: scale(0.97);
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
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal:hover {
  background: var(--border-color);
}

.modal-header {
  text-align: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
}

.modal-icon {
  color: var(--primary);
  margin-bottom: 8px;
}

.modal-header h3 {
  margin: 0 0 4px;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.modal-body {
  padding: 16px 24px;
}

.order-items {
  margin-bottom: 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.order-item-image {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.order-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.order-item-details {
  flex: 1;
}

.order-item-name {
  display: block;
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.9rem;
}

.order-item-qty {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.order-item-price {
  font-weight: 600;
  color: var(--text-color);
}

.order-totals {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: 12px;
  margin-bottom: 16px;
}

.dark .order-totals {
  background: rgba(255, 255, 255, 0.02);
}

.order-total-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.order-total-row.final {
  border-top: 1px solid var(--border-color);
  margin-top: 8px;
  padding-top: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.free-text {
  color: var(--primary);
  font-weight: 500;
}

.eco-commitment {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--primary-subtle);
  border-radius: var(--radius-lg);
  align-items: flex-start;
}

.commitment-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.eco-commitment p {
  margin: 0;
  color: var(--text-color);
  font-size: 0.85rem;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confirm-btn {
  padding: 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.confirm-btn:hover:not(:disabled) {
  background: var(--primary-dark);
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-btn {
  padding: 12px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9rem;
  transition: var(--transition);
}

.back-btn:hover {
  border-color: var(--text-secondary);
}

/* Success Modal */
.success-modal {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 32px 24px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  animation: modalIn 0.2s ease;
  border: 1px solid var(--border-color);
}

.success-animation {
  margin-bottom: 16px;
}

.success-circle {
  width: 72px;
  height: 72px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: successPop 0.4s ease;
}

@keyframes successPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.success-check {
  color: white;
}

.success-modal h3 {
  margin: 0 0 8px;
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 600;
}

.success-subtitle {
  margin: 0 0 20px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.order-confirmation {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: 12px;
  margin-bottom: 16px;
}

.dark .order-confirmation {
  background: rgba(255, 255, 255, 0.02);
}

.confirmation-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.order-number {
  font-weight: 600;
  color: var(--text-color);
}

.impact-summary {
  background: var(--primary-subtle);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 20px;
}

.impact-summary h4 {
  margin: 0 0 12px;
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 600;
}

.impact-grid {
  display: flex;
  gap: 10px;
}

.impact-box {
  flex: 1;
  padding: 12px;
  background: var(--card-bg);
  border-radius: var(--radius-md);
}

.impact-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
}

.impact-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary-action {
  padding: 14px;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.95rem;
  transition: var(--transition);
}

.primary-action:hover {
  background: var(--primary-dark);
}

.secondary-action {
  padding: 12px;
  background: transparent;
  color: var(--text-color);
  text-decoration: none;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  transition: var(--transition);
}

.secondary-action:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Responsive */
@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .order-summary-section {
    position: static;
  }
}

@media (max-width: 700px) {
  .cart-hero {
    padding: 90px 15px 40px;
  }

  .hero-content h1 {
    font-size: 1.75rem;
  }

  .hero-stats {
    gap: 24px;
  }

  .cart-item {
    grid-template-columns: 80px 1fr 36px;
    gap: 12px;
  }

  .item-checkbox {
    display: none;
  }

  .item-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .impact-grid {
    flex-direction: column;
  }
}
</style>

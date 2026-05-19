<template>
  <header class="app-header" :class="{ scrolled: isScrolled }">
    <nav class="navbar">
      <!-- Desktop Layout -->
      <div class="nav-left desktop-only">
        <router-link to="/" class="brand-link">
          <span class="brand-icon">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <path d="M16 4c-2 0-8 4-8 12s5 12 8 14c3-2 8-6 8-14s-6-12-8-12z" stroke="currentColor" stroke-width="1.8" fill="none"/>
              <path d="M16 8v14M12 14c2 3 6 3 8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="brand-text">Eco Pakalpojumi</span>
        </router-link>
      </div>

      <div class="nav-center desktop-only">
        <!-- Search Bar -->
        <div class="search-container" :class="{ expanded: searchExpanded }">
          <button class="search-toggle" @click="toggleSearch" v-if="!searchExpanded">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <div class="search-box" v-if="searchExpanded">
            <span class="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input 
              ref="searchInput"
              v-model="searchQuery" 
              type="text" 
              :placeholder="t('navbar.searchPlaceholder')"
              @keyup.enter="performSearch"
              @keyup.escape="closeSearch"
            />
            <span v-if="searchLoading" class="search-spinner">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </span>
            <button class="search-close" @click="closeSearch">×</button>
            
            <!-- Search Results Dropdown -->
            <div v-if="showSearchResults && searchQuery.length >= 2" class="search-results-dropdown">
              <div v-if="searchLoading" class="search-loading">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Searching...
              </div>
              <div v-else-if="!hasSearchResults" class="search-no-results">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
                No results found for "{{ searchQuery }}"
              </div>
              <div v-else class="search-results-content">
                <!-- Products Section -->
                <div v-if="searchResults.products.length > 0" class="search-section">
                  <div class="search-section-header">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    <span>Products</span>
                    <button @click="viewAllResults('products')" class="view-all-btn">View all</button>
                  </div>
                  <div 
                    v-for="product in searchResults.products" 
                    :key="'p-' + product.id" 
                    class="search-result-item"
                    @click="goToSearchResult('product', product)"
                  >
                    <span class="result-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                      </svg>
                    </span>
                    <div class="result-info">
                      <span class="result-title">{{ product.name }}</span>
                      <span class="result-meta">€{{ product.price?.toFixed(2) }} · {{ product.category }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Forum Posts Section -->
                <div v-if="searchResults.posts.length > 0" class="search-section">
                  <div class="search-section-header">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>Forum Posts</span>
                    <button @click="viewAllResults('posts')" class="view-all-btn">View all</button>
                  </div>
                  <div 
                    v-for="post in searchResults.posts" 
                    :key="'f-' + post.id" 
                    class="search-result-item"
                    @click="goToSearchResult('post', post)"
                  >
                    <span class="result-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </span>
                    <div class="result-info">
                      <span class="result-title">{{ post.title }}</span>
                      <span class="result-meta">by {{ post.author_name || 'Anonymous' }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Education Section -->
                <div v-if="searchResults.education.length > 0" class="search-section">
                  <div class="search-section-header">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                    <span>Education</span>
                    <button @click="viewAllResults('education')" class="view-all-btn">View all</button>
                  </div>
                  <div 
                    v-for="article in searchResults.education" 
                    :key="'e-' + article.id" 
                    class="search-result-item"
                    @click="goToSearchResult('education', article)"
                  >
                    <span class="result-icon">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    </span>
                    <div class="result-info">
                      <span class="result-title">{{ article.title }}</span>
                      <span class="result-meta">{{ article.category || 'Article' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="nav-links" v-show="!searchExpanded">
          <router-link to="/home" class="nav-link">
            {{ t('common.home') }}
          </router-link>
          <router-link to="/products" class="nav-link">
            {{ t('common.products') }}
          </router-link>
          <router-link to="/footprint" class="nav-link">
            {{ t('common.footprint') }}
          </router-link>
          <router-link to="/forum" class="nav-link">
            {{ t('common.forum') }}
          </router-link>
          <router-link v-if="user && user.role === 'admin'" to="/admin" class="nav-link admin-link">
            {{ t('common.admin') }}
          </router-link>
        </div>
      </div>

      <div class="nav-right desktop-only">
        <!-- Notifications -->
        <div v-if="user" class="notification-wrapper">
          <button class="notification-btn" @click="toggleNotifications" :class="{ active: notificationsOpen }">
            <svg class="notif-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
          </button>
          <div class="notification-dropdown" :class="{ active: notificationsOpen }">
            <div class="notif-header">
              <h4>{{ t('notifications.title') }}</h4>
              <button v-if="notifications.length > 0" class="mark-read" @click="markAllRead">{{ t('notifications.markAllRead') }}</button>
            </div>
            <div class="notif-list" v-if="notifications.length > 0">
              <div 
                v-for="notif in notifications" 
                :key="notif.id" 
                class="notif-item"
                :class="{ unread: !notif.read }"
                @click="handleNotification(notif)"
              >
                <span class="notif-item-icon"><Icon :name="notif.icon" :size="18" /></span>
                <div class="notif-content">
                  <p class="notif-text">{{ notif.message }}</p>
                  <span class="notif-time">{{ notif.time }}</span>
                </div>
              </div>
            </div>
            <div v-else class="notif-empty">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              <p>You're all caught up!</p>
            </div>
          </div>
        </div>

        <!-- Cart Button with Badge -->
        <router-link v-if="user" to="/cart" class="cart-button" title="Shopping Cart">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount > 9 ? '9+' : cartCount }}</span>
        </router-link>

        <div v-if="user" class="user-menu">
          <button class="user-button" @click="toggleUserDropdown">
            <div class="user-avatar" :class="getUserLevel()">
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="avatar-img" />
              <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-level">{{ getUserLevelName() }}</span>
            </div>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div class="user-dropdown" :class="{ active: userDropdownOpen }">
            <div class="user-dropdown-header">
              <div class="user-avatar-large" :class="getUserLevel()">
                <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="avatar-img" />
                <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="user-dropdown-info">
                <span class="user-dropdown-name">{{ user.name }}</span>
                <span class="user-dropdown-email">{{ user.email }}</span>
              </div>
            </div>
            <div class="user-dropdown-stats">
              <div class="stat-item">
                <span class="stat-value">{{ userStats.ecoPoints || 0 }}</span>
                <span class="stat-label">{{ t('navbar.ecoPoints') }}</span>
              </div>
            </div>
            <div class="user-dropdown-links">
              <router-link to="/profile" class="dropdown-item" @click="closeUserDropdown">
                <span class="dropdown-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                {{ t('navbar.myProfile') }}
              </router-link>
              <router-link to="/cart" class="dropdown-item" @click="closeUserDropdown">
                <span class="dropdown-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                </span>
                {{ t('navbar.myCart') }}
              </router-link>
            </div>
            <div class="user-dropdown-footer">
              <button class="dropdown-item logout-btn" @click="handleLogout">
                <span class="dropdown-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </span>
                {{ t('common.signOut') }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="auth-links">
          <router-link to="/login" class="auth-link">{{ t('common.login') }}</router-link>
          <router-link to="/register" class="auth-link primary">{{ t('common.signUp') }}</router-link>
        </div>

        <!-- Language Toggle -->
        <button @click="toggleLanguage" class="lang-toggle" :title="currentLanguage === 'lv' ? 'Switch to English' : 'Pārslēgties uz latviešu'">
          <span class="lang-icon">{{ currentLanguage === 'lv' ? 'LV' : 'EN' }}</span>
        </button>

        <button @click="toggleTheme" class="theme-toggle" :title="theme === 'light' ? t('navbar.darkMode') : t('navbar.lightMode')">
          <svg v-if="theme === 'light'" class="theme-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
          <svg v-else class="theme-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Layout -->
      <div class="mobile-header mobile-only">
        <router-link to="/" class="mobile-brand">
          <svg class="brand-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.252.744 4.33 2 6.004"/><path d="M12 6c-3 0-5.5 2.5-5.5 5.5S9 17 12 17s5.5-2.5 5.5-5.5S15 6 12 6z"/>
          </svg>
          <span class="brand-text">Eco</span>
        </router-link>
        
        <div class="mobile-actions">
          <!-- Mobile Search Toggle -->
          <button class="mobile-search-btn" @click="toggleMobileSearch">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          
          <!-- Mobile Cart -->
          <router-link v-if="user" to="/cart" class="mobile-cart-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            <span v-if="cartCount > 0" class="mobile-cart-badge">{{ cartCount }}</span>
          </router-link>
          
          <!-- Mobile Notifications -->
          <button v-if="user" class="mobile-notif-btn" @click="toggleNotifications">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span v-if="unreadCount > 0" class="mobile-notif-badge"></span>
          </button>
          
          <button @click="toggleMobileMenu" class="hamburger mobile-only" :class="{ active: mobileMenuOpen }">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
      
      <!-- Mobile Search Bar -->
      <div class="mobile-search-overlay" v-if="mobileSearchOpen">
        <div class="mobile-search-container">
          <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            ref="mobileSearchInput"
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products, posts..."
            @keyup.enter="performSearch"
          />
          <button class="search-close" @click="closeMobileSearch">×</button>
        </div>
        
        <!-- Mobile Search Results -->
        <div v-if="showSearchResults && searchQuery.length >= 2" class="mobile-search-results">
          <div v-if="searchLoading" class="search-loading">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Searching...
          </div>
          <div v-else-if="!hasSearchResults" class="search-no-results">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            No results found
          </div>
          <div v-else class="search-results-content">
            <!-- Products Section -->
            <div v-if="searchResults.products.length > 0" class="search-section">
              <div class="search-section-header">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span>Products</span>
              </div>
              <div 
                v-for="product in searchResults.products" 
                :key="'mp-' + product.id" 
                class="search-result-item"
                @click="goToSearchResult('product', product)"
              >
                <span class="result-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                </span>
                <div class="result-info">
                  <span class="result-title">{{ product.name }}</span>
                  <span class="result-meta">€{{ product.price?.toFixed(2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Forum Posts Section -->
            <div v-if="searchResults.posts.length > 0" class="search-section">
              <div class="search-section-header">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Forum Posts</span>
              </div>
              <div 
                v-for="post in searchResults.posts" 
                :key="'mf-' + post.id" 
                class="search-result-item"
                @click="goToSearchResult('post', post)"
              >
                <span class="result-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </span>
                <div class="result-info">
                  <span class="result-title">{{ post.title }}</span>
                </div>
              </div>
            </div>
            
            <!-- Education Section -->
            <div v-if="searchResults.education.length > 0" class="search-section">
              <div class="search-section-header">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                <span>Education</span>
              </div>
              <div 
                v-for="article in searchResults.education" 
                :key="'me-' + article.id" 
                class="search-result-item"
                @click="goToSearchResult('education', article)"
              >
                <span class="result-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </span>
                <div class="result-info">
                  <span class="result-title">{{ article.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
      <div class="mobile-menu" @click.stop>
        <div class="mobile-menu-header">
          <div class="mobile-brand-full">
            <svg class="brand-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.252.744 4.33 2 6.004"/><path d="M12 6c-3 0-5.5 2.5-5.5 5.5S9 17 12 17s5.5-2.5 5.5-5.5S15 6 12 6z"/>
            </svg>
            <span class="brand-text">Eco Pakalpojumi</span>
          </div>
          <button @click="closeMobileMenu" class="mobile-close">×</button>
        </div>

        <div class="mobile-menu-content">
          <!-- User Info -->
          <div v-if="user" class="mobile-user-info">
            <div class="user-avatar-large">
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="avatar-img" />
              <span v-else>{{ user.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="user-details">
              <div class="user-name">{{ user.name }}</div>
              <div class="user-email">{{ user.email }}</div>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="mobile-nav-links">
            <router-link to="/home" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              <span class="link-text">Home</span>
            </router-link>
            <router-link to="/products" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </span>
              <span class="link-text">Products</span>
            </router-link>
            <router-link to="/footprint" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              </span>
              <span class="link-text">Footprint</span>
            </router-link>
            <router-link to="/forum" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <span class="link-text">Forum</span>
            </router-link>
            <router-link v-if="user && user.role === 'admin'" to="/admin" @click="closeMobileMenu" class="mobile-nav-link">
              <span class="link-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
              </span>
              <span class="link-text">Admin</span>
            </router-link>
          </nav>

          <!-- Auth Actions -->
          <div v-if="!user" class="mobile-auth-actions">
            <router-link to="/login" @click="closeMobileMenu" class="mobile-auth-btn">
              <span class="btn-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <span class="btn-text">{{ t('common.login') }}</span>
            </router-link>
            <router-link to="/register" @click="closeMobileMenu" class="mobile-auth-btn primary">
              <span class="btn-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </span>
              <span class="btn-text">{{ t('common.signUp') }}</span>
            </router-link>
          </div>

          <!-- Mobile Sign Out -->
          <div v-if="user" class="mobile-auth-actions">
            <button @click="handleLogout" class="mobile-auth-btn logout">
              <span class="btn-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              <span class="btn-text">{{ t('common.signOut') }}</span>
            </button>
          </div>

          <!-- Language Toggle -->
          <div class="mobile-theme-toggle">
            <button @click="toggleLanguage" class="theme-toggle-btn">
              <span class="toggle-icon lang-mobile-icon">{{ currentLanguage === 'lv' ? 'LV' : 'EN' }}</span>
              <span class="toggle-text">{{ currentLanguage === 'lv' ? 'Pārslēgt uz English' : 'Switch to Latvian' }}</span>
            </button>
          </div>

          <!-- Theme Toggle -->
          <div class="mobile-theme-toggle">
            <button @click="toggleTheme" class="theme-toggle-btn">
              <svg v-if="theme === 'light'" class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
              </svg>
              <svg v-else class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <span class="toggle-text">{{ theme === 'light' ? t('navbar.darkMode') : t('navbar.lightMode') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth.js'
import api from '../utils/api.js'
import Icon from './common/Icon.vue'

export default {
  name: 'Navbar',
  components: { Icon },
  emits: ['theme-changed'],
  setup(props, { emit }) {
    const { t, locale } = useI18n()
    const router = useRouter()
    const authStore = useAuthStore()
    const mobileMenuOpen = ref(false)
    const theme = ref(localStorage.getItem('theme') || 'light')
    const user = computed(() => authStore.user)
    
    // Language switcher
    const currentLanguage = ref(localStorage.getItem('language') || 'lv')
    const toggleLanguage = () => {
      currentLanguage.value = currentLanguage.value === 'lv' ? 'en' : 'lv'
      locale.value = currentLanguage.value
      localStorage.setItem('language', currentLanguage.value)
    }
    
    // User avatar from customizations
    const userAvatar = ref('')
    
    // User stats from backend
    const userStats = ref({
      ecoPoints: 0,
      challengesCompleted: 0,
      cartCount: 0,
      level: 1
    })
    
    // Fetch user stats from backend
    const fetchUserStats = async () => {
      if (!user.value) return
      try {
        const { data } = await api.get('/api/user/stats')
        userStats.value = data
      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }
    
    // Load user customizations (avatar)
    const loadUserCustomizations = () => {
      if (user.value && user.value.id) {
        const saved = localStorage.getItem(`customizations_${user.value.id}`)
        if (saved) {
          const customizations = JSON.parse(saved)
          userAvatar.value = customizations.avatar || ''
        } else {
          userAvatar.value = ''
        }
      } else {
        userAvatar.value = ''
      }
    }
    
    // Watch for user changes to reload customizations
    watch(user, () => {
      loadUserCustomizations()
      if (user.value) {
        fetchUserStats()
      } else {
        userStats.value = { ecoPoints: 0, challengesCompleted: 0, cartCount: 0, level: 1 }
      }
    }, { immediate: true })
    
    // Scroll detection
    const isScrolled = ref(false)
    
    // Search
    const searchExpanded = ref(false)
    const searchQuery = ref('')
    const searchInput = ref(null)
    const mobileSearchOpen = ref(false)
    const mobileSearchInput = ref(null)
    const searchResults = ref({ products: [], posts: [], education: [] })
    const searchLoading = ref(false)
    const showSearchResults = ref(false)
    
    // Notifications
    const notificationsOpen = ref(false)
    const notifications = ref([])  // Fetched from backend
    
    const fetchNotifications = async () => {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) return
      try {
        const { data } = await api.get('/api/notifications')
        notifications.value = data.map(n => ({
          id: n.id,
          message: n.message,
          icon: n.icon || 'bell',
          read: !!n.read,
          time: formatTimeAgo(n.created_at),
          link: n.link
        }))
      } catch (e) {
        console.error('Failed to fetch notifications:', e)
      }
    }

    const formatTimeAgo = (dateStr) => {
      if (!dateStr) return ''
      const diff = Date.now() - new Date(dateStr).getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 1) return 'Just now'
      if (mins < 60) return `${mins}m ago`
      const hours = Math.floor(mins / 60)
      if (hours < 24) return `${hours}h ago`
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    }
    
    // Cart count from userStats
    const cartCount = computed(() => userStats.value.cartCount || 0)

    // Dropdown states
    const userDropdownOpen = ref(false)
    
    // Computed
    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

    // Scroll handler
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 20
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', theme.value)
      document.documentElement.setAttribute('data-theme', theme.value)
      emit('theme-changed', theme.value)
    }
    
    // Search functions
    const toggleSearch = () => {
      searchExpanded.value = true
      nextTick(() => {
        searchInput.value?.focus()
      })
    }
    
    const closeSearch = () => {
      searchExpanded.value = false
      searchQuery.value = ''
      showSearchResults.value = false
      searchResults.value = { products: [], posts: [], education: [] }
    }
    
    const toggleMobileSearch = () => {
      mobileSearchOpen.value = !mobileSearchOpen.value
      if (mobileSearchOpen.value) {
        nextTick(() => {
          mobileSearchInput.value?.focus()
        })
      }
    }
    
    const closeMobileSearch = () => {
      mobileSearchOpen.value = false
      searchQuery.value = ''
      showSearchResults.value = false
      searchResults.value = { products: [], posts: [], education: [] }
    }
    
    // Global search function
    const doGlobalSearch = async () => {
      const query = searchQuery.value.trim()
      if (!query || query.length < 2) {
        searchResults.value = { products: [], posts: [], education: [] }
        showSearchResults.value = false
        return
      }
      
      searchLoading.value = true
      showSearchResults.value = true
      
      try {
        // Fetch from all endpoints in parallel
        const [productsRes, postsRes, educationRes] = await Promise.all([
          api.get('/api/products').then(r => r.data).catch(() => []),
          api.get('/api/posts').then(r => r.data).catch(() => ({ posts: [] })),
          api.get('/api/education').then(r => r.data).catch(() => [])
        ])
        
        const searchLower = query.toLowerCase()
        
        // Filter products
        const products = (Array.isArray(productsRes) ? productsRes : productsRes.products || [])
          .filter(p => 
            p.name?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower) ||
            p.category?.toLowerCase().includes(searchLower)
          )
          .slice(0, 4)
        
        // Filter forum posts
        const posts = (postsRes.posts || postsRes || [])
          .filter(p => 
            p.title?.toLowerCase().includes(searchLower) ||
            p.content?.toLowerCase().includes(searchLower)
          )
          .slice(0, 4)
        
        // Filter education articles
        const education = (Array.isArray(educationRes) ? educationRes : [])
          .filter(e => 
            e.title?.toLowerCase().includes(searchLower) ||
            e.content?.toLowerCase().includes(searchLower) ||
            e.description?.toLowerCase().includes(searchLower)
          )
          .slice(0, 4)
        
        searchResults.value = { products, posts, education }
      } catch (error) {
        console.error('Search error:', error)
        searchResults.value = { products: [], posts: [], education: [] }
      } finally {
        searchLoading.value = false
      }
    }
    
    // Debounced search
    let searchTimeout = null
    watch(searchQuery, (newVal) => {
      clearTimeout(searchTimeout)
      if (newVal.trim().length >= 2) {
        searchTimeout = setTimeout(doGlobalSearch, 300)
      } else {
        showSearchResults.value = false
        searchResults.value = { products: [], posts: [], education: [] }
      }
    })
    
    const hasSearchResults = computed(() => {
      const r = searchResults.value
      return r.products.length > 0 || r.posts.length > 0 || r.education.length > 0
    })
    
    const goToSearchResult = (type, item) => {
      showSearchResults.value = false
      searchQuery.value = ''
      closeSearch()
      closeMobileSearch()
      
      if (type === 'product') {
        router.push({ path: '/products', query: { search: item.name } })
      } else if (type === 'post') {
        router.push({ path: '/forum', query: { post: item.id } })
      } else if (type === 'education') {
        router.push({ path: '/education', query: { article: item.id } })
      }
    }
    
    const viewAllResults = (type) => {
      const query = searchQuery.value
      showSearchResults.value = false
      closeSearch()
      closeMobileSearch()
      
      if (type === 'products') {
        router.push({ path: '/products', query: { search: query } })
      } else if (type === 'posts') {
        router.push({ path: '/forum', query: { search: query } })
      } else if (type === 'education') {
        router.push({ path: '/education', query: { search: query } })
      }
    }
    
    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({ path: '/products', query: { search: searchQuery.value } })
        closeSearch()
        closeMobileSearch()
        showSearchResults.value = false
      }
    }
    
    // Notification functions
    const toggleNotifications = () => {
      notificationsOpen.value = !notificationsOpen.value
      if (notificationsOpen.value) {
        userDropdownOpen.value = false
      }
    }
    
    const markAllRead = async () => {
      notifications.value.forEach(n => n.read = true)
      try {
        await api.put('/api/notifications/read-all')
      } catch (e) { /* ignore */ }
    }
    
    const handleNotification = async (notif) => {
      notif.read = true
      notificationsOpen.value = false
      try {
        await api.put(`/api/notifications/${notif.id}/read`)
      } catch (e) { /* ignore */ }
      if (notif.link) {
        router.push(notif.link)
      }
    }
    
    // User level functions
    const getUserLevel = () => {
      const level = userStats.value.level || 1
      if (level >= 10) return 'level-master'
      if (level >= 5) return 'level-pro'
      return 'level-eco'
    }
    
    const getUserLevelName = () => {
      const level = userStats.value.level || 1
      const keys = ['beginner', 'explorer', 'advocate', 'champion', 'master', 'legend']
      const key = keys[Math.min(level - 1, keys.length - 1)]
      return t(`profile.levelTitles.${key}`)
    }

    // Dropdown functions
    const toggleUserDropdown = () => {
      userDropdownOpen.value = !userDropdownOpen.value
      notificationsOpen.value = false
    }

    const closeUserDropdown = () => {
      userDropdownOpen.value = false
    }

    const logout = () => {
      authStore.logout()
      router.push('/')
    }

    const handleLogout = () => {
      logout()
      closeMobileMenu()
      closeUserDropdown()
    }

    onMounted(() => {
      // Listen for theme changes
      const currentTheme = localStorage.getItem('theme') || 'light'
      theme.value = currentTheme
      document.documentElement.setAttribute('data-theme', currentTheme)
      
      // Load user customizations
      loadUserCustomizations()
      
      // Fetch user stats
      if (user.value) {
        fetchUserStats()
        fetchNotifications()
      }
      
      // Add scroll listener
      window.addEventListener('scroll', handleScroll)
      
      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-wrapper')) {
          notificationsOpen.value = false
        }
      })
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      t,
      currentLanguage,
      toggleLanguage,
      mobileMenuOpen,
      theme,
      user,
      userAvatar,
      userStats,
      isScrolled,
      searchExpanded,
      searchQuery,
      searchInput,
      mobileSearchOpen,
      mobileSearchInput,
      searchResults,
      searchLoading,
      showSearchResults,
      hasSearchResults,
      notificationsOpen,
      notifications,
      unreadCount,
      cartCount,
      userDropdownOpen,
      toggleMobileMenu,
      closeMobileMenu,
      toggleTheme,
      toggleSearch,
      closeSearch,
      toggleMobileSearch,
      closeMobileSearch,
      performSearch,
      goToSearchResult,
      viewAllResults,
      toggleNotifications,
      markAllRead,
      handleNotification,
      getUserLevel,
      getUserLevelName,
      toggleUserDropdown,
      closeUserDropdown,
      logout,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-header {
  background: var(--nav-bg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

.app-header.scrolled {
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
  border-bottom-color: var(--border-color);
}

.navbar {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  gap: 24px;
}

/* Desktop Layout */
.nav-left {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color) !important;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-link:hover {
  transform: scale(1.02);
}

.brand-link:hover .brand-icon {
  box-shadow: 0 4px 16px rgba(13, 124, 95, 0.35);
  transform: rotate(-5deg);
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: var(--gradient-eco);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(13, 124, 95, 0.25);
}

.brand-text {
  font-size: 1.1rem;
  color: var(--text-color);
  letter-spacing: -0.02em;
  font-weight: 700;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

/* Search Bar */
.search-container {
  display: flex;
  align-items: center;
}

.search-toggle {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.search-toggle:hover {
  background: var(--border-color);
  color: var(--text-color);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
  gap: 8px;
  min-width: 280px;
  animation: expandSearch 0.2s ease;
}

@keyframes expandSearch {
  from { width: 36px; opacity: 0; }
  to { width: 280px; opacity: 1; }
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.search-icon {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.search-box input {
  flex: 1;
  border: none;
  background: none;
  color: var(--text-color);
  font-size: 0.9rem;
  outline: none;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.search-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.search-close:hover {
  color: var(--text-color);
}

/* Search Results Dropdown */
.search-results-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.search-loading,
.search-no-results {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.95em;
}

.search-loading span,
.search-no-results span {
  display: block;
  font-size: 1.5em;
  margin-bottom: 8px;
}

.search-section {
  border-bottom: 1px solid var(--border-color);
}

.search-section:last-child {
  border-bottom: none;
}

.search-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 8px;
  font-size: 0.8em;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-all-btn {
  background: none;
  border: none;
  color: #2ecc71;
  font-size: 0.9em;
  cursor: pointer;
  font-weight: 500;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-result-item:hover {
  background: var(--hover-bg, rgba(46, 204, 113, 0.1));
}

.result-icon {
  font-size: 1.2em;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border-radius: 8px;
  color: var(--primary);
}

.result-icon svg {
  stroke: var(--primary);
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  display: block;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  display: block;
  font-size: 0.85em;
  color: var(--text-secondary);
  margin-top: 2px;
}

.search-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile Search Results */
.mobile-search-results {
  background: var(--card-bg);
  margin: 8px 16px;
  border-radius: 12px;
  max-height: 60vh;
  overflow-y: auto;
}

.search-box {
  position: relative;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: var(--radius);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--gradient-eco);
  border-radius: 1px;
  transform: scaleX(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover {
  color: var(--primary);
  background: var(--primary-subtle);
}

.nav-link.router-link-active {
  color: var(--primary);
  background: var(--primary-subtle);
  font-weight: 600;
}

.nav-link.router-link-active::after {
  transform: scaleX(1);
}

.admin-link {
  color: #9b59b6;
}

.admin-link:hover {
  background: rgba(155, 89, 182, 0.1);
  color: #8e44ad;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Notifications */
.notification-wrapper {
  position: relative;
}

.notification-btn {
  background: none;
  border: 1.5px solid var(--border-color);
  width: 42px;
  height: 42px;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 1.2em;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-btn:hover {
  background: var(--primary-subtle);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.notification-btn.active {
  background: var(--primary-subtle);
  border-color: var(--primary);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  font-size: 0.65em;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: badgePop 0.3s ease;
}

@keyframes badgePop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.notification-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.notif-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notif-header h4 {
  margin: 0;
  color: var(--text-color);
}

.mark-read {
  background: none;
  border: none;
  color: #2ecc71;
  font-size: 0.85em;
  cursor: pointer;
  font-weight: 500;
}

.mark-read:hover {
  text-decoration: underline;
}

.notif-list {
  max-height: 300px;
  overflow-y: auto;
}

.notif-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid var(--border-color);
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover {
  background: rgba(46, 204, 113, 0.05);
}

.notif-item.unread {
  background: rgba(46, 204, 113, 0.08);
}

.notif-item-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-text {
  margin: 0 0 4px;
  color: var(--text-color);
  font-size: 0.9em;
  line-height: 1.4;
}

.notif-time {
  font-size: 0.8em;
  color: var(--text-secondary);
}

.notif-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-secondary);
}

.notif-empty span {
  font-size: 2.5em;
  display: block;
  margin-bottom: 10px;
}

.notif-empty p {
  margin: 0;
}

/* Cart Button */
.cart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--gradient-eco);
  border-radius: var(--radius);
  font-size: 1.2em;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(13, 124, 95, 0.25);
  position: relative;
  color: white;
}

.cart-button svg {
  stroke: white;
}

.cart-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(13, 124, 95, 0.4);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  font-size: 0.65em;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: 1.5px solid var(--border-color);
  cursor: pointer;
  padding: 5px 12px 5px 5px;
  border-radius: var(--radius-full);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-button:hover {
  border-color: var(--primary);
  background: var(--primary-subtle);
  transform: translateY(-1px);
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.9em;
  overflow: hidden;
}

.user-avatar .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-avatar.level-eco {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.user-avatar.level-pro {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.user-avatar.level-master {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9em;
  line-height: 1;
}

.user-level {
  font-size: 0.7em;
  color: #2ecc71;
  font-weight: 500;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 280px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-dropdown-header {
  padding: 20px;
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%);
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid var(--border-color);
}

.user-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1.2em;
  overflow: hidden;
}

.user-avatar-large .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-dropdown-info {
  flex: 1;
}

.user-dropdown-name {
  display: block;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
}

.user-dropdown-email {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.user-dropdown-stats {
  display: flex;
  justify-content: center;
  padding: 12px 20px;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.3em;
  font-weight: 700;
  color: #2ecc71;
}

.stat-label {
  font-size: 0.75em;
  color: var(--text-secondary);
}

.user-dropdown-links {
  padding: 8px 0;
}

.user-dropdown-links .dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.15s ease;
}

.user-dropdown-links .dropdown-item:hover {
  background: var(--bg-secondary);
}

.user-dropdown-links .dropdown-icon,
.user-dropdown-footer .dropdown-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.user-dropdown-links .dropdown-icon svg,
.user-dropdown-footer .dropdown-icon svg {
  stroke: var(--text-secondary);
}

.user-dropdown-footer {
  border-top: 1px solid var(--border-color);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #e74c3c !important;
  font-size: 0.95em;
  transition: all 0.15s ease;
}

.logout-btn .dropdown-icon svg {
  stroke: #e74c3c;
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 0.1) !important;
}

/* Auth Links */
.auth-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-link {
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.95em;
}

.auth-link:not(.primary) {
  color: var(--text-color);
  border: 1.5px solid var(--border-color);
}

.auth-link:not(.primary):hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-subtle);
}

.auth-link.primary {
  background: var(--gradient-eco);
  color: white;
  box-shadow: 0 2px 10px rgba(13, 124, 95, 0.25);
}

.auth-link.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 124, 95, 0.4);
}

/* Language Toggle */
.lang-toggle {
  background: none;
  border: 1.5px solid var(--border-color);
  color: var(--text-color);
  padding: 0;
  border-radius: var(--radius);
  cursor: pointer;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.lang-icon {
  font-size: 0.85em;
  font-weight: 700;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lang-toggle:hover {
  border-color: var(--primary);
  background: var(--primary-subtle);
  transform: translateY(-1px);
}

.lang-toggle:hover .lang-icon {
  transform: scale(1.1);
}

/* Theme Toggle */
.theme-toggle {
  background: none;
  border: 1.5px solid var(--border-color);
  color: var(--text-color);
  padding: 0;
  border-radius: var(--radius);
  cursor: pointer;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon {
  font-size: 1.2em;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.theme-toggle:hover {
  border-color: var(--primary);
  background: var(--primary-subtle);
  transform: translateY(-1px);
}

.theme-toggle:hover .theme-icon {
  transform: rotate(30deg) scale(1.15);
}

/* Mobile Layout */
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.2em;
  font-weight: 700;
}

.mobile-brand .brand-icon {
  font-size: 1.4em;
}

.mobile-brand .brand-text {
  font-size: 1em;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mobile-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-search-btn,
.mobile-cart-btn,
.mobile-notif-btn {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  cursor: pointer;
  position: relative;
  color: var(--text-color);
  text-decoration: none;
}

.mobile-search-btn:hover,
.mobile-cart-btn:hover,
.mobile-notif-btn:hover {
  background: rgba(46, 204, 113, 0.1);
}

.mobile-cart-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #e74c3c;
  color: white;
  font-size: 0.6em;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-notif-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
}

/* Mobile Search Overlay */
.mobile-search-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-search-container {
  display: flex;
  align-items: center;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 10px 14px;
  gap: 10px;
}

.mobile-search-container:focus-within {
  border-color: #2ecc71;
}

.mobile-search-container input {
  flex: 1;
  border: none;
  background: none;
  color: var(--text-color);
  font-size: 1em;
  outline: none;
}

/* Hamburger Menu */
.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: var(--text-color);
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Mobile Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  animation: fadeIn 0.3s ease;
}

.mobile-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 100%;
  background: var(--card-bg);
  box-shadow: 2px 0 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-menu-header {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-brand-full {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3em;
  font-weight: 700;
  color: var(--text-color);
}

.mobile-brand-full .brand-icon {
  font-size: 1.5em;
}

.mobile-brand-full .brand-text {
  font-size: 1.1em;
}

.mobile-close {
  background: none;
  border: none;
  font-size: 2em;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.mobile-close:hover {
  background: rgba(127, 140, 141, 0.1);
}

.mobile-menu-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px 24px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 24px;
}

.user-details {
  flex: 1;
}

.user-details .user-name {
  font-weight: 600;
  color: var(--text-color);
}

.user-details .user-email {
  font-size: 0.85em;
  color: var(--text-secondary);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(46, 204, 113, 0.1);
  border-left: 4px solid #2ecc71;
  padding-left: 20px;
}

.mobile-nav-link .link-icon {
  font-size: 1.4em;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.mobile-nav-link .link-icon svg {
  stroke: var(--primary);
}

.mobile-nav-link .link-text {
  font-weight: 500;
}

.mobile-auth-actions {
  padding: 24px;
  border-top: 1px solid var(--border-color);
  margin-top: 24px;
}

.mobile-auth-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  text-decoration: none;
  justify-content: center;
}

.mobile-auth-btn:last-child {
  margin-bottom: 0;
}

.mobile-auth-btn:hover {
  background: linear-gradient(135deg, #27ae60, #229954);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}

.mobile-auth-btn.logout {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border: 2px solid #e74c3c;
}

.mobile-auth-btn.logout .btn-icon svg {
  stroke: #e74c3c;
}

.mobile-auth-btn.logout:hover {
  background: #e74c3c;
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.mobile-auth-btn.logout:hover .btn-icon svg {
  stroke: white;
}

.lang-mobile-icon {
  font-size: 1.1em;
  font-weight: 700;
}

.mobile-auth-btn .btn-icon {
  font-size: 1.4em;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-auth-btn .btn-icon svg {
  stroke: white;
}

.mobile-auth-btn .btn-text {
  font-weight: 500;
}

.mobile-theme-toggle {
  padding: 0 24px 24px;
}

.theme-toggle-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(46, 204, 113, 0.1);
  border: 2px solid #2ecc71;
  color: var(--text-color);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
  background: #2ecc71;
  color: white;
}

.theme-toggle-btn:hover .toggle-icon svg {
  stroke: white;
}

.theme-toggle-btn .toggle-icon {
  font-size: 1.4em;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn .toggle-icon svg {
  stroke: var(--text-color);
  transition: all 0.3s ease;
}

.theme-toggle-btn .toggle-text {
  font-weight: 500;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
  }

  .navbar {
    padding: 0 20px;
    height: 70px;
  }

  .mobile-menu-overlay {
    top: 70px;
    height: calc(100vh - 70px);
  }
}

@media (min-width: 1025px) {
  .mobile-only {
    display: none !important;
  }

  .desktop-only {
    display: flex !important;
  }
}

@media (max-width: 1280px) and (min-width: 1025px) {
  .navbar {
    padding: 0 20px;
    gap: 15px;
  }

  .nav-links {
    gap: 2px;
  }

  .nav-link {
    padding: 8px 12px;
    font-size: 0.85em;
  }

  .auth-link {
    padding: 8px 14px;
    font-size: 0.85em;
  }

  .brand-text {
    font-size: 0.95em;
  }

  .search-box {
    min-width: 200px;
  }
}
</style>
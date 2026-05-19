<template>
  <div class="admin-dashboard" :class="{ 'admin-dark': adminDarkMode }">
    <!-- Top Navigation Bar -->
    <header class="admin-topbar">
      <div class="topbar-left">
        <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <Icon name="menu" :size="20" />
        </button>
        <div class="admin-branding">
          <span class="admin-logo">EP</span>
          <div class="admin-branding-copy">
            <span class="admin-title">{{ $t('admin.ecoAdmin') }}</span>
            <span class="admin-subtitle">{{ $t('admin.controlCenter') }}</span>
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <button class="topbar-btn" :title="$t('admin.backToSite')" @click="goToSite">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <span>{{ $t('admin.site') }}</span>
        </button>
        <button class="topbar-btn" :title="currentLang === 'lv' ? 'Switch to English' : 'Pārslēgt uz latviešu'" @click="toggleLanguage">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>{{ currentLang === 'lv' ? 'LV' : 'EN' }}</span>
        </button>
        <button class="topbar-btn" :title="adminDarkMode ? $t('admin.lightMode') : $t('admin.darkMode')" @click="toggleAdminDark">
          <svg v-if="!adminDarkMode" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <div class="topbar-divider"></div>
        <div class="admin-profile" @click="showProfileMenu = !showProfileMenu">
          <div class="profile-avatar">{{ currentUser?.name?.charAt(0)?.toUpperCase() || 'A' }}</div>
          <span class="profile-name">{{ currentUser?.name || 'Admin' }}</span>
          <span class="profile-dropdown-arrow">▼</span>
          
          <!-- Profile Dropdown Menu -->
          <div v-if="showProfileMenu" class="profile-dropdown">
            <div class="dropdown-header">
              <span class="dropdown-email">{{ currentUser?.email || 'admin@eco.lv' }}</span>
              <span class="dropdown-role">{{ currentUser?.role || 'Admin' }}</span>
            </div>
            <div class="dropdown-divider"></div>
            <button @click="goToProfile" class="dropdown-item">
              <span class="dropdown-item-label">{{ $t('admin.myProfile') }}</span>
            </button>
            <button @click="goToSite" class="dropdown-item">
              <span class="dropdown-item-label">{{ $t('admin.backToSite') }}</span>
            </button>
            <div class="dropdown-divider"></div>
            <button @click="logout" class="dropdown-item dropdown-logout">
              <span class="dropdown-item-label">{{ $t('admin.signOut') }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="admin-layout">
      <!-- Sidebar Navigation -->
      <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <nav class="admin-nav">
          <div class="nav-section">
            <span class="nav-section-title">{{ $t('admin.sidebarMain') }}</span>
            <button
              v-for="tab in mainTabs"
              :key="tab.id"
              @click="switchTab(tab.id)"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              <span class="nav-icon">
                <svg v-if="tab.icon === 'dashboard'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                <svg v-else-if="tab.icon === 'orders'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </span>
              <span class="nav-label">{{ tab.label }}</span>
              <span v-if="tab.count !== undefined && tab.count > 0" class="nav-badge">{{ tab.count }}</span>
            </button>
          </div>
          <div class="nav-section">
            <span class="nav-section-title">{{ $t('admin.sidebarContent') }}</span>
            <button
              v-for="tab in contentTabs"
              :key="tab.id"
              @click="switchTab(tab.id)"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              <span class="nav-icon">
                <svg v-if="tab.icon === 'users'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <svg v-else-if="tab.icon === 'products'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <svg v-else-if="tab.icon === 'forum'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </span>
              <span class="nav-label">{{ tab.label }}</span>
              <span v-if="tab.count !== undefined && tab.count > 0" class="nav-badge">{{ tab.count }}</span>
            </button>
          </div>
          <div class="nav-section">
            <span class="nav-section-title">{{ $t('admin.sidebarSettings') }}</span>
            <button
              v-for="tab in settingsTabs"
              :key="tab.id"
              @click="switchTab(tab.id)"
              :class="['nav-item', { active: activeTab === tab.id }]"
            >
              <span class="nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </span>
              <span class="nav-label">{{ tab.label }}</span>
            </button>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="admin-content" :class="{ expanded: sidebarCollapsed }">
        <transition name="tab-fade" mode="out-in">
        <!-- Dashboard Overview Tab -->
        <div v-if="activeTab === 'dashboard'" key="dashboard" class="admin-section admin-tab-content">
          <div class="section-title-bar">
            <div>
              <h2>{{ $t('admin.dashboardOverview') }}</h2>
              <p class="section-subtitle">{{ $t('admin.dashboardWelcome') }}</p>
            </div>
            <div class="title-actions">
              <select v-model="dateRange" class="date-select">
                <option value="today">{{ $t('admin.today') }}</option>
                <option value="week">{{ $t('admin.thisWeek') }}</option>
                <option value="month">{{ $t('admin.thisMonth') }}</option>
                <option value="year">{{ $t('admin.thisYear') }}</option>
              </select>
            </div>
          </div>

          <div class="dashboard-shell">
            <section class="dashboard-main-column">
              <div class="stats-grid">
                <div class="stat-card stat-users stagger-1">
                  <div class="stat-header">
                    <span class="stat-icon-bg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </span>
                    <span :class="['stat-trend', trends.users >= 0 ? 'up' : 'down']">
                      {{ trends.users >= 0 ? '+' : '' }}{{ trends.users }}%
                    </span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-value">{{ filteredStats.totalUsers }}</span>
                    <span class="stat-label">{{ $t('admin.newUsers') }}</span>
                  </div>
                  <div class="stat-footer">
                    <span class="stat-compare">{{ periodLabel }}</span>
                  </div>
                </div>
                <div class="stat-card stat-products stagger-2">
                  <div class="stat-header">
                    <span class="stat-icon-bg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </span>
                    <span class="stat-trend neutral">{{ $t('admin.total') }}</span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-value">{{ stats.totalProducts }}</span>
                    <span class="stat-label">{{ $t('admin.products') }}</span>
                  </div>
                  <div class="stat-footer">
                    <span class="stat-compare">{{ $t('admin.activeListings') }}</span>
                  </div>
                </div>
                <div class="stat-card stat-orders stagger-3">
                  <div class="stat-header">
                    <span class="stat-icon-bg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </span>
                    <span :class="['stat-trend', trends.orders >= 0 ? 'up' : 'down']">
                      {{ trends.orders >= 0 ? '+' : '' }}{{ trends.orders }}%
                    </span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-value">{{ filteredStats.totalOrders }}</span>
                    <span class="stat-label">{{ $t('admin.orders') }}</span>
                  </div>
                  <div class="stat-footer">
                    <span class="stat-compare">{{ periodLabel }}</span>
                  </div>
                </div>
                <div class="stat-card stat-revenue stagger-4">
                  <div class="stat-header">
                    <span class="stat-icon-bg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </span>
                    <span :class="['stat-trend', trends.revenue >= 0 ? 'up' : 'down']">
                      {{ trends.revenue >= 0 ? '+' : '' }}{{ trends.revenue }}%
                    </span>
                  </div>
                  <div class="stat-body">
                    <span class="stat-value">€{{ filteredStats.revenue.toFixed(2) }}</span>
                    <span class="stat-label">{{ $t('admin.revenue') }}</span>
                  </div>
                  <div class="stat-footer">
                    <span class="stat-compare">{{ periodLabel }}</span>
                  </div>
                </div>
              </div>

              <div class="dashboard-grid dashboard-grid-main">
                <div class="dashboard-card recent-orders-card">
                  <div class="card-header">
                    <h3>{{ $t('admin.recentOrders') }}</h3>
                    <button class="card-action" @click="activeTab = 'orders'">{{ $t('admin.viewAll') }}</button>
                  </div>
                  <div class="card-body">
                    <div v-if="ordersInRange.length > 0" class="mini-table">
                      <div v-for="order in ordersInRange.slice(0, 5)" :key="order.id" class="mini-row">
                        <span class="order-id">#{{ order.id }}</span>
                        <span class="order-customer">{{ order.user_name }}</span>
                        <span class="order-total">€{{ order.total?.toFixed(2) }}</span>
                        <span :class="['order-status', order.status]">{{ $t('admin.orderStatus.' + order.status) }}</span>
                      </div>
                    </div>
                    <div v-else class="empty-card">
                      <Icon name="inbox" :size="32" />
                      <p>{{ $t('admin.noOrdersInPeriod') }}</p>
                    </div>
                  </div>
                </div>

                <div class="dashboard-card top-products-card">
                  <div class="card-header">
                    <h3>{{ $t('admin.topProducts') }}</h3>
                    <button class="card-action" @click="activeTab = 'products'">{{ $t('admin.viewAll') }}</button>
                  </div>
                  <div class="card-body">
                    <div v-if="products.length > 0" class="top-products-list">
                      <div v-for="(product, index) in products.slice(0, 4)" :key="product.id" class="top-product-item">
                        <span class="product-rank">{{ index + 1 }}</span>
                        <div class="product-thumb">
                          <img v-if="product.image_url" :src="product.image_url" :alt="product.name" />
                          <Icon v-else name="sprout" :size="20" />
                        </div>
                        <div class="product-details">
                          <span class="product-name">{{ product.name }}</span>
                          <span class="product-cat">{{ product.category }}</span>
                        </div>
                        <span class="product-price">€{{ product.price?.toFixed(2) }}</span>
                      </div>
                    </div>
                    <div v-else class="empty-card">
                      <Icon name="package" :size="32" />
                      <p>{{ $t('admin.noProductsYet') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside class="dashboard-side-column">
              <div class="dashboard-card activity-card">
                <div class="card-header">
                  <h3>{{ $t('admin.recentActivity') }}</h3>
                </div>
                <div class="card-body">
                  <div class="activity-timeline">
                    <div v-for="activity in recentActivity" :key="activity.id" class="timeline-item">
                      <span class="timeline-icon"><Icon :name="activity.icon" :size="16" /></span>
                      <div class="timeline-content">
                        <p>{{ activity.text }}</p>
                        <span class="timeline-time">{{ activity.time }}</span>
                      </div>
                    </div>
                    <div v-if="recentActivity.length === 0" class="empty-card">
                      <Icon name="fileText" :size="32" />
                      <p>{{ $t('admin.noRecentActivity') }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="dashboard-card at-a-glance-card">
                <div class="card-header">
                  <h3>{{ $t('admin.atAGlance') }}</h3>
                </div>
                <div class="card-body at-a-glance-body">
                  <div class="glance-item">
                    <span>{{ $t('admin.totalUsers') }}</span>
                    <strong>{{ stats.totalUsers }}</strong>
                  </div>
                  <div class="glance-item">
                    <span>{{ $t('admin.totalOrders') }}</span>
                    <strong>{{ stats.totalOrders }}</strong>
                  </div>
                  <div class="glance-item">
                    <span>{{ $t('admin.storeRevenue') }}</span>
                    <strong>€{{ (stats.revenue || 0).toFixed(2) }}</strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-else-if="activeTab === 'users'" key="users" class="admin-section admin-tab-content">
          <div class="section-title-bar">
            <div>
              <h2>{{ $t('admin.userManagement') }}</h2>
              <p class="section-subtitle">{{ $t('admin.userManagementDesc') }}</p>
            </div>
            <div class="title-actions">
              <div class="search-box">
                <span class="search-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input v-model="userSearch" :placeholder="$t('admin.searchUsers')" class="search-input" />
              </div>
            </div>
          </div>

          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>{{ $t('admin.user') }}</th>
                  <th>{{ $t('admin.email') }}</th>
                  <th>{{ $t('admin.role') }}</th>
                  <th>{{ $t('admin.status') }}</th>
                  <th>{{ $t('admin.joined') }}</th>
                  <th>{{ $t('admin.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'row-blocked': user.blocked }">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-sm" :class="user.role">
                        {{ user.name?.charAt(0).toUpperCase() }}
                      </div>
                      <div class="user-info-cell">
                        <span class="user-name">{{ user.name }}</span>
                        <span class="user-id">ID: {{ user.id }}</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['badge', 'badge-' + user.role]">
                      {{ user.role === 'admin' ? $t('admin.userRole.admin') : $t('admin.userRole.user') }}
                    </span>
                  </td>
                  <td>
                    <span :class="['badge', user.blocked ? 'badge-danger' : 'badge-success']">
                      {{ user.blocked ? $t('admin.blocked') : $t('admin.active') }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button @click="editUser(user)" class="btn-icon btn-edit" :title="$t('admin.edit')">{{ $t('admin.edit') }}</button>
                      <button @click="toggleUserBlock(user)" :class="['btn-icon', user.blocked ? 'btn-success' : 'btn-warning']" :title="user.blocked ? $t('admin.unblock') : $t('admin.block')">
                        {{ user.blocked ? $t('admin.unblock') : $t('admin.block') }}
                      </button>
                      <button @click="deleteUser(user)" class="btn-icon btn-danger" :title="$t('admin.delete')">{{ $t('admin.delete') }}</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="empty-table">
                    <div class="empty-state">
                      <Icon name="users" :size="36" />
                      <p>{{ $t('admin.noUsersFound') }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-else-if="activeTab === 'products'" key="products" class="admin-section admin-tab-content">
          <div class="section-title-bar">
            <div>
              <h2>{{ $t('admin.productManagement') }}</h2>
              <p class="section-subtitle">{{ $t('admin.productManagementDesc') }}</p>
            </div>
            <div class="title-actions">
              <div class="search-box">
                <span class="search-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input v-model="productSearch" :placeholder="$t('admin.searchProducts')" class="search-input" />
              </div>
              <button @click="openProductModal()" class="btn-primary">{{ $t('admin.addProduct') }}</button>
            </div>
          </div>

          <div class="products-grid-admin">
            <div v-for="product in filteredProducts" :key="product.id" class="product-card-admin">
              <div class="product-image-admin">
                <img v-if="product.image_url" :src="product.image_url" :alt="product.name" loading="lazy" />
                <div v-else class="no-image-admin"><Icon name="sprout" :size="32" /></div>
                <div class="product-overlay-admin">
                  <button @click="openProductModal(product)" class="overlay-btn"><Icon name="edit" :size="14" /> {{ $t('admin.edit') }}</button>
                  <button @click="deleteProduct(product.id)" class="overlay-btn danger"><Icon name="trash" :size="14" /> {{ $t('admin.delete') }}</button>
                </div>
              </div>
              <div class="product-info-admin">
                <span class="product-category-admin">{{ product.category }}</span>
                <h4>{{ product.name }}</h4>
                <p class="product-desc-admin">{{ truncateText(product.description, 60) }}</p>
                <div class="product-meta-admin">
                  <span class="product-price-admin">€{{ product.price?.toFixed(2) }}</span>
                  <span :class="['product-stock-admin', product.stock < 10 ? 'low' : '']">
                    {{ product.stock }} {{ $t('admin.inStock') }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="filteredProducts.length === 0" class="empty-products">
              <Icon name="package" :size="36" />
              <p>{{ $t('admin.noProductsFound') }}</p>
              <button @click="openProductModal()" class="btn-primary">{{ $t('admin.addFirstProduct') }}</button>
            </div>
          </div>
        </div>

        <!-- Orders Tab -->
        <div v-else-if="activeTab === 'orders'" key="orders" class="admin-section admin-tab-content">
          <div class="section-title-bar">
            <div>
              <h2>{{ $t('admin.orderManagement') }}</h2>
              <p class="section-subtitle">{{ $t('admin.orderManagementDesc') }}</p>
            </div>
            <div class="title-actions">
              <div class="filter-tabs">
                <button :class="['filter-tab', { active: orderFilter === '' }]" @click="orderFilter = ''">{{ $t('admin.all') }}</button>
                <button :class="['filter-tab', { active: orderFilter === 'pending' }]" @click="orderFilter = 'pending'">{{ $t('admin.orderStatus.pending') }}</button>
                <button :class="['filter-tab', { active: orderFilter === 'processing' }]" @click="orderFilter = 'processing'">{{ $t('admin.orderStatus.processing') }}</button>
                <button :class="['filter-tab', { active: orderFilter === 'shipped' }]" @click="orderFilter = 'shipped'">{{ $t('admin.orderStatus.shipped') }}</button>
                <button :class="['filter-tab', { active: orderFilter === 'delivered' }]" @click="orderFilter = 'delivered'">{{ $t('admin.orderStatus.delivered') }}</button>
              </div>
            </div>
          </div>

          <div class="orders-list">
            <div v-for="order in filteredOrders" :key="order.id" class="order-card">
              <div class="order-header">
                <div class="order-id-badge">#{{ order.id }}</div>
                <select 
                  :value="order.status" 
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  :class="['status-dropdown', order.status]"
                >
                  <option value="pending">{{ $t('admin.orderStatus.pending') }}</option>
                  <option value="processing">{{ $t('admin.orderStatus.processing') }}</option>
                  <option value="shipped">{{ $t('admin.orderStatus.shipped') }}</option>
                  <option value="delivered">{{ $t('admin.orderStatus.delivered') }}</option>
                  <option value="cancelled">{{ $t('admin.orderStatus.cancelled') }}</option>
                </select>
              </div>
              <div class="order-body">
                <div class="order-detail">
                  <span class="detail-label">{{ $t('admin.customer') }}</span>
                  <span class="detail-value">{{ order.user_name }}</span>
                </div>
                <div class="order-detail">
                  <span class="detail-label">{{ $t('admin.items') }}</span>
                  <span class="detail-value">{{ order.item_count || 1 }} {{ $t('admin.productsCount') }}</span>
                </div>
                <div class="order-detail">
                  <span class="detail-label">{{ $t('admin.date') }}</span>
                  <span class="detail-value">{{ formatDate(order.created_at) }}</span>
                </div>
              </div>
              <div class="order-footer">
                <span class="order-total">€{{ order.total?.toFixed(2) }}</span>
                <div class="order-actions">
                  <button @click="viewOrderDetails(order)" class="btn-icon btn-view">{{ $t('admin.view') }}</button>
                  <button @click="deleteOrder(order.id)" class="btn-icon btn-danger">{{ $t('admin.delete') }}</button>
                </div>
              </div>
            </div>
            <div v-if="filteredOrders.length === 0" class="empty-orders">
              <Icon name="inbox" :size="36" />
              <p>{{ $t('admin.noOrdersFound') }}</p>
            </div>
          </div>
        </div>

        <!-- Forum Management Tab -->
        <div v-else-if="activeTab === 'forum'" key="forum" class="admin-section admin-tab-content">
          <div class="section-title-bar">
            <div>
              <h2>{{ $t('admin.forumManagement') }}</h2>
              <p class="section-subtitle">{{ $t('admin.forumManagementDesc') }}</p>
            </div>
            <div class="title-actions">
              <div class="search-box">
                <span class="search-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input v-model="forumSearch" :placeholder="$t('admin.searchPosts')" class="search-input" />
              </div>
            </div>
          </div>

          <div class="posts-list">
            <div v-for="post in filteredPosts" :key="post.id" class="post-card">
              <div class="post-main">
                <h4>{{ post.title }}</h4>
                <p class="post-excerpt">{{ truncateText(post.content, 120) }}</p>
                <div class="post-meta">
                  <span class="post-author">{{ $t('admin.by') }} {{ post.author_name }}</span>
                  <span class="post-date">{{ formatDate(post.created_at) }}</span>
                  <span class="post-comments">{{ post.comment_count || 0 }} {{ $t('admin.comments') }}</span>
                </div>
              </div>
              <div class="post-actions">
                <button @click="viewPost(post)" class="btn-icon btn-view">{{ $t('admin.view') }}</button>
                <button @click="deletePost(post.id)" class="btn-icon btn-danger">{{ $t('admin.delete') }}</button>
              </div>
            </div>
            <div v-if="filteredPosts.length === 0" class="empty-posts">
              <Icon name="message" :size="36" />
              <p>{{ $t('admin.noForumPosts') }}</p>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-else-if="activeTab === 'settings'" key="settings" class="admin-section admin-tab-content">
          <div class="section-title-bar">
            <div>
              <h2>{{ $t('admin.settings') }}</h2>
              <p class="section-subtitle">{{ $t('admin.configureAdmin') }}</p>
            </div>
          </div>

          <div class="settings-grid">
            <div class="settings-card">
              <h3>{{ $t('admin.storeSettings') }}</h3>
              <div class="setting-item">
                <label>{{ $t('admin.storeName') }}</label>
                <input type="text" v-model="adminSettings.storeName" class="setting-input" :placeholder="$t('admin.storeNamePlaceholder')" />
              </div>
              <div class="setting-item">
                <label>{{ $t('admin.currency') }}</label>
                <select class="setting-input" v-model="adminSettings.currency">
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
              <div class="settings-card-footer">
                <button class="btn-primary" @click="saveSettings">{{ $t('admin.saveChanges') }}</button>
              </div>
            </div>
            <div class="settings-card">
              <h3>{{ $t('admin.notifications') }}</h3>
              <div class="setting-toggle">
                <span>{{ $t('admin.emailOnNewOrders') }}</span>
                <label class="toggle">
                  <input type="checkbox" v-model="adminSettings.notifyNewOrders" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-toggle">
                <span>{{ $t('admin.emailOnNewUsers') }}</span>
                <label class="toggle">
                  <input type="checkbox" v-model="adminSettings.notifyNewUsers" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-toggle">
                <span>{{ $t('admin.lowStockAlerts') }}</span>
                <label class="toggle">
                  <input type="checkbox" v-model="adminSettings.lowStockAlerts" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        </transition>
      </main>
    </div>

    <!-- User Edit Modal -->
    <AdminUserModal
      :show="showUserModal"
      :form="userForm"
      :loading="loading"
      @close="closeUserModal"
      @save="saveUser"
      @update:form="userForm = $event"
    />

    <!-- Product Modal -->
    <AdminProductModal
      :show="showProductModal"
      :form="productForm"
      :loading="loading"
      :uploading="uploadingImage"
      @close="closeProductModal"
      @save="saveProduct"
      @upload="handleImageUpload"
      @remove-image="removeImage"
      @update:form="productForm = $event"
    />
  </div>
</template>

<script>
import api from '../utils/api.js'
import AdminUserModal from './admin/AdminUserModal.vue'
import AdminProductModal from './admin/AdminProductModal.vue'
import Icon from './common/Icon.vue'

export default {
  name: 'Admin',
  components: { AdminUserModal, AdminProductModal, Icon },
  data() {
    return {
      activeTab: 'dashboard',
      sidebarCollapsed: false,
      dateRange: 'month',
      refreshing: false,
      currentLang: localStorage.getItem('language') || 'lv',
      adminDarkMode: localStorage.getItem('adminDarkMode') === 'true',
      tabCounts: { orders: 0, users: 0, products: 0, forum: 0 },
      stats: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalPosts: 0,
        revenue: 0
      },
      recentActivity: [],
      users: [],
      products: [],
      orders: [],
      posts: [],
      userSearch: '',
      productSearch: '',
      forumSearch: '',
      orderFilter: '',
      showUserModal: false,
      showProductModal: false,
      loading: false,
      uploadingImage: false,
      showProfileMenu: false,
      currentUser: null,
      userForm: {
        id: null,
        name: '',
        email: '',
        role: 'user',
        blocked: false
      },
      productForm: {
        id: null,
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
        lifecycle_info: ''
      },
      adminSettings: {
        storeName: 'Eco Pakalpojumi',
        currency: 'EUR',
        notifyNewOrders: true,
        notifyNewUsers: false,
        lowStockAlerts: true
      }
    }
  },
  computed: {
    mainTabs() {
      return [
        { id: 'dashboard', label: this.$t('admin.dashboard'), icon: 'dashboard' },
        { id: 'orders', label: this.$t('admin.orders'), icon: 'orders', count: this.tabCounts.orders }
      ]
    },
    contentTabs() {
      return [
        { id: 'users', label: this.$t('admin.users'), icon: 'users', count: this.tabCounts.users },
        { id: 'products', label: this.$t('admin.products'), icon: 'products', count: this.tabCounts.products },
        { id: 'forum', label: this.$t('admin.forum'), icon: 'forum', count: this.tabCounts.forum }
      ]
    },
    settingsTabs() {
      return [
        { id: 'settings', label: this.$t('admin.settings'), icon: 'settings' }
      ]
    },
    // Get date range boundaries
    dateRangeBounds() {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      let startDate, prevStartDate, prevEndDate
      
      switch (this.dateRange) {
        case 'today':
          startDate = today
          prevStartDate = new Date(today)
          prevStartDate.setDate(prevStartDate.getDate() - 1)
          prevEndDate = today
          break
        case 'week':
          startDate = new Date(today)
          startDate.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
          prevStartDate = new Date(startDate)
          prevStartDate.setDate(prevStartDate.getDate() - 7)
          prevEndDate = new Date(startDate)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          prevEndDate = startDate
          break
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1)
          prevStartDate = new Date(now.getFullYear() - 1, 0, 1)
          prevEndDate = startDate
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          prevEndDate = startDate
      }
      
      return { startDate, prevStartDate, prevEndDate, now }
    },
    
    // Filter orders by date range
    ordersInRange() {
      const { startDate, now } = this.dateRangeBounds
      return this.orders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate >= startDate && orderDate <= now
      })
    },
    
    // Previous period orders for trend comparison
    ordersPrevPeriod() {
      const { prevStartDate, prevEndDate } = this.dateRangeBounds
      return this.orders.filter(order => {
        const orderDate = new Date(order.created_at)
        return orderDate >= prevStartDate && orderDate < prevEndDate
      })
    },
    
    // Filter users by date range
    usersInRange() {
      const { startDate, now } = this.dateRangeBounds
      return this.users.filter(user => {
        const userDate = new Date(user.created_at)
        return userDate >= startDate && userDate <= now
      })
    },
    
    // Previous period users
    usersPrevPeriod() {
      const { prevStartDate, prevEndDate } = this.dateRangeBounds
      return this.users.filter(user => {
        const userDate = new Date(user.created_at)
        return userDate >= prevStartDate && userDate < prevEndDate
      })
    },
    
    // Filtered stats based on date range
    filteredStats() {
      return {
        totalUsers: this.usersInRange.length,
        totalOrders: this.ordersInRange.length,
        totalProducts: this.products.length, // Products don't filter by date usually
        revenue: this.ordersInRange.reduce((sum, order) => sum + (order.total || 0), 0)
      }
    },
    
    // Calculate revenue for current period
    revenueInRange() {
      return this.ordersInRange.reduce((sum, order) => sum + (order.total || 0), 0)
    },
    
    // Calculate revenue for previous period
    revenuePrevPeriod() {
      return this.ordersPrevPeriod.reduce((sum, order) => sum + (order.total || 0), 0)
    },
    
    // Dynamic trends
    trends() {
      const calcTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100)
      }
      
      return {
        users: calcTrend(this.usersInRange.length, this.usersPrevPeriod.length),
        orders: calcTrend(this.ordersInRange.length, this.ordersPrevPeriod.length),
        revenue: calcTrend(this.revenueInRange, this.revenuePrevPeriod),
        products: 0 // Products don't have trend calculation
      }
    },
    
    // Period comparison label
    periodLabel() {
      switch (this.dateRange) {
        case 'today': return this.$t('admin.vsYesterday')
        case 'week': return this.$t('admin.vsLastWeek')
        case 'month': return this.$t('admin.vsLastMonth')
        case 'year': return this.$t('admin.vsLastYear')
        default: return this.$t('admin.vsPreviousPeriod')
      }
    },
    
    filteredUsers() {
      if (!this.userSearch) return this.users
      const search = this.userSearch.toLowerCase()
      return this.users.filter(u => 
        u.name?.toLowerCase().includes(search) || 
        u.email?.toLowerCase().includes(search)
      )
    },
    filteredProducts() {
      if (!this.productSearch) return this.products
      const search = this.productSearch.toLowerCase()
      return this.products.filter(p => 
        p.name?.toLowerCase().includes(search) || 
        p.category?.toLowerCase().includes(search)
      )
    },
    filteredOrders() {
      if (!this.orderFilter) return this.orders
      return this.orders.filter(o => o.status === this.orderFilter)
    },
    filteredPosts() {
      if (!this.forumSearch) return this.posts
      const search = this.forumSearch.toLowerCase()
      return this.posts.filter(p => 
        p.title?.toLowerCase().includes(search) ||
        p.author_name?.toLowerCase().includes(search)
      )
    }
  },
  mounted() {
    this.loadCurrentUser()
    this.loadSettings()
    this.loadAllData()
    // Close dropdown when clicking outside
    this._clickHandler = (e) => this.handleClickOutside(e)
    document.addEventListener('click', this._clickHandler)
  },
  beforeUnmount() {
    document.removeEventListener('click', this._clickHandler)
  },
  methods: {
    switchTab(tabId) {
      if (this.activeTab === tabId) return
      this.activeTab = tabId
    },
    handleClickOutside(event) {
      const profileEl = document.querySelector('.admin-profile')
      if (profileEl && !profileEl.contains(event.target)) {
        this.showProfileMenu = false
      }
    },
    loadCurrentUser() {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          this.currentUser = JSON.parse(userStr)
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
    },
    loadSettings() {
      const settingsRaw = localStorage.getItem('adminSettings')
      if (!settingsRaw) return
      try {
        const parsed = JSON.parse(settingsRaw)
        this.adminSettings = { ...this.adminSettings, ...parsed }
      } catch (error) {
        console.error('Error parsing admin settings:', error)
      }
    },
    saveSettings() {
      try {
        localStorage.setItem('adminSettings', JSON.stringify(this.adminSettings))
        alert('Settings saved successfully!')
      } catch (error) {
        alert('Failed to save settings')
      }
    },
    goToSite() {
      this.showProfileMenu = false
      this.$router.push('/')
    },
    toggleLanguage() {
      this.currentLang = this.currentLang === 'lv' ? 'en' : 'lv'
      this.$i18n.locale = this.currentLang
      localStorage.setItem('language', this.currentLang)
    },
    toggleAdminDark() {
      this.adminDarkMode = !this.adminDarkMode
      localStorage.setItem('adminDarkMode', this.adminDarkMode)
    },
    goToProfile() {
      this.showProfileMenu = false
      this.$router.push('/profile')
    },
    logout() {
      this.showProfileMenu = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    async loadAllData() {
      this.refreshing = true
      await Promise.all([
        this.loadUsers(),
        this.loadProducts(),
        this.loadOrders(),
        this.loadPosts()
      ])
      this.loadStats()
      this.updateTabCounts()
      setTimeout(() => { this.refreshing = false }, 500)
    },
    updateTabCounts() {
      this.tabCounts.orders = this.orders.length
      this.tabCounts.users = this.users.length
      this.tabCounts.products = this.products.length
      this.tabCounts.forum = this.posts.length
    },
    calculateRevenue() {
      const total = this.orders.reduce((sum, order) => sum + (order.total || 0), 0)
      return total.toFixed(2)
    },
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    loadStats() {
      this.stats = {
        totalUsers: this.users.length,
        totalProducts: this.products.length,
        totalOrders: this.orders.length,
        totalPosts: this.posts.length
      }
      
      // Build recent activity from latest data
      this.recentActivity = []
      
      if (this.users.length > 0) {
        const latestUser = this.users[this.users.length - 1]
        this.recentActivity.push({
          id: 'user-' + latestUser.id,
          icon: 'user',
          text: `New user registered: ${latestUser.name}`,
          time: 'Recently'
        })
      }
      
      if (this.orders.length > 0) {
        const latestOrder = this.orders[0]
        this.recentActivity.push({
          id: 'order-' + latestOrder?.id,
          icon: 'package',
          text: `New order #${latestOrder?.id} - €${latestOrder?.total?.toFixed(2)}`,
          time: 'Recently'
        })
      }
    },
    async loadUsers() {
      try {
        const { data } = await api.get('/api/admin/users')
        this.users = Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Error loading users:', error)
        this.users = []
      }
    },
    async loadProducts() {
      try {
        const { data } = await api.get('/api/products')
        this.products = data.products || data || []
      } catch (error) {
        console.error('Error loading products:', error)
        this.products = []
      }
    },
    async loadOrders() {
      try {
        const { data } = await api.get('/api/admin/orders')
        this.orders = Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Error loading orders:', error)
        this.orders = []
      }
    },
    async loadPosts() {
      try {
        const { data } = await api.get('/api/posts')
        this.posts = data.posts || data || []
      } catch (error) {
        console.error('Error loading posts:', error)
        this.posts = []
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A'
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return dateStr
      }
    },
    // User Management
    editUser(user) {
      this.userForm = { ...user }
      this.showUserModal = true
    },
    closeUserModal() {
      this.showUserModal = false
      this.userForm = { id: null, name: '', email: '', role: 'user', blocked: false }
    },
    async saveUser() {
      this.loading = true
      try {
        await api.put(`/api/admin/users/${this.userForm.id}/role`, { role: this.userForm.role })
        await api.put(`/api/admin/users/${this.userForm.id}/block`, { blocked: this.userForm.blocked })
        
        if (this.currentUser && this.currentUser.id === this.userForm.id) {
          const updatedUser = { ...this.currentUser, role: this.userForm.role, blocked: this.userForm.blocked }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          this.currentUser = updatedUser
          
          if (this.userForm.role !== 'admin') {
            alert('Your admin privileges have been removed. You will be redirected.')
            this.$router.push('/')
            return
          }
        }
        
        await this.loadUsers()
        this.closeUserModal()
      } catch (error) {
        alert('Error saving user: ' + error.message)
      } finally {
        this.loading = false
      }
    },
    async toggleUserBlock(user) {
      try {
        await api.put(`/api/admin/users/${user.id}/block`, { blocked: !user.blocked })
        await this.loadUsers()
      } catch (error) {
        alert('Error updating user: ' + error.message)
      }
    },
    async deleteUser(user) {
      if (!confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) return
      
      try {
        await api.delete(`/api/admin/users/${user.id}`)
        await this.loadUsers()
        this.updateTabCounts()
      } catch (error) {
        alert('Error deleting user: ' + error.message)
      }
    },
    // Product Management
    openProductModal(product = null) {
      if (product) {
        this.productForm = { ...product }
      } else {
        this.productForm = {
          id: null,
          name: '',
          description: '',
          price: '',
          category: '',
          stock: 0,
          image_url: '',
          lifecycle_info: ''
        }
      }
      this.showProductModal = true
    },
    closeProductModal() {
      this.showProductModal = false
      this.productForm = {
        id: null,
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
        lifecycle_info: ''
      }
    },
    async handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Only image files are allowed (JPG, PNG, GIF, WebP)')
        return
      }

      this.uploadingImage = true
      const formData = new FormData()
      formData.append('image', file)

      try {
        const { data } = await api.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.productForm.image_url = data.url
      } catch (error) {
        alert('Upload failed: ' + (error.response?.data?.error || error.message))
      } finally {
        this.uploadingImage = false
      }
    },
    removeImage() {
      this.productForm.image_url = ''
    },
    async saveProduct() {
      if (!this.productForm.name || !this.productForm.price || !this.productForm.category) {
        alert('Please fill in all required fields')
        return
      }
      
      this.loading = true
      const url = this.productForm.id
        ? `/api/products/${this.productForm.id}`
        : '/api/products'

      try {
        if (this.productForm.id) {
          await api.put(url, this.productForm)
        } else {
          await api.post(url, this.productForm)
        }
        await this.loadProducts()
        this.updateTabCounts()
        this.closeProductModal()
      } catch (error) {
        alert('Error saving product: ' + (error.response?.data?.error || error.message))
      } finally {
        this.loading = false
      }
    },
    async deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return

      try {
        await api.delete(`/api/products/${id}`)
        await this.loadProducts()
        this.updateTabCounts()
      } catch (error) {
        alert('Error deleting product: ' + (error.response?.data?.error || error.message))
      }
    },
    // Order Management
    async updateOrderStatus(orderId, status) {
      try {
        await api.put(`/api/admin/orders/${orderId}/status`, { status })
        await this.loadOrders()
      } catch (error) {
        alert('Error updating order: ' + (error.response?.data?.error || error.message))
      }
    },
    viewOrderDetails(order) {
      alert(`Order #${order.id}\nCustomer: ${order.user_name}\nTotal: €${order.total?.toFixed(2)}\nStatus: ${order.status}\nDate: ${this.formatDate(order.created_at)}`)
    },
    async deleteOrder(id) {
      if (!confirm('Are you sure you want to delete this order?')) return

      try {
        await api.delete(`/api/admin/orders/${id}`)
        await this.loadOrders()
        this.updateTabCounts()
      } catch (error) {
        alert('Error deleting order: ' + (error.response?.data?.error || error.message))
      }
    },
    // Forum Management
    viewPost(post) {
      alert(`Post: ${post.title}\nAuthor: ${post.author_name}\nContent: ${post.content?.substring(0, 200)}...`)
    },
    async deletePost(id) {
      if (!confirm('Are you sure you want to delete this post?')) return

      try {
        await api.delete(`/api/admin/posts/${id}`)
        await this.loadPosts()
        this.updateTabCounts()
      } catch (error) {
        alert('Error deleting post: ' + (error.response?.data?.error || error.message))
      }
    },
    // Placeholder methods
    openEducationModal() {
      alert('Education management coming soon!')
    },
    openServiceModal() {
      alert('Services management coming soon!')
    }
  }
}
</script>

<style scoped>
/* ===== BASE ===== */
.admin-dashboard {
  min-height: 100vh;
  background: #0f1117;
  display: flex;
  flex-direction: column;
  color: #e0e0e0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  animation: pageFadeIn 0.5s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== TAB CONTENT TRANSITIONS ===== */
.tab-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.tab-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== STAGGER ANIMATIONS ===== */
@keyframes staggerSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-tab-content .stagger-1,
.admin-tab-content .stagger-2,
.admin-tab-content .stagger-3,
.admin-tab-content .stagger-4 {
  animation: staggerSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.admin-tab-content .stagger-1 { animation-delay: 0.05s; }
.admin-tab-content .stagger-2 { animation-delay: 0.1s; }
.admin-tab-content .stagger-3 { animation-delay: 0.15s; }
.admin-tab-content .stagger-4 { animation-delay: 0.2s; }

/* ===== TOP BAR ===== */
.admin-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #161921;
  border-bottom: 1px solid #2a2d38;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 100;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sidebar-toggle {
  width: 40px;
  height: 40px;
  border: 1px solid #2a2d38;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.2em;
  color: #8b8fa3;
  transition: background 0.2s, color 0.2s;
}

.sidebar-toggle:hover {
  background: #1e2230;
  color: #2ecc71;
}

.admin-branding {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-logo {
  font-size: 1.6em;
}

.admin-title {
  font-size: 1.2em;
  font-weight: 700;
  color: #2ecc71;
}

.topbar-center {
  flex: 1;
  max-width: 440px;
  margin: 0 32px;
}

.global-search {
  display: flex;
  align-items: center;
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 10px;
  padding: 0 14px;
  transition: border-color 0.2s;
}

.global-search:focus-within {
  border-color: #2ecc71;
}

.global-search .search-icon {
  font-size: 0.95em;
  margin-right: 8px;
  opacity: 0.5;
}

.global-search input {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  font-size: 0.9em;
  color: #fff;
  outline: none;
}

.global-search input::placeholder {
  color: #555;
}

.global-search kbd {
  padding: 3px 7px;
  background: #282c3a;
  border-radius: 5px;
  font-size: 0.65em;
  color: #666;
  font-family: monospace;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topbar-btn {
  width: 38px;
  height: 38px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  color: #8b8fa3;
  transition: background 0.2s;
}

.topbar-btn:hover {
  background: #1e2230;
}

.topbar-btn .spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.topbar-divider {
  width: 1px;
  height: 28px;
  background: #2a2d38;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px 6px 6px;
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 28px;
  cursor: pointer;
  transition: border-color 0.2s;
  position: relative;
}

.admin-profile:hover {
  border-color: #2ecc71;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  background: #2ecc71;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85em;
  font-weight: 700;
  color: #fff;
}

.profile-name {
  font-size: 0.85em;
  font-weight: 600;
  color: #ccc;
}

.profile-dropdown-arrow {
  font-size: 0.55em;
  color: #666;
  margin-left: 2px;
}

/* Profile dropdown */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: #1c1f2e;
  border: 1px solid #2a2d38;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  overflow: hidden;
  z-index: 200;
  animation: ddSlide 0.2s ease;
}

@keyframes ddSlide {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
  padding: 16px;
  background: #22263a;
}

.dropdown-email {
  display: block;
  font-size: 0.85em;
  color: #fff;
  font-weight: 600;
  margin-bottom: 4px;
}

.dropdown-role {
  font-size: 0.65em;
  color: #2ecc71;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 8px;
  background: rgba(46,204,113,0.15);
  border-radius: 12px;
  font-weight: 700;
}

.dropdown-divider {
  height: 1px;
  background: #2a2d38;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 0.85em;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
}

.dropdown-item:hover {
  background: #282c3a;
  color: #fff;
}

.dropdown-item span {
  font-size: 1.1em;
}

.dropdown-logout {
  color: #e74c3c;
}

.dropdown-logout:hover {
  background: rgba(231,76,60,0.1);
  color: #e74c3c;
}

/* ===== LAYOUT ===== */
.admin-layout {
  display: flex;
  padding-top: 64px;
  min-height: 100vh;
}

/* ===== SIDEBAR ===== */
.admin-sidebar {
  width: 260px;
  min-width: 260px;
  background: #161921;
  border-right: 1px solid #2a2d38;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  transition: width 0.25s ease, min-width 0.25s ease;
  z-index: 90;
  overflow-y: auto;
}

.admin-sidebar.collapsed {
  width: 72px;
  min-width: 72px;
}

.admin-sidebar.collapsed .nav-label,
.admin-sidebar.collapsed .nav-badge,
.admin-sidebar.collapsed .nav-section-title,
.admin-sidebar.collapsed .sidebar-footer {
  display: none;
}

.admin-sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px;
}

.admin-nav {
  display: flex;
  flex-direction: column;
}

.nav-section {
  padding: 0 12px;
  margin-bottom: 8px;
}

.nav-section-title {
  font-size: 0.65em;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #555;
  padding: 14px 14px 8px;
  font-weight: 700;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #8b8fa3;
  font-weight: 500;
  font-size: 0.9em;
  width: 100%;
  text-align: left;
  margin-bottom: 2px;
  position: relative;
}

.nav-item:hover {
  background: #1e2230;
  color: #ccc;
}

.nav-item.active {
  background: linear-gradient(135deg, #22c55e, #1f9d63);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.nav-icon {
  font-size: 1em;
  width: 26px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: rgba(255,255,255,0.1);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: 700;
}

.nav-item.active .nav-badge {
  background: rgba(255,255,255,0.2);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #2a2d38;
  margin-top: auto;
}

.eco-score {
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.score-circle {
  width: 48px;
  height: 48px;
  background: #2ecc71;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: 1.2em;
  font-weight: 800;
  color: #fff;
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.score-label {
  font-size: 0.65em;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.score-status {
  font-size: 0.9em;
  font-weight: 700;
  color: #2ecc71;
}

/* ===== MAIN CONTENT ===== */
.admin-content {
  flex: 1;
  margin-left: 260px;
  padding: 28px;
  transition: margin-left 0.25s ease;
  min-height: calc(100vh - 64px);
}

.admin-content.expanded {
  margin-left: 72px;
}

.admin-section {
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== SECTION TITLE BAR ===== */
.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title-bar h2 {
  font-size: 1.4rem;
  color: #fff;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.section-subtitle {
  color: #666;
  font-size: 0.9em;
  margin-top: 4px;
}

.title-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-select {
  padding: 9px 32px 9px 14px;
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 8px;
  color: #ccc;
  font-size: 0.85em;
  cursor: pointer;
  transition: border-color 0.2s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%232ecc71' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.date-select:hover, .date-select:focus {
  border-color: #2ecc71;
  outline: none;
}

.date-select option {
  background: #1a1a2e;
  color: #fff;
}

/* ===== STATS GRID ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 18px;
}

.stat-card {
  background: #161921;
  border-radius: 16px;
  padding: 22px;
  border: 1px solid #2a2d38;
  transition: border-color 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.stat-card.stat-users::before { background: #3498db; }
.stat-card.stat-products::before { background: #9b59b6; }
.stat-card.stat-orders::before { background: #e67e22; }
.stat-card.stat-revenue::before { background: #2ecc71; }

.stat-card:hover {
  border-color: #3a3d4a;
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(46, 204, 113, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.stat-icon-bg {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e2230;
  color: #8b8fa3;
}

.stat-users .stat-icon-bg { color: #3498db; }
.stat-products .stat-icon-bg { color: #9b59b6; }
.stat-orders .stat-icon-bg { color: #e67e22; }
.stat-revenue .stat-icon-bg { color: #2ecc71; }

.stat-trend {
  font-size: 0.75em;
  padding: 5px 10px;
  border-radius: 14px;
  font-weight: 700;
}

.stat-trend.up {
  background: rgba(46,204,113,0.15);
  color: #2ecc71;
}

.stat-trend.down {
  background: rgba(231,76,60,0.15);
  color: #e74c3c;
}

.stat-trend.neutral {
  background: rgba(52,152,219,0.15);
  color: #3498db;
}

.stat-body {
  margin-bottom: 14px;
}

.stat-value {
  display: block;
  font-size: 2.2em;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 4px;
}

.stat-label {
  display: block;
  font-size: 0.85em;
  color: #666;
  font-weight: 500;
}

.stat-footer {
  padding-top: 12px;
  border-top: 1px solid #2a2d38;
}

.stat-compare {
  font-size: 0.8em;
  color: #555;
}

/* ===== TOTALS BAR ===== */
.totals-bar {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 14px 20px;
  background: #161921;
  border-radius: 10px;
  margin-bottom: 24px;
  border: 1px solid #2a2d38;
}

.total-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.total-label {
  color: #666;
  font-size: 0.85em;
}

.total-value {
  color: #fff;
  font-weight: 600;
  font-size: 0.95em;
}

/* ===== DASHBOARD GRID ===== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 18px;
}

.dashboard-card {
  background: #161921;
  border-radius: 16px;
  border: 1px solid #2a2d38;
  overflow: hidden;
  transition: border-color 0.2s;
}

.dashboard-card:hover {
  border-color: #3a3d4a;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid #2a2d38;
}

.card-header h3 {
  font-size: 0.98rem;
  color: #ddd;
  margin: 0;
  font-weight: 600;
}

.card-action {
  padding: 8px 14px;
  background: rgba(46,204,113,0.1);
  border: 1px solid rgba(46,204,113,0.25);
  border-radius: 10px;
  font-size: 0.82rem;
  color: #2ecc71;
  cursor: pointer;
  transition: background 0.15s;
  font-weight: 600;
}

.card-action:hover {
  background: rgba(46,204,113,0.2);
}

.card-body {
  padding: 0;
}

/* Mini table */
.mini-table {
  padding: 4px 0;
}

.mini-row {
  display: grid;
  grid-template-columns: 60px 1fr 90px 100px;
  gap: 12px;
  padding: 12px 22px;
  align-items: center;
  border-bottom: 1px solid #1e2230;
  transition: background 0.15s;
}

.mini-row:hover {
  background: #1e2230;
}

.mini-row:last-child {
  border-bottom: none;
}

.order-id {
  font-weight: 700;
  color: #bbb;
  font-size: 0.85em;
  font-family: monospace;
}

.order-customer {
  color: #999;
  font-size: 0.9em;
}

.order-total {
  font-weight: 700;
  color: #2ecc71;
  font-size: 0.95em;
}

.order-status {
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
}

.order-status.pending { background: rgba(241,196,15,0.15); color: #f1c40f; }
.order-status.processing { background: rgba(52,152,219,0.15); color: #3498db; }
.order-status.shipped { background: rgba(155,89,182,0.15); color: #9b59b6; }
.order-status.delivered { background: rgba(46,204,113,0.15); color: #2ecc71; }
.order-status.cancelled { background: rgba(231,76,60,0.15); color: #e74c3c; }

/* Activity */
.activity-timeline {
  padding: 12px 22px;
}

.timeline-item {
  display: flex;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #1e2230;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  flex-shrink: 0;
  background: #1e2230;
}

.timeline-content p {
  margin: 0 0 4px;
  color: #ccc;
  font-size: 0.85em;
}

.timeline-time {
  font-size: 0.75em;
  color: #555;
}

/* Quick actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 18px 22px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.quick-action:hover {
  border-color: #2ecc71;
  background: #22263a;
}

.qa-icon {
  font-size: 1.3em;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c3a;
  border-radius: 10px;
}

.qa-label {
  font-size: 0.85em;
  color: #ccc;
  font-weight: 600;
}

/* Top products */
.top-products-list {
  padding: 8px 0;
}

.top-product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 22px;
  border-bottom: 1px solid #1e2230;
  transition: background 0.15s;
}

.top-product-item:hover {
  background: #1e2230;
}

.top-product-item:last-child {
  border-bottom: none;
}

.product-rank {
  width: 24px;
  height: 24px;
  background: #282c3a;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75em;
  font-weight: 700;
  color: #2ecc71;
}

.product-thumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #1e2230;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
}

.product-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  display: block;
  font-size: 0.85em;
  color: #ddd;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-cat {
  display: block;
  font-size: 0.7em;
  color: #555;
  margin-top: 2px;
}

.product-price {
  font-weight: 700;
  color: #2ecc71;
  font-size: 0.9em;
}

/* Empty states */
.empty-card {
  padding: 36px 20px;
  text-align: center;
}

.empty-card span {
  font-size: 2em;
  display: block;
  margin-bottom: 8px;
  opacity: 0.4;
}

.empty-card p {
  color: #555;
  font-size: 0.85em;
  margin: 0;
}

/* ===== SEARCH & FILTER ===== */
.search-box {
  display: flex;
  align-items: center;
  position: relative;
}

.search-box .search-icon {
  position: absolute;
  left: 14px;
  opacity: 0.4;
  pointer-events: none;
  display: flex;
  align-items: center;
  color: currentColor;
}

.search-input {
  padding: 10px 16px 10px 38px;
  border: 1px solid #2a2d38;
  border-radius: 10px;
  font-size: 0.9em;
  background: #1e2230;
  color: #fff;
  min-width: 240px;
  transition: border-color 0.2s;
  outline: none;
}

.search-input::placeholder {
  color: #555;
}

.search-input:focus {
  border-color: #2ecc71;
}

/* ===== DATA TABLE ===== */
.data-table-container {
  background: #161921;
  border-radius: 16px;
  border: 1px solid #2a2d38;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 20px;
  text-align: left;
  border-bottom: 1px solid #1e2230;
}

.data-table th {
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
  font-weight: 700;
  background: #1a1d28;
}

.data-table tbody tr {
  transition: background 0.15s;
}

.data-table tbody tr:hover {
  background: #1e2230;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tr.row-blocked {
  background: rgba(231,76,60,0.06);
}

/* User cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #2ecc71;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85em;
}

.user-avatar-sm.admin {
  background: #9b59b6;
}

.user-info-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-info-cell .user-name {
  font-weight: 600;
  color: #ddd;
  font-size: 0.9em;
}

.user-info-cell .user-id {
  font-size: 0.7em;
  color: #555;
}

/* ===== BADGES ===== */
.badge {
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 0.7em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-admin { background: rgba(155,89,182,0.15); color: #bb6bd9; }
.badge-user { background: rgba(46,204,113,0.12); color: #2ecc71; }
.badge-success { background: rgba(46,204,113,0.12); color: #2ecc71; border: 1px solid rgba(46,204,113,0.2); }
.badge-danger { background: rgba(231,76,60,0.12); color: #e74c3c; border: 1px solid rgba(231,76,60,0.2); }

/* ===== ACTION BUTTONS ===== */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95em;
  transition: background 0.15s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  transform: scale(1.08);
}

.btn-icon.btn-edit { background: rgba(52,152,219,0.12); color: #3498db; }
.btn-icon.btn-edit:hover { background: rgba(52,152,219,0.25); }
.btn-icon.btn-view { background: rgba(155,89,182,0.12); color: #9b59b6; }
.btn-icon.btn-view:hover { background: rgba(155,89,182,0.25); }
.btn-icon.btn-danger { background: rgba(231,76,60,0.12); color: #e74c3c; }
.btn-icon.btn-danger:hover { background: rgba(231,76,60,0.25); }
.btn-icon.btn-warning { background: rgba(230,126,34,0.12); color: #e67e22; }
.btn-icon.btn-warning:hover { background: rgba(230,126,34,0.25); }
.btn-icon.btn-success { background: rgba(46,204,113,0.12); color: #2ecc71; }
.btn-icon.btn-success:hover { background: rgba(46,204,113,0.25); }

/* ===== PRODUCTS GRID ===== */
.products-grid-admin {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card-admin {
  background: #161921;
  border-radius: 16px;
  border: 1px solid #2a2d38;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
}

.product-card-admin:hover {
  border-color: #3a3d4a;
  transform: translateY(-4px);
}

.product-image-admin {
  position: relative;
  height: 200px;
  background: #1e2230;
  overflow: hidden;
}

.product-image-admin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card-admin:hover .product-image-admin img {
  transform: scale(1.05);
}

.no-image-admin {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  color: #333;
}

.product-overlay-admin {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.product-card-admin:hover .product-overlay-admin {
  opacity: 1;
}

.overlay-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
  font-weight: 600;
  transition: background 0.15s;
  color: #fff;
}

.overlay-btn:first-child {
  background: #3498db;
}

.overlay-btn:first-child:hover {
  background: #2980b9;
}

.overlay-btn.danger,
.overlay-btn:last-child:not(:first-child) {
  background: #e74c3c;
}

.overlay-btn.danger:hover,
.overlay-btn:last-child:not(:first-child):hover {
  background: #c0392b;
}

.product-info-admin {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-info-admin h4 {
  font-size: 1.05em;
  font-weight: 600;
  color: #eee;
  margin: 0;
  line-height: 1.3;
}

.product-category-admin {
  display: inline-flex;
  padding: 4px 10px;
  background: rgba(46,204,113,0.1);
  border: 1px solid rgba(46,204,113,0.2);
  border-radius: 12px;
  font-size: 0.7em;
  font-weight: 600;
  color: #2ecc71;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.product-desc-admin {
  font-size: 0.8em;
  color: #666;
  line-height: 1.5;
  margin: 2px 0;
}

.product-meta-admin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #2a2d38;
}

.product-price-admin {
  font-size: 1.2em;
  font-weight: 800;
  color: #2ecc71;
}

.product-stock-admin {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 600;
  background: rgba(46,204,113,0.1);
  color: #2ecc71;
}

.product-stock-admin.low {
  background: rgba(241,196,15,0.1);
  color: #f1c40f;
}

/* Empty products */
.empty-products {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px;
  background: #161921;
  border-radius: 16px;
  border: 2px dashed #2a2d38;
  text-align: center;
}

.empty-products span {
  font-size: 3.5em;
  margin-bottom: 12px;
  opacity: 0.3;
}

.empty-products p {
  font-size: 1.1em;
  color: #555;
  margin: 0 0 20px;
}

/* Empty table */
.empty-table {
  text-align: center;
  padding: 50px 20px !important;
  border-bottom: none !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-state span {
  font-size: 2.5em;
  opacity: 0.4;
}

.empty-state p {
  font-size: 1em;
  color: #555;
  margin: 0;
}

/* ===== FILTER TABS (Orders) ===== */
.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 9px 18px;
  background: transparent;
  border: 1px solid #2a2d38;
  border-radius: 20px;
  font-size: 0.8em;
  color: #888;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  font-weight: 600;
}

.filter-tab:hover {
  border-color: #3a3d4a;
  color: #ccc;
}

.filter-tab.active {
  background: #2ecc71;
  border-color: transparent;
  color: #fff;
}

/* ===== ORDER CARDS ===== */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #161921;
  border-radius: 14px;
  border: 1px solid #2a2d38;
  padding: 22px;
  transition: border-color 0.2s;
}

.order-card:hover {
  border-color: #3a3d4a;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.order-id-badge {
  padding: 6px 12px;
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9em;
  color: #2ecc71;
  font-family: monospace;
}

.status-dropdown {
  padding: 8px 14px;
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 8px;
  color: #ccc;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;
  outline: none;
}

.status-dropdown:focus {
  border-color: #2ecc71;
}

.status-dropdown option {
  background: #1a1a2e;
  color: #fff;
}

.status-dropdown.pending { border-color: rgba(241,196,15,0.4); }
.status-dropdown.processing { border-color: rgba(52,152,219,0.4); }
.status-dropdown.shipped { border-color: rgba(155,89,182,0.4); }
.status-dropdown.delivered { border-color: rgba(46,204,113,0.4); }
.status-dropdown.cancelled { border-color: rgba(231,76,60,0.4); }

.order-body {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.detail-label {
  font-size: 0.7em;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
  font-weight: 600;
}

.detail-value {
  font-size: 0.95em;
  color: #ccc;
  font-weight: 500;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #1e2230;
}

.order-total {
  font-size: 1.4em;
  font-weight: 800;
  color: #2ecc71;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.empty-orders {
  text-align: center;
  padding: 50px;
  color: #555;
}

.empty-orders span {
  font-size: 3em;
  display: block;
  margin-bottom: 10px;
  opacity: 0.4;
}

/* ===== FORUM ===== */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.post-card {
  background: #161921;
  border-radius: 14px;
  border: 1px solid #2a2d38;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  transition: border-color 0.15s;
}

.post-card:hover {
  border-color: #3a3d4a;
}

.post-main {
  flex: 1;
  min-width: 0;
}

.post-main h4 {
  font-size: 1.05em;
  color: #ddd;
  margin: 0 0 8px;
  font-weight: 600;
}

.post-excerpt {
  color: #666;
  font-size: 0.85em;
  line-height: 1.6;
  margin-bottom: 12px;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 0.75em;
  color: #555;
}

.post-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.empty-posts {
  text-align: center;
  padding: 50px;
  color: #555;
}

.empty-posts span {
  font-size: 3em;
  display: block;
  margin-bottom: 10px;
  opacity: 0.4;
}

/* ===== SETTINGS ===== */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 20px;
}

.settings-card {
  background: #161921;
  border-radius: 16px;
  border: 1px solid #2a2d38;
  overflow: hidden;
}

.settings-card h3 {
  padding: 18px 22px;
  margin: 0;
  font-size: 1.05em;
  color: #ddd;
  border-bottom: 1px solid #2a2d38;
  font-weight: 600;
}

.settings-card .btn-primary {
  margin: 16px 22px 22px;
  width: calc(100% - 44px);
}

.settings-card-footer {
  padding: 18px 22px 22px;
}

.settings-card-footer .btn-primary {
  width: 100%;
  margin: 0;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 18px 22px;
  border-bottom: 1px solid #1e2230;
}

.setting-item label {
  font-size: 0.82em;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.setting-input {
  padding: 10px 14px;
  background: #1e2230;
  border: 1px solid #2a2d38;
  border-radius: 8px;
  color: #ccc;
  font-size: 0.9em;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
  outline: none;
}

.setting-input:focus {
  border-color: #2ecc71;
}

.setting-input option {
  background: #1a1a2e;
  color: #fff;
}

.setting-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px;
  border-bottom: 1px solid #1e2230;
}

.setting-toggle:last-child {
  border-bottom: none;
}

.setting-toggle span {
  font-size: 0.9em;
  color: #999;
  font-weight: 500;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #2a2d38;
  border-radius: 26px;
  transition: background 0.2s;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: transform 0.2s;
}

.toggle input:checked + .toggle-slider {
  background: #2ecc71;
}

.toggle input:checked + .toggle-slider::after {
  transform: translateX(22px);
}

/* ===== FORM STYLES ===== */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-2);
  font-weight: 600;
  font-size: 0.85em;
}

.form-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 0.9em;
  background: var(--surface-2);
  color: var(--text-1);
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--text-3);
}

.form-input:focus {
  border-color: var(--accent, #2ecc71);
}

select.form-input {
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%232ecc71' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 34px;
}

select.form-input option {
  background: var(--surface);
  color: var(--text-1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.btn-primary {
  padding: 11px 20px;
  background: linear-gradient(135deg, #22c55e, #1f9d63);
  color: #fff;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: skewX(-25deg);
  transition: left 0.5s ease;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #20b35b, #188450);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
}

.btn-primary:hover:not(:disabled)::after {
  left: 100%;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 11px 20px;
  background: transparent;
  color: var(--text-2);
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.btn-secondary:hover {
  background: var(--surface-2);
  color: var(--text-1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .mini-row {
    grid-template-columns: 50px 1fr 90px 90px;
  }
}

@media (max-width: 1024px) {
  .admin-sidebar {
    position: fixed;
    left: -260px;
    transition: left 0.25s ease;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
  }
  
  .admin-sidebar:not(.collapsed) {
    left: 0;
  }
  
  .admin-content {
    margin-left: 0 !important;
  }
  
  .topbar-center {
    display: none;
  }
  
  .profile-name {
    display: none;
  }
}

@media (max-width: 768px) {
  .admin-topbar {
    padding: 0 14px;
    height: 56px;
  }
  
  .admin-title {
    display: none;
  }
  
  .admin-layout {
    padding-top: 56px;
  }
  
  .admin-content {
    padding: 18px 14px;
  }
  
  .section-title-bar {
    flex-direction: column;
  }
  
  .section-title-bar h2 {
    font-size: 1.3em;
  }
  
  .title-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 1.8em;
  }
  
  .products-grid-admin {
    grid-template-columns: 1fr;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .search-input {
    min-width: 100%;
  }
  
  .filter-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
    gap: 6px;
  }
  
  .filter-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .order-body {
    flex-direction: column;
    gap: 12px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .totals-bar {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
  
  .mini-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .order-customer {
    grid-column: span 2;
  }
}

@media (max-width: 480px) {
  .stat-icon-bg {
    width: 40px;
    height: 40px;
    font-size: 1.2em;
  }
}

/* ===== LIGHT REMAKE OVERRIDES ===== */
.admin-dashboard {
  --bg-canvas: #f2f4f7;
  --bg-soft: #fbfcfd;
  --surface: #ffffff;
  --surface-2: #f7f9fb;
  --line: #e4e9f0;
  --text-1: #111827;
  --text-2: #4b5563;
  --text-3: #6b7280;
  --accent: #1f9d63;
  --accent-soft: #e7f6ef;
  --danger: #cf3f3f;
  background:
    radial-gradient(circle at 12% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 45%),
    linear-gradient(180deg, #f8fafc 0%, var(--bg-canvas) 42%, #edf1f5 100%);
  color: var(--text-1);
  font-family: Manrope, "SF Pro Text", "Segoe UI", sans-serif;
}

.admin-topbar {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.05);
}

.admin-title {
  color: #0f172a;
}

.sidebar-toggle,
.topbar-btn {
  background: var(--surface-2);
  border: 1px solid var(--line);
  color: var(--text-2);
}

.sidebar-toggle:hover,
.topbar-btn:hover {
  background: var(--surface);
  border-color: #cfd8e3;
  color: var(--accent);
}

.topbar-divider {
  background: var(--line);
}

.admin-profile {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

.admin-profile:hover {
  border-color: #cfd8e3;
}

.profile-avatar {
  background: linear-gradient(135deg, #22c55e, #1f9d63);
}

.profile-name,
.profile-dropdown-arrow {
  color: var(--text-2);
}

.profile-dropdown {
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
}

.dropdown-header {
  background: var(--surface-2);
}

.dropdown-email {
  color: var(--text-1);
}

.dropdown-role {
  color: var(--accent);
  background: var(--accent-soft);
}

.dropdown-divider {
  background: var(--line);
}

.dropdown-item {
  color: var(--text-2);
}

.dropdown-item:hover {
  background: #f4f7fa;
  color: var(--text-1);
}

.dropdown-logout {
  color: var(--danger);
}

.dropdown-logout:hover {
  background: #fdecec;
}

.admin-sidebar {
  background: #f7f9fc;
  border-right: 1px solid var(--line);
}

.nav-section-title {
  color: #8a96a8;
}

.nav-item {
  color: var(--text-2);
}

.nav-item:hover {
  background: #edf3f8;
  color: #0f172a;
}

.nav-item.active {
  background: linear-gradient(135deg, #22c55e, #1f9d63);
  box-shadow: 0 10px 18px rgba(34, 197, 94, 0.24);
}

.nav-badge {
  background: #e9eef5;
  color: #516075;
}

.admin-content {
  padding: 32px;
}

.section-title-bar h2 {
  color: #0f172a;
  font-size: 1.55rem;
}

.section-subtitle {
  color: var(--text-3);
}

.date-select,
.search-input,
.setting-input,
.status-dropdown,
.form-input {
  background: var(--surface);
  border-color: #d8e0ea;
  color: var(--text-1);
}

.search-input::placeholder,
.form-input::placeholder {
  color: #99a2b1;
}

.date-select:focus,
.search-input:focus,
.setting-input:focus,
.status-dropdown:focus,
.form-input:focus {
  border-color: #8fcfaf;
  box-shadow: 0 0 0 3px rgba(31, 157, 99, 0.12);
}

.dashboard-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 1fr);
  gap: 20px;
  align-items: start;
}

.dashboard-main-column,
.dashboard-side-column {
  display: grid;
  gap: 18px;
}

.dashboard-grid.dashboard-grid-main {
  grid-template-columns: 1fr;
}

.stats-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 0;
}

.stat-card,
.dashboard-card,
.data-table-container,
.product-card-admin,
.order-card,
.post-card,
.settings-card,
.empty-products {
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
}

.stat-card:hover,
.dashboard-card:hover,
.product-card-admin:hover,
.order-card:hover,
.post-card:hover {
  border-color: #cdd8e6;
}

.stat-card::before {
  height: 4px;
}

.stat-icon-bg,
.timeline-icon,
.product-rank,
.product-thumb,
.order-id-badge,
.qa-icon {
  background: var(--surface-2);
}

.stat-value,
.card-header h3,
.product-name,
.settings-card h3,
.modal-header h3,
.post-main h4,
.detail-value,
.order-customer,
.user-info-cell .user-name {
  color: var(--text-1);
}

.stat-label,
.stat-compare,
.timeline-time,
.product-cat,
.empty-card p,
.empty-state p,
.detail-label,
.post-excerpt,
.post-meta,
.setting-item label,
.setting-toggle span,
.form-group label,
.user-info-cell .user-id,
.total-label {
  color: var(--text-3);
}

.card-header,
.stat-footer,
.mini-row,
.timeline-item,
.top-product-item,
.data-table th,
.data-table td,
.setting-item,
.setting-toggle,
.order-footer,
.product-meta-admin {
  border-color: #e9eef4;
}

.data-table th {
  background: #f7f9fc;
  color: #7a8699;
}

.data-table tbody tr:hover,
.mini-row:hover,
.top-product-item:hover {
  background: #f7fafc;
}

.btn-primary,
.card-action,
.filter-tab.active {
  background: linear-gradient(135deg, #22c55e, #1f9d63);
  border: 1px solid transparent;
  color: #fff;
}

.btn-primary:hover:not(:disabled),
.card-action:hover {
  background: linear-gradient(135deg, #20b35b, #188450);
}

.btn-secondary,
.filter-tab {
  border-color: #d3dce7;
  color: #4b5563;
}

.btn-secondary:hover,
.filter-tab:hover {
  background: #f5f8fb;
  color: #0f172a;
}

.empty-orders,
.empty-posts,
.empty-products p {
  color: #94a0b1;
}

/* Fix remaining dark-theme option backgrounds */
.date-select option,
select.form-input option,
.setting-input option {
  background: #ffffff;
  color: #1e293b;
}

.at-a-glance-body {
  display: grid;
  gap: 10px;
  padding: 16px 20px 20px;
}

.glance-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e6ecf3;
  border-radius: 12px;
  background: #fbfcfe;
  padding: 12px 14px;
}

.glance-item span {
  color: var(--text-3);
  font-size: 0.86rem;
}

.glance-item strong {
  color: var(--text-1);
  font-size: 0.95rem;
}

@media (max-width: 1280px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }

  .dashboard-side-column {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .dashboard-side-column {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== REDESIGN V2 ===== */
.admin-dashboard {
  background:
    radial-gradient(circle at 88% -10%, #dff6e9 0%, rgba(223, 246, 233, 0) 42%),
    radial-gradient(circle at 8% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 40%),
    #eef2f6;
  color: #0f172a;
}

.admin-branding {
  gap: 12px;
}

.admin-branding-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.admin-logo {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1faa6c, #187f51);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.admin-title {
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: -0.01em;
  color: #111827;
}

.admin-subtitle {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.topbar-btn {
  min-width: 62px;
  width: auto;
  padding: 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.topbar-btn .spinning {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

.admin-profile {
  border-radius: 14px;
  padding: 6px 12px 6px 8px;
}

.profile-dropdown-arrow {
  font-size: 0.62rem;
}

.dropdown-item {
  gap: 0;
  padding: 13px 16px;
  font-weight: 600;
}

.dropdown-item-label {
  font-size: 0.84rem;
}

.dropdown-item span {
  font-size: inherit;
}

.admin-sidebar {
  background: #f8fafc;
}

.nav-item {
  border: 1px solid transparent;
  border-radius: 12px;
}

.nav-item:hover {
  border-color: #dbe3ee;
}

.nav-icon {
  width: 32px;
  height: 28px;
  border-radius: 8px;
  background: #edf2f7;
  color: #3f4d61;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-icon svg {
  width: 16px;
  height: 16px;
}

.nav-item.active .nav-icon {
  background: rgba(255, 255, 255, 0.22);
  color: #ffffff;
}

.section-title-bar h2 {
  font-size: 1.7rem;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 0.95rem;
}

.stat-card,
.dashboard-card,
.data-table-container,
.order-card,
.post-card,
.settings-card,
.product-card-admin,
.modal {
  border-radius: 18px;
  border-color: #dfe6ef;
}

.card-header {
  padding: 18px 20px;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
}

.stat-value {
  font-size: 2rem;
}

.stat-label {
  font-size: 0.82rem;
}

.search-input,
.setting-input,
.form-input,
.date-select,
.status-dropdown {
  border-radius: 12px;
}

.card-action,
.btn-primary {
  border-radius: 12px;
  font-weight: 700;
}

.mini-row,
.top-product-item,
.timeline-item,
.setting-item,
.setting-toggle,
.data-table th,
.data-table td {
  border-color: #edf1f6;
}

.mini-row:hover,
.top-product-item:hover,
.data-table tbody tr:hover {
  background: #f7fafd;
}

.empty-card p,
.empty-orders,
.empty-posts,
.empty-products p,
.post-excerpt,
.post-meta,
.detail-label,
.timeline-time,
.upload-hint,
.or-divider {
  color: #738295;
}

@media (max-width: 768px) {
  .admin-branding-copy {
    display: none;
  }

  .topbar-btn {
    min-width: 52px;
    padding: 0 10px;
    font-size: 0.72rem;
  }
}

/* ===== TAB REDESIGN V3 ===== */
.title-actions {
  gap: 10px;
}

.filter-tabs {
  background: #ffffff;
  border: 1px solid #d9e3ee;
  border-radius: 999px;
  padding: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.filter-tab {
  border: none;
  border-radius: 999px;
  font-weight: 700;
  padding: 8px 18px;
  color: #64748b;
  font-size: 0.82rem;
  transition: all 0.2s ease;
}

.filter-tab:hover {
  background: #f1f5f9;
  color: #334155;
}

.filter-tab.active {
  background: #16a34a;
  color: #fff;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
}

.orders-list {
  gap: 14px;
}

.order-card {
  position: relative;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  padding: 20px 22px 20px 30px;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
  border-color: #cbd5e1;
}

.order-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 18px 0 0 18px;
  background: linear-gradient(180deg, #16a34a, #86efac);
}

.order-header,
.order-body,
.order-footer {
  margin-left: 0;
}

.order-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.order-id-badge {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  border-radius: 10px;
  padding: 5px 12px;
  font-size: 0.82rem;
  font-weight: 800;
  font-family: 'SF Mono', 'Fira Code', monospace;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.status-dropdown {
  flex: 1;
  min-width: 180px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #1e293b;
  background-color: #ffffff;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.status-dropdown:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
  outline: none;
}

.status-dropdown option {
  background: #ffffff;
  color: #1e293b;
  padding: 8px 12px;
  font-weight: 500;
}

.status-dropdown.pending {
  border-color: #fbbf24;
  background-color: #fffbeb;
  color: #92400e;
}
.status-dropdown.processing {
  border-color: #60a5fa;
  background-color: #eff6ff;
  color: #1e40af;
}
.status-dropdown.shipped {
  border-color: #a78bfa;
  background-color: #f5f3ff;
  color: #5b21b6;
}
.status-dropdown.delivered {
  border-color: #34d399;
  background-color: #ecfdf5;
  color: #065f46;
}
.status-dropdown.cancelled {
  border-color: #f87171;
  background-color: #fef2f2;
  color: #991b1b;
}

.order-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 14px 0;
  margin-bottom: 0;
}

.order-detail {
  padding: 0 12px;
  border-right: 1px solid #f1f5f9;
}

.order-detail:first-child {
  padding-left: 0;
}

.order-detail:last-child {
  border-right: none;
  padding-right: 0;
}

.detail-label {
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.detail-value {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.92rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  margin-top: 0;
  border-top: none;
}

.order-total {
  font-size: 1.3rem;
  font-weight: 800;
  color: #16a34a;
  letter-spacing: -0.02em;
}

.order-actions {
  display: flex;
  gap: 8px;
}

.data-table-container {
  border: 1px solid #dbe5f0;
  border-radius: 18px;
  overflow: hidden;
}

.data-table th {
  font-size: 0.68rem;
  color: #7b8ba1;
  background: #f8fbff;
}

.data-table td {
  color: #1f2937;
}

.action-buttons {
  gap: 8px;
}

.btn-icon {
  width: auto;
  min-width: 70px;
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
}

.btn-icon.btn-view {
  background: #f5f3ff;
  color: #7c3aed;
  border: 1px solid #e9e5ff;
}

.btn-icon.btn-view:hover {
  background: #ede9fe;
  border-color: #c4b5fd;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.12);
}

.btn-icon.btn-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-icon.btn-danger:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.12);
}

.btn-icon.btn-edit {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.btn-icon.btn-edit:hover {
  background: #dbeafe;
  border-color: #93c5fd;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);
}

.btn-icon.btn-warning {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.btn-icon.btn-warning:hover {
  background: #ffedd5;
  border-color: #fdba74;
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.12);
}

.btn-icon.btn-success {
  background: #ecfdf5;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.btn-icon.btn-success:hover {
  background: #dcfce7;
  border-color: #86efac;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.12);
}

.products-grid-admin {
  gap: 18px;
}

.product-card-admin {
  border: 1px solid #dce6f2;
}

.product-image-admin {
  background: #f6f9fc;
}

.product-overlay-admin {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0.5));
}

.overlay-btn {
  border-radius: 10px;
  font-size: 0.74rem;
  font-weight: 700;
}

.posts-list {
  gap: 14px;
}

.post-card {
  border: 1px solid #dbe5f0;
  border-left: 4px solid #9fd8bc;
}

.post-meta {
  gap: 12px;
}

.settings-card {
  border: 1px solid #dbe5f0;
  overflow: visible;
}

.settings-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  padding: 20px 24px;
  border-bottom: 1px solid #edf2f7;
}

.setting-item {
  padding: 18px 24px;
  gap: 10px;
}

.setting-item label {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.setting-input {
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.9rem;
}

.setting-toggle {
  padding: 16px 24px;
}

.setting-toggle span {
  color: #334155;
  font-size: 0.9rem;
}

.settings-card-footer {
  padding: 18px 24px 24px;
  border-top: 1px solid #edf2f7;
}

.settings-card-footer .btn-primary {
  width: 100%;
  padding: 12px;
  font-size: 0.9rem;
}

.toggle-slider {
  background: #d6dfeb;
}

.toggle input:checked + .toggle-slider {
  background: linear-gradient(135deg, #1faa6c, #188450);
}

.empty-orders,
.empty-posts {
  padding: 48px 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .order-card::before {
    left: 0;
  }

  .order-card {
    padding: 16px 16px 16px 22px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .status-dropdown {
    min-width: 100%;
  }

  .order-body {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .order-detail {
    border-right: none;
    padding: 0;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 8px;
  }

  .order-detail:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .btn-icon {
    min-width: 60px;
    height: 34px;
    padding: 0 10px;
    font-size: 0.72rem;
  }
}

/* ===== ADMIN DARK MODE ===== */
.admin-dark.admin-dashboard {
  --bg-canvas: #0f1117;
  --bg-soft: #161822;
  --surface: #1a1d2e;
  --surface-2: #1e2235;
  --line: #2a2f42;
  --text-1: #e8eaf0;
  --text-2: #a0a8b8;
  --text-3: #6e7687;
  --accent: #22c55e;
  --accent-soft: rgba(34,197,94,0.12);
  --danger: #ef4444;
  background: linear-gradient(180deg, #0f1117 0%, #131520 50%, #111318 100%) !important;
  color: var(--text-1);
}

/* Topbar */
.admin-dark .admin-topbar {
  background: rgba(22, 24, 34, 0.92);
  border-bottom-color: var(--line);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}
.admin-dark .admin-title { color: #e8eaf0; }
.admin-dark .admin-subtitle { color: #5a627a; }

.admin-dark .sidebar-toggle,
.admin-dark .topbar-btn {
  background: var(--surface-2);
  border-color: var(--line);
  color: var(--text-2);
}
.admin-dark .sidebar-toggle:hover,
.admin-dark .topbar-btn:hover {
  background: var(--surface);
  border-color: #3a4058;
  color: var(--accent);
}
.admin-dark .topbar-divider { background: var(--line); }

/* Profile dropdown */
.admin-dark .admin-profile {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
.admin-dark .admin-profile:hover { border-color: #3a4058; }
.admin-dark .profile-name,
.admin-dark .profile-dropdown-arrow { color: var(--text-2); }
.admin-dark .profile-dropdown {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 18px 36px rgba(0,0,0,0.35);
}
.admin-dark .dropdown-header { background: var(--surface-2); }
.admin-dark .dropdown-email { color: var(--text-1); }
.admin-dark .dropdown-role { color: var(--accent); background: var(--accent-soft); }
.admin-dark .dropdown-divider { background: var(--line); }
.admin-dark .dropdown-item { color: var(--text-2); }
.admin-dark .dropdown-item:hover { background: var(--surface-2); color: var(--text-1); }
.admin-dark .dropdown-logout { color: var(--danger); }
.admin-dark .dropdown-logout:hover { background: rgba(239,68,68,0.1); }

/* Sidebar */
.admin-dark .admin-sidebar {
  background: #141624;
  border-right-color: var(--line);
}
.admin-dark .nav-section-title { color: #5a627a; }
.admin-dark .nav-item { color: var(--text-2); border-color: transparent; }
.admin-dark .nav-item:hover { background: var(--surface-2); color: var(--text-1); border-color: var(--line); }
.admin-dark .nav-item.active {
  background: linear-gradient(135deg, #22c55e, #1f9d63);
  box-shadow: 0 10px 18px rgba(34,197,94,0.18);
  border-color: transparent;
}
.admin-dark .nav-icon { background: var(--surface-2); color: var(--text-2); }
.admin-dark .nav-item:hover .nav-icon { background: rgba(34,197,94,0.1); color: var(--accent); }
.admin-dark .nav-item.active .nav-icon { background: rgba(255,255,255,0.22); color: #fff; }
.admin-dark .nav-badge { background: var(--surface-2); color: var(--text-2); }

/* Section headers */
.admin-dark .section-title-bar h2 { color: var(--text-1); }
.admin-dark .section-subtitle { color: var(--text-2); }

/* Form inputs / selects */
.admin-dark .date-select,
.admin-dark .search-input,
.admin-dark .form-input,
.admin-dark .setting-input {
  background: var(--surface-2);
  border-color: var(--line);
  color: var(--text-1);
}
.admin-dark .date-select option,
.admin-dark .form-input option,
.admin-dark .setting-input option,
.admin-dark .status-dropdown option {
  background: var(--surface);
  color: var(--text-1);
}
.admin-dark .search-box { background: var(--surface-2); border-color: var(--line); }
.admin-dark .search-icon { color: var(--text-3); }

/* Stat cards */
.admin-dark .stat-card {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.admin-dark .stat-value { color: var(--text-1); }
.admin-dark .stat-label { color: var(--text-2); }
.admin-dark .stat-compare { color: var(--text-3); }
.admin-dark .stat-icon-bg { background: var(--surface-2); }

/* Dashboard cards */
.admin-dark .dashboard-card {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.admin-dark .dashboard-card:hover { border-color: #3a4058; }
.admin-dark .card-header { border-color: var(--line); }
.admin-dark .card-header h3 { color: var(--text-1); }
.admin-dark .card-action {
  background: rgba(34,197,94,0.12);
  border-color: rgba(34,197,94,0.25);
  color: var(--accent);
}
.admin-dark .card-action:hover {
  background: rgba(34,197,94,0.2);
}

.admin-dark .mini-row { border-color: var(--line); }
.admin-dark .mini-row:hover { background: var(--surface-2); }
.admin-dark .order-customer { color: var(--text-2); }

.admin-dark .top-product-item { border-color: var(--line); }
.admin-dark .top-product-item:hover { background: var(--surface-2); }
.admin-dark .product-rank { color: var(--text-3); }
.admin-dark .product-name { color: var(--text-1); }
.admin-dark .product-cat { color: var(--text-3); }
.admin-dark .product-price { color: var(--accent); }

.admin-dark .timeline-item { border-color: var(--line); }
.admin-dark .timeline-icon { background: var(--surface-2); }

/* At a glance */
.admin-dark .glance-item {
  background: var(--surface-2);
  border-color: var(--line);
}
.admin-dark .glance-item span { color: var(--text-2); }
.admin-dark .glance-item strong { color: var(--text-1); }

/* Activity timeline */
.admin-dark .timeline-content p { color: var(--text-2); }
.admin-dark .timeline-time { color: var(--text-3); }

/* Data table (Users/Products) */
.admin-dark .data-table-container { background: var(--surface); border-color: var(--line); }
.admin-dark .data-table th {
  background: var(--surface-2);
  color: var(--text-3);
  border-color: var(--line);
  border-bottom-color: var(--line);
}
.admin-dark .data-table td {
  color: var(--text-2);
  border-color: var(--line);
  border-bottom-color: var(--line);
}
.admin-dark .data-table tbody tr:hover,
.admin-dark .data-table tr:hover td { background: var(--surface-2); }
.admin-dark .user-name { color: var(--text-1); }
.admin-dark .user-id { color: var(--text-3); }

/* Action buttons – override V3 hardcoded light colors */
.admin-dark .btn-icon {
  border-color: var(--line);
  color: var(--text-2);
}
.admin-dark .btn-icon:hover { background: var(--surface-2); }

.admin-dark .btn-icon.btn-edit {
  background: rgba(37, 99, 235, 0.12);
  color: #60a5fa;
  border-color: rgba(37, 99, 235, 0.25);
}
.admin-dark .btn-icon.btn-edit:hover {
  background: rgba(37, 99, 235, 0.2);
  border-color: rgba(37, 99, 235, 0.4);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
}

.admin-dark .btn-icon.btn-warning {
  background: rgba(234, 88, 12, 0.12);
  color: #fb923c;
  border-color: rgba(234, 88, 12, 0.25);
}
.admin-dark .btn-icon.btn-warning:hover {
  background: rgba(234, 88, 12, 0.2);
  border-color: rgba(234, 88, 12, 0.4);
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.15);
}

.admin-dark .btn-icon.btn-danger {
  background: rgba(220, 38, 38, 0.12);
  color: #f87171;
  border-color: rgba(220, 38, 38, 0.25);
}
.admin-dark .btn-icon.btn-danger:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.4);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
}

.admin-dark .btn-icon.btn-success {
  background: rgba(22, 163, 74, 0.12);
  color: #4ade80;
  border-color: rgba(22, 163, 74, 0.25);
}
.admin-dark .btn-icon.btn-success:hover {
  background: rgba(22, 163, 74, 0.2);
  border-color: rgba(22, 163, 74, 0.4);
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.15);
}

.admin-dark .btn-icon.btn-view {
  background: rgba(124, 58, 237, 0.12);
  color: #a78bfa;
  border-color: rgba(124, 58, 237, 0.25);
}
.admin-dark .btn-icon.btn-view:hover {
  background: rgba(124, 58, 237, 0.2);
  border-color: rgba(124, 58, 237, 0.4);
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
}

/* Product cards */
.admin-dark .product-card-admin {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.admin-dark .product-image-admin { background: var(--surface-2); }
.admin-dark .product-overlay-admin { background: linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.6)); }
.admin-dark .product-info-admin h4 { color: var(--text-1); }
.admin-dark .product-desc-admin { color: var(--text-3); }
.admin-dark .product-category-admin { color: var(--accent); background: var(--accent-soft); }
.admin-dark .product-price-admin { color: var(--text-1); }
.admin-dark .product-stock-admin { color: var(--text-2); }

/* Order cards – override V3 hardcoded light styles */
.admin-dark .order-card {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.admin-dark .order-card:hover {
  border-color: #3a4058;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}
.admin-dark .order-card::before {
  background: linear-gradient(180deg, #22c55e, #4ade80);
}
.admin-dark .order-id-badge {
  background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.08));
  border-color: rgba(59,130,246,0.3);
  color: #60a5fa;
}
.admin-dark .order-body {
  border-top-color: var(--line);
  border-bottom-color: var(--line);
}
.admin-dark .order-detail { border-right-color: var(--line); }
.admin-dark .detail-label { color: var(--text-3); }
.admin-dark .detail-value { color: var(--text-1); }
.admin-dark .order-total { color: var(--accent); }
.admin-dark .order-footer { border-top-color: var(--line); }

/* Status dropdown – override V3 colored variants */
.admin-dark .status-dropdown {
  background-color: var(--surface-2);
  border-color: var(--line);
  color: var(--text-1);
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236e7687' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
.admin-dark .status-dropdown:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
}
.admin-dark .status-dropdown.pending {
  border-color: rgba(251,191,36,0.4);
  background-color: rgba(251,191,36,0.08);
  color: #fbbf24;
}
.admin-dark .status-dropdown.processing {
  border-color: rgba(96,165,250,0.4);
  background-color: rgba(96,165,250,0.08);
  color: #60a5fa;
}
.admin-dark .status-dropdown.shipped {
  border-color: rgba(167,139,250,0.4);
  background-color: rgba(167,139,250,0.08);
  color: #a78bfa;
}
.admin-dark .status-dropdown.delivered {
  border-color: rgba(52,211,153,0.4);
  background-color: rgba(52,211,153,0.08);
  color: #34d399;
}
.admin-dark .status-dropdown.cancelled {
  border-color: rgba(248,113,113,0.4);
  background-color: rgba(248,113,113,0.08);
  color: #f87171;
}

/* Filter tabs – override V3 */
.admin-dark .filter-tabs {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: none;
}
.admin-dark .filter-tab {
  color: var(--text-2);
}
.admin-dark .filter-tab:hover {
  background: var(--surface-2);
  color: var(--text-1);
}
.admin-dark .filter-tab.active {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 4px 12px rgba(34,197,94,0.25);
}

/* Forum posts */
.admin-dark .post-card {
  background: var(--surface);
  border-color: var(--line);
  border-left-color: rgba(34,197,94,0.4);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.admin-dark .post-card h4 { color: var(--text-1); }
.admin-dark .post-excerpt { color: var(--text-3); }
.admin-dark .post-author,
.admin-dark .post-date,
.admin-dark .post-comments { color: var(--text-3); }

/* Settings cards – override V3 */
.admin-dark .settings-card {
  background: var(--surface);
  border-color: var(--line);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.admin-dark .settings-card h3 {
  color: var(--text-1);
  border-bottom-color: var(--line);
}
.admin-dark .setting-item label { color: var(--text-2); }
.admin-dark .setting-toggle span { color: var(--text-2); }
.admin-dark .settings-card-footer { border-top-color: var(--line); }
.admin-dark .toggle-slider { background: #3a4058; }

/* Empty states */
.admin-dark .empty-state,
.admin-dark .empty-card,
.admin-dark .empty-products,
.admin-dark .empty-orders,
.admin-dark .empty-posts,
.admin-dark .empty-table { color: var(--text-3); }

/* Badges */
.admin-dark .badge-success { background: rgba(34,197,94,0.15); color: #4ade80; border-color: rgba(34,197,94,0.25); }
.admin-dark .badge-danger { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.25); }
.admin-dark .badge-admin { background: rgba(99,102,241,0.15); color: #a5b4fc; }
.admin-dark .badge-user { background: rgba(34,197,94,0.15); color: #4ade80; }

/* Row states */
.admin-dark .data-table tr.row-blocked { background: rgba(239,68,68,0.06); }

/* Placeholder text */
.admin-dark .search-input::placeholder,
.admin-dark .form-input::placeholder {
  color: var(--text-3);
}

/* Stat card before-line */
.admin-dark .stat-card::before { opacity: 0.7; }

/* Data-table hover from V2 */
.admin-dark .data-table tbody tr:hover { background: var(--surface-2); }

/* Upload area hover */
.admin-dark .upload-area:hover { border-color: rgba(34,197,94,0.4); }

/* Section title from LIGHT REMAKE */
.admin-dark .section-title-bar h2 { color: var(--text-1); }

/* Settings card h3 from V3 */
.admin-dark .settings-card h3 {
  color: var(--text-1);
  border-bottom-color: var(--line);
}

/* Settings card footer from V3 */
.admin-dark .settings-card-footer { border-top-color: var(--line); }

/* Toggle slider from V3 */
.admin-dark .toggle-slider { background: #3a4058; }

/* No-image product placeholder */
.admin-dark .no-image-admin { background: var(--surface-2); color: var(--text-3); }

/* Responsive dark overrides */
@media (max-width: 900px) {
  .admin-dark .order-detail {
    border-bottom-color: var(--line);
  }
}
</style>

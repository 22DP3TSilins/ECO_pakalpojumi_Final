<template>
  <div class="profile-page">
    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.visible" class="toast" :class="['toast-' + toast.type]">
        <svg v-if="toast.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <!-- Profile Hero -->
    <div class="profile-hero">
      <div class="hero-bg"></div>
      <div class="profile-avatar-section">
        <div class="avatar-wrapper">
          <div class="avatar-ring">
            <img v-if="customizations.avatar" :src="customizations.avatar" alt="Avatar" class="avatar-img" />
            <div v-else class="avatar-placeholder">
              {{ user?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
          </div>
          <button class="avatar-edit-btn" @click="triggerAvatarUpload">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
          <input type="file" ref="avatarInput" @change="handleAvatarUpload" accept="image/*" hidden />
        </div>
        <div class="profile-info">
          <h1>{{ user?.name || 'User' }}</h1>
          <p class="email">{{ user?.email }}</p>
          <div class="member-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.52 0 10-2.24 10-5v-4"/><path d="M2 17v-4"/><path d="M12 12c5.52 0 10-2.24 10-5S17.52 2 12 2 2 4.24 2 7s4.48 5 10 5Z"/></svg>
            <span>{{ t('profile.memberSince') }} {{ memberSince }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-container">
      <!-- Stats Overview -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.co2Saved }}</span>
            <span class="stat-label">{{ t('profile.stats.co2Saved') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.challengesCompleted }}</span>
            <span class="stat-label">{{ t('profile.stats.challengesDone') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.ecoOrders }}</span>
            <span class="stat-label">{{ t('profile.stats.ecoOrders') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-1.08-3.82-.5-5.5 1.5 1 2.5 2 2.5 5A2.5 2.5 0 0 0 14.5 11c1-1 1.5-2.5 1.5-4.5 3.5 1.5 6 4 6 9a7 7 0 1 1-14 0c0-1.42.35-2.72.93-3.89"/></svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ userStats.streak }}</span>
            <span class="stat-label">{{ t('profile.stats.streak') }}</span>
          </div>
        </div>
      </div>

      <div class="profile-grid">
        <!-- Main Content -->
        <div class="profile-main">
          <!-- Quick Actions -->
          <div class="section-card">
            <h2>{{ t('profile.quickActions') }}</h2>
            <div class="quick-actions">
              <router-link to="/footprint?tab=calculator" class="action-btn">
                <span class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="16" y2="18"/></svg>
                </span>
                <span class="action-text">{{ t('profile.calculateFootprint') }}</span>
              </router-link>
              <router-link to="/education" class="action-btn">
                <span class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </span>
                <span class="action-text">{{ t('profile.learnMore') || 'Learn' }}</span>
              </router-link>
              <router-link to="/footprint" class="action-btn">
                <span class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
                </span>
                <span class="action-text">{{ t('profile.logActivity') }}</span>
              </router-link>
              <router-link to="/products" class="action-btn">
                <span class="action-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </span>
                <span class="action-text">{{ t('profile.shopProducts') }}</span>
              </router-link>
            </div>
          </div>

          <!-- Edit Profile Section -->
          <div class="section-card">
            <div class="section-header">
              <h2>{{ t('profile.profileInfo') }}</h2>
              <button class="toggle-edit" @click="showEdit = !showEdit">
                <svg v-if="!showEdit" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {{ showEdit ? t('common.cancel') : t('common.edit') }}
              </button>
            </div>

            <div v-if="!showEdit" class="profile-display">
              <div class="info-row">
                <span class="info-label">{{ t('profile.name') }}</span>
                <span class="info-value">{{ user?.name }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('profile.email') }}</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('profile.bio') }}</span>
                <span class="info-value">{{ customizations.bio || t('profile.noBioYet') }}</span>
              </div>
            </div>

            <form v-else @submit.prevent="updateProfile" class="edit-form">
              <div class="form-group">
                <label>{{ t('profile.name') }}</label>
                <input v-model="editData.name" type="text" required />
              </div>
              <div class="form-group">
                <label>{{ t('profile.bio') }}</label>
                <textarea v-model="customizations.bio" :placeholder="t('profile.bioPlaceholder')" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>{{ t('profile.newPassword') }}</label>
                <input v-model="editData.password" type="password" placeholder="••••••••" />
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="loading">
                  {{ loading ? t('common.loading') : t('profile.saveChanges') }}
                </button>
              </div>
            </form>
          </div>

          <!-- Achievements Section -->
          <div class="section-card">
            <h2>
              <svg class="section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              {{ t('profile.achievements') }}
            </h2>
            <div class="achievements-grid">
              <div 
                v-for="badge in achievements" 
                :key="badge.id"
                :class="['achievement', { unlocked: badge.unlocked }]"
                :title="badge.description"
              >
                <span class="achievement-icon" v-html="badge.icon"></span>
                <span class="achievement-name">{{ badge.name }}</span>
                <div v-if="!badge.unlocked" class="achievement-progress">
                  <div class="progress-fill" :style="{ width: badge.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="profile-sidebar">
          <!-- Level Progress -->
          <div class="sidebar-card level-card">
            <div class="level-header">
              <span class="level-badge">{{ t('profile.level') }} {{ userLevel }}</span>
              <span class="level-title">{{ levelTitle }}</span>
            </div>
            <div class="level-progress">
              <div class="level-bar">
                <div class="level-fill" :style="{ width: levelProgress + '%' }"></div>
              </div>
              <span class="level-text">{{ currentXP }} / {{ nextLevelXP }} XP</span>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="sidebar-card">
            <h3>
              <svg class="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ t('profile.recentActivity') }}
            </h3>
            <div class="activity-list">
              <div v-for="(activity, index) in recentActivity" :key="index" class="activity-item">
                <span class="activity-icon" v-html="activity.icon"></span>
                <div class="activity-content">
                  <span class="activity-text">{{ activity.text }}</span>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="sidebar-card danger-zone">
            <h3>
              <svg class="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {{ t('profile.accountSettings') }}
            </h3>
            <p class="danger-text">{{ t('profile.dangerZone') }}</p>
            <button class="btn-logout" @click="logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {{ t('common.logout') }}
            </button>
            <button class="btn-delete" @click="deleteAccount">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
              {{ t('profile.deleteAccount') }}
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import api from '../utils/api.js'

export default {
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      showEdit: false,
      editData: {
        name: '',
        password: ''
      },
      loading: false,
      customizations: {
        avatar: '',
        bio: ''
      },
      userStats: {
        co2Saved: 0,
        challengesCompleted: 0,
        ecoOrders: 0,
        streak: 0
      },
      userLevel: 1,
      currentXP: 0,
      nextLevelXP: 100,
      memberSinceDate: null,
      toast: { message: '', type: 'success', visible: false },
      achievementsData: [
        { id: 1, key: 'firstStep', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-12a8 8 0 1 0-16 0c0 8 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>', unlocked: false, progress: 0 },
        { id: 2, key: 'ecoShopper', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>', unlocked: false, progress: 0 },
        { id: 3, key: 'carbonCutter', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', unlocked: false, progress: 0 },
        { id: 4, key: 'challengeMaster', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>', unlocked: false, progress: 0 },
        { id: 5, key: 'streakHero', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', unlocked: false, progress: 0 },
        { id: 6, key: 'planetGuardian', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>', unlocked: false, progress: 0 }
      ],
      recentActivity: []
    }
  },
  computed: {
    achievements() {
      return this.achievementsData.map(a => ({
        ...a,
        name: this.t(`profile.achievementsList.${a.key}Name`),
        description: this.t(`profile.achievementsList.${a.key}Desc`)
      }));
    },
    user() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          return { id: payload.id, email: payload.email, name: payload.name };
        } catch (e) {
          return null;
        }
      }
      return null;
    },
    memberSince() {
      if (this.memberSinceDate) {
        const date = new Date(this.memberSinceDate);
        return date.toLocaleDateString('lv-LV', { month: 'long', year: 'numeric' });
      }
      return this.t('common.recently') || 'Nesen';
    },
    levelProgress() {
      return (this.currentXP / this.nextLevelXP) * 100;
    },
    levelTitle() {
      const keys = ['beginner', 'explorer', 'advocate', 'champion', 'master', 'legend'];
      const key = keys[Math.min(this.userLevel - 1, keys.length - 1)];
      return this.t(`profile.levelTitles.${key}`);
    }
  },
  async mounted() {
    if (this.user) {
      this.editData.name = this.user.name;
      // Load customizations using user-specific key
      const saved = localStorage.getItem(`customizations_${this.user.id}`);
      if (saved) {
        this.customizations = JSON.parse(saved);
      }
      // Fetch real stats from backend
      await this.fetchUserStats();
    }
  },
  methods: {
    async fetchUserStats() {
      try {
        const { data } = await api.get('/api/user/stats');
        this.userStats = {
          co2Saved: data.totalCo2Saved || 0,
          challengesCompleted: data.challengesCompleted || 0,
          ecoOrders: data.ordersCount || 0,
          streak: data.streak || 0
        };
        this.userLevel = data.level || 1;
        this.currentXP = data.currentXP || 0;
        this.nextLevelXP = data.nextLevelXP || 100;
        this.memberSinceDate = data.userCreatedAt;
        this.updateAchievements(data);
        if (data.recentActivities && data.recentActivities.length > 0) {
          this.recentActivity = data.recentActivities.map(a => ({
            icon: this.getActivityIcon(a.activity),
            text: a.activity,
            time: this.formatActivityTime(a.date)
          }));
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    },
    updateAchievements(data) {
      // First Step - has any activity
      this.achievementsData[0].progress = data.activitiesCount > 0 ? 100 : 0;
      this.achievementsData[0].unlocked = data.activitiesCount > 0;
      
      // Eco Shopper - 5 orders
      this.achievementsData[1].progress = Math.min((data.ordersCount / 5) * 100, 100);
      this.achievementsData[1].unlocked = data.ordersCount >= 5;
      
      // Carbon Cutter - 50kg CO2
      this.achievementsData[2].progress = Math.min((data.totalCo2Saved / 50) * 100, 100);
      this.achievementsData[2].unlocked = data.totalCo2Saved >= 50;
      
      // Challenge Master - 10 challenges
      this.achievementsData[3].progress = Math.min((data.challengesCompleted / 10) * 100, 100);
      this.achievementsData[3].unlocked = data.challengesCompleted >= 10;
      
      // Streak Hero - 30 day streak
      this.achievementsData[4].progress = Math.min((data.streak / 30) * 100, 100);
      this.achievementsData[4].unlocked = data.streak >= 30;
      
      // Planet Guardian - 500kg CO2
      this.achievementsData[5].progress = Math.min((data.totalCo2Saved / 500) * 100, 100);
      this.achievementsData[5].unlocked = data.totalCo2Saved >= 500;
    },
    getActivityIcon(activity) {
      const svg = (path) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
      const lower = activity.toLowerCase();
      if (lower.includes('bike') || lower.includes('cycling')) return svg('<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>');
      if (lower.includes('recycle')) return svg('<path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>');
      if (lower.includes('walk')) return svg('<circle cx="13" cy="4" r="2"/><path d="m15 22-1-7 1-2 4 4M9 22l3-9-3-3-3 5"/>');
      if (lower.includes('public') || lower.includes('bus') || lower.includes('train')) return svg('<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/>');
      if (lower.includes('plant')) return svg('<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>');
      if (lower.includes('solar') || lower.includes('energy')) return svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>');
      if (lower.includes('water')) return svg('<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>');
      return svg('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>');
    },
    formatActivityTime(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return this.t('common.today');
      if (diffDays === 1) return this.t('common.yesterday');
      if (diffDays < 7) return `${diffDays} ${this.t('common.daysAgo')}`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${this.t('common.weeksAgo')}`;
      }
      return date.toLocaleDateString();
    },
    triggerAvatarUpload() {
      this.$refs.avatarInput.click();
    },
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.customizations.avatar = e.target.result;
          this.saveCustomizations();
        };
        reader.readAsDataURL(file);
      }
    },
    async updateProfile() {
      this.loading = true;
      try {
        // Only send fields the user actually wants to change
        const payload = {};
        if (this.editData.name && this.editData.name.trim() && this.editData.name !== this.user?.name) {
          payload.name = this.editData.name.trim();
        }
        if (this.editData.password) {
          payload.password = this.editData.password;
        }
        if (Object.keys(payload).length === 0) {
          // Just save local customizations (bio/avatar)
          this.saveCustomizations();
          this.showEdit = false;
          this.showToast(this.t('profile.savedLocally') || 'Saved');
          this.loading = false;
          return;
        }
        const { data } = await api.put('/api/user', payload);
        // Backend now re-issues a JWT so the new name shows up immediately
        if (data && data.token) {
          localStorage.setItem('token', data.token);
        }
        this.saveCustomizations();
        this.editData.password = '';
        this.showEdit = false;
        this.showToast(this.t('profile.profileUpdated') || 'Profile updated');
        // Force computed `user` to re-read the new token without a hard reload
        this.$forceUpdate();
      } catch (error) {
        this.showToast(error.response?.data?.error || 'Error updating profile', 'error');
      } finally {
        this.loading = false;
      }
    },
    showToast(message, type = 'success') {
      this.toast = { message, type, visible: true };
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.toast.visible = false;
      }, 3000);
    },
    async deleteAccount() {
      if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
      try {
        await api.delete('/api/user');
        localStorage.removeItem('token');
        this.$router.push('/');
        location.reload();
      } catch (error) {
        alert('Error deleting account');
      }
    },
    saveCustomizations() {
      if (this.user) {
        // Save customizations with user-specific key
        localStorage.setItem(`customizations_${this.user.id}`, JSON.stringify(this.customizations));
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
      location.reload();
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 60px;
  animation: pageFadeIn 0.5s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hero Section */
.profile-hero {
  position: relative;
  padding: 100px 20px 60px;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  overflow: hidden;
}

.profile-hero::before,
.profile-hero::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  animation: floatShape 8s ease-in-out infinite;
}

.profile-hero::before {
  width: 150px;
  height: 150px;
  top: -40px;
  right: 80px;
}

.profile-hero::after {
  width: 100px;
  height: 100px;
  bottom: -30px;
  left: 50px;
  animation-delay: -4s;
}

@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.profile-avatar-section {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-wrapper {
  position: relative;
}

.avatar-ring {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 4px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: white;
  cursor: pointer;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  color: var(--text-color);
}

.avatar-edit-btn:hover {
  transform: scale(1.05);
}

.profile-info {
  color: white;
}

.profile-info h1 {
  margin: 0 0 6px;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.profile-info .email {
  margin: 0 0 10px;
  opacity: 0.85;
  font-size: 0.9rem;
}

.member-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
}

.member-badge svg {
  opacity: 0.9;
}

/* Container */
.profile-container {
  max-width: 1000px;
  margin: -24px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(46, 204, 113, 0.12);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.stat-icon.green { background: var(--primary-subtle); color: var(--primary); }
.stat-icon.blue { background: #e8f4fd; color: #3b82f6; }
.stat-icon.purple { background: #f3e8ff; color: #8b5cf6; }
.stat-icon.orange { background: #fef3e2; color: #f59e0b; }

/* Dark-mode tints so coloured icons stay readable without going pure white */
.dark .stat-icon.blue { background: rgba(59, 130, 246, 0.15); color: #93c5fd; }
.dark .stat-icon.purple { background: rgba(139, 92, 246, 0.15); color: #c4b5fd; }
.dark .stat-icon.orange { background: rgba(245, 158, 11, 0.15); color: #fcd34d; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Profile Grid */
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

/* Section Cards */
.section-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 8px 24px rgba(46, 204, 113, 0.08);
}

.section-card h2 {
  margin: 0 0 16px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 0;
}

.toggle-edit {
  padding: 8px 14px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.85rem;
  transition: var(--transition);
}

.toggle-edit:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.dark .action-btn {
  background: rgba(255, 255, 255, 0.03);
}

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.15);
}

.action-icon {
  color: var(--primary);
}

.action-text {
  font-weight: 500;
  font-size: 0.9rem;
}

/* Profile Display */
.profile-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.info-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.info-value {
  color: var(--text-color);
  font-weight: 500;
}

/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 0.95rem;
  font-family: inherit;
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.form-actions {
  margin-top: 8px;
}

.btn-save {
  width: 100%;
  padding: 12px;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-save::after {
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

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
}

.btn-save:hover::after {
  left: 100%;
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.achievement {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  opacity: 0.5;
  filter: grayscale(1);
  transition: var(--transition);
}

.dark .achievement {
  background: rgba(255, 255, 255, 0.03);
}

.achievement.unlocked {
  opacity: 1;
  filter: none;
  background: var(--primary-subtle);
  border-color: var(--primary-light);
}

.achievement-icon {
  margin-bottom: 8px;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-name {
  font-size: 0.75rem;
  color: var(--text-color);
  text-align: center;
  font-weight: 500;
}

.achievement-progress {
  width: 100%;
  height: 3px;
  background: var(--border-color);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.dark .achievement-progress {
  background: rgba(255, 255, 255, 0.1);
}

.achievement-progress .progress-fill {
  height: 100%;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  border-radius: 2px;
}

/* Sidebar */
.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.sidebar-card h3 {
  margin: 0 0 12px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Level Card */
.level-card {
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  border: none;
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.level-badge {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.85rem;
}

.level-title {
  font-weight: 600;
}

.level-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.level-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.level-text {
  text-align: right;
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity-icon {
  width: 34px;
  height: 34px;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.dark .activity-icon {
  background: rgba(255, 255, 255, 0.05);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-text {
  font-size: 0.85rem;
  color: var(--text-color);
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Danger Zone */
.danger-zone {
  border: 1px solid #fecaca;
  background: #fef2f2;
}

.dark .danger-zone {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}

.danger-text {
  margin: 0 0 12px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.btn-logout,
.btn-delete {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-logout {
  background: #fee2e2;
  color: #dc2626;
}

.btn-logout:hover {
  background: #dc2626;
  color: white;
}

.btn-delete {
  background: transparent;
  border: 1px solid #dc2626;
  color: #dc2626;
  margin-bottom: 0;
}

.btn-delete:hover {
  background: #dc2626;
  color: white;
}

/* Responsive */
@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 600px) {
  .profile-hero {
    padding: 90px 15px 40px;
  }

  .profile-info h1 {
    font-size: 1.4rem;
  }

  .stats-section {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .stat-card {
    padding: 12px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Toast notification */
.toast {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 360px;
}

.toast-success {
  border-left: 3px solid var(--primary);
  color: var(--primary);
}

.toast-error {
  border-left: 3px solid #dc2626;
  color: #dc2626;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 600px) {
  .toast {
    top: 70px;
    right: 12px;
    left: 12px;
    max-width: none;
  }
}
</style>
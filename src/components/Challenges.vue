<template>
  <div class="challenges-page">
    <!-- Hero Section -->
    <div class="challenges-hero">
      <div class="hero-content">
        <h1><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>{{ t('challenges.title') }}</h1>
        <p>{{ t('challenges.subtitle') }}</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-number">{{ completedCount }}</span>
          <span class="stat-label">{{ t('challenges.completed') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ totalPoints }}</span>
          <span class="stat-label">{{ t('challenges.pointsEarned') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ currentStreak }}</span>
          <span class="stat-label">{{ t('challenges.dayStreak') }}</span>
        </div>
        <div class="hero-stat">
          <span class="stat-number">{{ userRank }}</span>
          <span class="stat-label">{{ t('challenges.yourRank') }}</span>
        </div>
      </div>
    </div>

    <div class="challenges-container">
      <!-- Main Content -->
      <div class="challenges-main">
        <!-- Featured Challenge -->
        <div class="featured-challenge" v-if="featuredChallenge">
          <div class="featured-badge"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Featured Challenge</div>
          <div class="featured-content">
            <div class="featured-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
            <div class="featured-info">
              <h2>{{ featuredChallenge.title }}</h2>
              <p>{{ featuredChallenge.description }}</p>
              <div class="featured-meta">
                <span class="meta-item">
                  <span class="meta-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>
                  {{ featuredChallenge.points }} points
                </span>
                <span class="meta-item">
                  <span class="meta-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                  {{ featuredChallenge.participants }} participating
                </span>
                <span class="meta-item">
                  <span class="meta-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                  {{ featuredChallenge.duration }}
                </span>
              </div>
              <div class="featured-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: featuredChallenge.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ featuredChallenge.progress }}% complete</span>
              </div>
            </div>
            <button 
              class="featured-btn"
              :class="{ joined: featuredChallenge.joined }"
              @click="toggleJoin(featuredChallenge)"
            >
              {{ featuredChallenge.joined ? 'Joined' : 'Join Challenge' }}
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-section">
          <div class="filter-tabs">
            <button 
              v-for="tab in filterTabs" 
              :key="tab.id"
              :class="['filter-tab', { active: activeFilter === tab.id }]"
              @click="activeFilter = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="sort-dropdown">
            <select v-model="sortBy">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="ending">Ending Soon</option>
              <option value="points">Highest Points</option>
            </select>
          </div>
        </div>

        <!-- Challenge Categories -->
        <div class="category-chips">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['category-chip', { active: activeCategory === cat.id }]"
            @click="activeCategory = activeCategory === cat.id ? 'all' : cat.id"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Challenges Grid -->
        <div class="challenges-grid">
          <div 
            v-for="challenge in filteredChallenges" 
            :key="challenge.id" 
            :class="['challenge-card', { completed: challenge.completed, joined: challenge.joined }]"
          >
            <div class="card-header" :style="{ background: challenge.gradient }">
              <span class="challenge-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
              <div class="card-badges">
                <span v-if="challenge.isNew" class="badge new">NEW</span>
                <span v-if="challenge.isHot" class="badge hot">HOT</span>
                <span class="badge difficulty" :class="challenge.difficulty">
                  {{ challenge.difficulty }}
                </span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="card-category">{{ getCategoryName(challenge.category) }}</div>
              <h3>{{ challenge.title }}</h3>
              <p>{{ challenge.description }}</p>
              
              <div class="card-stats">
                <div class="stat">
                  <span class="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span>
                  <span>{{ challenge.points }} pts</span>
                </div>
                <div class="stat">
                  <span class="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                  <span>{{ challenge.participants }}</span>
                </div>
                <div class="stat">
                  <span class="stat-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
                  <span>{{ challenge.daysLeft }}d left</span>
                </div>
              </div>

              <div v-if="challenge.joined && !challenge.completed" class="challenge-progress">
                <div class="progress-header">
                  <span>Progress</span>
                  <span>{{ challenge.currentProgress }}/{{ challenge.targetProgress }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: (challenge.currentProgress / challenge.targetProgress * 100) + '%' }"
                  ></div>
                </div>
              </div>

              <div class="card-actions">
                <button 
                  v-if="challenge.completed"
                  class="action-btn completed"
                  disabled
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Completed
                </button>
                <button 
                  v-else-if="challenge.joined"
                  class="action-btn progress-btn"
                  @click="updateProgress(challenge)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg> {{ t('challenges.logProgress') }}
                </button>
                <button 
                  v-else
                  class="action-btn join-btn"
                  @click="toggleJoin(challenge)"
                >
                  {{ t('challenges.joinChallenge') }}
                </button>
                <button class="share-btn" @click="shareChallenge(challenge)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredChallenges.length === 0" class="empty-state">
          <div class="empty-icon"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
          <h3>No challenges found</h3>
          <p>Try adjusting your filters or check back later for new challenges!</p>
        </div>
      </div>

      <!-- Sidebar -->
      <aside class="challenges-sidebar">
        <!-- Your Active Challenges -->
        <div class="sidebar-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>{{ t('challenges.yourActiveChallenges') }}</h3>
          <div v-if="activeChallenges.length === 0" class="no-active">
            <p>{{ t('challenges.noActiveYet') }}</p>
            <span class="hint">{{ t('challenges.browseAndJoin') }}</span>
          </div>
          <div v-else class="active-list">
            <div 
              v-for="challenge in activeChallenges" 
              :key="challenge.id"
              class="active-item"
            >
              <span class="active-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
              <div class="active-info">
                <span class="active-title">{{ challenge.title }}</span>
                <div class="mini-progress">
                  <div 
                    class="mini-fill" 
                    :style="{ width: (challenge.currentProgress / challenge.targetProgress * 100) + '%' }"
                  ></div>
                </div>
              </div>
              <span class="active-days">{{ challenge.daysLeft }}d</span>
            </div>
          </div>
        </div>

        <!-- Leaderboard -->
        <div class="sidebar-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>{{ t('challenges.leaderboard') }}</h3>
          <div class="leaderboard">
            <div 
              v-for="(user, index) in leaderboard" 
              :key="user.id"
              :class="['leader-item', { 'is-you': user.isYou }]"
            >
              <span class="leader-rank" :class="'rank-' + (index + 1)">
                {{ index + 1 }}
              </span>
              <div class="leader-avatar" :style="{ background: user.avatarColor }">
                {{ user.initials }}
              </div>
              <div class="leader-info">
                <span class="leader-name">{{ user.name }}</span>
                <span class="leader-challenges">{{ user.completed }} challenges</span>
              </div>
              <span class="leader-points">{{ user.points }} pts</span>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="sidebar-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>Challenge Badges</h3>
          <div class="badges-grid">
            <div 
              v-for="badge in badges" 
              :key="badge.id"
              :class="['badge-item', { unlocked: badge.unlocked }]"
              :title="badge.description"
            >
              <span class="badge-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg></span>
              <span class="badge-name">{{ badge.name }}</span>
            </div>
          </div>
        </div>

        <!-- Community Impact -->
        <div class="sidebar-card impact-card">
          <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>{{ t('challenges.communityImpact') }}</h3>
          <div class="impact-stats">
            <div class="impact-item">
              <span class="impact-value">12,450</span>
              <span class="impact-label">{{ t('challenges.kgCo2Saved') }}</span>
            </div>
            <div class="impact-item">
              <span class="impact-value">3,200</span>
              <span class="impact-label">{{ t('challenges.treesPlanted') }}</span>
            </div>
            <div class="impact-item">
              <span class="impact-value">8,900</span>
              <span class="impact-label">{{ t('challenges.challengesDone') }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Progress Modal -->
    <div v-if="showProgressModal" class="modal-overlay" @click.self="showProgressModal = false">
      <div class="progress-modal">
        <button class="modal-close" @click="showProgressModal = false">×</button>
        <div class="modal-header">
          <span class="modal-icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
          <h2>{{ selectedChallenge?.title }}</h2>
        </div>
        <div class="modal-body">
          <p>{{ t('challenges.todaysProgress') }}:</p>
          <div class="progress-input-group">
            <label>{{ t('challenges.todaysProgress') }}</label>
            <div class="progress-input-row">
              <button class="increment-btn" @click="progressIncrement--">−</button>
              <input type="number" v-model.number="progressIncrement" min="1">
              <button class="increment-btn" @click="progressIncrement++">+</button>
            </div>
            <span class="input-hint">
              Current: {{ selectedChallenge?.currentProgress }}/{{ selectedChallenge?.targetProgress }}
            </span>
          </div>
          <div class="modal-actions">
            <button class="modal-btn cancel" @click="showProgressModal = false">{{ t('common.cancel') }}</button>
            <button class="modal-btn confirm" @click="confirmProgress">{{ t('challenges.logProgress') }}</button>
          </div>
        </div>
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
      activeFilter: 'all',
      activeCategory: 'all',
      sortBy: 'popular',
      showProgressModal: false,
      selectedChallenge: null,
      progressIncrement: 1,
      currentStreak: 5,
      userRank: '#12'
    }
  },
  computed: {
    filterTabs() {
      return [
        { id: 'all', label: this.t('forum.all') },
        { id: 'active', label: this.t('challenges.active') },
        { id: 'completed', label: this.t('challenges.completed') },
        { id: 'available', label: this.t('challenges.available') }
      ]
    },
    categories() {
      return [
        { id: 'transport', name: this.t('footprint.categories.transport') },
        { id: 'energy', name: this.t('footprint.categories.energy') },
        { id: 'waste', name: this.t('footprint.categories.waste') },
        { id: 'food', name: this.t('footprint.categories.food') },
        { id: 'nature', name: this.t('footprint.categories.nature') },
        { id: 'lifestyle', name: this.t('calculator.lifestyle') }
      ]
    },
    challenges() {
      return [
        {
          id: 1,
          title: this.t('challenges.challengesList.plasticFreeTitle'),
          description: this.t('challenges.challengesList.plasticFreeDesc'),
          category: 'waste',
          points: 150,
          participants: 1234,
          daysLeft: 5,
          duration: `7 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          isNew: false,
          isHot: true,
          joined: true,
          completed: false,
          currentProgress: 4,
          targetProgress: 7,
          progress: 57
        },
        {
          id: 2,
          title: this.t('challenges.challengesList.bikeTitle'),
          description: this.t('challenges.challengesList.bikeDesc'),
          category: 'transport',
          points: 200,
          participants: 856,
          daysLeft: 12,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.hard'),
          gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          isNew: true,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 10,
          progress: 0
        },
        {
          id: 3,
          title: this.t('challenges.challengesList.meatlessTitle'),
          description: this.t('challenges.challengesList.meatlessDesc'),
          category: 'food',
          points: 100,
          participants: 2341,
          daysLeft: 18,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.easy'),
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          isNew: false,
          isHot: true,
          joined: true,
          completed: false,
          currentProgress: 2,
          targetProgress: 4,
          progress: 50
        },
        {
          id: 4,
          title: this.t('challenges.challengesList.energySaverTitle'),
          description: this.t('challenges.challengesList.energySaverDesc'),
          category: 'energy',
          points: 175,
          participants: 678,
          daysLeft: 8,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          isNew: false,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 1,
          progress: 0
        },
        {
          id: 5,
          title: this.t('challenges.challengesList.zeroWasteTitle'),
          description: this.t('challenges.challengesList.zeroWasteDesc'),
          category: 'waste',
          points: 125,
          participants: 1567,
          daysLeft: 15,
          duration: `14 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.easy'),
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          isNew: true,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 5,
          progress: 0
        },
        {
          id: 6,
          title: this.t('challenges.challengesList.plantTreeTitle'),
          description: this.t('challenges.challengesList.plantTreeDesc'),
          category: 'nature',
          points: 300,
          participants: 432,
          daysLeft: 25,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
          isNew: false,
          isHot: false,
          joined: false,
          completed: true,
          currentProgress: 1,
          targetProgress: 1,
          progress: 100
        },
        {
          id: 7,
          title: this.t('challenges.challengesList.coldShowerTitle'),
          description: this.t('challenges.challengesList.coldShowerDesc'),
          category: 'energy',
          points: 80,
          participants: 234,
          daysLeft: 3,
          duration: `5 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.hard'),
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          isNew: false,
          isHot: false,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 5,
          progress: 0
        },
        {
          id: 8,
          title: this.t('challenges.challengesList.secondhandTitle'),
          description: this.t('challenges.challengesList.secondhandDesc'),
          category: 'lifestyle',
          points: 200,
          participants: 789,
          daysLeft: 20,
          duration: `30 ${this.t('challenges.days')}`,
          difficulty: this.t('challenges.medium'),
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          isNew: true,
          isHot: true,
          joined: false,
          completed: false,
          currentProgress: 0,
          targetProgress: 30,
          progress: 0
        }
      ]
    },
    leaderboard() {
      return [
        { id: 1, name: 'EcoWarrior', initials: 'EW', avatarColor: '#2ecc71', points: 2450, completed: 18, isYou: false },
        { id: 2, name: 'GreenQueen', initials: 'GQ', avatarColor: '#9b59b6', points: 2280, completed: 16, isYou: false },
        { id: 3, name: 'NatureLover', initials: 'NL', avatarColor: '#3498db', points: 2150, completed: 15, isYou: false },
        { id: 4, name: 'Tomass', initials: 'T', avatarColor: '#e74c3c', points: 1820, completed: 12, isYou: true },
        { id: 5, name: 'EarthFirst', initials: 'EF', avatarColor: '#f39c12', points: 1650, completed: 11, isYou: false }
      ]
    },
    badges() {
      return [
        { id: 1, name: this.t('challenges.badges.firstStepName'), description: this.t('challenges.badges.firstStepDesc'), unlocked: true },
        { id: 2, name: this.t('challenges.badges.weekWarriorName'), description: this.t('challenges.badges.weekWarriorDesc'), unlocked: true },
        { id: 3, name: this.t('challenges.badges.ecoMasterName'), description: this.t('challenges.badges.ecoMasterDesc'), unlocked: true },
        { id: 4, name: this.t('challenges.badges.communityHeroName'), description: this.t('challenges.badges.communityHeroDesc'), unlocked: false },
        { id: 5, name: this.t('challenges.badges.planetSaverName'), description: this.t('challenges.badges.planetSaverDesc'), unlocked: false },
        { id: 6, name: this.t('challenges.badges.legendName'), description: this.t('challenges.badges.legendDesc'), unlocked: false }
      ]
    },
    completedCount() {
      return this.challenges.filter(c => c.completed).length;
    },
    totalPoints() {
      return this.challenges
        .filter(c => c.completed)
        .reduce((sum, c) => sum + c.points, 0);
    },
    featuredChallenge() {
      return this.challenges.find(c => c.isHot && !c.completed) || this.challenges[0];
    },
    activeChallenges() {
      return this.challenges.filter(c => c.joined && !c.completed);
    },
    filteredChallenges() {
      let filtered = [...this.challenges];

      // Apply filter tab
      if (this.activeFilter === 'active') {
        filtered = filtered.filter(c => c.joined && !c.completed);
      } else if (this.activeFilter === 'completed') {
        filtered = filtered.filter(c => c.completed);
      } else if (this.activeFilter === 'available') {
        filtered = filtered.filter(c => !c.joined && !c.completed);
      }

      // Apply category filter
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(c => c.category === this.activeCategory);
      }

      // Apply sorting
      if (this.sortBy === 'popular') {
        filtered.sort((a, b) => b.participants - a.participants);
      } else if (this.sortBy === 'newest') {
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      } else if (this.sortBy === 'ending') {
        filtered.sort((a, b) => a.daysLeft - b.daysLeft);
      } else if (this.sortBy === 'points') {
        filtered.sort((a, b) => b.points - a.points);
      }

      return filtered;
    }
  },
  mounted() {
    this.fetchChallenges();
  },
  methods: {
    async fetchChallenges() {
      try {
        const { data } = await api.get('/api/challenges');
        if (data.challenges && data.challenges.length > 0) {
          console.log('Fetched challenges:', data.challenges);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    },
    getCategoryName(categoryId) {
      const cat = this.categories.find(c => c.id === categoryId);
      return cat ? cat.name : categoryId;
    },
    toggleJoin(challenge) {
      challenge.joined = !challenge.joined;
      if (challenge.joined) {
        challenge.participants++;
      } else {
        challenge.participants--;
        challenge.currentProgress = 0;
      }
    },
    updateProgress(challenge) {
      this.selectedChallenge = challenge;
      this.progressIncrement = 1;
      this.showProgressModal = true;
    },
    confirmProgress() {
      if (this.selectedChallenge) {
        this.selectedChallenge.currentProgress += this.progressIncrement;
        if (this.selectedChallenge.currentProgress >= this.selectedChallenge.targetProgress) {
          this.selectedChallenge.currentProgress = this.selectedChallenge.targetProgress;
          this.selectedChallenge.completed = true;
          this.selectedChallenge.progress = 100;
          // Could show celebration here
        } else {
          this.selectedChallenge.progress = Math.round(
            (this.selectedChallenge.currentProgress / this.selectedChallenge.targetProgress) * 100
          );
        }
      }
      this.showProgressModal = false;
    },
    shareChallenge(challenge) {
      if (navigator.share) {
        navigator.share({
          title: challenge.title,
          text: `Join me in the "${challenge.title}" eco challenge!`,
          url: window.location.href
        });
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(
          `Join me in the "${challenge.title}" eco challenge! ${window.location.href}`
        );
        alert('Challenge link copied to clipboard!');
      }
    }
  }
}
</script>

<style scoped>
.challenges-page {
  min-height: 100vh;
  padding: 80px 20px 60px;
  background: var(--bg-color);
  animation: pageFadeIn 0.5s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hero Section */
.challenges-hero {
  max-width: 1100px;
  margin: 0 auto 24px;
  padding: 32px;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  border-radius: var(--radius-xl);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  position: relative;
  overflow: hidden;
}

.challenges-hero::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  top: -70px;
  right: -30px;
  animation: floatShape 8s ease-in-out infinite;
}

.challenges-hero::after {
  content: '';
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  bottom: -30px;
  left: 15%;
  animation: floatShape 10s ease-in-out infinite reverse;
}

@keyframes floatShape {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(10px, -15px) scale(1.05); }
}

.hero-content h1 {
  margin: 0 0 8px;
  font-size: 1.75rem;
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
  gap: 16px;
  flex-wrap: wrap;
}

.hero-stat {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: var(--radius-lg);
  padding: 12px 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.hero-stat:hover {
  transform: translateY(-2px);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.85;
}

/* Container Layout */
.challenges-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

/* Featured Challenge */
.featured-challenge {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.featured-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f59e0b;
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 500;
}

.featured-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.featured-icon {
  width: 64px;
  height: 64px;
  background: var(--primary-subtle);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.featured-info {
  flex: 1;
}

.featured-info h2 {
  margin: 0 0 6px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.featured-info p {
  margin: 0 0 10px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.featured-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--text-color);
}

.meta-icon {
  color: var(--primary);
}

.featured-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-eco, var(--primary));
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 70px;
}

.featured-btn {
  padding: 12px 24px;
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.featured-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: skewX(-25deg);
  transition: left 0.6s ease;
}

.featured-btn:hover::after {
  left: 120%;
}

.featured-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.3);
}

.featured-btn.joined {
  background: var(--primary-subtle);
  color: var(--primary);
}

/* Filter Section */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tabs {
  display: flex;
  gap: 6px;
  padding: 4px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.dark .filter-tabs {
  background: rgba(255, 255, 255, 0.03);
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
  transition: var(--transition);
}

.filter-tab:hover {
  color: var(--primary);
}

.filter-tab.active {
  background: var(--card-bg);
  color: var(--primary);
  box-shadow: var(--shadow);
}

.dark .filter-tab.active {
  background: var(--card-bg);
}

.tab-icon {
  color: inherit;
}

.sort-dropdown select {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.85rem;
  cursor: pointer;
}

/* Category Chips */
.category-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.category-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: 100px;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.85rem;
  transition: var(--transition);
}

.category-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.category-chip.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Challenges Grid */
.challenges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.challenge-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.challenge-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(46, 204, 113, 0.1);
}

.challenge-card.completed {
  opacity: 0.8;
}

.card-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.challenge-icon {
  color: white;
  opacity: 0.85;
}

.card-badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.badge {
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.new {
  background: var(--primary);
  color: white;
}

.badge.hot {
  background: #dc2626;
  color: white;
}

.badge.difficulty {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.badge.difficulty.easy {
  color: var(--primary);
}

.badge.difficulty.medium {
  color: #f59e0b;
}

.badge.difficulty.hard {
  color: #dc2626;
}

.card-body {
  padding: 0 16px 16px;
}

.card-category {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.card-body h3 {
  margin: 0 0 6px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

.card-body p {
  margin: 0 0 12px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
}

.card-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.card-stats .stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-color);
}

.stat-icon {
  color: var(--primary);
}

.challenge-progress {
  margin-bottom: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.join-btn {
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
}

.join-btn:hover {
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.25);
}

.progress-btn {
  background: var(--primary-subtle);
  color: var(--primary);
}

.progress-btn:hover {
  background: var(--primary);
  color: white;
}

.action-btn.completed {
  background: var(--primary-subtle);
  color: var(--primary);
  cursor: default;
}

.share-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.share-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 20px;
}

.empty-icon {
  color: var(--text-secondary);
  opacity: 0.5;
  margin-bottom: 12px;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  color: var(--text-secondary);
}

/* Sidebar */
.challenges-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 20px;
  border: 1px solid var(--border-color);
}

.sidebar-card h3 {
  margin: 0 0 15px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

/* Active Challenges */
.no-active {
  text-align: center;
  padding: 20px 10px;
}

.no-active p {
  margin: 0 0 5px;
  color: var(--text-color);
}

.no-active .hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.active-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.active-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.dark .active-item {
  background: rgba(255, 255, 255, 0.03);
}

.active-icon {
  color: var(--primary);
}

.active-info {
  flex: 1;
}

.active-title {
  display: block;
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 6px;
}

.mini-progress {
  height: 4px;
  background: var(--primary-subtle);
  border-radius: 2px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
}

.active-days {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Leaderboard */
.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leader-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: var(--radius-md);
  transition: var(--transition);
}

.leader-item.is-you {
  background: var(--primary-subtle);
}

.leader-rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.dark .leader-rank {
  background: rgba(255, 255, 255, 0.1);
}

.leader-rank.rank-1 {
  background: #d4a853;
  border-color: #d4a853;
  color: white;
}

.leader-rank.rank-2 {
  background: #9ca3af;
  border-color: #9ca3af;
  color: white;
}

.leader-rank.rank-3 {
  background: #c9844a;
  border-color: #c9844a;
  color: white;
}

.leader-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

.leader-info {
  flex: 1;
}

.leader-name {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
}

.leader-challenges {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.leader-points {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary);
}

/* Badges */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  opacity: 0.4;
  filter: grayscale(1);
  transition: var(--transition);
}

.dark .badge-item {
  background: rgba(255, 255, 255, 0.03);
}

.badge-item.unlocked {
  opacity: 1;
  filter: none;
  background: var(--primary-subtle);
  border-color: var(--primary);
}

.badge-icon {
  color: var(--primary);
  margin-bottom: 5px;
}

.badge-name {
  font-size: 0.7rem;
  color: var(--text-color);
  text-align: center;
}

/* Impact Card */
.impact-card {
  background: var(--primary-subtle);
  border: 1px solid var(--primary);
}

.impact-stats {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.impact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.impact-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary);
}

.impact-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.progress-modal {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  position: relative;
  border: 1px solid var(--border-color);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-color);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-secondary);
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.dark .modal-close {
  background: rgba(255, 255, 255, 0.1);
}

.modal-close:hover {
  color: var(--text-color);
  border-color: var(--text-secondary);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.modal-icon {
  color: var(--primary);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.2rem;
}

.modal-body p {
  margin: 0 0 20px;
  color: var(--text-secondary);
}

.progress-input-group {
  margin-bottom: 25px;
}

.progress-input-group label {
  display: block;
  margin-bottom: 10px;
  color: var(--text-color);
  font-weight: 600;
}

.progress-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.increment-btn {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  transition: var(--transition);
}

.increment-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.progress-input-row input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1.1rem;
  text-align: center;
}

.progress-input-row input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.input-hint {
  display: block;
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.modal-btn.cancel {
  background: var(--bg-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.dark .modal-btn.cancel {
  background: rgba(255, 255, 255, 0.1);
}

.modal-btn.cancel:hover {
  border-color: var(--text-secondary);
}

.modal-btn.confirm {
  background: var(--gradient-eco, linear-gradient(135deg, var(--primary), var(--primary-dark)));
  color: white;
}

.modal-btn.confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

/* Responsive */
@media (max-width: 900px) {
  .challenges-container {
    grid-template-columns: 1fr;
  }

  .challenges-hero {
    flex-direction: column;
    text-align: center;
  }

  .hero-stats {
    justify-content: center;
  }

  .featured-content {
    flex-direction: column;
    text-align: center;
  }

  .featured-meta {
    justify-content: center;
  }

  .featured-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .challenges-hero {
    padding: 24px;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-stat {
    padding: 12px 18px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .filter-tabs {
    width: 100%;
    justify-content: center;
  }

  .filter-tab span:last-child {
    display: none;
  }

  .challenges-grid {
    grid-template-columns: 1fr;
  }

  .badges-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
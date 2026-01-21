<template>
  <div class="education-page">
    <!-- Hero Section -->
    <div class="education-hero">
      <div class="header-content">
        <h1>{{ t('education.title') }}</h1>
        <p>{{ t('education.subtitle') }}</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-value">{{ articles.length }}</span>
          <span class="stat-label">{{ t('education.articles') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="hero-stat">
          <span class="stat-value">{{ videos.length }}</span>
          <span class="stat-label">{{ t('education.videos') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="hero-stat">
          <span class="stat-value">{{ guides.length }}</span>
          <span class="stat-label">{{ t('education.guides') }}</span>
        </div>
      </div>
    </div>

    <!-- Search and Topics -->
    <div class="search-section">
      <div class="search-bar">
        <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          :placeholder="t('education.searchPlaceholder')"
          class="search-input"
        >
      </div>
    </div>

    <!-- Quick Topics -->
    <div class="quick-topics">
      <h2>{{ t('education.quickTopics') }}</h2>
      <div class="topics-grid">
        <button 
          v-for="topic in topics" 
          :key="topic.id"
          :class="['topic-card', { active: selectedTopic === topic.id }]"
          @click="selectTopic(topic.id)"
        >
          <span class="topic-name">{{ topic.name }}</span>
        </button>
      </div>
    </div>

    <!-- Featured Section -->
    <div class="featured-section" v-if="featuredContent">
      <div class="featured-card">
        <div class="featured-badge">{{ t('education.featured') }}</div>
        <div class="featured-image">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
        </div>
        <div class="featured-content">
          <span class="featured-type">{{ featuredContent.type }}</span>
          <h2>{{ featuredContent.title }}</h2>
          <p>{{ featuredContent.description }}</p>
          <div class="featured-meta">
            <span>{{ featuredContent.readTime }}</span>
            <span>{{ featuredContent.date }}</span>
          </div>
          <button class="featured-btn" @click="openContent(featuredContent)">
            {{ t('education.startLearning') }}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Tabs -->
    <div class="content-section">
      <div class="section-header">
        <h2>{{ t('education.learningResources') }}</h2>
        <div class="tab-buttons">
          <button 
            :class="['tab-btn', { active: activeTab === 'all' }]"
            @click="activeTab = 'all'"
          >
            {{ t('education.all') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'articles' }]"
            @click="activeTab = 'articles'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
            {{ t('education.articles') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'videos' }]"
            @click="activeTab = 'videos'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            {{ t('education.videos') }}
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'guides' }]"
            @click="activeTab = 'guides'"
          >
            <svg class="tab-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            {{ t('education.guides') }}
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <article 
          v-for="item in filteredContent" 
          :key="item.id" 
          class="content-card"
          @click="openContent(item)"
        >
          <div class="card-image" :style="{ background: getGradient(item.type) }">
            <span class="card-type-icon" v-html="getTypeIcon(item.type)"></span>
            <span class="card-type-badge">
              <span v-html="getTypeBadgeIcon(item.type)"></span>
            </span>
          </div>
          <div class="card-body">
            <div class="card-tags">
              <span v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ truncate(item.description, 100) }}</p>
            <div class="card-footer">
              <span class="card-meta">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ item.readTime }}
              </span>
              <span class="card-difficulty" :class="item.difficulty">
                {{ item.difficulty }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="filteredContent.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <h3>{{ t('education.noContentFound') }}</h3>
        <p>{{ t('education.tryAdjusting') }}</p>
      </div>
    </div>

    <!-- Learning Paths -->
    <div class="learning-paths">
      <h2>
        <svg class="section-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
        {{ t('education.learningPaths') }}
      </h2>
      <p class="section-desc">{{ t('education.learningPathsDesc') }}</p>
      <div class="paths-grid">
        <div v-for="path in learningPaths" :key="path.id" class="path-card">
          <div class="path-header" :style="{ background: path.color }">
            <span class="path-icon" v-html="getPathIcon(path.id)"></span>
            <span class="path-level">{{ path.level }}</span>
          </div>
          <div class="path-body">
            <h3>{{ path.title }}</h3>
            <p>{{ path.description }}</p>
            <div class="path-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getPathProgress(path.id) + '%' }"></div>
              </div>
              <span class="progress-text">{{ getPathProgress(path.id) }}% {{ t('education.complete') }}</span>
            </div>
            <div class="path-modules">
              <span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                {{ path.modules }} {{ t('education.modules') }}
              </span>
              <span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ path.duration }}
              </span>
            </div>
            <button class="path-btn" @click="startLearningPath(path)">
              {{ getPathProgress(path.id) > 0 ? t('education.continue') : t('education.startPath') }} →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips Carousel -->
    <div class="tips-section">
      <h2>
        <svg class="section-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1H9a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/>
        </svg>
        {{ t('education.dailyEcoTips') }}
      </h2>
      <div class="tips-carousel">
        <div class="tip-slide" v-for="(tip, index) in dailyTips" :key="index">
          <div class="tip-number">{{ index + 1 }}</div>
          <div class="tip-content">
            <span class="tip-icon" v-html="getTipIcon(index)"></span>
            <h4>{{ tip.title }}</h4>
            <p>{{ tip.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Modal -->
    <div v-if="selectedContent" class="content-modal" @click.self="selectedContent = null">
      <div class="modal-content">
        <button class="modal-close" @click="selectedContent = null">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="modal-header" :style="{ background: getGradient(selectedContent.type) }">
          <span class="modal-type-icon" v-html="getTypeIcon(selectedContent.type)"></span>
        </div>
        <div class="modal-body">
          <span class="modal-type">{{ selectedContent.type }}</span>
          <h2>{{ selectedContent.title }}</h2>
          <div class="modal-meta">
            <span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ selectedContent.readTime }}
            </span>
            <span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {{ selectedContent.date }}
            </span>
            <span :class="['difficulty', selectedContent.difficulty]">{{ selectedContent.difficulty }}</span>
          </div>
          <div class="modal-text">
            {{ selectedContent.fullContent }}
          </div>
          <div class="modal-tags">
            <span v-for="tag in selectedContent.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="modal-actions">
            <button 
              class="action-btn" 
              :class="{ saved: isContentSaved(selectedContent.id) }"
              @click="toggleSaveContent(selectedContent)"
            >
              <svg v-if="isContentSaved(selectedContent.id)" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
              {{ t('education.save') }}
            </button>
            <button class="action-btn" @click="shareContent(selectedContent)">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              {{ t('education.share') }}
            </button>
            <button 
              class="action-btn primary" 
              :class="{ completed: isContentCompleted(selectedContent.id) }"
              @click="toggleCompleteContent(selectedContent)"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ t('education.markComplete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="toastMessage" class="toast-notification" :class="toastType">
        <span class="toast-icon">
          <svg v-if="toastType === 'success'" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </span>
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Education',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      posts: [],
      searchQuery: '',
      selectedTopic: null,
      activeTab: 'all',
      selectedContent: null,
      savedContent: [],
      completedContent: [],
      pathProgress: {},
      toastMessage: '',
      toastType: 'success'
    }
  },
  computed: {
    topics() {
      return [
        { id: 'energy', name: this.t('education.topics.energy') },
        { id: 'waste', name: this.t('education.topics.waste') },
        { id: 'food', name: this.t('education.topics.food') },
        { id: 'transport', name: this.t('education.topics.transport') },
        { id: 'home', name: this.t('education.topics.home') },
        { id: 'garden', name: this.t('education.topics.garden') },
        { id: 'fashion', name: this.t('education.topics.fashion') },
        { id: 'water', name: this.t('education.topics.water') }
      ]
    },
    allContent() {
      return [
        {
          id: 1,
          type: 'article',
          title: this.t('education.content.carbonFootprintTitle'),
          description: this.t('education.content.carbonFootprintDesc'),
          fullContent: this.t('education.content.carbonFootprintFull'),
          readTime: `5 ${this.t('education.minRead')}`,
          date: 'Jan 15, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Climate', 'Basics'],
          topic: 'energy'
        },
        {
          id: 2,
          type: 'video',
          title: this.t('education.content.compostTitle'),
          description: this.t('education.content.compostDesc'),
          fullContent: this.t('education.content.compostFull'),
          readTime: `12 ${this.t('education.minWatch')}`,
          date: 'Jan 14, 2026',
          difficulty: this.t('education.intermediate'),
          tags: ['DIY', 'Garden'],
          topic: 'garden'
        },
        {
          id: 3,
          type: 'guide',
          title: this.t('education.content.zeroWasteTitle'),
          description: this.t('education.content.zeroWasteDesc'),
          fullContent: this.t('education.content.zeroWasteFull'),
          readTime: `15 ${this.t('education.minRead')}`,
          date: 'Jan 13, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Zero Waste', 'Kitchen'],
          topic: 'waste'
        },
        {
          id: 4,
          type: 'article',
          title: this.t('education.content.cyclingTitle'),
          description: this.t('education.content.cyclingDesc'),
          fullContent: this.t('education.content.cyclingFull'),
          readTime: `6 ${this.t('education.minRead')}`,
          date: 'Jan 12, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Transport', 'Health'],
          topic: 'transport'
        },
        {
          id: 5,
          type: 'video',
          title: this.t('education.content.plantsTitle'),
          description: this.t('education.content.plantsDesc'),
          fullContent: this.t('education.content.plantsFull'),
          readTime: `8 ${this.t('education.minWatch')}`,
          date: 'Jan 11, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Home', 'Plants'],
          topic: 'home'
        },
        {
          id: 6,
          type: 'guide',
          title: this.t('education.content.wardrobeTitle'),
          description: this.t('education.content.wardrobeDesc'),
          fullContent: this.t('education.content.wardrobeFull'),
          readTime: `10 ${this.t('education.minRead')}`,
          date: 'Jan 10, 2026',
          difficulty: this.t('education.intermediate'),
          tags: ['Fashion', 'Minimalism'],
          topic: 'fashion'
        },
        {
          id: 7,
          type: 'article',
          title: this.t('education.content.waterTitle'),
          description: this.t('education.content.waterDesc'),
          fullContent: this.t('education.content.waterFull'),
          readTime: `7 ${this.t('education.minRead')}`,
          date: 'Jan 9, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Water', 'Home'],
          topic: 'water'
        },
        {
          id: 8,
          type: 'guide',
          title: this.t('education.content.seasonalTitle'),
          description: this.t('education.content.seasonalDesc'),
          fullContent: this.t('education.content.seasonalFull'),
          readTime: `12 ${this.t('education.minRead')}`,
          date: 'Jan 8, 2026',
          difficulty: this.t('education.beginner'),
          tags: ['Food', 'Seasonal'],
          topic: 'food'
        },
        {
          id: 9,
          type: 'video',
          title: this.t('education.content.solarTitle'),
          description: this.t('education.content.solarDesc'),
          fullContent: this.t('education.content.solarFull'),
          readTime: `15 ${this.t('education.minWatch')}`,
          date: 'Jan 7, 2026',
          difficulty: this.t('education.advanced'),
          tags: ['Energy', 'Home'],
          topic: 'energy'
        }
      ]
    },
    learningPaths() {
      return [
        {
          id: 1,
          title: this.t('education.paths.zeroWasteTitle'),
          description: this.t('education.paths.zeroWasteDesc'),
          level: this.t('education.beginner'),
          modules: 8,
          duration: `4 ${this.t('education.paths.weeks')}`,
          progress: 25,
          color: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
        },
        {
          id: 2,
          title: this.t('education.paths.ecoHomeTitle'),
          description: this.t('education.paths.ecoHomeDesc'),
          level: this.t('education.intermediate'),
          modules: 12,
          duration: `6 ${this.t('education.paths.weeks')}`,
          progress: 0,
          color: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
        },
        {
          id: 3,
          title: this.t('education.paths.sustainableEatingTitle'),
          description: this.t('education.paths.sustainableEatingDesc'),
          level: this.t('education.beginner'),
          modules: 10,
          duration: `5 ${this.t('education.paths.weeks')}`,
          progress: 60,
          color: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)'
        }
      ]
    },
    dailyTips() {
      return [
        {
          title: this.t('education.tips.shorterShowersTitle'),
          description: this.t('education.tips.shorterShowersDesc')
        },
        {
          title: this.t('education.tips.unplugTitle'),
          description: this.t('education.tips.unplugDesc')
        },
        {
          title: this.t('education.tips.bagsTitle'),
          description: this.t('education.tips.bagsDesc')
        },
        {
          title: this.t('education.tips.thermostatTitle'),
          description: this.t('education.tips.thermostatDesc')
        },
        {
          title: this.t('education.tips.mealPrepTitle'),
          description: this.t('education.tips.mealPrepDesc')
        }
      ]
    },
    articles() {
      return this.allContent.filter(c => c.type === 'article');
    },
    videos() {
      return this.allContent.filter(c => c.type === 'video');
    },
    guides() {
      return this.allContent.filter(c => c.type === 'guide');
    },
    featuredContent() {
      return this.allContent[0];
    },
    filteredContent() {
      let content = [...this.allContent];
      
      // Filter by tab
      if (this.activeTab !== 'all') {
        const typeMap = { articles: 'article', videos: 'video', guides: 'guide' };
        content = content.filter(c => c.type === typeMap[this.activeTab]);
      }
      
      // Filter by topic
      if (this.selectedTopic) {
        content = content.filter(c => c.topic === this.selectedTopic);
      }
      
      // Filter by search
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        content = content.filter(c => 
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some(t => t.toLowerCase().includes(query))
        );
      }
      
      return content;
    }
  },
  mounted() {
    this.fetchPosts();
    this.loadFromLocalStorage();
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/education');
        const data = await response.json();
        this.posts = data.posts || [];
      } catch (error) {
        console.error('Error fetching education posts:', error);
      }
    },
    selectTopic(topicId) {
      this.selectedTopic = this.selectedTopic === topicId ? null : topicId;
    },
    openContent(item) {
      this.selectedContent = item;
    },
    truncate(text, length) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    getTypeBadge(type) {
      const badges = { article: 'Article', video: 'Video', guide: 'Guide' };
      return badges[type] || 'Content';
    },
    getTypeBadgeIcon(type) {
      const icons = {
        article: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
        video: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
        guide: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
      };
      return icons[type] || icons.article;
    },
    getTypeIcon(type) {
      const icons = {
        article: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
        video: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
        guide: '<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
      };
      return icons[type] || icons.article;
    },
    getPathIcon(pathId) {
      const icons = {
        1: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 2.252.744 4.33 2 6.004"/><path d="M12 6c-3 0-5.5 2.5-5.5 5.5S9 17 12 17s5.5-2.5 5.5-5.5S15 6 12 6z"/></svg>',
        2: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        3: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>'
      };
      return icons[pathId] || icons[1];
    },
    getTipIcon(index) {
      const icons = [
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>',
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64a9 9 0 11-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>',
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>',
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>'
      ];
      return icons[index] || icons[0];
    },
    getGradient(type) {
      const gradients = {
        article: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        video: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        guide: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      };
      return gradients[type] || 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
    },
    isContentSaved(id) {
      return this.savedContent.includes(id);
    },
    isContentCompleted(id) {
      return this.completedContent.includes(id);
    },
    toggleSaveContent(content) {
      const index = this.savedContent.indexOf(content.id);
      if (index === -1) {
        this.savedContent.push(content.id);
        this.showToast(this.t('education.contentSaved') || 'Saturs saglabāts!', 'success');
      } else {
        this.savedContent.splice(index, 1);
        this.showToast(this.t('education.contentUnsaved') || 'Saturs noņemts no saglabātajiem', 'info');
      }
      this.saveTolocalStorage();
    },
    toggleCompleteContent(content) {
      const index = this.completedContent.indexOf(content.id);
      if (index === -1) {
        this.completedContent.push(content.id);
        this.showToast(this.t('education.contentCompleted') || 'Apsveicam! Saturs atzīmēts kā pabeigts!', 'success');
      } else {
        this.completedContent.splice(index, 1);
        this.showToast(this.t('education.contentIncomplete') || 'Saturs atzīmēts kā nepabeigts', 'info');
      }
      this.saveTolocalStorage();
    },
    async shareContent(content) {
      const shareData = {
        title: content.title,
        text: content.description,
        url: window.location.href
      };
      
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          this.showToast(this.t('education.shareSuccess') || 'Paldies par dalīšanos!', 'success');
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(`${content.title}\n\n${content.description}\n\n${window.location.href}`);
          this.showToast(this.t('education.copiedToClipboard') || 'Saite nokopēta starpliktuvē!', 'success');
        }
      } catch (error) {
        console.error('Error sharing:', error);
        // Try clipboard as fallback
        try {
          await navigator.clipboard.writeText(window.location.href);
          this.showToast(this.t('education.copiedToClipboard') || 'Saite nokopēta starpliktuvē!', 'success');
        } catch (e) {
          this.showToast(this.t('education.shareError') || 'Neizdevās dalīties', 'error');
        }
      }
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    saveTolocalStorage() {
      localStorage.setItem('education_saved', JSON.stringify(this.savedContent));
      localStorage.setItem('education_completed', JSON.stringify(this.completedContent));
      localStorage.setItem('education_pathProgress', JSON.stringify(this.pathProgress));
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('education_saved');
      const completed = localStorage.getItem('education_completed');
      const pathProgress = localStorage.getItem('education_pathProgress');
      if (saved) this.savedContent = JSON.parse(saved);
      if (completed) this.completedContent = JSON.parse(completed);
      if (pathProgress) this.pathProgress = JSON.parse(pathProgress);
    },
    getPathProgress(pathId) {
      return this.pathProgress[pathId] || 0;
    },
    startLearningPath(path) {
      // Increment progress by 10-15% each time (simulating module completion)
      const currentProgress = this.pathProgress[path.id] || 0;
      if (currentProgress >= 100) {
        this.showToast(this.t('education.pathCompleted') || 'Apsveicam! Ceļš pabeigts!', 'success');
        return;
      }
      
      const increment = Math.min(Math.floor(100 / path.modules), 100 - currentProgress);
      this.pathProgress[path.id] = Math.min(currentProgress + increment, 100);
      
      if (this.pathProgress[path.id] >= 100) {
        this.showToast(this.t('education.pathCompleted') || 'Apsveicam! Ceļš pabeigts!', 'success');
      } else {
        this.showToast(this.t('education.pathProgressUpdated') || `Progress: ${this.pathProgress[path.id]}%`, 'success');
      }
      
      this.saveTolocalStorage();
    }
  }
}
</script>

<style scoped>
.education-page {
  min-height: 100vh;
  padding: 80px 24px 60px;
  background: var(--bg-color);
}

/* Hero Section */
.education-hero {
  max-width: 1100px;
  margin: 0 auto 32px;
  padding: 32px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.header-content h1 {
  margin: 0 0 6px;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  letter-spacing: -0.02em;
}

.header-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-color);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Search Section */
.search-section {
  max-width: 1100px;
  margin: 0 auto 24px;
}

.search-bar {
  display: flex;
  align-items: center;
  max-width: 400px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0 16px;
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 14px 12px;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  outline: none;
}

/* Quick Topics */
.quick-topics {
  max-width: 1100px;
  margin: 0 auto 32px;
}

.quick-topics h2 {
  color: var(--text-color);
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
}

.topics-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.topic-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-color);
  font-size: 0.875rem;
}

.topic-card:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.topic-card.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.topic-name {
  font-weight: 500;
}

/* Featured Section */
.featured-section {
  max-width: 1100px;
  margin: 0 auto 32px;
}

.featured-card {
  display: grid;
  grid-template-columns: 220px 1fr;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  position: relative;
}

.featured-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  background: #f59e0b;
  color: white;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.8rem;
  z-index: 1;
}

.featured-image {
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}

.featured-emoji {
  color: white;
  opacity: 0.8;
}

.featured-content {
  padding: 24px;
}

.featured-type {
  display: inline-block;
  padding: 4px 10px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.featured-content h2 {
  margin: 0 0 12px;
  color: var(--text-color);
  font-size: 1.4rem;
  font-weight: 600;
}

.featured-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.featured-meta {
  display: flex;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.featured-btn {
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.featured-btn:hover {
  background: var(--primary-dark);
}

/* Content Section */
.content-section {
  max-width: 1100px;
  margin: 0 auto 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 600;
}

.tab-buttons {
  display: flex;
  gap: 6px;
}

.tab-btn {
  padding: 8px 16px;
  border: none;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.875rem;
  transition: var(--transition);
}

.dark .tab-btn {
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  background: var(--primary);
  color: white;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.content-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.content-card:hover {
  border-color: var(--primary);
}

.card-image {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-type-icon {
  color: white;
  opacity: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-type-icon svg {
  width: 48px;
  height: 48px;
}

.card-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-body {
  padding: 16px;
}

.card-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.card-tag {
  padding: 3px 8px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}

.card-body h3 {
  margin: 0 0 8px;
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

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-meta {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.card-difficulty {
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.card-difficulty.Beginner {
  background: var(--primary-subtle);
  color: var(--primary);
}

.card-difficulty.Intermediate {
  background: #fef3e2;
  color: #f59e0b;
}

.card-difficulty.Advanced {
  background: #fee2e2;
  color: #dc2626;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
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
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Learning Paths */
.learning-paths {
  max-width: 1100px;
  margin: 0 auto 40px;
}

.learning-paths h2 {
  color: var(--text-color);
  margin: 0 0 6px;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.section-desc {
  color: var(--text-secondary);
  margin: 0 0 20px;
  font-size: 0.9rem;
}

.paths-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.path-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.path-card:hover {
  border-color: var(--primary);
}

.path-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.path-icon {
  opacity: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
}

.path-icon svg {
  width: 28px;
  height: 28px;
}

.path-level {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 500;
}

.path-body {
  padding: 20px;
}

.path-body h3 {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.path-body p {
  margin: 0 0 16px;
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.9rem;
}

.path-progress {
  margin-bottom: 12px;
}

.progress-bar {
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.dark .progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 0.5s;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.path-modules {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.path-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.path-btn:hover {
  background: var(--primary-dark);
}

/* Tips Section */
.tips-section {
  max-width: 1100px;
  margin: 0 auto 40px;
}

.tips-section h2 {
  color: var(--text-color);
  margin: 0 0 20px;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tips-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.tip-slide {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  position: relative;
  border: 1px solid var(--border-color);
}

.tip-number {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 28px;
  height: 28px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.tip-icon {
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.tip-icon svg {
  width: 24px;
  height: 24px;
}

.tip-content h4 {
  margin: 0 0 6px;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

.tip-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
}

/* Content Modal */
.content-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: white;
  z-index: 1;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-header {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-type-icon {
  color: white;
  opacity: 0.85;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-type-icon svg {
  width: 56px;
  height: 56px;
}

.modal-body {
  padding: 24px;
}

.modal-type {
  display: inline-block;
  padding: 4px 10px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.modal-body h2 {
  margin: 0 0 12px;
  color: var(--text-color);
  font-size: 1.4rem;
  font-weight: 600;
}

.modal-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.modal-meta .difficulty {
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.modal-text {
  color: var(--text-color);
  line-height: 1.7;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.modal-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.modal-tags .tag {
  padding: 4px 12px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9rem;
  transition: var(--transition);
}

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.action-btn.primary {
  background: var(--primary);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  background: var(--primary-dark);
}

/* Responsive */
@media (max-width: 900px) {
  .education-hero {
    flex-direction: column;
    text-align: center;
    padding: 28px 20px;
  }
  
  .hero-content h1 {
    font-size: 1.5rem;
  }
  
  .search-input {
    width: 100%;
  }
  
  .hero-search {
    width: 100%;
    max-width: 400px;
  }
  
  .featured-card {
    grid-template-columns: 1fr;
  }
  
  .featured-image {
    min-height: 180px;
  }
}

@media (max-width: 600px) {
  .topics-grid {
    justify-content: center;
  }
  
  .topic-card {
    padding: 10px 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tab-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .modal-body h2 {
    font-size: 1.4em;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  background: #2ecc71;
  color: white;
  border-radius: 12px;
  font-weight: 500;
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.toast-notification.info {
  background: #3498db;
}

.toast-notification.error {
  background: #e74c3c;
}

.toast-icon {
  font-size: 1.2em;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Button States */
.action-btn.saved {
  border-color: #f39c12;
  color: #f39c12;
  background: rgba(243, 156, 18, 0.1);
}

.action-btn.completed {
  background: linear-gradient(135deg, #27ae60 0%, #1e8449 100%) !important;
}

.action-btn.completed:hover {
  background: linear-gradient(135deg, #1e8449 0%, #145a32 100%) !important;
}
</style>
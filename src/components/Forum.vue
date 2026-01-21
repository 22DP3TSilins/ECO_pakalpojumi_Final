<template>
  <div class="forum-page">
    <!-- Forum Header -->
    <div class="forum-header">
      <div class="header-content">
        <h1>{{ t('forum.title') }}</h1>
        <p>{{ t('forum.subtitle') }}</p>
      </div>
      <div class="forum-stats">
        <div class="stat">
          <span class="stat-number">{{ posts.length }}</span>
          <span class="stat-label">{{ t('forum.discussions') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number">{{ totalComments }}</span>
          <span class="stat-label">{{ t('forum.comments') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-number">{{ uniqueUsers }}</span>
          <span class="stat-label">{{ t('forum.members') }}</span>
        </div>
      </div>
    </div>

    <div class="forum-container">
      <!-- Sidebar -->
      <aside class="forum-sidebar">
        <!-- Categories -->
        <div class="sidebar-section">
          <h3>{{ t('forum.categories') }}</h3>
          <div class="category-list">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              :class="['category-btn', { active: selectedCategory === cat.id }]"
              @click="selectedCategory = cat.id"
            >
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">{{ getCategoryCount(cat.id) }}</span>
            </button>
          </div>
        </div>

        <!-- Popular Tags -->
        <div class="sidebar-section">
          <h3>{{ t('forum.popularTags') }}</h3>
          <div class="tags-cloud">
            <span 
              v-for="tag in popularTags" 
              :key="tag"
              :class="['tag', { active: selectedTag === tag }]"
              @click="toggleTag(tag)"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Community Guidelines -->
        <div class="sidebar-section guidelines">
          <h3>{{ t('forum.guidelines') }}</h3>
          <ul>
            <li>{{ t('forum.guidelineRespect') }}</li>
            <li>{{ t('forum.guidelineTopics') }}</li>
            <li>{{ t('forum.guidelineResources') }}</li>
            <li>{{ t('forum.guidelineSupport') }}</li>
          </ul>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="forum-main">
        <!-- Create Post Section -->
        <div v-if="user && !selectedPost" class="create-post-section">
          <div v-if="!showCreateForm" class="create-post-trigger" @click="showCreateForm = true">
            <div class="user-avatar">{{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}</div>
            <span>{{ t('forum.shareThoughts') }}, {{ user.name }}...</span>
            <button class="create-btn">{{ t('forum.createPost') }}</button>
          </div>

          <div v-else class="create-post-form">
            <div class="form-header">
              <h3>{{ t('forum.createNewDiscussion') }}</h3>
              <button class="close-btn" @click="showCreateForm = false">×</button>
            </div>
            <form @submit.prevent="addPost">
              <input 
                v-model="newPost.title" 
                :placeholder="t('forum.giveTitle')"
                class="title-input"
                required
              >
              <div class="form-row">
                <select v-model="newPost.category" class="category-select">
                  <option value="">{{ t('forum.selectCategory') }}</option>
                  <option v-for="cat in categories.filter(c => c.id !== 'all')" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <input 
                  v-model="newPost.tags" 
                  :placeholder="t('forum.tagsSeparated')"
                  class="tags-input"
                >
              </div>
              <textarea 
                v-model="newPost.content" 
                :placeholder="t('forum.whatsOnYourMind')"
                required
              ></textarea>
              <div class="form-actions">
                <button type="button" class="cancel-btn" @click="showCreateForm = false">{{ t('forum.cancel') }}</button>
                <button type="submit" class="submit-btn">🌱 {{ t('forum.postDiscussion') }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Login Prompt -->
        <div v-if="!user && !selectedPost" class="login-prompt">
          <p>🔐 <router-link to="/login">{{ t('common.login') }}</router-link> {{ t('common.or') }} <router-link to="/register">{{ t('common.register') }}</router-link> {{ t('forum.loginToJoin') }}</p>
        </div>

        <!-- Posts List -->
        <div v-if="!selectedPost" class="posts-section">
          <div class="posts-header">
            <h2>{{ getCurrentCategoryName }}</h2>
            <div class="sort-options">
              <button 
                :class="['sort-btn', { active: sortBy === 'newest' }]"
                @click="sortBy = 'newest'"
              >
                🕐 {{ t('forum.newest') }}
              </button>
              <button 
                :class="['sort-btn', { active: sortBy === 'popular' }]"
                @click="sortBy = 'popular'"
              >
                🔥 {{ t('forum.popular') }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPosts.length === 0" class="empty-state">
            <div class="empty-icon">🌿</div>
            <h3>{{ t('forum.noDiscussionsYet') }}</h3>
            <p>{{ t('forum.beFirstToStart') }}</p>
          </div>

          <!-- Posts Grid -->
          <div class="posts-list">
            <article 
              v-for="post in filteredPosts" 
              :key="post.id" 
              class="post-card"
              @click="viewPost(post.id)"
            >
              <div class="post-header">
                <div class="author-info">
                  <div class="author-avatar" :style="{ background: getAvatarColor(post.name) }">
                    {{ post.name ? post.name.charAt(0).toUpperCase() : '?' }}
                  </div>
                  <div class="author-details">
                    <span class="author-name">{{ post.name }}</span>
                    <span class="post-date">{{ formatDate(post.date) }}</span>
                  </div>
                </div>
                <span v-if="post.category" class="post-category">
                  {{ getCategoryIcon(post.category) }} {{ post.category }}
                </span>
              </div>

              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ truncateContent(post.content) }}</p>

              <div class="post-footer">
                <div class="post-tags" v-if="post.tags">
                  <span v-for="tag in parseTags(post.tags)" :key="tag" class="tag-small">#{{ tag }}</span>
                </div>
                <div class="post-stats">
                  <span class="stat-item">💬 {{ post.comment_count || 0 }}</span>
                  <span class="stat-item">👁️ {{ post.views || Math.floor(Math.random() * 50) + 5 }}</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Post Detail View -->
        <div v-if="selectedPost" class="post-detail">
          <button class="back-btn" @click="selectedPost = null">
            {{ t('forum.backToDiscussions') }}
          </button>

          <article class="detail-card">
            <div class="detail-header">
              <div class="author-info">
                <div class="author-avatar large" :style="{ background: getAvatarColor(selectedPost.name) }">
                  {{ selectedPost.name ? selectedPost.name.charAt(0).toUpperCase() : '?' }}
                </div>
                <div class="author-details">
                  <span class="author-name">{{ selectedPost.name }}</span>
                  <span class="post-date">{{ formatDate(selectedPost.date) }}</span>
                </div>
              </div>
              <span v-if="selectedPost.category" class="post-category">
                {{ getCategoryIcon(selectedPost.category) }} {{ selectedPost.category }}
              </span>
            </div>

            <h1 class="detail-title">{{ selectedPost.title }}</h1>
            <div class="detail-content">{{ selectedPost.content }}</div>

            <div class="detail-tags" v-if="selectedPost.tags">
              <span v-for="tag in parseTags(selectedPost.tags)" :key="tag" class="tag">#{{ tag }}</span>
            </div>

            <div class="detail-actions">
              <button class="action-btn">👍 Like</button>
              <button class="action-btn">🔗 Share</button>
              <button class="action-btn">🔖 Save</button>
            </div>
          </article>

          <!-- Comments Section -->
          <div class="comments-section">
            <h3>💬 Comments ({{ comments.length }})</h3>

            <!-- Add Comment -->
            <div v-if="user" class="add-comment">
              <div class="user-avatar small">{{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}</div>
              <form @submit.prevent="addComment" class="comment-form">
                <textarea 
                  v-model="newComment" 
                  placeholder="Share your thoughts..."
                  required
                ></textarea>
                <button type="submit" class="comment-submit">💬 Comment</button>
              </form>
            </div>

            <!-- Comments List -->
            <div v-if="comments.length === 0" class="no-comments">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>

            <div class="comments-list">
              <div v-for="comment in comments" :key="comment.id" class="comment-card">
                <div class="comment-header">
                  <div class="author-avatar small" :style="{ background: getAvatarColor(comment.name) }">
                    {{ comment.name ? comment.name.charAt(0).toUpperCase() : '?' }}
                  </div>
                  <div class="comment-info">
                    <span class="comment-author">{{ comment.name }}</span>
                    <span class="comment-date">{{ formatDate(comment.date) }}</span>
                  </div>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
                <div class="comment-actions">
                  <button class="mini-action">👍 Like</button>
                  <button class="mini-action">↩️ Reply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'Forum',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      posts: [],
      selectedPost: null,
      comments: [],
      newPost: {
        title: '',
        content: '',
        category: '',
        tags: ''
      },
      newComment: '',
      user: null,
      showCreateForm: false,
      selectedCategory: 'all',
      selectedTag: null,
      sortBy: 'newest',
      popularTags: ['zerowaste', 'recycling', 'sustainable', 'organic', 'vegan', 'upcycling', 'garden', 'solar', 'compost', 'plastic-free']
    }
  },
  computed: {
    categories() {
      return [
        { id: 'all', name: this.t('forum.allDiscussions'), icon: '📋' },
        { id: 'tips', name: this.t('forum.ecoTips'), icon: '💡' },
        { id: 'diy', name: this.t('forum.diyProjects'), icon: '🔧' },
        { id: 'news', name: this.t('forum.greenNews'), icon: '📰' },
        { id: 'questions', name: this.t('forum.questions'), icon: '❓' },
        { id: 'success', name: this.t('forum.successStories'), icon: '🏆' },
        { id: 'products', name: this.t('forum.productReviews'), icon: '⭐' }
      ]
    },
    filteredPosts() {
      let filtered = [...this.posts];
      
      // Filter by category
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === this.selectedCategory);
      }
      
      // Filter by tag
      if (this.selectedTag) {
        filtered = filtered.filter(p => {
          const tags = this.parseTags(p.tags);
          return tags.includes(this.selectedTag);
        });
      }
      
      // Sort
      if (this.sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        filtered.sort((a, b) => (b.comment_count || 0) - (a.comment_count || 0));
      }
      
      return filtered;
    },
    getCurrentCategoryName() {
      const cat = this.categories.find(c => c.id === this.selectedCategory);
      return cat ? `${cat.icon} ${cat.name}` : 'Discussions';
    },
    totalComments() {
      return this.posts.reduce((sum, p) => sum + (p.comment_count || 0), 0);
    },
    uniqueUsers() {
      const users = new Set(this.posts.map(p => p.name));
      return users.size;
    }
  },
  mounted() {
    this.fetchPosts();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.user = JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        console.error('Invalid token');
      }
    }
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        this.posts = data.posts || [];
      } catch (error) {
        console.error('Error fetching posts:', error);
        this.posts = [];
      }
    },
    async addPost() {
      const token = localStorage.getItem('token');
      try {
        await fetch('http://localhost:3000/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.newPost)
        });
        this.newPost = { title: '', content: '', category: '', tags: '' };
        this.showCreateForm = false;
        this.fetchPosts();
      } catch (error) {
        console.error('Error adding post:', error);
      }
    },
    async viewPost(id) {
      this.selectedPost = this.posts.find(p => p.id === id);
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`);
        const data = await response.json();
        this.comments = data.comments || [];
      } catch (error) {
        console.error('Error fetching comments:', error);
        this.comments = [];
      }
    },
    async addComment() {
      const token = localStorage.getItem('token');
      try {
        await fetch(`http://localhost:3000/api/posts/${this.selectedPost.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: this.newComment })
        });
        this.newComment = '';
        this.viewPost(this.selectedPost.id);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const now = new Date();
      const diff = now - d;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      return d.toLocaleDateString();
    },
    truncateContent(content) {
      if (!content) return '';
      return content.length > 150 ? content.substring(0, 150) + '...' : content;
    },
    parseTags(tags) {
      if (!tags) return [];
      return tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    },
    getCategoryCount(catId) {
      if (catId === 'all') return this.posts.length;
      return this.posts.filter(p => p.category === catId).length;
    },
    getCategoryIcon(catId) {
      const cat = this.categories.find(c => c.id === catId);
      return cat ? cat.icon : '📋';
    },
    toggleTag(tag) {
      this.selectedTag = this.selectedTag === tag ? null : tag;
    },
    getAvatarColor(name) {
      if (!name) return '#2ecc71';
      const colors = ['#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c', '#e91e63', '#00bcd4'];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    }
  }
}
</script>

<style scoped>
.forum-page {
  min-height: 100vh;
  padding: 80px 24px 60px;
  background: var(--bg-color);
}

/* Header */
.forum-header {
  max-width: 1100px;
  margin: 0 auto 24px;
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

.forum-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat {
  text-align: center;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-color);
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Container */
.forum-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

/* Sidebar */
.forum-sidebar {
  position: sticky;
  top: 90px;
  height: fit-content;
}

.sidebar-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 18px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.sidebar-section h3 {
  margin: 0 0 12px;
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 600;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-color);
  text-align: left;
  width: 100%;
  font-size: 0.875rem;
}

.category-btn:hover {
  background: var(--bg-secondary);
}

.category-btn.active {
  background: var(--primary-subtle);
  color: var(--primary);
  font-weight: 500;
}

.cat-name {
  flex: 1;
}

.cat-count {
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.category-btn.active .cat-count {
  background: var(--primary);
  color: white;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 5px 10px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 100px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover, .tag.active {
  background: var(--primary);
  color: white;
}

.guidelines ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guidelines li {
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border-color);
}

.guidelines li:last-child {
  border: none;
}

/* Main Content */
.forum-main {
  min-width: 0;
}

/* Create Post */
.create-post-section {
  margin-bottom: 20px;
}

.create-post-trigger {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-color);
}

.create-post-trigger:hover {
  border-color: var(--primary);
}

.create-post-trigger span {
  flex: 1;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.user-avatar.small {
  width: 32px;
  height: 32px;
  font-size: 0.85rem;
}

.create-btn {
  padding: 10px 18px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.create-btn:hover {
  background: var(--primary-dark);
}

.create-post-form {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.form-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
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

.dark .close-btn {
  background: rgba(255, 255, 255, 0.1);
}

.close-btn:hover {
  background: #dc2626;
  color: white;
}

.create-post-form form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title-input {
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 500;
}

.title-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.category-select, .tags-input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
}

.category-select:focus, .tags-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.create-post-form textarea {
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
}

.create-post-form textarea:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
}

.cancel-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.submit-btn {
  padding: 10px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
}

.submit-btn:hover {
  background: var(--primary-dark);
}

/* Login Prompt */
.login-prompt {
  text-align: center;
  padding: 16px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.login-prompt a {
  color: var(--primary);
  font-weight: 500;
}

/* Posts Section */
.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.posts-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.sort-options {
  display: flex;
  gap: 6px;
}

.sort-btn {
  padding: 6px 12px;
  border: none;
  background: var(--bg-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
  transition: var(--transition);
}

.dark .sort-btn {
  background: rgba(255, 255, 255, 0.05);
}

.sort-btn.active {
  background: var(--primary);
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
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

/* Posts List */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.post-card:hover {
  border-color: var(--primary);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.author-avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1.1rem;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.9rem;
}

.post-date {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.post-category {
  padding: 4px 10px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.post-title {
  margin: 0 0 8px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.post-excerpt {
  margin: 0 0 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag-small {
  padding: 2px 8px;
  background: var(--primary-subtle);
  color: var(--primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}

.post-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* Post Detail */
.post-detail {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.back-btn {
  padding: 8px 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  background: transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.9rem;
  transition: var(--transition);
}

.dark .back-btn {
  background: rgba(255, 255, 255, 0.05);
}

.back-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.detail-card {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 24px;
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-title {
  margin: 0 0 16px;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
}

.detail-content {
  color: var(--text-color);
  line-height: 1.7;
  font-size: 0.95rem;
  white-space: pre-wrap;
  margin-bottom: 16px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.detail-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  padding: 8px 16px;
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

/* Comments */
.comments-section {
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 24px;
  border: 1px solid var(--border-color);
}

.comments-section h3 {
  margin: 0 0 20px;
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.add-comment {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.comment-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-form textarea {
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color);
  min-height: 70px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
}

.comment-form textarea:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-subtle);
}

.comment-submit {
  align-self: flex-end;
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
}

.comment-submit:hover {
  background: var(--primary-dark);
}

.no-comments {
  text-align: center;
  padding: 24px;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-card {
  padding: 16px;
  background: var(--bg-color);
  border-radius: var(--radius-lg);
}

.dark .comment-card {
  background: rgba(255, 255, 255, 0.03);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.9rem;
}

.comment-date {
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.comment-content {
  margin: 0 0 10px;
  color: var(--text-color);
  line-height: 1.6;
  font-size: 0.9rem;
}

.comment-actions {
  display: flex;
  gap: 10px;
}

.mini-action {
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.mini-action:hover {
  background: var(--primary-subtle);
  color: var(--primary);
}

/* Responsive */
@media (max-width: 900px) {
  .forum-container {
    grid-template-columns: 1fr;
  }
  
  .forum-sidebar {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .sidebar-section {
    margin-bottom: 0;
  }
  
  .forum-header {
    flex-direction: column;
    text-align: center;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .forum-header {
    padding: 20px;
  }
  
  .header-content h1 {
    font-size: 1.4rem;
  }
  
  .forum-stats {
    gap: 16px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .post-card {
    padding: 18px;
  }
  
  .detail-title {
    font-size: 1.4em;
  }
}
</style>
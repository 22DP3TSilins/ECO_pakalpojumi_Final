<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal modal-lg">
      <div class="modal-header">
        <h3>
          <Icon :name="form.id ? 'edit' : 'plus'" :size="18" />
          {{ form.id ? $t('admin.editProduct') : $t('admin.addProduct') }}
        </h3>
        <button @click="$emit('close')" class="modal-close">×</button>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label>{{ $t('admin.productName') }} *</label>
            <input :value="form.name" @input="update('name', $event.target.value)" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label>{{ $t('admin.category') }} *</label>
            <select :value="form.category" @change="update('category', $event.target.value)" class="form-input" required>
              <option value="">{{ $t('admin.selectCategory') }}</option>
              <option value="Solar">{{ $t('admin.categorySolar') }}</option>
              <option value="Water">{{ $t('admin.categoryWater') }}</option>
              <option value="Energy">{{ $t('admin.categoryEnergy') }}</option>
              <option value="Garden">{{ $t('admin.categoryGarden') }}</option>
              <option value="Home">{{ $t('admin.categoryHome') }}</option>
              <option value="Transport">{{ $t('admin.categoryTransport') }}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('admin.description') }}</label>
          <textarea :value="form.description" @input="update('description', $event.target.value)" class="form-input" rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>{{ $t('admin.price') }} *</label>
            <input :value="form.price" @input="update('price', parseFloat($event.target.value))" type="number" step="0.01" min="0" class="form-input" required />
          </div>
          <div class="form-group">
            <label>{{ $t('admin.stock') }} *</label>
            <input :value="form.stock" @input="update('stock', parseInt($event.target.value))" type="number" min="0" class="form-input" required />
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('admin.productImage') }}</label>
          <div class="image-upload-section">
            <div v-if="form.image_url" class="image-preview">
              <img :src="form.image_url" alt="Product preview" />
              <button type="button" @click="$emit('remove-image')" class="remove-image-btn">×</button>
            </div>
            <div v-else class="upload-area">
              <input 
                type="file" 
                ref="imageInput" 
                @change="$emit('upload', $event)" 
                accept="image/*" 
                class="file-input"
                id="product-image"
              />
              <label for="product-image" class="upload-label">
                <span class="upload-icon"><Icon name="folder" :size="20" /></span>
                <span>{{ $t('admin.clickToUpload') }}</span>
                <span class="upload-hint">{{ $t('admin.uploadHint') }}</span>
              </label>
            </div>
            <div v-if="uploading" class="upload-progress">
              <span>{{ $t('admin.uploading') }}</span>
            </div>
          </div>
          <div class="image-url-fallback">
            <span class="or-divider">{{ $t('admin.or') }}</span>
            <input :value="form.image_url" @input="update('image_url', $event.target.value)" type="url" class="form-input" :placeholder="$t('admin.pasteImageUrl')" />
          </div>
        </div>
        <div class="form-group">
          <label>{{ $t('admin.lifecycleInfo') }}</label>
          <textarea :value="form.lifecycle_info" @input="update('lifecycle_info', $event.target.value)" class="form-input" rows="2" :placeholder="$t('admin.lifecyclePlaceholder')"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">{{ $t('admin.cancel') }}</button>
        <button @click="$emit('save')" class="btn-primary" :disabled="loading || uploading">
          {{ loading ? $t('admin.saving') : (form.id ? $t('admin.updateProduct') : $t('admin.addProduct')) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../common/Icon.vue'

export default {
  name: 'AdminProductModal',
  components: { Icon },
  props: {
    show: Boolean,
    form: Object,
    loading: Boolean,
    uploading: Boolean
  },
  emits: ['close', 'save', 'upload', 'remove-image', 'update:form'],
  methods: {
    update(field, value) {
      this.$emit('update:form', { ...this.form, [field]: value })
    }
  }
}
</script>

<style src="./admin-modal.css" scoped></style>

<style scoped>
:global(.admin-dark) .modal-overlay { background: rgba(0,0,0,0.6); }
:global(.admin-dark) .modal { box-shadow: 0 24px 64px rgba(0,0,0,0.4); }
:global(.admin-dark) .modal-close { background: rgba(231,76,60,0.12); border-color: transparent; color: #e74c3c; }
:global(.admin-dark) .modal-close:hover { background: #e74c3c; color: #fff; }
</style>

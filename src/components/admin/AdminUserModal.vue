<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ $t('admin.editUser') }}</h3>
        <button @click="$emit('close')" class="modal-close">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>{{ $t('admin.name') }}</label>
          <input :value="form.name" @input="update('name', $event.target.value)" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label>{{ $t('admin.email') }}</label>
          <input :value="form.email" @input="update('email', $event.target.value)" type="email" class="form-input" />
        </div>
        <div class="form-group">
          <label>{{ $t('admin.role') }}</label>
          <select :value="form.role" @change="update('role', $event.target.value)" class="form-input">
            <option value="user">{{ $t('admin.userRole.user') }}</option>
            <option value="admin">{{ $t('admin.userRole.admin') }}</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">{{ $t('admin.cancel') }}</button>
        <button @click="$emit('save')" class="btn-primary" :disabled="loading">
          {{ loading ? $t('admin.saving') : $t('admin.saveChanges') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUserModal',
  props: {
    show: Boolean,
    form: Object,
    loading: Boolean
  },
  emits: ['close', 'save', 'update:form'],
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

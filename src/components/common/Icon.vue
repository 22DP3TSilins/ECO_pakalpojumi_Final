<template>
  <span
    class="icon"
    :class="[wrapperClass]"
    :style="{ width: size + 'px', height: size + 'px' }"
    aria-hidden="true"
    v-html="svg"
  />
</template>

<script setup>
import { computed } from 'vue';
import { ICONS } from './icons.js';

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  strokeWidth: { type: [Number, String], default: 2 },
  wrapperClass: { type: String, default: '' }
});

const svg = computed(() => {
  const body = ICONS[props.name] || ICONS.circle;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${props.size}" height="${props.size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${props.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
});
</script>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  line-height: 1;
  flex-shrink: 0;
}
.icon :deep(svg) {
  display: block;
}
</style>

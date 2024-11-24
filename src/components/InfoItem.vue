<template>
  <section class="container-info-item">
    <span :class="getTitleClass">{{ props.title }}</span>
    <div class="div-subtitle">
      <div class="left-content">
        <slot name="left-icon"></slot>
      </div>
      <span :class="getSubtitleClass">{{ props.subtitle }}</span>
      <div class="right-content">
        <slot name="right-icon"></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: [String, Number],
    default: '',
  },
  titleClass: {
    type: [String, Array, Object],
    default: null,
  },
  subtitleClass: {
    type: [String, Array, Object],
    default: null,
  },
})

const getTitleClass = computed(() => props.titleClass || 'default-title-class')
const getSubtitleClass = computed(() => props.subtitleClass || 'default-subtitle-class')
</script>

<style lang="css" scoped>
.container-info-item {
  padding: 6px 12px;
}

.default-title-class {
  color: #030712;
  font-size: 14px;
  font-weight: 500;
}

.default-subtitle-class {
  color: #030712;
  font-size: 18px;
  font-weight: 400;
  margin-top: 5px;
}

.left-content,
.right-content {
  display: flex;
  align-items: center;
}

.left-content {
  margin-top: 5px;
  margin-right: 6px;
}

.right-content {
  margin-top: 5px;
  margin-left: 6px;
}

.div-subtitle {
  display: flex;
  align-items: center;
}
</style>

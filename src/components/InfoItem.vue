<template>
  <section class="container-info-item">
    <label :class="getTitleClass">{{ props.title }}</label>
    <div class="div-subtitle">
      <div class="left-content">
        <slot name="left-icon"></slot>
      </div>
      <label :class="getSubtitleClass">{{ props.subtitle }}</label>
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
    type: String,
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
  padding: 15px 25px;
}

.default-title-class {
  color: #030712;
  font-size: 14px;
  font-weight: 500;
}

.default-subtitle-class {
  color: #030712;
  font-size: 24px;
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
  margin-right: 10px;
}

.right-content {
  margin-top: 5px;
  margin-left: 10px;
}

.div-subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div class="container-badge" :class="getBackground">
    <p>{{ props.label }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  mainColor: {
    type: [String, Array, Object],
    default: null,
  },
  name: {
    type: String,
    default: 'success',
  },
})

const getBackground = computed(() => (props.name === 'error' ? 'error-badge' : 'success-badge'))
</script>

<style lang="css" scoped>
.container-badge {
  width: 35px;
  height: 20px;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-badge > p {
  font-size: 12px;
  font-weight: 500;
}

.success-badge {
  background-color: #86e6a9;
  color: #15803d;
}

.error-badge {
  background-color: #eebfbf;
  color: #891c1c;
}
</style>

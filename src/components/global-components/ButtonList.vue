<template>
  <div class="card">
    <h5>{{ props.title }}</h5>
    <button class="email-button" @click="toggleTooltip">
      <span v-for="(email, index) in displayedEmails" :key="index">
        {{ email }}<span v-if="index < displayedEmails.length - 1">, </span>
      </span>
      <span v-if="emails.length > 2" class="more-text">...</span>
    </button>

    <Transition name="fade">
      <div v-if="showTooltip" class="tooltip">
        <p v-for="(email, index) in props.emails" :key="'tooltip-' + index">{{ email }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  emails: {
    type: Array,
    default: () => [],
  },
})

const showTooltip = ref(false)
const displayedEmails = computed(() => props.emails.slice(0, 2))

const toggleTooltip = () => {
  showTooltip.value = !showTooltip.value
}
</script>

<style lang="css" scoped>
.card h5,
.card .email-button {
  margin: 0;
}

.card {
  width: 15rem;

  border-radius: 5px;
  position: relative;
  background: white;
}

h5 {
  text-align: center;
}

.email-button {
  background: linear-gradient(to right, white, rgba(255, 255, 255, 0.5));
  padding: 5px;

  cursor: pointer;
  text-align: left;
  position: relative;
}

.more-text {
  font-weight: bold;
}

span {
  font-size: 12px;
}

.tooltip {
  position: absolute;
  font-size: 12px;
  top: 100%;
  left: 0;
  width: max-content;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <section class="card-container">
    <div class="div__container">
      <h5>{{ props.title }}</h5>
      <h5 class="name__total">{{ props.count }}</h5>
    </div>
    <div class="div__container">
      <ButtonList title="Email To" :emails="props.emailsTo" />
      <ButtonList title="Email Cc" :emails="props.emailsCc" />
    </div>
    <div class="div__button">
      <button @click="handleClick" class="btn__send">Send</button>
    </div>
  </section>
</template>

<script setup>
import ButtonList from './ButtonList.vue'

const emit = defineEmits(['button-click'])

const handleClick = () => {
  emit('button-click')
}

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  count: {
    type: [String, Number],
    default: '',
  },
  emailsTo: {
    type: Array,
    default: () => [],
  },
  emailsCc: {
    type: Array,
    default: () => [],
  },
})
</script>

<style lang="css" scoped>
.card-container {
  border: 1px solid blue;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  display: grid;
  grid-template-columns: 1fr 2.5fr 1fr;
}

.div__container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.name__total {
  margin-right: 3rem;
}

.div__button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn__send {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 4px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}

.btn__send:hover {
  background-color: var(--hover-button);
}
</style>

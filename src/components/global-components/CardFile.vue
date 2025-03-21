<template>
  <section
    class="container__card"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <p>{{ props.title }}</p>
    <div class="container__img">
      <img :src="props.icon" alt="icon" />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  file: { type: Object, default: () => ({}) },
  icon: { type: String, default: '' },
})

const emit = defineEmits(['drag-start', 'drag-end'])

const handleDragStart = (event) => {
  // Lógica básica interna del componente
  event.target.classList.add('dragging')
  // Emitir evento al padre con el evento nativo y datos necesarios
  emit('drag-start', {
    nativeEvent: event,
    payload: '', // Si necesita enviar datos específicos
  })
}

const handleDragEnd = (event) => {
  event.target.classList.remove('dragging')
  emit('drag-end')
}
</script>

<style lang="css" scoped>
.container__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  width: 7rem;
  padding: 0.5rem;
  transition: all 0.3s ease;
  opacity: 1;
}

.container__card .card.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border: 2px dashed #2196f3;
  cursor: grabbing;
}

.container__img {
}

img {
  width: 70px;
  height: 70px;
}

p {
  font-size: 0.7rem;
  margin: 0;
}
</style>

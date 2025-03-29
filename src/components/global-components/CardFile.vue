<template>
  <section
    class="container__card"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @drag="handleDrag"
  >
    <p>{{ props.title }}</p>
    <div class="container__img">
      <img :src="props.icon" alt="icon" />
      <p class="file-size">{{ formattedSize }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  file: { type: Object, default: () => ({}) },
  icon: { type: String, default: '' },
  size: { type: Number, default: 0 },
})

const emit = defineEmits(['drag-start', 'drag-end'])

const formattedSize = computed(() => {
  const bytes = props.size
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
})

const handleDragStart = (event) => {
  // if (!props.file?.content) {
  //   event.preventDefault();
  //   return;
  // }
  // Necesario para Firefox
  event.dataTransfer.setData('text/plain', props.file.name)

  // Establecer imagen de arrastre
  // const dragIcon = event.target.cloneNode(true);
  // dragIcon.style.opacity = '0.5';
  // dragIcon.style.with = '100px'
  // event.dataTransfer.setDragImage(dragIcon, event.offsetX, event.offsetY);

  emit('drag-start', {
    nativeEvent: event,
    file: props.file,
  })
}

const handleDragEnd = (event) => {
  event.preventDefault()
  event.dataTransfer.clearData()
  emit('drag-end')
}

const handleDrag = (event) => {
  event.preventDefault()
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

img {
  width: 50px;
  height: 50px;
}

p {
  font-size: 0.7rem;
  margin: 0;
}

.file-size {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
}

.drag-preview {
  width: 150px;
  height: 90px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #2196f3;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
  position: fixed;
  top: -9999px;
}

.preview-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.preview-text {
  font-size: 12px;
  color: #333;
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>

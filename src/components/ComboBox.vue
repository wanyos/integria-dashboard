<template>
  <ComboboxRoot v-model="selectedValue" class="ComboboxRoot">
    <ComboboxAnchor class="ComboboxAnchor">
      <ComboboxInput class="ComboboxInput" placeholder="Choose an option..." />
      <ComboboxTrigger>
        <v-icon name="bi-chevron-down" />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxContent class="ComboboxContent">
      <ComboboxViewport class="ComboboxViewport">
        <ComboboxGroup>
          <ComboboxItem
            v-for="(option, index) in props.options"
            :key="index"
            class="ComboboxItem"
            :value="option"
          >
            <ComboboxItemIndicator class="ComboboxItemIndicator">
              <v-icon name="bi-check" />
            </ComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

<script setup>
import { ref } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'radix-vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
})

const selectedValue = ref('')
</script>

<style lang="css" scoped>
.ComboboxRoot {
  position: relative;
}

.ComboboxAnchor {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  line-height: 1;
  height: 35px;
  padding: 0 15px;
  gap: 5px;
  background-color: white;
  color: #1a1a1a;
  border-radius: 4px;
}

.ComboboxInput {
  height: 100%;
  background-color: transparent;
}
.ComboboxInput[data-placeholder] {
  color: #1a1a1a;
}

.ComboboxIcon {
  width: 16px;
  height: 16px;
}

.ComboboxContent {
  z-index: 10;
  width: 100%;
  position: absolute;
  left: 0px;
  overflow: hidden;
  background-color: white;
  border-radius: 6px;
  margin-top: 8px;
  box-shadow:
    0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
}

.ComboboxViewport {
  padding: 5px;
}

.ComboboxEmpty {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
}

.ComboboxItem {
  font-size: 14px;
  line-height: 1;
  border-radius: 5px;
  width: 70%;
  margin-left: 10px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 35px 0 25px;
  position: relative;
}
.ComboboxItem[data-disabled] {
  color: #4ea6e1;
  pointer-events: none;
}
.ComboboxItem[data-highlighted] {
  outline: none;
  background-color: #0088cc;
  color: #fff;
  cursor: pointer;
}

.ComboboxLabel {
  padding: 0 25px;
  font-size: 12px;
  line-height: 25px;
  color: #1a1a1a;
}

.ComboboxItemIndicator {
  position: absolute;
  left: 0;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>

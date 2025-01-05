<template>
  <ComboboxRoot v-model="selectedValue" class="ComboboxRoot">
    <ComboboxAnchor class="ComboboxAnchor">
      <v-icon :name="props.iconName" class="icon-calendar" />
      <ComboboxInput
        class="ComboboxInput"
        placeholder="Select..."
        :style="{ width: props.customWidth }"
        name="combobox-input"
        readonly
      />
      <ComboboxTrigger class="ComboboxIcon">
        <v-icon name="bi-chevron-down" />
      </ComboboxTrigger>

      <ComboboxContent data-align="center" class="ComboboxContent">
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
    </ComboboxAnchor>
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
  customWidth: {
    type: String,
    default: '100px',
  },
  iconName: {
    type: String,
    default: '',
  },
})

const selectedValue = ref('')
</script>

<style lang="css" scoped>
.ComboboxRoot {
  position: relative;
}

.ComboboxAnchor {
  position: relative;
  display: flex;
  align-items: center;
  font-size: 12px;
  height: 30px;
  padding: 0 8px;
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
  margin-right: 2px;
  cursor: pointer;
}

.ComboboxContent {
  z-index: 10;
  width: 100%;
  position: absolute;
  top: 35px;
  left: 0;
  overflow: hidden;
  background-color: white;
  border-radius: 6px;
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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
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

.icon-calendar {
  margin-right: 15px;
}
</style>

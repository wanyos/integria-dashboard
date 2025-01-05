import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HeatMap from '../HeatMap.vue'

vi.mock('vue3-apexcharts', () => ({
  default: {
    props: ['options', 'series'],
    template: '<div>{{ options.title.text }}</div>',
  },
}))

describe('HeatMap', () => {
  it('renders properly', () => {
    const wrapper = mount(HeatMap, { props: { title: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})

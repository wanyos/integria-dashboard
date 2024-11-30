import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HeatMap from '../HeatMap.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HeatMap, { props: { title: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})

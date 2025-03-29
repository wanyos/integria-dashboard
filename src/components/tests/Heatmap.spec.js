import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import HeatmapChart from '@/components/HeatMap.vue'
import VueApexCharts from 'vue3-apexcharts'

// Guarda una referencia al mock para usarla en las pruebas
const mockHandleMouseLeave = vi.fn()

// Mock del composable useChartUtils
vi.mock('@/composables/useChartUtils', () => ({
  useChartUtils: () => ({
    chartRef: ref(null),
    handleMouseLeave: mockHandleMouseLeave,
  }),
}))

// Mock de vue3-apexcharts para evitar problemas de renderizado en tests
vi.mock('vue3-apexcharts', () => ({
  default: {
    name: 'VueApexCharts',
    render: () => {},
  },
}))

// Mock de vue-loading-overlay
vi.mock('vue-loading-overlay', () => ({
  default: {
    name: 'Loading',
    render: () => {},
  },
}))

describe('HeatmapChart', () => {
  let wrapper
  const defaultProps = {
    id: 'test-heatmap',
    title: 'Test Heatmap',
    subtitle: '2024',
    colors: ['#E3F2FD', '#90CAF9', '#42A5F5', '#1565C0', '#0D47A1'],
    incidents: [
      {
        name: 'Jan',
        data: [
          { x: '1', y: 5 },
          { x: '2', y: 10 },
          { x: '3', y: 15 },
        ],
      },
      {
        name: 'Feb',
        data: [
          { x: '1', y: 12 },
          { x: '2', y: 25 },
          { x: '3', y: 30 },
        ],
      },
    ],
  }

  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    vi.clearAllMocks()

    wrapper = shallowMount(HeatmapChart, {
      props: defaultProps,
      global: {
        stubs: {
          VueApexCharts: true,
          Loading: true,
        },
      },
    })
  })

  it('se renderiza correctamente', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(VueApexCharts).exists()).toBe(true)
  })

  it('pasa las propiedades correctamente a las opciones del gráfico', async () => {
    const chartOptionsData = wrapper.vm.chartOptionsHeat

    expect(chartOptionsData.chart.type).toBe('heatmap')
    expect(chartOptionsData.title.text).toBe(defaultProps.title)
    expect(chartOptionsData.subtitle.text).toBe(`Year: ${defaultProps.subtitle}`)

    // const colorRanges = chartOptionsData.plotOptions.heatmap.colorScale.ranges
    // expect(colorRanges[0].color).toBe(defaultProps.colors[0])
    // expect(colorRanges[3].color).toBe(defaultProps.colors[3])
  })

  it('inicializa correctamente el estado de carga', async () => {
    expect(wrapper.vm.isLoading).toBe(false)
    await wrapper.vm.$nextTick()
    //  expect(wrapper.vm.isLoading).toBe(true)
  })

  it('actualiza seriesHeat cuando cambian los incidents', async () => {
    const newIncidents = [
      {
        name: 'Mar',
        data: [
          { x: '1', y: 50 },
          { x: '2', y: 75 },
        ],
      },
    ]

    await wrapper.setProps({ incidents: newIncidents })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.seriesHeat).toEqual(newIncidents)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('actualiza el subtítulo cuando cambia la prop subtitle', async () => {
    const newIncidents = [
      {
        name: 'Mar',
        data: [{ x: '1', y: 50 }],
      },
    ]

    await wrapper.setProps({
      subtitle: '2025',
      incidents: newIncidents,
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.chartOptionsHeat.subtitle.text).toBe('Year: 2025')
  })

  it('maneja el evento mouse-leave correctamente', async () => {
    mockHandleMouseLeave.mockClear()
    const mountedWrapper = mount(HeatmapChart, {
      props: defaultProps,
      global: {
        stubs: {
          VueApexCharts: {
            template: '<div class="vue-apex-charts" @mouseleave="$emit(\'mouse-leave\')"></div>',
            props: ['options', 'series'],
          },
          Loading: true,
        },
      },
    })

    // Simular el evento mouse-leave
    await mountedWrapper.findComponent(VueApexCharts).trigger('mouseleave')
    await wrapper.vm.$nextTick()
    expect(mockHandleMouseLeave).toHaveBeenCalled()
  })

  it('configura correctamente 31 días en las categorías del eje X', () => {
    const categories = wrapper.vm.chartOptionsHeat.xaxis.categories
    expect(categories).toHaveLength(31)
    expect(categories[0]).toBe('1')
    expect(categories[30]).toBe('31')
  })

  it('configura correctamente las escalas de color basadas en los rangos de valores', () => {
    const colorRanges = wrapper.vm.chartOptionsHeat.plotOptions.heatmap.colorScale.ranges
    expect(colorRanges).toHaveLength(6)
    expect(colorRanges[0]).toEqual({ from: 0, to: 10, color: defaultProps.colors[0], name: '0-10' })
    expect(colorRanges[4]).toEqual({
      from: 61,
      to: 100,
      color: defaultProps.colors[3],
      name: '61-100',
    })
    expect(colorRanges[5]).toEqual({
      from: 101,
      to: 400,
      color: defaultProps.colors[4],
      name: '+100',
    })
  })
})

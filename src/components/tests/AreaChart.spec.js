import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import AreaChart from '@/components/AreaChart.vue' // Ajusta la ruta según tu estructura de proyecto
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

describe('AreaChart', () => {
  let wrapper
  const defaultProps = {
    id: 'test-area-chart',
    title: 'Test Chart',
    subtitle: '2024',
    color: '#1E88E5',
    incidents: [
      {
        name: 'Incidents',
        data: [
          { x: 'January', y: 30 },
          { x: 'February', y: 40 },
          { x: 'March', y: 35 },
        ],
      },
    ],
  }

  beforeEach(() => {
    // Limpiar los mocks antes de cada test
    vi.clearAllMocks()

    wrapper = shallowMount(AreaChart, {
      props: defaultProps,
      global: {
        stubs: {
          VueApexCharts: true,
        },
      },
    })
  })

  it('se renderiza correctamente', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(VueApexCharts).exists()).toBe(true)
  })

  it('pasa las propiedades correctamente a las opciones del gráfico', async () => {
    // Verificar que las props se pasan correctamente a chartOptions
    const chartOptionsData = wrapper.vm.chartOptions

    expect(chartOptionsData.chart.id).toBe(defaultProps.id)
    expect(chartOptionsData.title.text).toBe(defaultProps.title)
    expect(chartOptionsData.subtitle.text).toBe(`Year: ${defaultProps.subtitle}`)
    expect(chartOptionsData.stroke.colors[0]).toBe(defaultProps.color)
    expect(chartOptionsData.markers.colors[0]).toBe(defaultProps.color)
  })

  it('actualiza las opciones del gráfico cuando cambian los incidents', async () => {
    // El componente solo observa cambios en incidents, por lo que necesitamos
    // cambiar incidents para que se actualicen las otras props también
    const newIncidents = [
      {
        name: 'Updated Incidents',
        data: [
          { x: 'January', y: 100 },
          { x: 'February', y: 200 },
        ],
      },
    ]

    await wrapper.setProps({
      title: 'Updated Title',
      subtitle: '2025',
      color: '#FF5722',
      incidents: newIncidents,
    })

    // Esperar a que el watcher y el nextTick del componente se ejecuten
    await nextTick()
    await nextTick()

    // Ahora las opciones deberían actualizarse
    const updatedOptions = wrapper.vm.chartOptions
    expect(updatedOptions.title.text).toBe('Updated Title')
    expect(updatedOptions.subtitle.text).toBe('Year: 2025')
    expect(updatedOptions.stroke.colors[0]).toBe('#FF5722')
    expect(updatedOptions.markers.colors[0]).toBe('#FF5722')
    expect(updatedOptions.tooltip.marker.fillColors[0]).toBe('#FF5722')
  })

  it('actualiza seriesArea cuando cambian los incidents', async () => {
    const newIncidents = [
      {
        name: 'Updated Incidents',
        data: [
          { x: 'January', y: 100 },
          { x: 'February', y: 200 },
        ],
      },
    ]

    await wrapper.setProps({ incidents: newIncidents })
    await nextTick()

    expect(wrapper.vm.seriesArea).toEqual(newIncidents)
  })

  it('maneja el evento mouse-leave correctamente', async () => {
    // Resetear el mock antes de la prueba
    mockHandleMouseLeave.mockClear()

    // Montar el componente con un stub que permite eventos
    const mountedWrapper = mount(AreaChart, {
      props: defaultProps,
      global: {
        stubs: {
          VueApexCharts: {
            template: '<div class="vue-apex-charts" @mouseleave="$emit(\'mouse-leave\')"></div>',
            props: ['options', 'series'],
          },
        },
      },
    })

    // Simular el evento mouse-leave
    await mountedWrapper.findComponent(VueApexCharts).trigger('mouseleave')

    // Esperar a que Vue procese el evento
    await nextTick()

    // Verificar que el método handleMouseLeave fue llamado
    expect(mockHandleMouseLeave).toHaveBeenCalled()
  })

  it('contiene las categorías correctas para el eje X', () => {
    const categories = wrapper.vm.chartOptions.xaxis.categories
    expect(categories).toHaveLength(12)
    expect(categories).toContain('January')
    expect(categories).toContain('December')
  })
})

import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VChart: typeof import('vue-echarts')['default']
    VDataTable: typeof import('vuetify/labs/VDataTable')['VDataTable']
  }
}

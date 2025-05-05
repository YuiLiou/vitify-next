<template>
  <v-card>
    <v-card-title class="headline">Task List</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="samples"
        item-value="name"
        loading-text="Loading... Please wait"
        :loading="loading"
      />
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { fetchDispatchReasonByTask } from '@/scripts/dispatch-handlers'
import type { DataTableHeaders } from '@/plugins/vuetify'
const props = withDefaults(
  defineProps<{
    taskId: string
  }>(),
  {
    taskId: '',
  },
)
const taskId = toRef(props, 'taskId')
const samples = ref<any[]>([])
const loading = ref(true)
const headers: DataTableHeaders = [
  {
    title: 'Sample_ID',
    key: 'sampleId',
  },
  {
    title: 'Ctrl_ID',
    key: 'ctrlId',
  },
  {
    title: 'IP',
    key: 'ip',
  },
  {
    title: 'FW Version',
    key: 'fwVersion',
  },
  {
    title: 'FW Feature',
    key: 'fwFeatureString',
  },
  {
    title: 'Status',
    key: 'testerStatus',
  },
]

onMounted(async () => {
  const response = await fetchDispatchReasonByTask(taskId.value)
  response.projects.forEach((project) => {
    console.log(project.projectId)
    project.tasks.forEach((task) => {
      Object.values(task.sampleIdToMismatch).forEach((mismatch: any) => {
        samples.value.push({
          ...mismatch.sample,
        })
      })
    })
  })
  loading.value = false
})

const emit = defineEmits(['close'])
</script>

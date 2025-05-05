<template>
  <v-card>
    <v-card-title class="headline">Task List</v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="tasks" item-value="name" />
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import {
  fetchTasksByPjID,
  getTaskStatus,
  getTaskResult,
} from '@/scripts/task-handlers'
import type { DataTableHeaders } from '@/plugins/vuetify'
const props = withDefaults(
  defineProps<{
    projectId: string
  }>(),
  {
    projectId: '',
  },
)
const projectID = toRef(props, 'projectId')
const tasks = ref<any[]>([])
const headers: DataTableHeaders = [
  {
    title: 'TK_ID',
    key: 'tkId',
  },
  {
    title: 'PJ_ID',
    key: 'pjId',
  },
  {
    title: 'Tool',
    key: 'toolName',
  },
  {
    title: 'TCS Name',
    key: 'tcsName',
  },
  {
    title: 'Status',
    key: 'testStatus',
  },
  {
    title: 'Result',
    key: 'testResult',
  },
  {
    title: 'Start',
    key: 'runningStartTime',
  },
]

onMounted(async () => {
  const response = await fetchTasksByPjID(projectID.value)
  tasks.value = await response.data['tasks'].map((task: any) => ({
    ...task,
    testStatus: getTaskStatus(task.testStatus),
    testResult: getTaskResult(task.testResult),
  }))
})

const emit = defineEmits(['close'])
</script>

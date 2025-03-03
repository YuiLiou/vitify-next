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
import { fetchTasksByPjID } from '@/scripts/TaskHandlers'
import type { DataTableHeaders } from '@/plugins/vuetify'
const props = withDefaults(
  defineProps<{
    projectID: string
  }>(),
  {
    projectID: '',
  },
)
const projectID = toRef(props, 'projectID')
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
  {
    title: 'Status',
    key: 'testStatus',
  },
]

onMounted(async () => {
  const response = await fetchTasksByPjID(projectID.value)
  tasks.value = await response.data['tasks'].map((task: any) => ({
    ...task,
  }))
})

const emit = defineEmits(['close'])
</script>

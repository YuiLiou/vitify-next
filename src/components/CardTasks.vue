<template>
  <v-card>
    <v-card-title class="headline">Task List</v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="tasks" item-value="name">
        <template #item.action="{ item }">
          <v-defaults-provider
            :defaults="{
              VBtn: {
                size: 20,
                rounded: 'sm',
                variant: 'text',
                class: 'ml-1',
                color: '',
              },
              VIcon: {
                size: 20,
              },
            }"
          >
            <v-tooltip location="top">
              <template #activator="{ taskProps }">
                <v-btn
                  icon="mdi-rocket-launch-outline"
                  v-bind="taskProps"
                  @click="openDialog(item.tkId)"
                />
              </template>
              <span>Go!</span>
            </v-tooltip>
          </v-defaults-provider>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog">
        <card-tasks-dispatch
          :task-id="selectedTaskId"
          @close="dialog = false"
        />
      </v-dialog>
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
import DialogConfirm from './DialogConfirm.vue'
const props = withDefaults(
  defineProps<{
    projectId: string
  }>(),
  {
    projectId: '',
  },
)
const projectId = toRef(props, 'projectId')
const selectedTaskId = ref('')
const dialog = ref(false)
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
  { title: 'Action', key: 'action', sortable: false },
]

onMounted(async () => {
  const response = await fetchTasksByPjID(projectId.value)
  tasks.value = await response.data['tasks'].map((task: any) => ({
    ...task,
    testStatus: getTaskStatus(task.testStatus),
    testResult: getTaskResult(task.testResult),
  }))
})

function openDialog(taskId: string) {
  dialog.value = true
  selectedTaskId.value = taskId
}

const emit = defineEmits(['close'])
</script>

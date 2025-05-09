<template>
  <v-card>
    <v-card-title class="headline">未派工原因</v-card-title>
    <v-card-text>
      <v-spacer />
      <v-text-field>{{ projectId }} </v-text-field>
      <v-data-table :headers="headers" :items="taskDetails" item-value="name">
        <template #item.projectValid="{ item }">
          <v-tooltip location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon
                v-bind="tooltipProps"
                :color="
                  item.testStatusString !== 'Idle'
                    ? 'yellow'
                    : item.projectValid
                      ? 'green'
                      : 'red'
                "
              >
                {{
                  item.testStatusString !== 'Idle'
                    ? 'mdi-alert'
                    : item.projectValid
                      ? 'mdi-check-circle'
                      : 'mdi-alert-circle'
                }}
              </v-icon>
            </template>
            <span v-if="item.projectReason != ''">{{
              item.projectReason
            }}</span>
            <span v-else-if="item.testStatusString !== 'Idle'">Block</span>
            <span v-else>OK!</span>
          </v-tooltip>
        </template>
        <template #item.taskValid="{ item }">
          <v-tooltip location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon
                v-bind="tooltipProps"
                :color="
                  item.testStatusString !== 'Idle'
                    ? 'yellow'
                    : item.taskValid
                      ? 'green'
                      : 'red'
                "
              >
                {{
                  item.testStatusString !== 'Idle'
                    ? 'mdi-alert'
                    : item.taskValid
                      ? 'mdi-check-circle'
                      : 'mdi-alert-circle'
                }}
              </v-icon>
            </template>
            <span v-if="item.taskReason != ''">{{ item.taskReason }}</span>
            <span v-else-if="item.testStatusString !== 'Idle'">Block</span>
            <span v-else>OK!</span>
          </v-tooltip>
        </template>
        <template #item.sampleValid="{ item }">
          <v-tooltip location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon
                v-bind="tooltipProps"
                :color="
                  item.testStatusString !== 'Idle'
                    ? 'yellow'
                    : item.sampleValid
                      ? 'green'
                      : 'red'
                "
              >
                {{
                  item.testStatusString !== 'Idle'
                    ? 'mdi-alert'
                    : item.sampleValid
                      ? 'mdi-check-circle'
                      : 'mdi-alert-circle'
                }}
              </v-icon>
            </template>
            <span v-if="item.sampleReason != ''">{{ item.sampleReason }}</span>
            <span v-else-if="item.testStatusString !== 'Idle'">Block</span>
            <span v-else>OK!</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { DataTableHeaders } from '@/plugins/vuetify'
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    projectId: string
    tasks: any[]
  }>(),
  {
    projectId: '',
    tasks: () => [],
  },
)
const taskDetails = ref<any[]>([])

const headers: DataTableHeaders = [
  { title: 'Project', key: 'projectValid', sortable: false },
  { title: 'Task', key: 'taskValid', sortable: false },
  { title: 'Sample', key: 'sampleValid', sortable: false },
  {
    title: 'TK_ID',
    key: 'taskId',
  },
  { title: 'Status', key: 'testStatusString' },
  { title: 'Result', key: 'testResultString' },
  { title: 'Tool', key: 'tool' },
  { title: 'Tags', key: 'tag' },
  { title: 'Pattern', key: 'pattern' },
]

onMounted(async () => {
  const mappedTasks = props.tasks.map((t: any) => ({
    ...t,
    projectValid: Object.values(t.sampleIdToMismatch).every(
      (m: any) => m.projectRelatives.length == 0,
    ),
    taskValid: Object.values(t.sampleIdToMismatch).every(
      (m: any) => m.projectRelatives.length == 0 && m.taskRelatives.length == 0,
    ),
    sampleValid: Object.values(t.sampleIdToMismatch).every(
      (m: any) =>
        m.projectRelatives.length == 0 && m.sampleRelatives.length == 0,
    ),
    projectReason: Object.values(t.sampleIdToMismatch)
      .map((m: any) => m.projectRelatives.join(', '))
      .filter(Boolean)
      .join(', '),
    taskReason: Object.values(t.sampleIdToMismatch)
      .map((m: any) => m.taskRelatives.join(', '))
      .filter(Boolean)
      .join(', '),
    sampleReason: Object.values(t.sampleIdToMismatch)
      .map((m: any) => m.sampleRelatives.join(', '))
      .filter(Boolean)
      .join(', '),
  }))

  mappedTasks.sort(sortTasks)
  taskDetails.value = mappedTasks
})

const emit = defineEmits(['close'])

const isTaskFullyValid = (task: any): boolean => {
  return task.projectValid && task.sampleValid && task.taskValid
}

const sortTasks = (a: any, b: any) => {
  const isAIdle = a.testStatusString === 'Idle'
  const isBIdle = b.testStatusString === 'Idle'

  if (isAIdle && !isBIdle) {
    return -1
  } else if (!isAIdle && isBIdle) {
    return 1
  }

  const isAValid = isTaskFullyValid(a)
  const isBValid = isTaskFullyValid(b)

  if (isAValid !== isBValid) {
    return isAValid ? -1 : 1
  }

  return 0
}
</script>

<template>
  <v-card>
    <v-card-title class="headline">未派工原因</v-card-title>
    <v-card-text>
      <v-spacer></v-spacer>
      <v-text-field>{{ projectId }} </v-text-field>
      <v-data-table :headers="headers" :items="tasks" item-value="name">
      </v-data-table>
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { DataTableHeaders } from '@/plugins/vuetify'

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

const headers: DataTableHeaders = [
  {
    title: 'TK_ID',
    key: 'taskId',
  },
  { title: 'Status', key: 'testStatusString' },
  { title: 'Result', key: 'testResultString' },
  { title: 'Tool', key: 'tool' },
  { title: 'Pattern', key: 'pattern' },
]

const emit = defineEmits(['close'])
</script>

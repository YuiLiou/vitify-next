<template>
  <v-card>
    <v-card-title class="headline">未派工原因</v-card-title>
    <v-card-text>
      <v-spacer></v-spacer>
      <v-text-field>CHIP ID: {{ ctrlId }} </v-text-field>
      <v-data-table
        :headers="headers"
        :items="projects"
        item-value="name"
        loading-text="Loading... Please wait"
        :loading="loading"
      >
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
              <template #activator="{ props }">
                <v-btn
                  icon="mdi-rocket-launch-outline"
                  v-bind="props"
                  @click="openDialog(item.projectId)"
                />
              </template>
              <span>Go!</span>
            </v-tooltip>
          </v-defaults-provider>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog">
        <card-reasons
          :projectId="selectedPjId"
          :tasks="idToTasks.get(selectedPjId)"
          @close="dialog = false"
        />
      </v-dialog>
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { fetchReasonByChipId } from '@/scripts/SampleHandlers'
import type { DataTableHeaders } from '@/plugins/vuetify'

const props = withDefaults(
  defineProps<{
    ctrlId: string
  }>(),
  {
    ctrlId: '',
  },
)
const ctrlId = toRef(props, 'ctrlId').value.replace(/\s+/g, '')
const projects = ref<any[]>([])
const loading = ref(true)
const dialog = ref(false)
const selectedPjId = ref('')
const idToTasks = ref<Map<string, any[]>>(new Map())

onMounted(async () => {
  try {
    const response = await fetchReasonByChipId(ctrlId)
    const projectData = await response.data['projects']
    projects.value = projectData.map((p: any) => ({
      ...p,
      ic: p.product.ic,
    }))
    projectData.forEach((p: any) => {
      idToTasks.value.set(p.projectId, p.tasks)
    })
  } finally {
    loading.value = false
  }
})

const headers: DataTableHeaders = [
  {
    title: 'PJ_ID',
    key: 'projectId',
  },
  { title: 'IC', key: 'ic' },
  { title: 'Capacity', key: 'mpCapacity' },
  { title: 'Status', key: 'statusString' },
  { title: 'Result', key: 'testResultString' },
  { title: 'FW Version', key: 'fwVersion' },
  { title: 'FW Feature', key: 'fwFeatureString' },
  { title: 'Action', key: 'action', sortable: false },
]

function openDialog(projectId: string) {
  dialog.value = true
  selectedPjId.value = projectId
}

const emit = defineEmits(['close'])
</script>

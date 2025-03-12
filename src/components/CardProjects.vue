<template>
  <v-card>
    <v-card-title class="headline">未派工原因</v-card-title>
    <v-card-text>
      <v-spacer />
      <v-text-field
        ><v-icon> {{ 'mdi-magnify' }}</v-icon> {{ ctrlId }}
      </v-text-field>
      <v-data-table
        :headers="headers"
        :items="projects"
        item-value="name"
        loading-text="Loading... Please wait"
        :loading="loading"
      >
        <template #item.projectValid="{ item }">
          <v-icon :color="item.projectValid ? 'green' : 'red'">
            {{ item.projectValid ? 'mdi-check-circle' : 'mdi-alert-circle' }}
          </v-icon>
        </template>
        <template #item.taskValid="{ item }">
          <v-icon :color="item.taskValid ? 'green' : 'red'">
            {{ item.taskValid ? 'mdi-check-circle' : 'mdi-alert-circle' }}
          </v-icon>
        </template>
        <template #item.sampleValid="{ item }">
          <v-icon :color="item.sampleValid ? 'green' : 'red'">
            {{ item.sampleValid ? 'mdi-check-circle' : 'mdi-alert-circle' }}
          </v-icon>
        </template>
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
          :project-id="selectedPjId"
          :tasks="idToTasks.get(selectedPjId) || []"
          @close="dialog = false"
        />
      </v-dialog>
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import { fetchReasonByChipId } from '@/scripts/sample-handlers'
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
  loading.value = true;
  try {
    const response = await fetchReasonByChipId(ctrlId);
    for (const id in response) {
      const p = response[id];
      console.log(p.statusString);
      const project = {
        ...p,
        ic: p.product.ic,
        projectValid: true,
        taskValid: true,
        sampleValid: true,
      };

      for (const task of p.tasks) {
        for (const mismatch of Object.values(task.sampleIdToMismatch)) {
          if (mismatch.projectRelatives.length > 0) project.projectValid = false;
          if (mismatch.taskRelatives.length > 0) project.taskValid = false;
          if (mismatch.sampleRelatives.length > 0) project.sampleValid = false;
        }
      }
      idToTasks.value.set(p.projectId, p.tasks)
      projects.value.push(project);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
});

const headers: DataTableHeaders = [
  { title: 'Project', key: 'projectValid', sortable: false },
  { title: 'Task', key: 'taskValid', sortable: false },
  { title: 'Sample', key: 'sampleValid', sortable: false },
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

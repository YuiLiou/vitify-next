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
        :items="displayedProjects"
        item-value="name"
        loading-text="Loading... Please wait"
        :loading="loading"
      >
        <template #item.projectValid="{ item }">
          <v-tooltip location="top">
            <template #activator="{ props: tooltipProps }">
              <v-icon
                v-bind="tooltipProps"
                :color="item.projectValid ? 'green' : 'red'"
              >
                {{
                  item.projectValid ? 'mdi-check-circle' : 'mdi-alert-circle'
                }}
              </v-icon>
            </template>
            <span v-if="item.projectReason != ''">{{
              item.projectReason
            }}</span>
            <span v-else>OK!</span>
          </v-tooltip>
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
              VIcon: { size: 20 },
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
import { toRef, ref, onMounted } from 'vue'
import { fetchReasonByChipId } from '@/scripts/sample-handlers'
import type { DataTableHeaders } from '@/plugins/vuetify'

const props = withDefaults(defineProps<{ ctrlId: string }>(), { ctrlId: '' })
const ctrlId = toRef(props, 'ctrlId').value.replace(/\s+/g, '')
const projects = ref<any[]>([])
const displayedProjects = ref<any[]>([])
const loading = ref(true)
const dialog = ref(false)
const selectedPjId = ref('')
const idToTasks = ref<Map<string, any[]>>(new Map())
onMounted(async () => {
  try {
    const generator = fetchReasonByChipId(ctrlId)
    for await (const projectsData of generator) {
      projectsData.forEach((p) => {
        const projectId = p.projectId
        let project = projects.value.find(
          (proj: any) => proj.projectId === projectId,
        )
        if (!project) {
          project = {
            ...p,
            ic: p.product.ic,
            flash: p.product.flash,
            projectValid: true,
            projectReason: '',
            capacity: p.product.totalCapacity,
          }
          projects.value.push(project)
        }
        for (const task of p.tasks) {
          for (const mismatch of Object.values(task.sampleIdToMismatch)) {
            if (mismatch.projectRelatives.length > 0) {
              project.projectValid = false
            }
            project.projectReason = Object.values(task.sampleIdToMismatch)
              .map((m: any) => m.projectRelatives.join(', '))
              .filter(Boolean)
              .join(', ')
            break
          }
          break
        }
        if (idToTasks.value.has(p.projectId)) {
          idToTasks.value.get(p.projectId).push(...p.tasks)
        } else {
          idToTasks.value.set(p.projectId, p.tasks)
        }
        displayedProjects.value = [...projects.value]
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
})
const headers: DataTableHeaders = [
  { title: 'Project', key: 'projectValid', sortable: false },
  { title: 'PJ_ID', key: 'projectId' },
  { title: 'IC', key: 'ic' },
  { title: 'Flash', key: 'flash' },
  { title: 'Capacity', key: 'capacity' },
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

<script setup lang="ts">
import type { DataTableHeaders } from '@/plugins/vuetify'
import {
  fetchProjects,
  getProjectStatus,
  formatDateTime,
  getActionMode,
} from '@/scripts/project-handlers'
import { ssd_ics } from '@/scripts/ic-handlers'
import { ref } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'

const projects = ref<any[]>([])
const selectedIc = ref('PS5027')
const search = ref('')
const date_range = ref([
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
])
const projectType = ref('2')
const dialog = ref(false)
const selectedPjID = ref('')
const loading = ref(false)

definePage({
  meta: {
    icon: 'mdi-food-drumstick-outline',
    title: 'Project View',
    drawerIndex: 3,
  },
})

const headers: DataTableHeaders = [
  {
    title: 'PJ_ID',
    key: 'pjId',
  },
  { title: 'IC', key: 'ic' },
  { title: 'FW Version', key: 'fwVersion' },
  { title: 'Status', key: 'status' },
  { title: 'Establish', key: 'establishDate' },
  { title: 'Capacity', key: 'totalCapacity' },
  { title: 'Priority', key: 'priority' },
  { title: 'Mode', key: 'actionMode' },
  { title: 'Group', key: 'groupMain' },
  { title: 'Sub', key: 'groupSub' },
  { title: 'Action', key: 'action', sortable: false },
]

const getProject = async () => {
  loading.value = true
  const startDate = date_range.value[0].toISOString().substring(0, 10)
  const endDate = date_range.value[1].toISOString().substring(0, 10)
  const response = await fetchProjects(
    startDate,
    endDate,
    selectedIc.value,
    '',
    projectType.value,
  )
  projects.value = response.data['pj'].map((p: any) => ({
    ...p,
    fwVersion: `${p.fwVersion}-${p.fwSubVersion}`,
    status: getProjectStatus(p.status),
    establishDate: formatDateTime(p.establishDate),
    actionMode: getActionMode(p.actionMode),
  }))
  loading.value = false
}

function openDialog(projectID: string) {
  dialog.value = true
  selectedPjID.value = projectID
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <teleport to="#app-bar" />
          <v-row>
            <v-col cols="auto" class="d-flex align-center">
              <v-select
                v-model="selectedIc"
                :items="ssd_ics"
                variant="underlined"
                prepend-inner-icon="mdi-memory"
                density="compact"
                class="mr-2 ml-4"
                hide-details
                style="width: 150px"
              />
            </v-col>
            <v-col cols="auto" class="d-flex align-center">
              <date-picker
                v-model:value="date_range"
                type="date"
                range
                placeholder="select date range"
                class="my-auto"
              />
            </v-col>
            <v-col class="d-flex align-center">
              <v-btn icon variant="text" @click="getProject">
                <v-icon>mdi-run-fast</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="projects"
            item-value="name"
            :search="search"
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
                      @click="openDialog(item.pjId)"
                    />
                  </template>
                  <span>Go!</span>
                </v-tooltip>
              </v-defaults-provider>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog">
      <card-tasks :project-id="selectedPjID" @close="dialog = false" />
    </v-dialog>
  </v-container>
</template>

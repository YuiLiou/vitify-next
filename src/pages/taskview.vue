<script setup lang="ts">
import type { DataTableHeaders } from '@/plugins/vuetify'
import {
  fetchProjects,
  getProjectStatus,
  formatDateTime,
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

definePage({
  meta: {
    icon: 'mdi-hamburger',
    title: 'Task View',
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
  const start_date = date_range.value[0].toISOString().substring(0, 10)
  const end_date = date_range.value[1].toISOString().substring(0, 10)
  const response = await fetchProjects(
    start_date,
    end_date,
    selectedIc.value,
    '',
    projectType.value,
  )
  projects.value = response.data['pj'].map((p: any) => ({
    ...p,
    fwVersion: `${p.fwVersion}-${p.fwSubVersion}`,
    status: getProjectStatus(p.status),
    establishDate: formatDateTime(p.establishDate),
  }))
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <teleport to="#app-bar" />
          <v-row>
            <v-col cols="auto">
              <v-select
                v-model="selectedIc"
                label="IC"
                :items="ssd_ics"
                variant="underlined"
              />
            </v-col>
            <v-col cols="auto">
              <date-picker
                v-model:value="date_range"
                type="date"
                range
                placeholder="select date range"
              />
            </v-col>
            <v-col>
              <v-btn icon @click="getProject">
                <v-icon>mdi-rocket-launch</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="projects"
            item-value="name"
            :search="search"
          >
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
                  <v-btn icon="mdi-rocket-launch-outline" v-bind="props" />
                </template>
                <span>Go!</span>
              </v-tooltip>
            </v-defaults-provider>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

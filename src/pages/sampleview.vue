<script setup lang="ts">
import type { DataTableHeaders } from '@/plugins/vuetify'
import {
  fetchSamplesByIc,
  fetchSamplesByIp,
  formatDateTime,
} from '@/scripts/SampleHandlers'
import { getTesterStatus } from '@/scripts/TesterHandlers'
import { ssd_ics } from '@/scripts/IcHandlers'

const ipString = ref('')
const samples = ref<any[]>([])
const selectedIc = ref('PS5027')
const selectedCtrlId = ref('')
const search = ref('')
const dialog = ref(false)
const loading = ref(false)

const fetchByIp = async () => {
  loading.value = true
  let response = await fetchSamplesByIp(ipString.value)
  samples.value = await response.data['samples'].map((sample: any) => ({
    ...sample,
    fwVersion: `${sample.fwVersion}-${sample.fwSubVersion}`,
    status: getTesterStatus(sample.testerStatus),
    modifyDate: formatDateTime(sample.modifyDate),
  }))
  loading.value = false
}

const fetchByIc = async () => {
  loading.value = true
  let response = await fetchSamplesByIc(selectedIc.value)
  samples.value = await response.data['samples'].map((sample: any) => ({
    ...sample,
    sampleId: sample.id,
    status: getTesterStatus(sample.testerStatus),
    modifyDate: formatDateTime(sample.modifyDate),
    fwVersion: sample.firmware,
    fwFeature: sample.firmwareFeature,
  }))
  loading.value = false
}

function openDialog(ctrlId: string) {
  dialog.value = true
  selectedCtrlId.value = ctrlId
}

definePage({
  meta: {
    icon: 'mdi-french-fries',
    title: 'Sample View',
    drawerIndex: 3,
  },
})

const headers: DataTableHeaders = [
  {
    title: 'ID',
    key: 'sampleId',
  },
  { title: 'Chip ID', key: 'ctrlId' },
  { title: 'FW Version', key: 'fwVersion' },
  { title: 'FW Feature', key: 'fwFeature' },
  { title: 'Capacity', key: 'capacity' },
  { title: 'IP', key: 'ip' },
  { title: 'Status', key: 'status' },
  { title: 'Modify', key: 'modifyDate' },
  { title: 'Action', key: 'action', sortable: false },
]
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <teleport to="#app-bar">
            <v-row>
              <v-col cols="auto">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  density="compact"
                  class="mr-2"
                  rounded="xl"
                  flat
                  variant="solo"
                  style="width: 250px"
                />
              </v-col>
            </v-row>
          </teleport>
          <v-row>
            <v-col cols="auto">
              <v-select
                v-model="selectedIc"
                :items="ssd_ics"
                variant="underlined"
                prepend-inner-icon="mdi-memory"
              ></v-select>
            </v-col>
            <v-col cols="auto">
              <v-text-field
                v-model="ipString"
                prepend-inner-icon="mdi-lan"
                label="IP Address"
                single-line
                hide-details
                density="compact"
                class="mr-2"
                rounded="xl"
                flat
                variant="solo"
                style="width: 150px"
              />
            </v-col>
            <v-col>
              <v-btn icon @click="ipString ? fetchByIp() : fetchByIc()">
                <v-icon>mdi-run-fast</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="samples"
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
                      @click="openDialog(item.ctrlId)"
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
      <card-projects :ctrlId="selectedCtrlId" @close="dialog = false" />
    </v-dialog>
  </v-container>
</template>

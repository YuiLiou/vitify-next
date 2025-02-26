<script setup lang="ts">
import type { DataTableHeaders } from '@/plugins/vuetify'
import {
  getTesterStatus,
  fetchSamplesByIc,
  fetchSamplesByIp,
  formatDateTime,
} from '@/scripts/SampleHandlers'
import { ssd_ics } from '@/scripts/IcHandlers'

const ipString = ref('')
const samples = ref<any[]>([])
const selectedIc = ref('PS5027')
const search = ref('')

const fetchByIp = async () => {
  let response = await fetchSamplesByIp(ipString.value)
  samples.value = await response.data['samples'].map((sample: any) => ({
    ...sample,
    fwVersion: `${sample.fwVersion}-${sample.fwSubVersion}`,
    status: getTesterStatus(sample.testerStatus),
    modifyDate: formatDateTime(sample.modifyDate),
  }))
}

const fetchByIc = async () => {
  let response = await fetchSamplesByIc(selectedIc.value)
  samples.value = await response.data['samples'].map((sample: any) => ({
    ...sample,
    sampleId: sample.id,
    status: getTesterStatus(sample.testerStatus),
    modifyDate: formatDateTime(sample.modifyDate),
    fwVersion: sample.firmware,
    fwFeature: sample.firmwareFeature,
  }))
}

definePage({
  meta: {
    icon: 'mdi-table',
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
                label="IC"
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
                style="width: 250px"
              />
            </v-col>
            <v-col>
              <v-btn icon @click="ipString ? fetchByIp() : fetchByIc()">
                <v-icon>mdi-rocket-launch</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="samples"
            item-value="name"
            :search="search"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

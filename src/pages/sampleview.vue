<script setup lang="ts">
import DialogConfirm from '@/components/DialogConfirm.vue'
import type { DataTableHeaders } from '@/plugins/vuetify'
import {
  getTesterStatus,
  fetchSamples,
  formatDateTime,
} from '@/scripts/SampleHandlers'

const ipString = ref('172.20.83.89')
const samples = ref<Promise<any>[]>([])

const fetch = async () => {
  let response = await fetchSamples(ipString.value)
  samples.value = response.data['samples'].map((sample) => ({
    ...sample,
    fwVersion: `${sample.fwVersion}-${sample.fwSubVersion}`,
    status: getTesterStatus(sample.testerStatus),
    modifyDate: formatDateTime(sample.modifyDate),
  }))
}

definePage({
  meta: {
    icon: 'mdi-table',
    title: 'Data Table',
    drawerIndex: 3,
  },
})

const search = ref('')
const dialogDelete = useTemplateRef('dialogDelete')
function showDialogDelete(name: string) {
  dialogDelete.value
    ?.open('Are you sure you want to delete this dessert?')
    .then(async (confirmed: boolean) => {
      if (confirmed) {
        try {
          const index = desserts.value!.findIndex((v) => v.name === name)
          desserts.value!.splice(index, 1)
          Notify.success('Deleted')
        } catch (e) {
          Notify.error(e)
        }
      }
    })
}

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
          <client-only>
            <teleport to="#app-bar">
              <v-row>
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
                    @keyup.enter="fetch"
                  />
                </v-col>
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
          </client-only>
          <v-data-table
            :headers="headers"
            :items="samples"
            item-value="name"
            :search="search"
          >
            <template #item.actions="{ item }">
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
                      icon="mdi-delete-outline"
                      v-bind="props"
                      @click.stop="showDialogDelete(item.name)"
                    />
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </v-defaults-provider>
            </template>
          </v-data-table>
          <DialogConfirm ref="dialogDelete" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

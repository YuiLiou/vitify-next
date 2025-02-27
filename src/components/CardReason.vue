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
      </v-data-table>
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, toRef, defineEmits } from 'vue'
import {
  fetchReasonByChipId,
} from '@/scripts/SampleHandlers'
import type { DataTableHeaders } from '@/plugins/vuetify'

const props = withDefaults(
  defineProps<{
    ctrlId: string
  }>(),
  {
    ctrlId: '',
  },
)
const ctrlId = toRef(props, 'ctrlId').value.replace(/\s+/g, '');
const projects = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetchReasonByChipId(ctrlId);
    projects.value = await response.data['projects'].map((p: any) => ({
      ...p,
      ic: p.product.ic,
    }));
  } finally {
    loading.value = false;
  }   
});

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
]

const emit = defineEmits(['close'])
</script>

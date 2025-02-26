<template>
  <v-card>
    <v-card-title class="headline">Dialog Title</v-card-title>
    <v-card-text> </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-text-field>CHIP ID: {{ ctrlId }} </v-text-field>
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, toRef, defineEmits } from 'vue'

const props = withDefaults(
  defineProps<{
    ctrlId: string
  }>(),
  {
    ctrlId: '',
  },
)
const ctrlId = toRef(props, 'ctrlId')

const emit = defineEmits(['close'])
</script>

<template>
  <v-card>
    <v-card-title class="headline">未派工原因</v-card-title>
    <v-card-text>
      <v-spacer></v-spacer>
      <v-text-field>CHIP ID: {{ ctrlId }} </v-text-field>
      <v-btn color="primary" text="Ok" @click="emit('close')">Close</v-btn>
    </v-card-text>
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

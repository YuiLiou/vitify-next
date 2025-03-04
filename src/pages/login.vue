<script setup lang="ts">
const name = ref('')
function sayHi() {
  Notify.success(`Hi, ${name.value}!`)
}
function warning() {
  Notify.warning(`How dare you refuse me, ${name.value}.`)
}
definePage({
  meta: {
    icon: 'mdi-home',
    title: 'Login',
    drawerIndex: 0,
  },
})
</script>

<template>
  <v-container fluid class="fill-height bg-grey-lighten-3">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="4" rounded="lg" class="pa-4">
          <v-card-title class="text-center text-h4 font-weight-bold pb-4">
            Welcome Back
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="name"
                prepend-inner-icon="mdi-account"
                label="Username"
                variant="underlined"
                class="mb-2"
              />

              <v-text-field
                id="password"
                prepend-inner-icon="mdi-lock"
                label="Password"
                type="password"
                variant="underlined"
                class="mb-6"
              />

              <v-btn
                block
                color="primary"
                size="large"
                elevation="2"
                class="mb-3"
              >
                Login
              </v-btn>
              <div class="text-center">
                <span class="text-grey">Don't have an account? </span>
                <a href="#" class="text-decoration-none" @click.prevent="warning">Sign Up</a>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.wrapper {
  position: relative;
  top: calc(50vh - 330px);
  text-align: center;
}
</style>

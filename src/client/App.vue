<template>
  <v-app>
    <page-header/>
    <main>
      <v-container fluid class="mt-10">
        <router-view> </router-view>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import PageHeader from "./views/components/PageHeader.vue";

export default {
  name: "App",
  components: {
    PageHeader,
  },
}
</script>

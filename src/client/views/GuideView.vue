<template>
  <v-container class="d-flex h-screen">
    <v-expansion-panels v-model="panel" class="mx-auto my-auto">
      <v-expansion-panel value="guide" title="Návody">
        <v-expansion-panel-text>
          <guide-question></guide-question>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Časté otázky">
        <v-expansion-panel-text> </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script lang="ts">
 import GuideQuestion from './components/GuideQuestion.vue';

 export default {
   components: {
     GuideQuestion,
   },
   data: () => ({
     panel:['guide']
   }),
 };

</script>

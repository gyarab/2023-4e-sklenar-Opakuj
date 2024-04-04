<template>
  <v-layout class="h-screen">
    <v-card class="mx-auto h-100 w-75" tile>
      <v-container class="mx-auto d-flex flex-col justify-center">
        <v-row
          class="mt-5 mb-5 mx-auto border-spacing-2 border-b-2 border-b-neutral-400"
        >
          <v-col class="d-inline-flex flex-grow-0 align-center">
            <v-avatar size="120">
              <v-img :src="user.pfp" referrerpolicy="no-referrer"></v-img>
            </v-avatar>
          </v-col>
          <v-list-item class="d-inline-flex flex-grow-0 g">
            <v-list-item-content>
              <v-list-item-title class="text-h1 p-2">{{
                user.displayName
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-h4 p-2">{{
                user.email
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-row>
        <v-row class="mx-auto mt-8">
          <h1 class="text-h3">Statistiky</h1>
        </v-row>
        <v-row>
          <v-container class="d-flex max-h-80 max-w-80 justify-center">
            <div class="d-flex flex-column mx-auto">
              <h2 class="text-h4 text-center">Cvičení</h2>
              <Chart
              class="max-h-80 max-w-80 justify-center"
              type="pie"
              :data="chartDataExercises"
              :options="chartOptions"
            />
            </div>
            <div class="d-flex flex-column mx-auto">
              <h2 class="text-h4 text-center">Otázky</h2>
              <Chart
              class="max-h-80 max-w-80 justify-center"
              type="pie"
              :data="chartDataQuestions"
              :options="chartOptions"
            />
            </div>
            
          </v-container>
        </v-row>
      </v-container>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";
import axios from "axios";
import Chart from "primevue/chart";

export default {
  name: "ProfileView",
  async created() {
    await this.getStats().then(() => {
    });
  },
  computed: {
    chartDataExercises() {
      return {
        labels: ["Ostatní", "Bezchybně", "Nezdařené"],
        datasets: [
          {
            data: [
              this.stats.totalExercisesPlayed -
                this.stats.totalAcedExercises -
                this.stats.totalFailedExercises,
              this.stats.totalAcedExercises,
              this.stats.totalFailedExercises,
            ],
            backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
          },
        ],
      };
    },
    chartDataQuestions() {
      return {
        labels: ["Správně", "Špatně"],
        datasets: [
          {
            data: [
              this.stats.totalCorrectAnswers,
              this.stats.totalIncorrectAnswers,
            ],
            backgroundColor: ["#66BB6A", "#FF7043"],
          },
        ],
      };
    },
  },
  data() {
    return {
      stats: {} as any,
      user: useStore().state.user,
      chartOptions: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const total = dataset.data.reduce(
                (previousValue, currentValue) => previousValue + currentValue
              );
              const currentValue = dataset.data[tooltipItem.index];
              const percentage = Math.floor((currentValue / total) * 100 + 0.5);

              return (
                data.labels[tooltipItem.index] +
                ": " +
                currentValue +
                " (" +
                percentage +
                "%)"
              );
            },
          },
        },
      },
    };
  },
  methods: {
    async getStats() {
      await axios
        .get(
          window.location.protocol +
            "//" +
            window.location.host +
            "/api/getStats"
        )
        .then((res) => {
          this.stats = res.data;
        });
    },
    loadStats() {
      return this.stats;
    },
  },
  components: {
    Chart,
  },
};
</script>

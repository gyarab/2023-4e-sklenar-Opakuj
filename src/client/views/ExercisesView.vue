<template>
  <v-container>
    <v-layout class="flex-col justify-center">
      <v-container class="flex wrap flex-col">
        <h1 class="text-h2 mx-auto">Má cvičení</h1>
        <v-btn
          class="!bg-green-500 w-1/6 !h-10 mx-auto"
          @click="setDialogUpload(true)"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
        </v-btn>
      </v-container>
      <div>
        <v-container class="border-spacing-2 border-t-2 mt-2 border-gray-300">
          <v-card-text>
            <v-container class="flex flex-wrap">
              <exercise-card
                :exercisesParent="exercisesComputed"
                :visibilityOptions="visibilityOptions"
                @deleteExercise="deleteExerciseEmit"
              >
              </exercise-card>
              <v-card class="m-2 justify-center">
                <v-btn
                  class="!h-full !w-full !bg-green-500"
                  @click="setDialogUpload(true)"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" />
                </v-btn>
              </v-card>
            </v-container>
          </v-card-text>
        </v-container>
      </div>
    </v-layout>
  </v-container>
  <v-dialog v-model="dialogUpload" max-width="40rem">
    <v-card class="flex wrap justify-center content-center">
      <v-card-title>
        <v-container class="flex wrap">
          <v-btn class="ml-auto !bg-gray-300" @click="setDialogUpload(false)">
            <font-awesome-icon :icon="['fas', 'times']" />
          </v-btn>
        </v-container>
      </v-card-title>
      <v-container class="flex wrap">
        <v-file-input
          chips
          show-size
          class="flex-grow-1"
          variant="outlined"
          accept=".txt"
          label="Nahrát .txt soubor se cvičením"
          @change="handleFileUpload($event)"
        >
        </v-file-input>
        <v-select
          id="visibility"
          :items="visibilityOptions"
          label="Viditelnost"
          item-title="label"
          item-text="value"
          variant="outlined"
          style="max-width: 10rem"
          v-model="defaultSelected"
        >
        </v-select>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import axios from "axios";
import { ref } from "vue";
import {
  createExerciseFinal,
  createQuestion,
  checkFile,
  komentarCheck,
} from "../scripts/exerciseScripts";
import router from "../router";
import ExerciseCard from "./components/ExerciseCard.vue";

let dialogUpload = ref(false);

export default {
  async mounted() {
    await this.getExercises();
  },
  data() {
    return {
      exercises: [] as any,
      visibilityOptions: [
        { label: "Soukromé", value: "Private" },
        { label: "Veřejné", value: "Public" },
      ],
      defaultSelected: "Private",
      isLoading: true as boolean,
      dialogUpload,
    };
  },
  name: "ExercisesView",
  methods: {
    async handleFileUpload(event) {
      let file = event.target.files[0];
      // zde se zpracovava nahrany soubor
      let uwu = await createExerciseFinal(
        file,
        (document.getElementById("visibility") as HTMLSelectElement).value
      );
      if (checkFile(file)) {
        await this.uploadExercise(uwu);
        this.setDialogUpload(false);
      }
    },
    async getExercises() {
      await axios
        .get(
          window.location.protocol +
            "//" +
            window.location.host +
            "/api/getExercisesPrivate"
        )
        .then((res) => {
          this.exercises = [...res.data];
          this.$store.dispatch("setExercises", this.exercises);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    async uploadExercise(exercise) {
      await axios
        .post(
          window.location.protocol +
            "//" +
            window.location.host +
            "/api/exercisesUpload",
          exercise
        )
        .then((res) => {
          if (res.data.msg == "OK") {
            alert("Cvičení nahráno úspěšně!");
            this.exercises.push(res.data.newExercise);
            this.$store.dispatch("setExercises", this.exercises);
          } else {
            alert("Nahrání cvičení selhalo!");
          }
        });
    },

    setDialogUpload(boolean) {
      this.dialogUpload = boolean;
    },
    deleteExerciseEmit(id) {
      this.exercises = this.exercises.filter((e) => e.exerciseID != id);
    },
  },
  computed: {
    exercisesComputed() {
      return this.exercises;
    },
  },
  components: { ExerciseCard },
};
</script>

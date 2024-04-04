<template>
  <v-container>
    <v-layout class="justify-center flex-col">
      <h1 class="mx-auto text-h2">Cvičení</h1>
      <div class="d-flex mx-auto">
        <v-card
          v-for="exercise in exercises"
          :key="exercise._id"
          class="m-2 justify-center"
        >
          <v-card-title>{{ exercise.name }}</v-card-title>
          <v-card-subtitle
            >Počet otázek:
            {{ exercise.questions.length }}</v-card-subtitle
          >

          <v-btn-group class="d-flex mt-3">
            <v-btn class="!bg-green-400 !w-full" @click="redirectToPlay(exercise.name),setSelectedExercise(exercise.exerciseID)">
              <font-awesome-icon :icon="['fas', 'play']" />
            </v-btn>
          </v-btn-group>
        </v-card>
      </div>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";

let exercises: any = [];

const store = useStore();
export default {
  async created() {
    this.getExercises();
  },
  data() {
    return {
      exercises: exercises,
    };
  },
  name: "BrowseView",
  methods: {
    async getExercises() {
      await axios
        .get(
          window.location.protocol +
            "//" +
            window.location.host +
            "/api/getExercisesPublic"
        )
        .then((res) => {
          this.exercises = [...res.data];
          this.$store.dispatch("setExercisesPublic", this.exercises);
          console.log(this.exercises);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    redirectToPlay(exerciseName) {
      let pub = "public";
      console.log(exerciseName);
      this.$router.push({
        name: "exercisePlayPub",
        params: { exerciseName: exerciseName, pub: pub },
      });
    },
    setSelectedExercise(exerciseID) {
      this.$store.dispatch("setExerciseSelectedID", exerciseID);
    },
  },
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="$router.go(-1)">Zpět</v-btn>
        <v-breadcrumbs :items="items"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-card class="!p-5">
      <v-row>
        <v-container>
          <h1 class="text-h2">{{ getExercise.name }}</h1>
        </v-container>
        <v-col>
          <p>Počet otázek</p>
          <v-form @submit.prevent="onSubmit" class="flex flex-col w-2/3">
            <v-slider
              v-model="sliderQuestions"
              thumb-label
              step="1"
              :max="getExercise.questions.length"
              :min="1"
            >
              <template v-slot:append>
                <v-text-field
                  v-model="sliderQuestions"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  style="width: 70px"
                  :min="1"
                ></v-text-field>
              </template>
            </v-slider>
            <v-radio-group v-model="difficulty" row>
              <v-radio label="Lehká" value="easy"></v-radio>
              <v-radio label="Střední" value="medium"></v-radio>
              <v-radio label="Obtížná" value="hard"></v-radio>
            </v-radio-group>

            <v-btn class="!bg-green-500" type="submit">
              <font-awesome-icon :icon="['fas', 'play']" />
            </v-btn>
          </v-form>
        </v-col>
        <v-col>
          <v-list class="overflow-y-auto" max-height="60vh">
            <v-card v-for="question in getExercise.questions" class="m-2">
              <v-card-title>{{question.number}}. {{ question.question }}</v-card-title>
            </v-card>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { executionAsyncId } from "async_hooks";

export default {
  name: "ExercisePlayView",
  components: {},
  created() {
    console.log(this.$route);
    this.soutExercises();
    this.fillArray();
  },
  mounted() {
    this.soutExercises();
  },
  computed: {
    getExerciseName() {
      return this.$route.params.exerciseName;
    },
    getExerciseID() {
      return this.$store.state.exerciseSelectedID;
    },
    getExercise() {
      return this.exercise;
    },
  },
  data() {
    let unknownExercises = [] as any;
    if (this.$route.params.pub == "public") {
      unknownExercises = this.$store.state.exercisesPublic;
    } else {
      unknownExercises = this.$store.state.exercises;
    }
    return {
      exercises: unknownExercises,
      exercise: Object as any,
      sliderQuestions: 1,
      difficulty: "easy",
      items: [
        {
          title: "Home",
          disabled: false,
          href: "/",
        },
      ],
      answerChecked: false,
    };
  },
  methods: {
    soutExercises() {
      if (this.$route.params.pub == "public") {
        let exerciseFind = this.$store.state.exercisesPublic.find(
          (exercise) => exercise.exerciseID == this.getExerciseID
        );
        this.exercise = exerciseFind;
      } else {
        let exerciseFind = this.$store.state.exercises.find(
          (exercise) => exercise.exerciseID == this.getExerciseID
        );
        this.exercise = exerciseFind;
      }
      console.log(this.exercise);
    },
    fillArray() {
      let urlArray = this.$route.path.split("/");
      let url = "";
      for (let i = 1; i < urlArray.length; i++) {
        url += "/" + urlArray[i];
        if (i != urlArray.length - 1) {
          this.items.push({
            title: urlArray[i],
            disabled: i >= urlArray.length - 2 ? true : false,
            href: url,
          });
        }
      }
    },
    onSubmit() {
      if (this.sliderQuestions == 0) {
        alert("Musíte vybrat alespoň jednu otázku!");
        return;
      }
      if (this.sliderQuestions > this.getExercise.questions.length) {
        this.sliderQuestions = this.getExercise.questions.length;
      }
      let questions = [...this.getExercise.questions];
      for (let i = questions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
      if (this.sliderQuestions == 0) {
        questions = questions.slice(0, 1);
      } else {
        questions = questions.slice(0, this.sliderQuestions);
      }
      this.$store.dispatch("setQuestionsQuiz", questions);
      this.$store.dispatch("setDifficulty", this.difficulty);
      console.log(this.$store.state.questionsQuiz);
      this.$router.push({
        name: "quizPlay",
        params: { exerciseName: this.getExerciseName },
      });
    },
  },
};
</script>

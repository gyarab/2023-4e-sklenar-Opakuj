<template>
        <v-card
          min-width="20vh"
          v-for="exercise in exercisesComputed as any"
          :key="exercise.exerciseID"
          class="m-2 justify-center"
        >
          <v-card-title>{{ exercise.name }}</v-card-title>
          <v-card-subtitle
            >Počet otázek:
            {{ exercise.questions.length }}</v-card-subtitle
          >
          <v-btn-group class="mt-5">
            <v-btn
              class="!bg-green-500 !rounded-bl"
              @click="
                redirectToPlay(exercise.name),
                  setSelectedExercise(exercise.exerciseID)
              "
            >
              <font-awesome-icon :icon="['fas', 'play']" />
            </v-btn>
            <v-btn
              :id="exercise.exerciseID"
              @click="setExerciseEditor($event)"
              class="!bg-gray-400"
            >
              <!--rozbije se po pridani noveho cviceni a pokuso o jeho upraveni-->
              <!-- bude potreba predelat editor aby vyuzival lokalni promenne, ne zdedene(jsou read only) -->
              <font-awesome-icon :icon="['fas', 'pencil']" />
              <v-dialog
                v-model="dialog"
                activator="parent"
                width="1024"
                max-height="768"
                persistent
              >
                <v-card class="p-2">
                  <v-card-title>
                    <h1 class="text-center">Upravit</h1>
                  </v-card-title>
                  <v-col wrap class="m-2">
                    <v-row wrap class="!w-full !mb-0 overflow-auto">
                      <v-text-field
                        label="Exercise name"
                        v-model="exerciseEditor.name"
                        ><!-- je potreba predelat na metodu co vyuzije :id z btn -->
                      </v-text-field>
                      <v-select
                        id="visibility2"
                        :items="visibilityOptions"
                        label="Visibility"
                        class="flex-shrink-1"
                        v-model="exerciseEditor.visibility"
                      >
                      </v-select>
                    </v-row>
                    <v-row wrap rows="2" class="!w-full">
                      <v-text-field
                        label="Exercise description"
                        v-model="exerciseEditor.description"
                      ></v-text-field>
                    </v-row>
                  </v-col>

                  <v-row wrap class="m-3 overflow-hidden">
                    <v-col cols="3">
                      <v-list
                        v-model="exerciseEditor.questions"
                        class="overflow-auto"
                        max-height="50vh"
                      >
                        <v-list-item
                          v-for="question in exerciseEditor.questions"
                          :key="question.questionID"
                        >
                          <v-card class="!bg-cyan-300"
                            ><v-btn
                              :id="question.questionID"
                              @click="
                                selectQuestion(
                                  $event,
                                  exerciseEditor.exerciseID
                                )
                              "
                              class="!bg-inherit !h-full !w-full"
                            >
                              <v-card-title>
                                {{ question.question }}
                              </v-card-title>
                            </v-btn>
                          </v-card>
                        </v-list-item>
                        <v-list-item>
                          <v-card class="!bg-cyan-300"
                            ><v-btn
                              id="plus"
                              class="!bg-inherit !h-full !w-full"
                            >
                              <v-card-title>
                                <font-awesome-icon :icon="['fas', 'plus']" />
                              </v-card-title>
                            </v-btn>
                          </v-card>
                        </v-list-item>
                      </v-list>
                    </v-col>
                    <v-col class="overflow-auto">
                      <v-row wrap class="!w-full !mb-0">
                        <v-text-field
                          label="Číslo otázky"
                          v-model="getQuestion.number"
                        ></v-text-field>
                        <v-text-field
                          label="Otázka"
                          v-model="getQuestion.question"
                        ></v-text-field>
                      </v-row>
                      <v-row wrap class="!w-full">
                        <v-text-field
                          label="Popis otázky"
                          v-model="getQuestion.description"
                        ></v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="mx-2" @click=""> Uložit </v-btn>
                    <v-btn class="mx-2" @click="setDialog(false)">Zrušit</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-btn>
            <v-btn class="!bg-red-600 !rounded-br">
              <font-awesome-icon :icon="['fas', 'trash']" />
              <v-dialog activator="parent" v-model="dialog2">
                <v-card class="p-2">
                  <v-card-title>
                    <h1 class="text-center">Smazat cvičení ?</h1>
                  </v-card-title>
                  <v-card-text>
                    <p>Opravdu chcete smazat dané cvičení ?</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      class="mx-2"
                      @click="deleteExercise(exercise.exerciseID)"
                    >
                      Ano
                    </v-btn>
                    <v-btn class="mx-2" @click="setDialog2(false)">Ne</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-btn>
          </v-btn-group>
        </v-card>
</template>

<script lang="ts">
import { set } from "mongoose";
import { ref } from "vue";
import axios from "axios";


export default {
  props: {
    exercisesParent: {
      type: Array,
      required: true,
    },
    visibilityOptions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    redirectToPlay(exerciseName) {
      this.$router.push({
        name: "exercisePlay",
        params: { exerciseName: exerciseName },
      });
    },
    async deleteExercise(id) {
      await axios
        .post(
          window.location.protocol +
            "//" +
            window.location.host +
            "/api/deleteExercisesPrivate",
          { exerciseID: id }
        )
        .then((res) => {
          console.log(res.data);
          if (res.data == "OK") {
            this.setDialog2(false);
            this.$emit("deleteExercise", id);
            alert("Cvičení bylo smazáno úspěšně!");
            this.exercises = this.exercises.filter((e) => e.exerciseID != id);
            this.$store.dispatch("setExercises", this.exercises);
          } else {
            alert("Něco se pokazilo! Cvičení nemohl být smazáno!");
          }
        });
    },
    setDialog(boolean) {
      this.dialog = boolean;
    },
    setDialog2(boolean) {
      this.dialog2 = boolean;
    },
    selectQuestion(event, exerciseID) {
      let questionID = event.currentTarget.id;
      for (let exercise of this.exercisesComputed) {
        if ((exercise as any).exerciseID == exerciseID) {
          for (let question of (exercise as any).questions) {
            if (question.questionID == questionID) {
              this.questionSelected = question;
              console.log(this.questionSelected);
            }
          }
        }
      }
    },
    setExerciseEditor(event) {
      this.exerciseID = event.currentTarget.id;
      this.exerciseEditor = this.getExercise(this.exerciseID);
    },
    getExercise(exerciseID) {
      for (let exercise of this.exercisesComputed) {
        if ((exercise as any).exerciseID == exerciseID) {
          return exercise;
        }
      }
    },
    
    setSelectedExercise(exerciseID) {
      this.$store.dispatch("setExerciseSelectedID", exerciseID);
    },
  },
  computed:{
    getQuestion() {
      return this.questionSelected;
    },
    exercisesComputed() {
      this.exercises = this.exercisesParent;
      return this.exercisesParent;
    },
  },
  data() {
    return {
      dialog: ref(false),
      dialog2: ref(false),
      questionID: "" as String,
      exerciseID: "" as String,
      questionNumber: 0 as number,
      exerciseNumber: 0 as number,
      questionSelected: Object as any,
      exerciseEditor: Object as any,
      exerciseName: "",
      exercises: ref([]) as any
    };
  },
};
</script>

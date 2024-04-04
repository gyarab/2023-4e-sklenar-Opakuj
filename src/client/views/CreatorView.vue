<template>
  <v-form v-model="valid">
    <v-container class="mt-9">
      <div class="d-flex flex-row mb-3">
        <v-textarea
          label="Téma(název cvičení)"
          variant="solo-filled"
          auto-grow
          rows="1"
          v-model="name"
          :rules="nameRules"
        >
        </v-textarea>
        <v-btn
          class="!bg-green-500"
          :disabled="!valid"
          @click="finishExercise()"
          >Dokončit</v-btn
        >
      </div>
      <v-row>
        <v-col cols="3">
          <v-list class="d-flex flex-col w-full">
            <v-btn
              v-for="question in questionsArray"
              @click="changeQuestion(question.number)"
              class="!bg-yellow-700 my-1"
              >{{ question.number }}. {{ question.question }}</v-btn
            >
            <v-btn class="!bg-green-500 mt-1" @click="addQuestion()">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </v-btn>
          </v-list>
        </v-col>
        <v-col cols="9">
          <v-textarea
            label="Otázka"
            variant="solo-filled"
            auto-grow
            rows="1"
            v-model="questionsArray[selectedNumber - 1].question"
            :rules="questionRules"
          >
          </v-textarea>
          <v-select
            id="typOtazky"
            :items="questionTypes"
            item-title="title"
            item-value="value"
            label="Typy otázek"
            variant="outlined"
            v-model="selectedType"
            class="w-full my-3"
            @update:model-value="changeType"
            :rules="typeRules"
          >
          </v-select>
          <v-card v-if="selectedType == '$'">
            <v-textarea
              label="Kontext"
              variant="solo-filled"
              auto-grow
              rows="1"
              v-model="questionsArray[selectedNumber - 1].context"
            >
            </v-textarea>
            <v-textarea
              label="Odpověď"
              variant="solo-filled"
              auto-grow
              rows="1"
              v-model="questionsArray[selectedNumber - 1].answer"
            >
            </v-textarea>
          </v-card>
          <v-card v-if="selectedType == '%'">
            <v-textarea
              label="Odpověď"
              variant="solo-filled"
              auto-grow
              rows="1"
              v-model="questionsArray[selectedNumber - 1].answer"
            >
            </v-textarea>
          </v-card>
          <v-card v-if="selectedType == '&'">
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-textarea
                    v-for="dvojice in dvojiceArray[selectedNumber - 1]"
                    label="První z dvojice"
                    rows="1"
                    variant="solo-filled"
                    auto-grow
                    v-model="
                      questionsArray[selectedNumber - 1].answersRight[
                        dvojice - 1
                      ][0]
                    "
                  >
                  </v-textarea>
                </v-col>
                <v-col cols="6">
                  <v-textarea
                    v-for="dvojice in dvojiceArray[selectedNumber - 1]"
                    label="Druhý z dvojice"
                    rows="1"
                    variant="solo-filled"
                    auto-grow
                    v-model="
                      questionsArray[selectedNumber - 1].answersRight[
                        dvojice - 1
                      ][1]
                    "
                  >
                  </v-textarea>
                </v-col>
                <v-btn class="!bg-green-500 mt-1 w-full" @click="addDvojice()"
                  ><font-awesome-icon :icon="['fas', 'plus']"
                /></v-btn>
              </v-row>
            </v-container>
          </v-card>
          <v-card v-if="selectedType == '*'">
            <v-row>
              <v-col cols="6">
                <v-textarea
                  v-for="spravne in spravneArray"
                  label="Správná odpověď"
                  rows="1"
                  variant="solo-filled"
                  auto-grow
                  v-model="
                    questionsArray[selectedNumber - 1].answersRight[spravne - 1]
                  "
                >
                </v-textarea>
                <v-btn
                  class="!bg-green-500 mt-1 w-full"
                  @click="addRightAnswers()"
                  ><font-awesome-icon :icon="['fas', 'plus']"
                /></v-btn>
              </v-col>
              <v-col cols="6">
                <v-textarea
                  v-for="spatne in spatneArray"
                  label="Špatná odpověď"
                  rows="1"
                  variant="solo-filled"
                  auto-grow
                  v-model="
                    questionsArray[selectedNumber - 1].answersWrong[spatne - 1]
                  "
                >
                </v-textarea>
                <v-btn
                  class="!bg-green-500 mt-1 w-full"
                  @click="addWrongAnswers()"
                  ><font-awesome-icon :icon="['fas', 'plus']"
                /></v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  data() {
    return {
      valid: false,
      questionTypes: [
        { title: "-", value: "" },
        { title: "Doplňování do věty", value: "$" },
        { title: "Napsat správnou odpověď", value: "%" },
        { title: "Spojování dvojic", value: "&" },
        { title: "Výběr správné odpovědi", value: "*" },
      ],
      selectedType: "",
      selectedNumber: 1,
      name: ref(),
      //array vsech otazek -> pak se vlozi do objektu Exercise
      questionsArray: ref([
        {
          number: 1,
          question: "",
          type: "",
          context: "",
          answer: "",
          answersRight: [[]],
          answersWrong: [[]],
        },
      ]) as any,
      //prave aktivni data
      dvojiceArray: ref(Array.from({ length: 100 }, () => [])) as any,
      spravneArray: ref([[]]) as any,
      spatneArray: ref([[]]) as any,

      nameRules: [(v: string) => !!v || "Název je povinný"],
      questionRules: [(v: string) => !!v || "Otázka nebo jméno jsou povinné"],
      typeRules: [(v: string) => !!v || "Typ otázky je povinný"],
    };
  },
  methods: {
    addQuestion() {
      this.questionsArray.push({
        number: this.questionsArray.length + 1,
        question: "",
        type: "",
        context: "",
        answer: "",
        answersRight: [[]],
        answersWrong: [[]],
      });
    },
    changeSelectedNumber(number: number) {
      this.selectedNumber = number;
    },
    changeQuestion(number: number) {
      this.selectedNumber = number;
      this.selectedType = this.questionsArray[number - 1].type;
    },
    addDvojice() {
      this.dvojiceArray[this.selectedNumber - 1].push(
        this.dvojiceArray[this.selectedNumber - 1].length + 1
      );
      this.questionsArray[this.selectedNumber - 1].answersRight.push([]);
    },
    addRightAnswers() {
      this.spravneArray.push(this.spravneArray.length + 1);
    },
    addWrongAnswers() {
      this.spatneArray.push(this.spatneArray.length + 1);
    },
    changeType() {
      this.questionsArray[this.selectedNumber - 1].type = this.selectedType;
    },
    async finishExercise() {
      for (let i = 0; i < this.questionsArray.length; i++) {
        this.questionsArray[i].answersRight = this.questionsArray[
          i
        ].answersRight.filter((answer) => answer.length !== 0);
        this.questionsArray[i].answersWrong = this.questionsArray[
          i
        ].answersWrong.filter((answer) => answer.length !== 0);
      }
      console.log(this.questionsArray);

      let exercise = {
        userID: this.$store.getters.getUser.userID,
        name: this.name,
        questions: this.questionsArray,
        visibility: "Private",
      };
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
            this.$router.push({ name: "exercises" });
          } else {
            alert("Nahrát cvičení selhalo!");
          }
        });
    },
  },
};
</script>

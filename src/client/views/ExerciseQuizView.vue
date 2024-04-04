<template>
  <v-container class="flex wrap">
    <v-card
      class="flex wrap mt-5 mx-auto mb-0 flex-col !w-full"
      v-if="!resultsBool && HP > 0"
    >
      <p style="text-align: end" class="mr-6 mt-2">
        {{ HP }}
        <font-awesome-icon :icon="['fas', 'heart']" style="color: #ff0000" />
      </p>
      <v-container v-for="(question, index) in paginatedQuestions" :key="index">
        <!-- ///////////////// doplnovacka do textu $ /////////////////////// -->
        <q-c-doplnovacka
          v-if="question.type == '$'"
          :question="question"
          :answersArr="answersArr"
          :setQuestionAnswered="setQuestionAnswered"
          :currQType.sync="currQType"
          @setCurrQType="setCurrQType"
        >
        </q-c-doplnovacka>

        <!-- ///////////////// jedna spravna odpoved % /////////////////////// -->
        <q-c-doplneni
          v-if="question.type == '%'"
          :question="question"
          :answer.sync="answer"
          :setQuestionAnswered="setQuestionAnswered"
          :currQType.sync="currQType"
          :questionAnswered="questionAnswered"
          :nextPage="nextPageBool"
          @setCurrQType="setCurrQType"
          @updateAnswer="updateAnswer"
          @setNextPageBool="setNextPageBool"
        >
        </q-c-doplneni>

        <!-- /////////////////spojovacka &  /////////////////////// -->
        <q-c-spojovacka
          v-if="question.type == '&'"
          ref="spojovacka"
          :question="question"
          :selectedAnswersColLeft.sync="selectedAnswersColLeft"
          :selectedAnswersColRight.sync="selectedAnswersColRight"
          :loading="loading"
          :getOrder="getOrder"
          :currQType.sync="currQType"
          :disabledArray="disabledArray"
          @setCurrQType="setCurrQType"
          @checkPairEmit="checkPair(index)"
          @updateSelectedAnswersColLeft="updateSelectedAnswersColLeft"
          @updateSelectedAnswersColRight="updateSelectedAnswersColRight"
        >
        </q-c-spojovacka>

        <!-- ///////////////// vyber * /////////////////////// -->
        <q-c-vyber
          v-if="question.type == '*'"
          :question="question"
          :selectedAnswersArray.sync="selectedAnswersArray"
          :loading="loading"
          :getOrder="getOrder"
          :currQType.sync="currQType"
          @setCurrQType="setCurrQType"
          @updateSelectedAnswersArray="updateSelectedAnswersArray"
        >
        </q-c-vyber>
      </v-container>
      <v-container class="flex-row flex wrap mt-0 mx-auto justify-center">
        <v-pagination
          :length="questionsCount"
          :total-visible="5"
          :disabled="true"
          v-model="currentPage"
        ></v-pagination>
        <!-- <v-btn @click="previousPage" :disabled="currentPage === 0"
          >Previous</v-btn
        >-->
        <v-btn @click="answerCheck()" v-if="!answerChecked">Zkontrolovat</v-btn>
        <v-btn
          v-if="answerChecked && currentPage < pageCount - 1"
          @click="nextPage(), clearAnswerData()"
          :disabled="currentPage >= pageCount - 1 || !questionAnswered"
          >Další otázka</v-btn
        >
        <v-btn
          v-if="currentPage >= pageCount - 1 && answerChecked && !resultsBool"
          @click="resultsBool = true"
          >Výsledky</v-btn
        >
      </v-container>
    </v-card>
    <result-screen
      v-if="resultsBool && HP > 0"
      :correct-questions="correctQuestions"
      :maximum-questions="maximumQuestions"
    ></result-screen>
    <failed-screen
      v-if="HP <= 0"
      :answered-questions="currentPage"
      :correct-questions="correctQuestions"
      :maximum-questions="questionsCount"
    >
    </failed-screen>
  </v-container>
  <v-alert v-if="answerChecked && !resultsBool && !(HP <= 0)"
    :type="correctAnswer ? 'success' : 'error'"
    >{{ correctAnswer ? 'Good job' : 'try again'}}
    <p v-if="!correctAnswer">Správná odpověď: </p>
    <p v-if="!correctAnswer">{{ paginatedQuestions[0].answer }} {{ paginatedQuestions[0].answersRight.join(', ') }}</p>
    </v-alert>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { reactive } from "vue";
import { VueElement } from "vue";
import { check } from "@/server/scripts/exercisesCheck";
import ResultScreen from "./components/ResultScreen.vue";
import { textChangeRangeIsUnchanged } from "typescript";
import QCDoplnovacka from "./components/QuestionCardDoplnovacka.vue"; //$
import QCVyber from "./components/QuestionCardVyber.vue"; //*
import QCSpojovacka from "./components/QuestionCardSpojovacka.vue"; //&
import QCDoplneni from "./components/QuestionCardDoplneniJedneOdpovedi.vue"; //%
import { clear } from "console";
import FailedScreen from "./components/FailedScreen.vue";

export default {
  setup() {
    const store = useStore();
    const questions = computed(() => store.state.questionsQuiz);
    const itemsPerPage = 1;
    const currentPage = ref(1);
    const questionsCount = computed(() => questions.value.length);
    //pocet stranek
    const pageCount = computed(() =>
      Math.ceil(questions.value.length / itemsPerPage + 1)
    );
    //rozdeleni otazek na stranky
    const paginatedQuestions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return questions.value.slice(start, end);
    });

    const alreadyWrongAnswerOnce = ref(false);
    const nextPageBool = ref(false as boolean);

    //pocet moznych nespravnych odpovedi
    var HP = ref(Math.ceil(pageCount.value - 1));
    switch (useStore().state.difficulty) {
      case "easy":
        HP.value = Math.ceil(pageCount.value - 1);
        break;
      case "medium":
        HP.value = Math.ceil((pageCount.value - 1) / 2);
        break;
      case "hard":
        HP.value = Math.ceil((pageCount.value - 1 )/ 6);
        break;
    };
    

    //zda je otazka zodpovezena, zda je zkontrolovana, zda je spravna odpoved
    const questionAnswered = ref(false);
    const answerChecked = ref(false);
    const correctAnswer = ref(false);
    const correctAnswerArr = ref([] as any[]);

    //zda je mozne zobrazit vysledky
    const resultsBool = ref(false);
    const allTimeWrongAnswers = ref(0 as number);

    //typ zobrazene otazky
    const currQType = ref("");
    //dopleneni jedne spravne odpovedi $
    const answer = ref("");

    //spojovacka &
    const selectedAnswersColRight = ref([] as any[]);
    const selectedAnswersColLeft = ref([] as any[]);
    const disabledArray = ref([] as any[]);
    const loading = ref(true);

    //vyber vice odpovedi *
    const selectedAnswersArray = ref([] as any[]);

    //doplnovacka do textu %
    const answersArr = ref([] as any[]);
    const wronglyWrittenAnswers = ref([] as any[]);

    const nextPage = () => {
      if (currentPage.value < pageCount.value - 1) {
        nextPageBool.value = true;
        currentPage.value++;
        answerChecked.value = false;
        questionAnswered.value = false;
      }
    };
    const previousPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
      }
    };
    return {
      paginatedQuestions,
      nextPage,
      previousPage,
      currentPage,
      pageCount,
      answer,
      questionAnswered,
      questionsCount,
      answerChecked,
      currQType,
      correctAnswer,
      selectedAnswersArray,
      answers: [] as any[],
      selectedAnswersColRight,
      selectedAnswersColLeft,
      loading,
      randomOrders: new Map(),
      disabledArray,
      answersArr,
      resultsBool,
      allTimeWrongAnswers,
      HP,
      alreadyWrongAnswerOnce,
      wronglyWrittenAnswers,
      nextPageBool,
      questions,
    };
  },
  created() {
    this.loading = true;
  },
  computed: {
    selectedColor() {
      return (value) =>
        this.selectedAnswersArray.includes(value as never) ? "red" : "";
    },
    correctQuestions() {
      return this.questionsCount - this.allTimeWrongAnswers;
    },
    maximumQuestions() {
      return this.questionsCount;
    },
    
  },
  methods: {
    setQuestionAnswered() {
      this.questionAnswered = true;
    },
    checkPair(index) {
      if (
        this.selectedAnswersColLeft.length > 0 &&
        this.selectedAnswersColRight.length > 0
      ) {
        const isCorrect = this.paginatedQuestions[0].answersRight.some(
          (answer) => {
            if (
              this.selectedAnswersColLeft.includes(answer[0]) &&
              this.selectedAnswersColRight.includes(answer[1])
            ) {
              //correct
              this.disabledArray.push(this.selectedAnswersColLeft);
              this.disabledArray.push(this.selectedAnswersColRight);
              this.selectedAnswersColLeft = [];
              this.selectedAnswersColRight = [];
              return true;
            }
          }
        );
        if (!isCorrect) {
          //wrong
          this.selectedAnswersColLeft = [];
          this.selectedAnswersColRight = [];
          (this.$refs as any).spojovacka[index].selectWasWrong();
          if (!this.alreadyWrongAnswerOnce) {
            this.HP--;
          }
          this.alreadyWrongAnswerOnce = true;
        }
      }
    },
    answerCheck() {
      let type = this.currQType;
      /*console.log(type); /*
            console.log(this.paginatedQuestions[0]);
            console.log(this.currentPage);*/
      switch (type) {
        case "$":
          //doplnovacka do textu
          //odpovedi ktere se budou doplnovat do textu se budou ukladat do array
          //projet nejspis array odpovedi a porovnat s odpovedmi v textu

          
          /*console.log(this.answersArr);
          console.log(this.paginatedQuestions[0].answersRight.flat());*/
          
          this.correctAnswer = true;
          let i = 0;
          for (let answer of this.answersArr) {
            if (
              this.paginatedQuestions[0].answersRight.flat().includes(answer)
            ) {
              //correct
              this.wronglyWrittenAnswers[i] = 0;
            } else {
              //wrong
              this.wronglyWrittenAnswers[i] = 1;
              if (!this.alreadyWrongAnswerOnce) {
                this.allTimeWrongAnswers++;
                this.HP--;
                this.correctAnswer = false;
                this.$store.state.questionsQuiz.push(this.paginatedQuestions[0]);
              }
              this.alreadyWrongAnswerOnce = true;
            }
            //i++;
          }
          
          this.alreadyWrongAnswerOnce = false;
          this.answerChecked = true;
          break;
        case "%":
          //doplneni jedne spravne odpovedi
          if (this.answer === this.paginatedQuestions[0].answer) {
            this.correctAnswer = true;
          } else {
            this.correctAnswer = false;
            this.allTimeWrongAnswers++;
            this.HP--;
            this.$store.state.questionsQuiz.push(this.paginatedQuestions[0]);
          }
          this.answerChecked = true;
          this.alreadyWrongAnswerOnce = false;
          break;
        case "&":
          // spojovacka
          //zkontrolovat dvojici...zkontrolovat ze jsou vsechny dvojice spojeny

          if (
            this.disabledArray.length ==
            this.paginatedQuestions[0].answersRight.length * 2
          ) {
            this.correctAnswer = true;
            this.answerChecked = true;
          }
          this.alreadyWrongAnswerOnce = false;
          break;
        case "*":
          //vyber vice odpovedi
          //projet array odpovedi a porovnat s odpovedmi v textu
          //bylo by asi lepsi to udelat pres hashset
          //do hashsetu se ulozi vsechny odpovedi a pak se porovnaji
          //pokud se najde odpoved ktera tam neni tak se vrati false

          this.correctAnswer = true;

          for (let answer of this.selectedAnswersArray) {
            if (
              !this.paginatedQuestions[0].answersRight.flat().includes(answer)
            ) {
              this.correctAnswer = false;
              if (!this.alreadyWrongAnswerOnce) {
                this.HP--;
                this.allTimeWrongAnswers++;
                this.$store.state.questionsQuiz.push(this.paginatedQuestions[0]);
              }
              this.alreadyWrongAnswerOnce = true;
            }
          }
          for (let answer of this.paginatedQuestions[0].answersRight.flat()) {
            if (!this.selectedAnswersArray.flat().includes(answer)) {
              this.correctAnswer = false;
              if (!this.alreadyWrongAnswerOnce) {
                this.allTimeWrongAnswers++;
                this.HP--;
                this.$store.state.questionsQuiz.push(this.paginatedQuestions[0]);
              }
              this.alreadyWrongAnswerOnce = true;
            }
          }

          
          this.alreadyWrongAnswerOnce = false;
          this.answerChecked = true;
          break;
      }
      this.setQuestionAnswered();
    },
    getOrder(id) {
      if (!this.randomOrders.has(id)) {
        this.randomOrders.set(id, Math.floor(Math.random() * 10));
      }
      return this.randomOrders.get(id);
    },
    setCurrQType(Qtype) {
      this.currQType = Qtype;
    },
    updateSelectedAnswersColLeft(answ) {
      this.selectedAnswersColLeft[0] = answ;
    },
    updateSelectedAnswersColRight(answ) {
      this.selectedAnswersColRight[0] = answ;
    },
    updateSelectedAnswersArray(data) {
      if (this.selectedAnswersArray.includes(data)) {
        this.selectedAnswersArray = this.selectedAnswersArray.filter(
          (item) => item !== data
        );
      } else{
        this.selectedAnswersArray.push(data);
      }
    },
    updateAnswer(data) {
      this.answer = data;
    },
    clearAnswerData() {
      this.answer = "";
      this.answersArr = [];
      this.selectedAnswersArray = [];
      this.selectedAnswersColLeft = [];
      this.selectedAnswersColRight = [];
      this.disabledArray = [];
      this.wronglyWrittenAnswers = [];
    },
    setNextPageBool() {
      this.nextPageBool = false;
    },
  },
  components: {
    ResultScreen,
    QCDoplnovacka,
    QCVyber,
    QCSpojovacka,
    QCDoplneni,
    FailedScreen,
  },
};
</script>
<style scoped>
.colorChangeBtn.v-btn--active {
  color: red !important;
}
</style>

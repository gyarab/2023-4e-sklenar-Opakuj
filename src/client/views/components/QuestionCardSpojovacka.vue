<template>
  <v-card v-if="question.type == '&'">
    <v-card-title>{{ question.number }}. {{ question.question }}</v-card-title>
    <v-container class="mx-auto flex flex-wrap justify-center flex-row">
      <v-btn-toggle
        class="flex flex-wrap justify-start flex-col max-w-sm"
        style="height: 10rem"
        v-model="selectedColLeft"
      >
        <v-btn
          v-for="(answ, index) in question.answersRight"
          :disabled="isDisabled(answ[0])"
          :style="loading ? { order: getOrder(index) } : {}"
          style="height: 2rem"
          :value="answ[0]"
          @click="
            updateSelectedAnswersColLeft(answ[0]),
              setCurrQType(question.type),
              checkPairEmit()
          "
          >{{ answ[0] }}</v-btn
        >
      </v-btn-toggle>
      <v-btn-toggle
        class="flex flex-wrap justify-start flex-col max-w-sm"
        style="height: 10rem"
        v-model="selectedColRight"
      >
        <v-btn
          v-for="(answ, index) in question.answersRight"
          @click="
            updateSelectedAnswersColRight(answ[1]),
              setCurrQType(question.type),
              checkPairEmit()
          "
          :disabled="isDisabled(answ[1])"
          :style="
            loading
              ? { order: getOrder(question.answersRight.length + index) }
              : {}
          "
          :value="answ[1]"
          style="height: 2rem"
          >{{ answ[1] }}</v-btn
        >
      </v-btn-toggle>
    </v-container>
  </v-card>
</template>
<script lang="ts">
import { ref } from "vue";

export default {
  props: {
    question: {
      type: Object,
      required: true,
    },
    selectedAnswersColLeft: {
      type: Array,
      required: true,
    },
    selectedAnswersColRight: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    getOrder: {
      type: Function,
      required: true,
    },
    currQType: {
      type: String,
      required: true,
    },
    disabledArray: {
      type: Array,
      required: true,
    },
  },
  methods: {
    setCurrQType(Qtype) {
      this.$emit("setCurrQType", Qtype);
    },
    updateSelectedAnswersColLeft(answ) {
      this.$emit("updateSelectedAnswersColLeft", answ);
    },
    updateSelectedAnswersColRight(answ) {
      this.$emit("updateSelectedAnswersColRight", answ);
    },
    checkPairEmit() {
      this.$emit("checkPairEmit");
    },
    isDisabled(value) {
      return this.disabledArrayComp.flat().includes(value as any);
    },
    selectWasWrong() {
      this.selectedColLeft = [];
      this.selectedColRight = [];
    },
  },
  computed:{
    disabledArrayComp(){
      return this.disabledArray;
    },
  },

  data() {
    return {
      selectedColLeft: [] as any[],
      selectedColRight: [] as any[],
    };
  },
};
</script>

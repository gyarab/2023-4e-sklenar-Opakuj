<template>
  <v-card v-if="question.type == '%'">
    <v-card-title>{{ question.number }}. {{ question.question }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="answerRW"
        :disabled="questionAnswered"
        @change="updateAnswer(), setQuestionAnswered, setCurrQType(question.type)"
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { clear } from "console";
import { ref } from "vue";
export default {
  mounted() {
    this.clearData();
    this.$emit("setNextPageBool")
  },
  updated(){
    this.$emit("setNextPageBool")
    if(this.nextPage){
      this.clearData();
    }
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    setQuestionAnswered: {
      type: Function,
      required: true,
    },
    currQType: {
      type: String,
      required: true,
    },
    questionAnswered: {
      type: Boolean,
      required: true,
    },
    nextPage: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    setCurrQType(Qtype) {
      this.$emit("setCurrQType", Qtype);
    },
    updateAnswer() {
      this.$emit("updateAnswer", this.answerRW);
    },
    clearData() {
      this.answerRW = "";
    },
  },
  data() {
    return {
      answerRW: ref("" as string),
    };
  },
};
</script>

<template>
<v-card v-if="question.type == '$'">
          <v-card-title
            >{{ question.number }}. {{ question.question }}</v-card-title
          >
          <v-card-text>
            <v-container class="flex wrap flex-row">
              <div
                v-for="(context, index) in question.context"
                :key="index"
                class="flex wrap flex-row"
              >
                <p>{{ context }}</p>
                <v-textarea
                  v-if="index != question.context.length - 1"
                  class="mx-2"
                  v-model="answersArr[index]"
                  :value="answersArr[index]"
                  @input="updateAnswersArr($event)"
                  @change="setQuestionAnswered, setCurrQType(question.type)"
                  variant="solo-filled"
                  auto-grow
                  rows="1"
                ></v-textarea>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
</template>

<script lang="ts">
export default {
    props:{
        question: {
            type: Object,
            required: true
        },
        answersArr: {
            type: Array,
            required: true
        },
        setQuestionAnswered: {
            type: Function,
            required: true
        },
        currQType: {
            type: String,
            required: true
        }
    },
    methods: {
        setCurrQType(Qtype) {
            this.$emit('setCurrQType', Qtype);
        },
        updateAnswersArr(event) {
            this.$emit('update:AnswersArr', event);

        }
    },
}
</script>
<template>
    <v-card class="flex flex-wrap" v-if="question.type == '*'">
          <v-card-title
            >{{ question.number }}. {{ question.question }}</v-card-title
          >
          <div>
            <v-container class="mx-auto flex flex-wrap justify-center flex-col w-screen">
              <v-btn-toggle
                class="mx-auto flex-col flex-wrap flex"
                style="height: 10rem; width: 25%"
                multiple
                v-model="selectedAnswersArrayRW"
              >
                <v-btn
                  v-for="(answ, index) in question.answersRight"
                  :value="answ[0]"
                  :style="loading ? { order: getOrder(index) } : {}"
                  style="height: 2rem"
                  @click="setCurrQType(question.type), updateSelectedAnswersArray(answ[0])"
                  >{{ answ[0] }}</v-btn
                >
                <v-btn
                  v-for="(answ, index) in question.answersWrong"
                  :value="answ[0]"
                  :style="
                    loading
                      ? {
                          order: getOrder(question.answersRight.length + index),
                        }
                      : {}
                  "
                  @click="setCurrQType(question.type), updateSelectedAnswersArray(answ[0])"
                  style="height: 2rem"
                  >{{ answ[0] }}</v-btn
                >
              </v-btn-toggle>
            </v-container>
          </div>
        </v-card>
</template>
<script lang="ts">
export default {
    props:{
        question: {
            type: Object,
            required: true
        },
        selectedAnswersArray: {
            type: Array,
            required: true
        },
        getOrder: {
            type: Function,
            required: true
        },
        loading: {
            type: Boolean,
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
        updateSelectedAnswersArray(data) {
            this.$emit('updateSelectedAnswersArray', data);
        }
    },
    data() {
        return {
            selectedAnswersArrayRW: [] as any[],
        };
    }
}
</script>
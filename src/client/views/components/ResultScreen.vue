<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="$router.push({ name: 'exercises' })">Zpět</v-btn>
        <v-breadcrumbs :items="items"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-card class="flex wrap mt-5 mx-auto mb-0 flex-col !w-full">
      <v-card-title class="headline"
        ><v-alert type="success" icon="$success" dismissible>
          Dobrá práce! Úspěšně jste dokončili cvičení.
        </v-alert></v-card-title
      >
      <v-card-text>
        <v-card class="flex wrap mt-5 mx-auto mb-0 flex-col !w-full">
          <div
            class="percentage-bar"
            :style="{ width: percentage + '%' }"
          ></div>
          <div class="percentage-label">
            {{ percentage }}% ({{ Math.abs(correctQuestions) }}/{{ maximumQuestions }})
            Správně zodpovězené otázky
          </div>
        </v-card>
      </v-card-text>
      <v-container class="justify-center d-flex">
        <v-btn @click="$router.push({ name: 'exercises' })" class="mx-2">Má cvičení</v-btn>
        <v-btn @click="$router.push(items[items.length-1].href)" class="mx-2">Zkusit znovu</v-btn>
        </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import axios from 'axios';
export default {
  props: {
    correctQuestions: {
      type: Number,
      required: true,
    },
    maximumQuestions: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.fillArray();
  },
  async mounted() {
    await this.updateStats();
  },
  computed: {
    percentage() {
      return Math.abs((this.correctQuestions / this.maximumQuestions) * 100).toFixed(2);
    },
  },
  data() {
    return {
      items: [
        {
          title: "Home",
          disabled: false,
          href: "/",
        },
      ],
    };
  },
  methods: {
    fillArray() {
      let urlArray = this.$route.path.split("/");
      let url = "";
      for (let i = 1; i < urlArray.length; i++) {
        url += "/" + urlArray[i];
        if (i != urlArray.length - 1) {
          this.items.push({
            title: urlArray[i],
            disabled: i >= urlArray.length - 3 ? true : false,
            href: url,
          });
        }
      }
    },
    async updateStats(){
      await axios.post(window.location.protocol + "//" + window.location.host + "/api/updateStats", {
        totalCorrectAnswers: this.correctQuestions,
        totalAnswers: this.maximumQuestions,
        totalIncorrectAnswers: (this.maximumQuestions - this.correctQuestions),
        totalAcedExercises: (this.maximumQuestions - this.correctQuestions == 0) ? 1 : 0,
        exactAcedExercises: (this.maximumQuestions - this.correctQuestions == 0) ? this.$store.getters.getExerciseSelectedID : "",
      }).then((res) => {
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
      });
    },
  },
};
</script>

<style scoped>
.percentage-bar {
  height: 20px;
  background-color: #2196f3;
}

.percentage-label {
  margin-top: 5px;
  text-align: center;
}
</style>

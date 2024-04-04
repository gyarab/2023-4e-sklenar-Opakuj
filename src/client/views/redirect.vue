<template>
  <v-btn id="login" @click="login"> </v-btn>
</template>

<script lang="ts">
import { computed, ref, onMounted, onUpdated } from "vue";
var user = ref({
  googleId: "",
  displayName: "",
  firstName: "",
  lastName: "",
  email: "",
  pfp: "",
  userID: "",
  logged: false,
});
var session = ref("");

function getUser() {
  let urlParams = new URLSearchParams(window.location.search);
  let data = urlParams.get("data");
  if (data) {
    user.value = JSON.parse(data!);
  }
}

function getSession() {
  let urlParams = new URLSearchParams(window.location.search);
  let data = urlParams.get("session");
  session.value = data!;
}

export default {
  methods: {
    login() {
      this.$store.dispatch("setUser", user);
      this.$store.dispatch("setSession", session);
      this.$router.push({
        name: "Profile",
      });
    },
  },
  created() {
    getUser();
    getSession();
    this.login();
  },
};
</script>

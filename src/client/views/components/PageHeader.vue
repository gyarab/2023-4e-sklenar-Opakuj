<template>
  <v-app-bar fixed>
    <v-app-bar-title style="max-width: 30px">
      <router-link
        to="/home"
        class="ml-2 my-1 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mb-0 lg:mt-0"
      >
      <font-awesome-icon :icon="['fas', 'repeat']" style="color: #6f0000;" />
        <!-- <img
          class="mr-2"
          src="/vite.svg"
          style="height: 20px"
          alt="TE Logo"
          loading="lazy"
        /> -->
      </router-link>
    </v-app-bar-title>

    <v-container class="flex justify-center mx-auto">
      <div>
        <v-btn v-if="$store.state.user.logged" to="/exercises" class="mx-1">
          Má cvičení
        </v-btn>
        <v-btn v-if="$store.state.user.logged" to="/creator" class="mx-1"
          >Vytvořit cvičení</v-btn
        >
        <v-btn to="/browse" class="mx-1">Prohlížet</v-btn>
        <v-btn to="/guide" class="mx-1">Pomoc</v-btn>
      </div>
      <v-spacer></v-spacer>
      <div>
        <v-btn @click="toggleTheme" class="mx-1">
          <font-awesome-icon v-if="dark == false" :icon="['fas', 'moon']" />
          <font-awesome-icon v-if="dark == true" :icon="['fas', 'sun']" />
        </v-btn>
        <v-btn v-if="!$store.state.user.logged" class="mx-1">
          <GoogleLogin :id-configuration="idconfiguration"></GoogleLogin>
        </v-btn>
        <router-link
          rounded
          v-if="$store.state.user.logged"
          :to="{
            name: 'Profile',
          }"
          class="mx-2 rounded-full"
        >
          <v-avatar>
            <img :src="$store.state.user.pfp" />
          </v-avatar>
        </router-link>
        <v-btn v-if="$store.state.user.logged" @click="logout" class="mx-1">
          Odhlásit se
          <span></span>
          <font-awesome-icon
            :icon="['fas', 'right-from-bracket']"
            class="ms-1"
          />
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { faThemeco } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { use } from "passport";
import { GoogleLogin, type CallbackTypes } from "vue3-google-login";
import { useTheme } from "vuetify";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { createDecipheriv } from "crypto";

const $store = useStore();
const $router = useRouter();

let dark = ref(false);
const idconfiguration = {
  login_uri:
    window.location.protocol +
    "//" +
    window.location.host +
    "/auth/callback/google-one-tap",
  ux_mode: "redirect",
};
var guest = {
  googleId: "",
  displayName: "",
  firstName: "",
  lastName: "",
  email: "",
  pfp: "",
  userID: "",
  logged: false,
};
async function logoutServer() {
  const res = await axios
    .get(window.location.protocol + "//" + window.location.host + "/logout")
    .then((res) => {
      if (res.status == 200) {
        console.log("logout");
        return true;
      }
      return false;
    });
}
function logout() {
  logoutServer();
  $store.dispatch("setUser", guest);
  $store.dispatch("setSession", "");
  window.localStorage.removeItem("vuex");
  console.log("logout");
  $router.push({
    name: "Home",
  });
}
const theme = useTheme();
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  dark.value = !dark.value;
}
</script>

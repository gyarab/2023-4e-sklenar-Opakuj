import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "./views/HomeView.vue";
import Login from "./views/components/Login.vue";
import Profile from "./views/ProfileView.vue";
import redirect from "./views/redirect.vue";
import Browse from "./views/BrowseView.vue";
import Exercises from "./views/ExercisesView.vue";
import ExercisePlay from "./views/ExercisePlayView.vue";
import ExerciseQuiz from "./views/ExerciseQuizView.vue";
import Guide from "./views/GuideView.vue";
import Creator from "./views/CreatorView.vue";
import { useStore } from "vuex";
import e from "express";
import path from "path";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home" || "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/redirect",
    name: "redirect",
    component: redirect,
  },
  {
    path: "/browse",
    name: "browse",
    component: Browse,
  },
  {
    path: "/exercises",
    name: "exercises",
    component: Exercises,
  },
  {
    path: "/exercises/exercisePlay/:exerciseName",
    name: "exercisePlay",
    component: ExercisePlay,
    props: true,
  },
  {
    path: "/browse/exercisePlay/:exerciseName:pub",
    name: "exercisePlayPub",
    component: ExercisePlay,
    props: true,
  },
  {
    path: "/exercises/exercisePlay/:exerciseName/quiz",
    name: "quizPlay",
    component: ExerciseQuiz,
    props: true,
  },
  {
    path: "/guide",
    name: "guide",
    component: Guide,
    props: true,
  },
  {
    path: "/creator",
    name: "creator",
    component: Creator,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const store = useStore();
  const publicPages = ["/login", "/browse", "/home", "/redirect", "/guide"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = store.state.user.logged;

  if (authRequired && !loggedIn) {
    return { name: "Home" };
  } else {
    return true;
  }
});

export default router;

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
export const store = new Vuex.Store({
    state: {
        user: {
            googleID: "",
            displayName: "",
            firstName: "",
            lastName: "",
            email: "",
            pfp: "",
            userID: "",
            logged: false,
        },
        session: "",
        exercises: [
           /* {
                name: "",
                description: "",
                questions: [],
            }*/
        ],
        exercisesPublic: [],
        exerciseSelectedID: "",
        questionsQuiz : [],
        difficulty: "easy",
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setSession(state, session) {
            state.session = session;
        },
        setExercises(state, exercises) {
            state.exercises = exercises;
        },
        setExercisesPublic(state, exercises) {
            state.exercisesPublic = exercises;
        },
        setExerciseSelectedID(state, exerciseID) {
            state.exerciseSelectedID = exerciseID;
        },
        setQuestionsQuiz(state, questionsQuiz) {
            state.questionsQuiz = questionsQuiz;
        },
        setDifficulty(state, difficulty) {
            state.difficulty = difficulty;
        },
    },
    actions: {
        setUser(context, user) {
            context.commit('setUser', user);
        },
        setSession(context, session) {
            context.commit('setSession', session);
        },
        setExercises(context, exercises) {
            context.commit('setExercises', exercises);
        },
        setExercisesPublic(context, exercises) {
            context.commit('setExercisesPublic', exercises);
        },
        setExerciseSelectedID(context, exerciseID) {
            context.commit('setExerciseSelectedID', exerciseID);
        },
        setQuestionsQuiz(context, questionsQuiz) {
            context.commit('setQuestionsQuiz', questionsQuiz);
        },
        setDifficulty(context, difficulty) {
            context.commit('setDifficulty', difficulty);
        },
    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getSession(state) {
            return state.session;
        },
        getExercises(state) {
            return state.exercises;
        },
        getExercisesPublic(state) {
            return state.exercisesPublic;
        },
        getExerciseSelectedID(state) {
            return state.exerciseSelectedID;
        },
        getQuestionsQuiz(state) {
            return state.questionsQuiz;
        },
        getDifficulty(state) {
            return state.difficulty;
        },
    },
    plugins: [createPersistedState({
            storage: window.sessionStorage,
        })],
});
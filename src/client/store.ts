import {  } from "vuex";
import { InjectionKey } from "vue";
import { useStore as baseUseStore, Store } from "vuex";
import { createStore } from "vuex-extensions";

export interface State {
    user: any;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>(Store,{
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        userLogout(state) {
            state.user = null;
        }
    },
    getters: {
        getUser(state) {
            return state.user;
        }
    },
});

export function useStore() {
    return baseUseStore(key);
}

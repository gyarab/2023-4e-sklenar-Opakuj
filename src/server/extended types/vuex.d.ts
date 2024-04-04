import { Store } from 'vuex';

declare module '@vue/runtime-core' {
    interface State {
        user: any;
    }

    interface ComponentCustomProperties {
        $store: Store;

    }
}


/*import { VuetifyOptions, createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

let vuetifyConfig: VuetifyOptions = {
    theme: {
        defaultTheme: 'light',
    }
}
vuetifyConfig = {
    components: { components,labsComponents},
    directives,
    ...vuetifyConfig,
};

export default createVuetify(vuetifyConfig);

export {components,directives}*/

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
    theme: {
        defaultTheme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    },
    icons: {
        defaultSet: 'mdi',

    },
})
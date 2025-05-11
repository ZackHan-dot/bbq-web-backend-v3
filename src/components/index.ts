import { App } from "vue";
import Lake from "./Lake/index.vue";

export function registerComponents(app: App) {
  app.component("Lake", Lake);
}

import { getBrowserLang } from "@/utils";
import { createI18n } from "vue-i18n";
import en from "./modules/en";
import zh from "./modules/zh";

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale: getBrowserLang(),
  messages: {
    ...en,
    ...zh
  }
});

export default i18n;

<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from "vue";
import { useTheme } from "@/hooks/useTheme";
import { getBrowserLang } from "@/utils";
import { ElConfigProvider } from "element-plus";
import { useGlobalStore } from "@/stores/modules/global";
import { useI18n } from "vue-i18n";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { LanguageType } from "./stores/interface";

const globalStore = useGlobalStore();

// init language
const i18n = useI18n();

// element language
const locale = computed(() => {
  if (globalStore.language == "zh") return zhCn;
  if (globalStore.language == "en") return en;
  return getBrowserLang() == "zh" ? zhCn : en;
});

// init theme
const { initTheme } = useTheme();
initTheme();
// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize);

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });

onMounted(() => {
  const lang = globalStore.language ?? getBrowserLang();
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
});
</script>
